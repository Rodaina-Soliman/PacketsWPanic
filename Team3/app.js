var express = require('express');
var path = require('path');
var session = require('express-session'); 
const { MongoClient } = require('mongodb'); 
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const mongoUrl = 'mongodb://localhost:27017';
const client = new MongoClient(mongoUrl);
const dbName = 'myDB';        
const collectionName = 'myCollection'; 
let collection;
async function connectDB() {
    try {
        await client.connect();
        console.log(">>> SUCCESS: Connected to MongoDB <<<");
        const db = client.db(dbName);
        collection = db.collection(collectionName);
    } catch (err) {
        console.error("Database Connection Error:", err);
    }
}
connectDB();
app.use(session({
    secret: 'secretKey123',
    resave: false,
    saveUninitialized: true
}));
app.get('/login', function(req, res){
    res.render('login', { error: null, success: null });
});
app.post('/login', async function(req, res) {
    const { username, password } = req.body;

    try {
        const user = await collection.findOne({ username, password });

        if (user) {
            req.session.user = user;
            return res.redirect('/home');
        } else {
            return res.render('login', { error: "Invalid username or password.", success: null });
        }

    } catch (e) {
        res.send("Error: " + e.message);
    }
    });

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
  if (!req.session.user) {
       return res.redirect('/'); 
  }
  res.render('home');
});

app.get('/islands', function(req, res){
  res.render('islands')
});

app.get('/paris', function(req, res){
  res.render('paris')
});


app.get('/login', function(req, res){
  res.render('login')
});

app.get('/registration', function(req, res){
   res.render('registration', { error: null, success: null });
});

app.post('/registration', async function(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('registration', { error: "Fields cannot be empty.", success: null });
    }

    try {
        const existing = await collection.findOne({ username });

        if (existing) {
            return res.render('registration', { error: "Username already taken.", success: null });
        }

        await collection.insertOne({ username, password, wantToGoList: [] });

        res.render('login', { error: null, success: "Registration successful! Please log in." });

    } catch (e) {
        res.send("Error: " + e.message);
    }
});
app.get('/rome', function(req, res){
  res.render('rome')
});

app.get('/santorini', function(req, res){
  res.render('santorini')
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
