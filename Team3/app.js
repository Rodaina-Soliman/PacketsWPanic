var express = require('express');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index',{title: "express"})
});

//Rana
//Category Page gets 
//gets from cities
app.get('/paris', function(req,res){
  res.render('paris');
})

app.get('/rome', function(req,res){
  res.render('rome');
})

//gets from hiking
app.get('/inca', function(req,res){
  res.render('inca');
})

app.get('/annapurna', function(req,res){
  res.render('annapurna');
})

//gets from islands
app.get('/bali', function(req,res){
  res.render('bali');
})

app.get('/santorini', function(req,res){
  res.render('santorini');
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



app.listen(3000);
