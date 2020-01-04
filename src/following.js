const followinglist = {
    following:{
        'yp24':['Mack','Jan Doe'],
        'Jan Doe':['Mack'],
        'Mack':['Jan Doe']
    }
}

const getFollowing = (req, res) =>{
    if (!req.user) req.user = 'yp24'
    const user = req.params.user ? req.params.user : req.user
    res.send({
        username: user,
        following: followinglist.following[user]
    })
}

const putFollowing = (req, res) =>{
    if (!req.user) req.user = 'yp24'
    if (followinglist.following[req.user].indexOf(req.params.user) == -1){
        followinglist.following[req.user].push(req.params.user)
    }
    res.send({
        username: req.user,
        following: followinglist.following[req.user]
    })
}

const deleteFollowing = (req, res)=>{
    if (!req.user) req.user = 'yp24'
    const newfollowing = followinglist.following[req.user].filter((v)=>{
        return v != req.params.user
    })
    followinglist.following[req.user] = newfollowing
    res.send({
        username: req.user,
        following: followinglist.following[req.user]
    })
}

module.exports = app => {
    app.get('/following/:user?', getFollowing)
    app.put('/following/:user', putFollowing)
    app.delete('/following/:user', deleteFollowing)
}



// const followings = [
//     {
//         username: 'yp24',
//         following: [
//             'Mack',
//             'Jan Doe'
//         ]
//     }
// ]

// const getFollowing = (req, res) =>{
//     const user = req.params.user ? req.params.user : 'yp24'
//     console.log("currUser:", user)
//     var currFollow = followings.filter(foll => {
//         // console.log("in filter:", foll.username==user)
//         // foll.username == user
//         true
//     })
//     console.log("following:", currFollow)
//     res.send({
//         username: user,
//         following: currFollow
//     })
// }

// const putFollowing = (req, res) =>{
//     followings[0].following.push(req.params.user)
//     res.send({
//         username: followings[0].username,
//         following: followings[0].following
//     })
// }

// const deleteFollowing = (req, res)=>{
    
//     followings[0].following = followings[0].following.filter((v)=>{
//         return v != req.params.user
//     })
//     res.send({
//         username: followings[0].username,
//         following: followings[0].following
//     })
// }

// module.exports = (app) => {
//     app.delete('/following/:user', deleteFollowing)
//     app.put('/following/:user', putFollowing)
//     app.get('/following/:user?',getFollowing)  
// }