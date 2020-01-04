
// this is model.js 
var mongoose = require('mongoose')
// mongoose.set('useFindAndModify', false);
require('./db.js')

var userSchema = new mongoose.Schema({
    username: String, salt: String, hash: String
})

var commentSchema = new mongoose.Schema({
	commentId: String, author: String, date: Date, text: String 
})

var articleSchema = new mongoose.Schema({
	author: String, img: String, date: Date, text: String,
	comments: [ commentSchema ]
})

var profileSchema = new mongoose.Schema({
	username: String, displayname: String, headline: String,
	email: String, zipcode: String, dob: String,
	following: [ String ], avatar: String
})

exports.User = mongoose.model('user', userSchema)
exports.Article = mongoose.model('article', articleSchema)
exports.Profile = mongoose.model('profile', profileSchema)
exports.Comment = mongoose.model('comment', commentSchema)


// // this is model.js 
// var mongoose = require('mongoose')
// require('./db.js')

// var commentSchema = new mongoose.Schema({
// 	commentId: Number, author: String, date: Date, text: String
// })
// var articleSchema = new mongoose.Schema({
// 	id: Number, author: String, img: String, date: Date, text: String,
// 	comments: [ commentSchema ]
// })

// exports.Article = mongoose.model('article', articleSchema)

