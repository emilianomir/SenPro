const sqlite3 = require("sqlite3").verbose();
const data = require('./generated.json');
let statement;


const db = new sqlite3.Database('./main.db', sqlite3.OPEN_READWRITE);
 

/*
statement = `
CREATE TABLE User (
    Email text,
    Username text,
    Password text,
    Address text,
    PRIMARY KEY (Email)
);
`;
db.run(statement)


db.run("INSERT INTO User VALUES ('u1@gmail.com', 'user1', '****', 'testAddress')");
db.run("INSERT INTO User VALUES ('u2@gmail.com', 'user2', '*****', 'testAddress1')");
db.run("INSERT INTO User VALUES ('u3@gmail.com', 'user3', '******', 'testAddress2')");

statement = `SELECT Email FROM User`; 

db.all(statement, [], (err, rows) => {

  rows.forEach((x) => {
    console.log(x);
  })});
*/



/*
statement =  `
CREATE Table TestJson (
    id varchar(3),
    data json,
    PRIMARY KEY (id)
)
`

db.run(statement);
*/

/*
data.forEach(x => {
  statement = 'INSERT INTO TestJson VALUES(?,?)';
  db.run(statement, [x['_id'], JSON.stringify(x)])
});
*/

//

statement = `SELECT json_extract(data, '$.email', '$.gender') Email FROM TestJson`; 

db.all(statement, [], (err, rows) => {

  rows.forEach((x) => {
    console.log(x);
  })});