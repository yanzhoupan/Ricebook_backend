const Article = require('./model.js').Article
const Comment = require('./model.js').Comment
const Profile = require('./model.js').Profile
const md5 = require('md5')
// const uploadImage = require('../uploadCloudinary')
const multer = require('multer')
const stream = require('stream')
const cloudinary = require('cloudinary')
require("dotenv").config();
  
let id = 3

const articles = [
    {
        id: 0,
        author: 'Scott',
        text: 'This is Scott\'s article',
        date: new Date(),
        comments: ['happy']
    },
    {
        id: 1,
        author: 'Tom',
        text: 'This is Tom\'s article',
        date: new Date(),
        comments: ['happy']
    },
    {
        id: 2,
        author: 'Jerry',
        text: 'This is Jerry\'s article',
        date: new Date(),
        comments: ['happy']
    }
]

const addArticle = (req, res) =>{
    if(!req.body.text){
        res.status(400).send('no content in this article')
		return
    }
    // console.log('start new article', req.body.image)

    const newArticle = new Article({author: req.username, 
                                    // img: req.fileurl, 
                                    img: req.body.image,
                                    date: new Date(), 
                                    text: req.body.text, 
                                    comments: []})
    new Article(newArticle).save(function(err, article){
        if(err) throw err
        else{
            res.status(200).send({articles: [article]})
        }
    })
}

const addArticleImage = function(req, res, next){
    multer().single('image')(req, res, () => doUpload(req, res, next));
  }
  
  doUpload = function(req, res, next){
    const uploadStream = cloudinary.uploader.upload_stream(result => {
                
    // capture the url and public_id and add to the request
    req.fileurl = result.url
    // Article.update({username: req.username}, {$set: {img: req.fileurl}}, {new: true}, function(){})
    // console.log("article image uplode-----set req.fileurl", req.fileurl)
    res.status(200).send({
              username: req.username,
              image: req.fileurl
          })
      req.fileid = result.public_id
      next()
  }, { public_id: req.body["image"]})
  
    if (req.file) {
      const s = new stream.PassThrough()
      s.end(req.file.buffer)
      s.pipe(uploadStream)
      s.on('end', uploadStream.end)
    }
    else {
      next()
    }
  // and the end of the buffer we tell cloudinary to end the upload.
  }



const getArticles = (req, res) => {
    // res.send("cool")
    // console.log("get articles")
    // console.log(req.params.id, Article.find({author: req.params.id}))
	if(req.params.id){
		// Article.find({_id: req.params.id}).exec(function(err,articles){
        //     if(err) {
        //         console.log(1)
        //         res.status(400).send('Bad Request')
        //     } else if (articles.length > 0){
        //         res.send({articles:[articles[0]]})
        //     } else{
                Article.find({author: req.params.id}).exec(function(err, articles){
                    if (err){
                        res.status(400).send('Bad Request')
                    } else {
                        res.status(200).send({articles: articles})
            }})
        // }
        // })
	} else {
		Profile.find({username:req.username}).exec(function(err,profiles){
        if (err || profiles.length == 0){
            res.status(500).send('Internal Server Error') //unit test dies here
        } else {
            const userObj = profiles[0]
            const usersToQuery = [req.username, ...userObj.following]
            Article.find({ author: {$in: usersToQuery} }).sort('-date').limit(10).exec(function(err, articleItems) {
                return res.status(200).send({ articles: articleItems })
            })
        }})}
}



// const editArticle = (req, res) => {
// 	const text = req.body.text;
// 	if(req.params.id > articles.length || req.params.id <= 0){
// 		res.status(401).send('Forbidden!')
// 		return;
// 	} else if(!req.body.commentId) {
// 		articles[req.params.id].text = req.body.text;
// 	} else{
// 		articles[req.params.id].comments.push(req.body.text);
// 	}
// 	res.status(200).send({articles: [articles[req.params.id]]});	
// }

const editArticle = (req, res) => {
    Article.find({_id: req.params.id}).exec(function(err, articles) {
        // no such article with the id 
        if(err || articles.length == 0) {
            // console.log("didn't find")
            res.status(400).send('Bad Request')
            return
        } 
        // console.log("=====in editarticle", req.body.commentId)
        // edit a comment
        if (req.body.commentId+1) {
            // console.log("+++edit comment!")
            // add a new comment
            if (req.body.commentId == -1){
                const newcomment = new Comment({
                    commentId: md5(req.username + new Date().toUTCString()), 
                    author:req.username, 
                    date: (new Date()).toUTCString(), 
                    text: req.body.text
                })
                Article.findOneAndUpdate({_id: articles[0]._id}, { $addToSet: {comments: newcomment}}, {upsert:true, new:true}, function(err){
                    if (err){
                        res.status(500).send('Internal Server Error')
                    } else {
                        Article.find({_id: req.params.id}).exec(function(exception, articles){
                            res.send({articles: [articles[0]]})
                        })
                }})
            }
            // edit a comment
            else{
                // console.log("edit comment", req.body.commentId, req.body.text)
                Article.findOneAndUpdate({_id: articles[0]._id, 'comments.commentId' : req.body.commentId}, {$set: {'comments.$.text':req.body.text}}, function(ex, articles){
                comId = req.body.commentId    
                // Article.findOneAndUpdate({_id: articles[0]._id}, {$set: {'comments.0':"req.body.text"}},{multi: true}, function(ex, articles){
                    if (ex) {
                    res.status(500).send('Internal Sever Error')
                    return
                } 
                res.send({articles: [articles]})
            })}
        }
        //edit an article 
        else {
            Article.findOneAndUpdate({_id: articles[0]._id}, {$set: { text: req.body.text }}, function(err, articles){
                if (err){
                    res.status(500).send('Internal Server Error')
                    return
                } else {
                    res.send({articles: [articles]})
                }
        })}
    })
}

module.exports = app =>{
    app.get('/articles/:id?', getArticles)
    app.post('/article', addArticle)
    app.put('/articleImage', addArticleImage) // fix this, how to upload article with image(req.fileurl)
    app.put('/articles/:id', editArticle)
    // app.put('/comment/')
}