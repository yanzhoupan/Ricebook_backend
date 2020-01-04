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


describe('unit test for login, post new article, and logout', ()=>{
    let body = {
        "username":"yp24",
        "password":"123", 

    }
    let articlesNum = 0;

    it('should login the test user', done=>{
        const opts = { method: "post", headers: { 'Content-Type': 'application/json'}}
        resource("/login",opts, body)
        .then(res=>{
            res.json().then(ele=>{
                expect(ele.username).to.be.equal("yp24")
            })
        }).then(done).catch(done)
    })

    it("should get the articles of the test user", done=>{
        const loginOpts = { method: "post", headers: { 'Content-Type': 'application/json'}}
        resource("/login",loginOpts, body).then(ele=>{
            const opts = { method:"get", headers: { 'Content-Type': 'application/json', "cookie":ele.headers._headers["set-cookie"]}}
            resource("/articles/yp24", opts, body)
            .then(res=>{
                res.json().then(ele=>{
                    articlesNum = ele.articles.length
                    expect(articlesNum).to.be.at.least(5)
                }).then(done).catch(done)
            })
        })
    })


    it('should POST a new articles', done=>{
        const postBody = {text:"for unit test"}
        const loginOpts = { method: "post", headers: { 'Content-Type': 'application/json'}}
        resource("/login",loginOpts, body).then(ele=>{

            // console.log("in post article", ele.headers._headers["set-cookie"])
            const opts = { method:"post", headers: { 'Content-Type': 'application/json', "cookie":ele.headers._headers["set-cookie"]}}
            resource("/article", opts, postBody)
            .then(res=>{
                // console.log("=======", AuthenticatorAssertionResponse)
                res.json().then(elem=>{
                    // newArticlesNum = ele.articles.length
                    expect(elem.articles[0].text).to.eql("for unit test")
                }).then(done).catch(done)
            })
        })
    })

    it('should GET articles with articlesNum + 1', done=>{
        const loginOpts = { method: "post", headers: { 'Content-Type': 'application/json'}}
        resource("/login",loginOpts, body).then(ele=>{
            const opts = { method:"get", headers: { 'Content-Type': 'application/json', "cookie":ele.headers._headers["set-cookie"]}}
            resource("/articles/yp24", opts, body)
            .then(res=>{
                res.json().then(ele=>{
                    newArticlesNum = ele.articles.length
                    expect(newArticlesNum).to.equal(articlesNum+1)
                }).then(done).catch(done)
            })
        })
    })

    it("should logout the test user", done=>{
        const loginOpts = { method: "post", headers: { 'Content-Type': 'application/json'}}
        resource("/login",loginOpts, body).then(ele=>{
            const opts = { method:"put", headers: { 'Content-Type': 'application/json', "cookie":ele.headers._headers["set-cookie"]}}
            resource("/logout", opts, body)
            .then(res=>{
                res.json().then(ele=>{
                    expect(ele.status).to.equal("success")
                }).then(done).catch(done)
            })
        })
    })
})