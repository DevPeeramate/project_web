import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const DBSERVER = process.env.DBSERVER;
const DBHOST = process.env.DBHOST;
const DBPORT = process.env.DBPORT;
const DBUSER = process.env.DBUSER;
const DBPASSWORD = process.env.DBPASSWORD;
const DB = process.env.DB;

export default new Pool({
    connectionString: `${DBSERVER}://${DBUSER}:${encodeURIComponent(DBPASSWORD)}@${DBHOST}:${DBPORT}/${DB}`
})