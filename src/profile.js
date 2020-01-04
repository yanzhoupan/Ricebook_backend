// const User = require('../model').User
const Profile = require('./model.js').Profile
const uploadImage = require('./uploadCloudinary.js').uploadImage
const parseIt = require("./uploadCloudinary.js");

const multer = require('multer')
const stream = require('stream')
const cloudinary = require('cloudinary')
require("dotenv").config();

const stubProfile= {
		'realUser' :{
			email:'realUser@email.com',
			zipcode: "01234",
			avatar: 'realUserAvatar',
			dob: (new Date('01/01/2000')).toDateString()
		},
		'yp24':{
			email:'yp24@rice.edu',
			zipcode: "12345",
			avatar: 'yp24Avatar',
			dob: (new Date('07/15/1994')).toDateString()
		}
	}

const getHeadlines = (req, res) => {
    // console.log("get headlines")
    let users = []
    if (!req.params.users) {
        // console.log("get headlines!!!")
      users.push(req.username)
    }
    else {
      users = req.params.users ? req.params.users.split(',') : [req.user]
    }
  
    Profile
      .find( { username: {  $in : users } } )
      .exec( (err, foundUsers) => {
          const headlineArray = foundUsers.map( (user) => {
          let headlineObj =  {username: user.username, headline: user.headline}
          return headlineObj
        })
        res.status(200).send( { headlines: headlineArray } )
      })
  }


  const updateHeadline = (req, res) => {
    console.log("update headline")
    Profile
      .findOneAndUpdate( { username: req.username }, { headline: req.body.headline } )
      .exec( (err, foundUser) => {
          res.status(200).send( { username: req.username, headline: req.body.headline } )
        // res.send( { username: req.username, headline: req.body.headline } )
      })
  }



  const getEmail = (req, res) => {
    const username = req.params.user ? req.params.user : req.username
    Profile.find({ username:username }).exec(function(err, profiles){
      if(err) {
        throw err
      } else if(profiles === null || profiles.length === 0){
        res.status(400).send("no user "+username+" in database")
      } else {
        res.status(200).send({username:username, email:profiles[0].email})			
      }
    })
  }



  const putEmail = (req, res) => {
    const username = req.username
    const email = req.body.email
    console.log(username, email)
    Profile.update({username: username}, { $set: {email: email}}, {new: true}, function(err, profiles){
      if(err) {
        throw err
      } else {
        res.status(200).send({username:username, email:email})
      }
    })
  }



  const getZipcode = (req, res) => {
    const username = req.params.user ? req.params.user : req.username
    Profile.find({ username:username }).exec(function(err, profiles){
      if(err) {
        throw err
      } else if(profiles === null || profiles.length === 0){
        res.status(400).send("no user "+username+" in database")
      } else {
        res.status(200).send({username:username, zipcode:profiles[0].zipcode})			
      }
    })
  }



  const putZipcode = (req, res) => {
    const username = req.username
    const zipcode = req.body.zipcode
    Profile.update({username: username}, { $set: {zipcode: zipcode}}, {new: true}, function(err, profiles){
      if(err) {
        throw err
      } else {
        res.status(200).send({username:username, zipcode:zipcode})
      }
    })
  }
  


  const getDob = (req, res) =>{
    const username = req.username
    Profile.find({username:username}).exec(function(err, profiles){
      if(err) throw err
      else {
        res.status(200).send({username:username, dob:profiles[0].dob})			
      }
    })
  }


  const getAvatars = (req, res) => {
    var users = req.params.users ? req.params.users.split(',') : [req.username]
      Profile.find({username: {$in:users}}).exec(function(err,profiles){
          if(!profiles || profiles.length === 0 ){
              res.status(400).send('all the input users have Not registered')
              return
          }
          var result = []
          profiles.forEach(function(item){
              result.push({username:item.username, avatar:item.avatar})
          })
          res.status(200).send({avatars:result})
      })
  }
  
  // const putAvatars = (req, res) => {
  //   var user = req.username
  //     if(!req.fileurl){
  //         res.status(400).send("missing the avatar input")
  //         return
  //     }
  //     Profile.update({username:user},{$set:{avatar:req.fileurl}},{new: true}, function(err){
  //         if(err)
  //             return console.log(err)
  //         else{
  //             Profile.find({username:user}).exec(function(err,profiles){
  //                 if(err)
  //                     return console.log(err)
  //                 else if(!profiles  || profiles.length === 0){
  //                     res.status(400).send("this user has not registered to the database")
  //                     return
  //                 }
  //                 else{
  //                     res.status(200).send({
  //                     username:user,
  //                     avatar:profiles[0].avatar
  //                     })
  //                 }
  //             })
  //         }
  //     })
  // }

//   const putAvatar = (req, res) => {
//     console.log("in putAvatars----", req.email, req.username, req.fileurl)
//     Profile.update({username: req.username}, {$set: {avatar: req.fileurl}}, {new: true}, function(){})
//     res.status(200).send({
//         username: req.username,
//         avatar: req.fileurl
//     })
// }

const putAvatar = function(req, res, next){
  multer().single('avatar')(req, res, () => doUpload(req, res, next));
}

doUpload = function(req, res, next){
  const uploadStream = cloudinary.uploader.upload_stream(result => {
  // capture the url and public_id and add to the request
  req.fileurl = result.url
  Profile.update({username: req.username}, {$set: {avatar: req.fileurl}}, {new: true}, function(){})
  console.log("in doUpload-----set req.username", req.username)
  res.status(200).send({
            username: req.username,
            avatar: req.fileurl
        })
    req.fileid = result.public_id
    next()
}, { public_id: req.body["avatar"]})

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


  module.exports = (app) => {
    app.get('/headlines/:users*?', getHeadlines)
    app.put('/headline', updateHeadline)
    app.get('/email/:user?', getEmail)
    app.put('/email', putEmail)
    app.get('/dob', getDob)
    app.get('/zipcode/:user?', getZipcode)
    app.put('/zipcode', putZipcode)
    app.get('/avatars/:user?', getAvatars)
    // app.put('/avatar', uploadImage('avatar'), putAvatars)
    app.put('/avatar', putAvatar)
}
