//LEFT TO DO

// test 
// check syntax , optimize 
// change the button one heart can't cancel once picked
// try to remove inner.html

'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");

// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');

/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}

/* start of code run on start-up */
// create object to interface with express
const app = express();
// Code in this section sets up an express pipeline
// print info about incoming HTTP request 

// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
    // change parameter to "true" to get it to computer real winner based on PrefTable 
    // with parameter="false", it uses fake preferences data and gets a random result.
    // winner should contain the rowId of the winning video.
    let winner = await win.computeWinner(8, false);
    let winnerObject = await getUrlByRowID(winner);
    // you'll need to send back a more meaningful response here.
    res.json(winnerObject);
  } catch (err) {
    res.status(500).send(err);
  }
});

// "getTwoVideos picks two videos randomly from the database"
app.get("/getTwoVideos", async function(req, res) {
  console.log("getting two videos");
  try {
    // WRITE HERE  
    // 1. call getRandomInt to get two unique random integer 
    let element1 = getRandomInt(8);
    let element2 = getRandomInt(8);
    while (element1 == element2) {
      element2 = getRandomInt(8);
    }

    // 2. call the database to get the two entries
    let item1 = await getVideo(element1);
    let item2 = await getVideo(element2);
    let videoArray = [item1, item2];

    // 3. send it back to front end
    res.json(videoArray);

  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/insertPref", async function(req, res) {
  console.log("got the /insertPref post\n");
  try {
    // parse the JSON body to Javascript Object type
    let info = req.body;
    // create a new object to pass into insertVideo function
    let vidObj = {
      "better": info.better,
      "worse": info.worse
    }
    // test length

    let checkTable = await allPrefTable();
    let tableSize = checkTable.length;
    console.log("tableSize ", tableSize);

    if (tableSize == 15) {
      res.send("pick winner");
    } else {
      //console.log(vidObj);
      await insertVideo(vidObj);
      res.send("conitune");
    }
  } catch (err) {
    res.send(err);}
});

// Page not found
app.use(function(req, res) {
  res.status(404);
  res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification
// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

/////////////////////////////////////////////////////////////////
//SQL functions 
async function getVideo(eleNum) {
  try {
    const sql = 'select * from VideoTable';
    let result = await db.all(sql);
    return result[eleNum];
  }
  catch (err) {
    console.log(err);
  }
}

async function insertVideo(v) {
  try {
    const sql = "insert into PrefTable (better,worse) values (?,?)";
    await db.run(sql, [v.better, v.worse]);
    console.log("inserting", v);
  }
  catch (err) {
    console.log(err);
  }
}

// // print PrefTable
// console.log("From sqlWrap.js call");
allPrefTable();

// allPrefTable returns the entire table on sucess
async function allPrefTable() {
  try {
    console.log("Printing PrefTable");
    // make the SQL command
    let cmd = " SELECT * FROM PrefTable";
    let result = await db.all(cmd);
    console.log("Print PrefTable: \n", result);
    return result;
  }
  catch (err) {
    console.log(err);
  }
}


async function getUrlByRowID(num) {
  try {
    const sql = 'select url from VideoTable where rowIdNum = ?';
    let result = await db.get(sql, [num]);
    console.log(result);
    return result;
  }
  catch (err) {
    console.log(err);
  }
}
