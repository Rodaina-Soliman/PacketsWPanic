var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Monogodb connection

const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
const db = client.db('myDB');

app.use(session({
    secret: 'secretKey123',
    resave: false,
    saveUninitialized: true
}));

app.get('/', function(req, res){
  res.render('login', { error: null, success: null });
});

app.get('/cities', function(req, res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('cities')
});

app.get('/hiking', function(req, res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('hiking')
});

app.get('/home', function(req, res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('home')
});

app.get('/islands', function(req, res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('islands')
});

app.get('/login', function(req, res){
    req.session.user = null;
    res.render('login', { error: null, success: null });
});

app.post('/login', function(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.render('login', { error: "Fields cannot be empty.", success: null });
    }
    db.collection("myCollection").findOne({username: username, password: password}).then(result => {
        if (result && result.username && result.password) {
            req.session.user = username;
            return res.redirect('/home');
        } else {
            return res.render('login', { error: "Invalid username or password.", success: null });
        }
      });
 });

app.get('/registration', function(req, res){
  res.render('registration', { error: null, success: null });
});

app.post('/registration', function(req, res){
  const { username, password } = req.body;

  if (!username || !password) {
        return res.render('registration', { error: "Fields cannot be empty.", success: null });
    }

  db.collection("myCollection").findOne({username: username}).then(result => {
    if (result && result.username){
      return res.render('registration', { error: "Username already taken.", success: null });
    }
    else {
      db.collection("myCollection").insertOne({username: username, password: password, destinations: []});
  res.render('login', { error: null, success: "Registration successful! Please log in." });
    }
  });
    
});

app.get('/searchresults', function(req, res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('searchresults')
});

app.get('/wanttogo', function(req, res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
  }

  const username = req.session.user;

  db.collection("myCollection").findOne({username: username}).then(result => {
      res.render('wanttogo', {
        destinations: result.destinations || []
    });
  });

});

//Category Page gets 
//gets from cities
app.get('/paris', function(req,res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('paris', {error: null, success: null});
})

app.get('/rome', function(req,res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('rome', {error: null, success: null});
})

//gets from hiking
app.get('/inca', function(req,res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('inca', {error: null, success: null});
})

app.get('/annapurna', function(req,res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('annapurna', {error: null, success: null});
})

//gets from islands
app.get('/bali', function(req,res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('bali', {error: null, success: null});
})

app.get('/santorini', function(req,res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('santorini', {error: null, success: null});
})

//Search 
const destinations = ["rome","paris","inca","annapurna","bali","santorini"];

app.get('/searchresults', function(req,res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  res.render('searchresults');
})

app.post('/search', function(req,res){
  if (!req.session.user) {
       return res.render('login', { error: "Please Login first", success: null });
    }
  var x = req.body.Search;

  if (!x || x.trim()===""){
    return res.render("searchresults", {results:[], notFound: true});
  }

  const results = destinations.filter(dest =>
    dest.toLowerCase().includes(x.toLowerCase())
  ); //results list
    
  res.render("searchresults", { results: results, notFound: results.length === 0 });

  
    }
  );

  //Add to want to go list

  app.post('/add-to-wanttogo', function(req,res){
    const username = req.session.user;
    const {destination } = req.body;
    db.collection("myCollection").findOne({username: username}).then(result => {
      if (result.destinations.includes(destination)){
        return res.render(destination.toLowerCase(), {error: 'Already in your list!', success: null})
      }
      else{
        db.collection("myCollection").updateOne(
                {username: username},
                {$addToSet: {destinations: destination}},
                {upsert: true}).then(() => {
                return res.render(destination.toLowerCase(), {error: null, success: 'Added to list!'});
            });
      }
  });
});

app.listen(3000);