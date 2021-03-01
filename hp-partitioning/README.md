# Horizontal Partitioning with Postgres

**Spin postgres container:**

`docker exec -it pgmain psql -U postgres`

**Create a grade sql table:**

`CREATE TABLE grades_org (id serial not null, g int not null);`

**Insert 10M recrods:**

`INSERT into grades_org(g) SELECT floor(random()*100) FROM generate_series(0, 10000000);`

* random() gives a value between 0.00,0.99
* values from generate_series which will be called 10 000 000 time and execute floor(random()*100) will go into g field from table grades_org 

Check if we have successfully created 10M records

```
SELECT count(*) FROM grades_org;  

 count
----------
 10000001
 (1 row)
```

**Create indexes on grades:**
`CREATE INDEX grades_org_index ON grades_org(g);`

# Do the actual partitioning

## 1. Create main partition table and set the partition type

`CREATE TABLE grades_parts (id serial not null, g int not null) PARTITION BY RANGE(g);`

## 2. Create all partition tables

### 2.1 Create table for grades between X and Y e.g where g between X and Y. The table will looks like table grades_parts and it will include all the indexes

```
CREATE TABLE g0035 (like grades_parts including indexes);
CREATE TABLE g3560 (like grades_parts including indexes);
CREATE TABLE g6080 (like grades_parts including indexes);
CREATE TABLE g80100 (like grades_parts including indexes);
```

## 3. Attach the tables to the main table

```
ALTER TABLE grades_parts attach partition g0035 for values from (0) to (35);
ALTER TABLE grades_parts attach partition g3560 for values from (35) to (60);
ALTER TABLE grades_parts attach partition g6080 for values from (60) to (80);
ALTER TABLE grades_parts attach partition g80100 for values from (80) to (100);
```

## 4. Copy the entire grades_org table into grades_parts

`INSERT INTO grades_parts SELECT * FROM grades_org;`

### 4.1 Checks

```
SELECT count(*) FROM grades_parts;
SELECT max(g) FROM g0035;
SELECT min(g) FROM g3560;
SELECT count(*) FROM g0035;
```

## 5. Create indexes

`CREATE INDEX grades_parts_idx on grades_parts(g);`

Craeting indexes on the main partition table will create indexes to all partition tables.
This is possible because we use "including indexes" while creating partion tables;

## 6. Check the index size

`SELECT (pg_relation_size(oid) / (1000*1000)) || 'MB', relname from pg_class order by pg_relation_size(oid) desc;`

## 7. ENABLE_PARTITION_PRUNING should be equal to true in order to use the partition indexes, otherwise it goes throw all partition indexes

`show ENABLE_PARTITION_PRUNING;`

# Automate partitions

## 1. Spin postgres container

`docker exec -it pgmain psql -U postgres`

## 2. Create partitions

`npm install`

## 3. Create partitions

`make createPartion`

## 4. Populate already partitions tables

`make populateCustomers`