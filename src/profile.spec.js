const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const resource = (endpoint, opts, payload) => {
	const url = `https://hw-6-backend-yp24.herokuapp.com${endpoint}`
    var options = opts
    if (payload) options.body = JSON.stringify(payload)
    options.credentials = "include";
	return fetch(url, options).then(r => {
			if (r.status == 200) {
				return r
			} else {
				const msg = `ERROR ${method} ${endpoint} returned ${r.status}`
				console.error(msg)
				throw new Error(msg)
			}
		})
}


describe('validate headline-ralated function', ()=>{
	let putHeadlineBody = {
        "headline":"new headline for unit test"
	}
	let loginBody = {
        "username":"yp24",
        "password":"123", 

    }

    it('should GET headline for the test user', done=>{
		const loginOpts = { method: "post", headers: { 'Content-Type': 'application/json'}}
        resource("/login",loginOpts, loginBody).then(ele=>{
			// console.log("=====", ele)
            const opts = { method:"get", headers: { 'Content-Type': 'application/json', "cookie":ele.headers._headers["set-cookie"]}}
            resource("/headlines/yp24", opts)
            .then(res=>{
				// 
                res.json().then(ele=>{
					// console.log(ele)
                    expect(ele.headlines[0].username).to.be.equal("yp24")
                }).then(done).catch(done)
            })
		})
    })

    it('should PUT headline for the test user', done=>{
		const loginOpts = { method: "post", headers: { 'Content-Type': 'application/json'}}
        resource("/login",loginOpts, loginBody).then(ele=>{
            const opts = { method:"put", headers: { 'Content-Type': 'application/json', "cookie":ele.headers._headers["set-cookie"]}}
            resource("/headline", opts, putHeadlineBody)
            .then(res=>{
                res.json().then(ele=>{
					// console.log("======", ele)
					expect(ele.username).to.be.equal("yp24")
					expect(ele.headline).to.be.equal("new headline for unit test")
                }).then(done).catch(done)
            })
		})


        // const headline = "something different"
        // resource('PUT','headline',{headline})
        // .then(body=>{
		// 	expect(body.username).to.be.eql('yp24')
		// 	expect(body.headline).to.be.eql(headline)
        // })
        // .then(done).catch(done)
    })

})