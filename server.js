// Load the modules
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

const dbConfig = {
	host: 'db',
	port: 5432,
	database: "meal_db",
	user: "postgres",
	password: "pwd"
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


app.get('/', function(req, res) {
  res.redirect('./main');
});

app.get('/main', function(req, res) {
  res.render('pages/main', {
    my_title: "Home",
    meal: '',
    error: false,
    message: ''
  });
});

app.post('/get_feed', function(req, res) {
  var title = req.body.title;

  if(title) {
    axios({
      url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${title}`,
        method: 'GET',
        dataType:'json',
      })
        .then(meal => {
          res.render('pages/main',{
            my_title: "Home",
            meal: meal.data.meals[0],
            error: false
          })
        })
        .catch(error => {
          console.log(error);
          res.render('pages/main',{
            my_title: "Home",
            meal: '',
            error: true,
            message: error
          })
        });


  }
  else {
    res.render('pages/main',{
      my_title: "Home",
      meal: '',
      error: true,
      message: "Meal name missing"
    })
  }
});

app.get('/reviews', function(req, res) {
  var query = 'SELECT * FROM meal_reviews;';
  db.any(query)
    .then(function (rows) {
      // res.send(rows);
      res.render('pages/reviews', {
        my_title: "Reviews",
        data: rows
      })
    })
    .catch(function (err) {
      console.log('error', err);
      res.render('pages/reviews', {
        my_title: 'Reviews',
        data: ''
      })
    })
});

app.post('/filter', function(req, res) {
  var filter = req.body.filter_by;
  var query = "SELECT * FROM meal_reviews WHERE meal_name = '" + filter + "';";
  db.any(query)
    .then(function (rows) {
      res.render('pages/reviews', {
        my_title: "Reviews",
        data: rows
      })
    })
    .catch(function (err) {
      console.log('error', err);
      res.render('pages/reviews', {
        my_title: 'Reviews',
        data: ''
      })
    })
});

app.post('/add_review', function(req, res) {
  var meal_name = req.body.meal_name;
  var review = req.body.review_text;
  var insert = "INSERT INTO meal_reviews (meal_name, review, review_date) VALUES ('"+ meal_name + "', '" + review + "', CURRENT_TIMESTAMP);";
  var select = 'SELECT * FROM meal_reviews;';

  db.task('get-everything', task => {
    return task.batch([
      task.any(insert),
      task.any(select)
    ]);
  })
  .then(info => {
    res.render('pages/reviews', {
      my_title: "Reviews",
      data: info[1]
    })
  })
  .catch(err => {
    console.log('error', err);
    res.render('pages/reviews', {
      my_title: "Reviews",
      data: ''
    })
  });
});

app.listen(3000);
console.log('3000 is the magic port');