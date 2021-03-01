import pg from 'pg';
import os from 'os';

// Read from configs from env variables
const host = os.hostname();
const port = process.env.PG_PORT;
const user = process.env.PG_USER;
const password = process.env.PG_PASSWORD;
const customersDB = process.env.PG_CUSTOMERS_DB;

console.log(`Host ${host}\nPort ${port}\nUser ${user}\nPassword ${password}\nPG_DB ${pgDB}\nCustomersDB ${customersDB}`);
/*
make sure to run the create_partitions.mjs file 
to create partitions before running this
node create_partitions.mjs 
*/
async function run() {
  const dbClientCustomers = new pg.Client({
    "user": user,
    "password": password,
    "host": host,
    "port": port,
    "database": customersDB
  });

  console.log ("connecting to customers db...")
  await dbClientCustomers.connect(); 
  console.log("inserting customers... ")
  /*
  creating a 10M customers
  */
  for (let i = 0; i < 10; i ++)
  {   
      /* creates a million row */
      const psql  = `insert into customers(name) (select random() from generate_series(1,999999))`;
      console.log(`inserting 1m customers...   `)
      await dbClientCustomers.query(psql ); 
  }

  
  console.log("closing connection...")
  await dbClientCustomers.end(); 
  console.log("done.")
}

 run();
