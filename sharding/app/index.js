const app = require("express")();
const { Client } = require("pg");
const crypto = require("crypto");
const HashRing = require("hashring");
const hashRing = new HashRing();
const os = require('os');

const host = os.hostname();

hashRing.add("5432")
hashRing.add("5433")
hashRing.add("5434")

const clients = {
  "5432" : new Client ({
    "host": host,
    "port": "5432",
    "user": "postgres",
    "password": "postgres",
    "database": "postgres",
  }),
  "5433" : new Client ({
    "host": host,
    "port": "5433",
    "user": "postgres",
    "password": "postgres",
    "database": "postgres",
  }),
  "5434" : new Client ({
    "host": host,
    "port": "5434",
    "user": "postgres",
    "password": "postgres",
    "database": "postgres",
  })
}

async function connect() { 
  try {
    await clients["5432"].connect();
    await clients["5433"].connect();
    await clients["5434"].connect();
  } catch (error) {
    console.log(`Could not connect to one of the shards: ${error}`);
  }
}
  

app.get("/:urlID", async (req, res) => {
    const urlID = req.params.urlID
    const server = hashRing.get(urlID);
    const result = await clients[server].query("SELECT URL_ID,URL_TEXT FROM URL_TABLE WHERE URL_ID = $1", [urlID]);
    if (result.rowCount > 0 ) {
      res.send({
        "urlInfo": {
          "urlID": result.rows[0]["url_id"],
          "url": result.rows[0]["url_text"],
        },
        "server": server,
      });
      return
    }

    res.sendStatus(404);
})

app.post("/", async (req, res) => {
    const url = req.query.url
    // Consistently hash this to get a port
    // www.wikipedia.com/sharding -> convert to hash base64
    const hash = crypto.createHash("sha256").update(url).digest("base64");
    // Take the first 5 chars from the hash as url ID
    const urlID = hash.substr(0,5);
    const server = hashRing.get(urlID);
    await clients[server].query("INSERT INTO URL_TABLE (URL_TEXT,URL_ID) VALUES ($1,$2)", [url, urlID]);
    res.send({
      "urlInfo": {
        "hash": hash,
        "urlID": urlID,
        "url": url,
      },
      "server": server,
    });
})


connect();
app.listen(8081, () => console.log("Listening to port 8081"));
