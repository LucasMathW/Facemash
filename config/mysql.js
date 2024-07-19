const
  mysql = require('mysql2'),
  hl = require('handy-log'),
  { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env
const db = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  port: 6033,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  charset: 'utf8mb4'
})

console.log('MYSQL_HOST', MYSQL_DATABASE)

db.connect(err => {
  if(err){
    hl.error(err.message)
  }
})

module.exports = db
