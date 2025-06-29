const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "joshua082005",
    host: "localhost",
    port: 5432,
    database: "vertexpro"
});

module.exports = pool;