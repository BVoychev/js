
import pg from 'pg';
import os from 'os';

// Read from configs from env variables
const host = os.hostname();
const port = process.env.PG_PORT;
const user = process.env.PG_USER;
const password = process.env.PG_PASSWORD;
const pgDB = process.env.PG_DB;
const customersDB = process.env.PG_CUSTOMERS_DB;

console.log(`Host ${host}\nPort ${port}\nUser ${user}\nPassword ${password}\nPG_DB ${pgDB}\nCustomersDB ${customersDB}`);
/**
 * This script creates 100 partitions 
 * and attaches them to the main table customers
 * */ 
async function run() {
  try {
    const dbClientPG = new pg.Client({
      "user": user,
      "password": password,
      "host": host,
      "port": port,
      "database": pgDB
    });

    console.log("connection to postgress...");
    await dbClientPG.connect();
    console.log("creaeting database customers...");
    await dbClientPG.query("create database customers")
    await dbClientPG.end();
    console.log("closing database connection...");

    const dbClientCustomers = new pg.Client({
      "user": user,
      "password": password,
      "host": host,
      "port": port,
      "database": customersDB
    });
    console.log("connection to customer db...");
    const conn = await dbClientCustomers.connect();
    console.log("creaeting customer table...");
    const sql = `create table customers (id serial, name text) partition by range (id)`;
    await dbClientCustomers.query(sql);

    /**
     * assume we are going to support 10M customers
     * and each partition will have 1M customers
     * that gives us 10 partition tables.
     */
    for (let i=0;i<10;i++){
      const idFrom = i*1000000;
      const idTo = (i+1)*1000000;
      const partitionName = `customers_${idFrom}_${idTo}`;
      const psql1 = `create table ${partitionName} (like customers including indexes)`;
      const psql2 = `alter table customers attach partition ${partitionName} for values from (${idFrom}) to (${idTo})`;
      console.log(`creating partition ${partitionName}`);
      await dbClientCustomers.query(psql1);
      await dbClientCustomers.query(psql2);
    }
    await dbClientCustomers.end();
  } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`);
  }
}

run();