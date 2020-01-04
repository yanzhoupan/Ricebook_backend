// this is dbarticle.js 
var Article = require('./model.js').Article
var Profile = require('./model.js').Profile
var Comment = require('./model.js').Comment

function find(req, res) {
     findByAuthor(req.params.user, function(items) {
          res.send({items})
     })
}

module.exports = (app) => {
     app.get('/find/:user', find)
}


function findByAuthor(author, callback) {
	Article.find({ author: author }).exec(function(err, items) {
		console.log('There are ' + items.length + ' entries for ' + author)
		var totalLength = 0
		items.forEach(function(article) {
			totalLength += article.text.length
		})
		console.log('average length', totalLength / items.length)		
		callback(items)
	})
}

// Add my own Atricle
// new Article({ id: 101, author: 'yp24', img: null, date: new Date().getTime(), text: 'This is Yanzhou Pan\'s 1st article'}).save()
// new Article({ id: 102, author: 'yp24', img: null, date: new Date().getTime(), text: 'This is Yanzhou Pan\'s 2nd article'}).save()
// new Article({ id: 103, author: 'yp24', img: null, date: new Date().getTime(), text: 'This is Yanzhou Pan\'s 3rd article'}).save()
// new Article({ id: 104, author: 'yp24', img: null, date: new Date().getTime(), text: 'This is Yanzhou Pan\'s 4th article'}).save()
// new Article({ id: 105, author: 'yp24', img: null, date: new Date().getTime(), text: 'This is Yanzhou Pan\'s 5th article'}).save()


//Add the test user profile
// new Profile({username: "yp24", displayname: "Andrew", headline: "I love web development!",
// 	email: "yp24@rice.edu", zipcode: "77005", dob: "what?",
// 	following: [], avatar: "String"}).save()

// commentId: String, author: String, date: Date, text: String 
// "Wow, that picture is so beautiful!",
// "Good job, bro!",
// "I love web development."
const comts = [new Comment({commentId:"0", author:"user1", text:"Wow, that picture is so beautiful!"}),
new Comment({commentId:"1", author:"user2", text:"Good job, bro!"}),
new Comment({commentId:"2", author:"user3", text:"I love web development."})
]
new Article({ id: 1, author: 'yp24', img: null, date: new Date().getTime(), text: 'This is my first article', comments: comts}).save()

//////////////////////////////
// remove these examples 

// new Article({ id: 1, author: 'mrj1', img: null, date: new Date().getTime(), text: 'This is my first article'}).save()
// new Article({ id: 2, author: 'mrj1', img: null, date: new Date().getTime(), text: 'This is my second article'}).save()
// new Article({ id: 3, author: 'jmg3', img: null, date: new Date().getTime(), text: "This is Max's article"}).save(function() {
//      console.log('done with save')
//      Article.find().exec(function(err, items) { 
//           console.log("There are " + items.length + " articles total in db") 

//           findByAuthor('mrj1', function() {
//               findByAuthor('jmg3', function() {
//                   console.log('complete')
//                   process.exit()
//               })
//           })
//      })
// })

//////////////////////////////
// remove the above example code
//////////////////////////////