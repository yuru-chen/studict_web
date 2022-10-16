var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var user = require('./routes/user');
var session = require('express-session');
var flash = require('connect-flash');



// var users = require('./routes/users');

var app = express();

// set session
app.use(session({
  secret: 'directory',
  resave: false,
  saveUninitialized: true
}))

// app.use('/users', users);
app.use('/css',express.static(__dirname+'/public/css/'));
app.use('/js',express.static(__dirname+'/public/js/'));
app.use('/img',express.static(__dirname+'/public/img/'));


//set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// view
// app.set('views', path.join(__dirname,'pubic'));
app.set('views', './view');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);



// 透過 locals 傳值給 view: session 功能和 errorMessage
app.use(flash())
app.use((req, res, next) => {
  res.locals.name = req.session.name;
  res.locals.errorMessage = req.flash('errorMessage');
  // 記得加上 next() 把控制權轉移到下一個中間介
  next();
})

app.use('/', user);


// routing
// app.get('/', function(req, res, next){
// 	res.sendFile(path.join(__dirname, "/public/index.html"));
// 	console.log("Hi");
// })

app.listen(3000);
console.log('Server is running on port 3000...')

