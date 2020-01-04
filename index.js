const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express()
app.use(cookieParser());

// const corsMiddleware = (req, res, next) => {
//      res.header("Access-Control-Allow-Credentials", true);
//      res.setHeader("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept")
//      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
//      res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200")
//      res.status(200).send('OK')
//     //  next()
//      if (req.method === 'OPTIONS') {
//        res.status(200).send('OK')
//      }
//      else {
//        next()
//      }
//    }

const corsMiddleware = (req, res, next) => {
 
  res.header('Access-Control-Allow-Origin',req.headers.origin)
  res.header('Access-Control-Allow-Credentials',true)
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers','Authorization, Content-Type')
  res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id')
  if (req.method == 'OPTIONS')
  {
      res.sendStatus(200)
  }
  else{
      next()
  }
}


    // corsOptions = {
    //     origin: "*",
    //     credentials: true,
    //     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //     allowedHeaders: 'Authorization, Content-Type, Origin, X-Request-With, X-Session-Id',
    //     exposeHeaders: 'Location, X-Session-Id',
    //     withCredentials: 'include',
    //     credentials : 'include' 
    //   };
    //   app.use(cors(corsOptions));
    // app.all('*', function(req, res, next){
    //       res.header("Access-Control-Allow-Origin", req.headers.origin);//不能设置为*，必须是具体的地址
    //       res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    //       res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //       res.header('Access-Control-Allow-Headers', 'Content-Type');
    //       res.setHeader('Access-Control-Allow-Credentials', true);//设置为true，可以跨域带上cookie
    // })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(corsMiddleware)

app.get('/', (req, res) => res.send("Yanzhou Pan, Ricebook, hw6-backend"))
// app.post('/article', (req, res) => res.send("addArticle"))

// require("./src/dbpost")(app)
require('./src/auth')(app)
require('./src/profile')(app)
require('./src/following')(app)
require('./src/articles')(app)
require('./src/uploadCloudinary.js').setup(app)

// const upCloud = require('./src/uploadCloudinary.js')
// upCloud.setup(app)





// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})






























// const express = require('express');
// const bodyParser = require('body-parser');

// let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
//     { id: 1, author: 'Jack', body: 'Post 2' },
//     { id: 2, author: 'Zack', body: 'Post 3' }];

// const hello = (req, res) => res.send({ hello: 'world' });

// const getArticles = (req, res) => res.send(articles);

// const getArticle = (req, res) => res.send(articles[req.params.id]);

// const addArticle = (req, res) => {
//     let post = req.body;
//     let article = {id: articles.length, author: post.author, body: post.body}
//     articles.push(article);
//     res.send(articles);
// }

// const app = express();
// app.use(bodyParser.json());
// app.get('/', hello);
// app.get('/articles', getArticles);
// app.get('/articles/:id', getArticle);
// app.post('/article', addArticle);

// // Get the port from the environment, i.e., Heroku sets it
// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//      const addr = server.address();
//      console.log(`Server listening at http://${addr.address}:${addr.port}`)
// });