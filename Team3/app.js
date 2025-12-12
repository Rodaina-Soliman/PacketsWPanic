var express = require('express');
var path = require('path');
var app = express();

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

app.get('/', function(req, res){
  res.render('login')
});

app.get('/cities', function(req, res){
  res.render('cities')
});

app.get('/hiking', function(req, res){
  res.render('hiking')
});

app.get('/home', function(req, res){
  res.render('home')
});

app.get('/islands', function(req, res){
  res.render('islands')
});

app.get('/login', function(req, res){
  res.render('login')
});

app.get('/registration', function(req, res){
  res.render('registration')
});

app.get('/searchresults', function(req, res){
  res.render('searchresults')
});

app.get('/wanttogo', function(req, res){
  res.render('wanttogo')
});

//Category Page gets 
//gets from cities
app.get('/paris', function(req,res){
  res.render('paris', {e: 'false', m: null});
})

app.get('/rome', function(req,res){
  res.render('rome', {e: 'false', m: null});
})

//gets from hiking
app.get('/inca', function(req,res){
  res.render('inca', {e: 'false', m: null});
})

app.get('/annapurna', function(req,res){
  res.render('annapurna', {e: 'false', m: null});
})

//gets from islands
app.get('/bali', function(req,res){
  res.render('bali', {e: 'false', m: null});
})

app.get('/santorini', function(req,res){
  res.render('santorini', {e: 'false', m: null});
})

//Search 
const destinations = ["rome","paris","inca","annapurna","bali","santorini"];

app.get('/searchresults', function(req,res){
  res.render('searchresults');
})

app.post('/search', function(req,res){
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
        const { username, destination } = req.body;
        db.collection("myCollection").findOne({username: username}).then(result => {
          if (result.destinations.includes(destination)){
            return res.render(destination.toLowerCase(), {e: 'true', m: 'Already in your list!'})
          }
          else{
            db.collection("myCollection").updateOne(
                    {username: username},
                    {$addToSet: {destinations: destination}},
                    {upsert: true}).then(() => {
                    return res.render(destination.toLowerCase(), {e: 'true', m: 'Added to list!'});
                });
        }
    });
  });

app.listen(3000);
