// Require
const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({defalutLayout:'main'});
const mysql = require('./dbcon.js');
const bodyParser = require('body-parser');

// Engines
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

// Queries
const tableName = "workouts";
const getAllQuery = `SELECT * FROM ${tableName}`
const insertQuery = ``
const updateQuery = ``
const deleteQuery = ``
const deleteTableQuery = `DROP TABLE IF EXISTS ${tableName}`
const createTableQuery = `CREATE TABLE ${tableName}(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  reps INT,
  weight INT,
  lbs BOOLEAN,
  date DATE
)`;

// Render pages
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query(createTableQuery);
  mysql.pool.query(`SELECT * FROM ${tableName}`, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});

app.get('/reset-table', (req, res, next) => {
  mysql.pool.query(deleteTableQuery, (err) => {
    mysql.pool.query(createTableQuery, (err) => {
      if(err){
        console.log(err);
      }
      res.send(`${tableName} table reset`)
    })
  })
})

app.get('/results', (req, res) => {
  var entries = [];
  for (var entry in req.query) {
      entries.push({'name':entry, 'value':req.query[entry]});
  }
  var displayGetObject = {};
  displayGetObject.dataList = entries;
  res.render('get-results', displayGetObject)
});

app.get('/insert',function(req,res,next){
  var entries = [];
  for (var entry in req.query) {
      entries.push({'name':entry, 'value':req.query[entry]});
  }
  var upload = {};
  upload.dataList = entries;

  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `lbs`, `date`) VALUES (?, ?, ?, ?, ?)", [
    // req.query.newExerciseName,
    upload.dataList[0].value,
    upload.dataList[1].value,
    upload.dataList[2].value,
    upload.dataList[3].value,
    upload.dataList[4].value
    ], function(err, result){
      if(err){
        console.log(err);
        next(err);
        return;
      }
      upload.results = "Inserted id " + result.insertId;
      res.render('home', upload);
  });
});

app.get('/simple-update',function(req,res,next){
    var context = {};
    mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=? WHERE id=? ",
      [req.query.name, req.query.done, req.query.due, req.query.id],
      function(err, result){
      if(err){
        next(err);
        return;
      }
      context.results = "Updated " + result.changedRows + " rows.";
      res.render('home',context);
    });
});

app.use((req, res) => {
    res.status(404);
    res.render('404');
});

app.use((req, res) => {
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), () => {
    console.log('Express started on: ' + app.get('port') + '. Press Ctrl+C to terminate.');
});