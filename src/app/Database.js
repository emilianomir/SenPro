const sqlite3 = require("sqlite3").verbose();
const data = require('./generated.json');
let statement;


const db = new sqlite3.Database('./main.db', sqlite3.OPEN_READWRITE);
 


statement = `
CREATE TABLE User (
    Email text,
    Username text,
    Password text,
    Address text,
    PRIMARY KEY (Email)
);
`;
//db.run(statement)


//db.run("INSERT INTO User VALUES ('u1@gmail.com', 'user1', '****', 'testAddress')");
//db.run("INSERT INTO User VALUES ('u2@gmail.com', 'user2', '*****', 'testAddress1')");
//db.run("INSERT INTO User VALUES ('u3@gmail.com', 'user3', '******', 'testAddress2')");

statement = `SELECT Email FROM User`; 

/*
db.all(statement, [], (err, rows) => {

  rows.forEach((x) => {
    console.log(x);
  })});

*/


statement =  `
CREATE Table TestJson (
    id varchar(3),
    data json,
    PRIMARY KEY (id)
)
`

//db.run(statement);

/*
data.forEach(x => {
  statement = 'INSERT INTO TestJson VALUES(?,?)';
  db.run(statement, [x['_id'], JSON.stringify(x)])
});
*/

// This allow you to find array length as well as select specific sections within the json
statement = `
SELECT json_extract(data, '$.name') Name, json_array_length(data, '$.tags') Tags
FROM TestJson
`;

/*
db.all(statement, [], (err, rows) => {

  rows.forEach((x) => {
    console.log(x);
  })});
*/



// Seperating the sections by text removing arrays. Also finding duplicates
statement = `
SELECT json_extract (data, A.fullkey) Tags, count(json_extract (data, A.fullkey)) Count
FROM TestJson JOIN json_tree(data, '$.tags') A ON A.type = 'text'
GROUP BY Tags
HAVING Count > 1
ORDER BY Count DESC

 
`; 
   /*
  db.all(statement, [], (err, rows) => {
  
    rows.forEach((x) => {
      console.log(x);
    })});
*/

// Seperating the sections by text removing arrays. Also finding duplicates


statement = `
CREATE TABLE Tags (
    Tag text,
    ID INTEGER PRIMARY KEY AUTOINCREMENT
);
`;
/*
db.run(statement);
*/

// 

statement = `
SELECT DISTINCT(json_extract (data, A.fullkey)) Tags
FROM TestJson JOIN json_tree(data, '$.tags') A ON A.type = 'text' 
`; 

/*
db.all(statement, [], (err, rows) => {

  rows.forEach((x) => {
    statement = 'INSERT INTO Tags (Tag) VALUES(?)';
    db.run(statement, x['Tags'])
  })});
*/

statement = `
SELECT *
FROM Tags 
`; 

/*
db.all(statement, [], (err, rows) => {

  rows.forEach((x) => {
    console.log(x)
  })});
*/



statement = `
CREATE TABLE SeperateTags (
  ID INTEGER,
  JID varchar(3),
  PRIMARY KEY (ID, JID),
  FOREIGN KEY (ID) REFERENCES Tags(ID),
  FOREIGN KEY (JID) REFERENCES TestJson(id)
)`;
/*
db.run(statement)
*/


statement =`
SELECT json_extract (data, A.fullkey) ID, json_extract(data, '$._id') JID
FROM TestJson JOIN json_tree(data, '$.tags') A ON A.type = 'text' 
`;

/*
db.all(statement, [], (err, rows) => {

  rows.forEach((x) => {
    console.log(x);
  })});
*/

  statement =`
  SELECT DISTINCT(json_extract (data, A.fullkey)) ID, TestJson.id
  FROM (TestJson JOIN json_tree(data, '$.tags') A ON A.type = 'text') 
  `;

  /*
  db.all(statement, [], (err, rows) => {

    rows.forEach((x) => {
      console.log(x);
    })});
    */

    statement =`
    INSERT INTO SeperateTags (ID, JID)
    SELECT DISTINCT(Tags.id), TestJson.id
    FROM (TestJson JOIN json_tree(data, '$.tags') A ON A.type = 'text') JOIN Tags ON json_extract (data, A.fullkey) = Tags.Tag
    `;

    /*
    db.run(statement);
    */

    statement =`
    SELECT *
    FROM SeperateTags
    ORDER BY ID ASC
    `;

    /*
    db.all(statement, [], (err, rows) => {

      rows.forEach((x) => {
        console.log(x);
      })});
      */

      statement = `
      
      
      `