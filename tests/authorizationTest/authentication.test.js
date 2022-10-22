const app = require("../../app");
const request = require("supertest");
const chai = require("chai");
const should = require("chai").should();

/**
 * Tests for authentication middlewares
 * @returns {Promise<void>} - Nothing
 */
async function runTests() {
    const newUser = {"username": "-11test-new@techbrij.com", "password": "tesT!"};
    const existingUser = {"username": "1test-new@techbrij.com", "password": "tesT!"};
    let createdProduct = null;

    after(async () => {
        // Close the server and exit the process
        app.close();
    });

    it("Login with a non-existing user", (done) => {
        request(app)
            .post('/login')
            .send(newUser)
            .expect(200)
            .end((err, res) => {
                if (res.text.includes("Password or username is incorrect")) {
                    if (!err) {
                        done();
                        return;
                    }
                    done("shouldn't have an error");
                    return;
                }
                done("response text should include 'Password or username is incorrect'");
            })
    });

    it("Try creating a user with a weak password", (done) => {
        const weakPasswordUser = {"username": newUser.username, "password": "weak"};
        request(app)
            .post('/register')
            .send(weakPasswordUser)
            .expect(200)
            .end((err, res) => {
                if (res.text.includes("Password Too Weak")) {
                    if (!err) {
                        done();
                        return;
                    }
                    done("shouldn't have an error");
                    return;
                }
                done("response text should include 'Password Too Weak'");
            })
    });

    it('Create a user', (done) => {
        request(app)
            .post('/register')
            .send(newUser)
            .expect(302)
            .end((err, res) => {
                res.text.should.contain("Redirecting to /");
                if (!err) {
                    done();
                    return;
                }
                done("Should not be here");
            })
    })

    it('Login with a user', (done) => {
        request(app)
            .post('/login')
            .send(existingUser)
            .expect(302)
            .end((err, res) => {
                res.text.should.contain("Redirecting to /");
                if (!err) {
                    done();
                    return;
                }
                done("Should not have an error");
            })
    });


    it("should not login with wrong password", (done) => {
        const wrongPasswordUser = {"username": "1test-new@techbrij.com", "password": "tesT!!"};
        request(app)
            .post('/login')
            .send(wrongPasswordUser)
            .expect(200)
            .end((err, res) => {
                if (res.text.includes("Password or username is incorrect")) {
                    if (!err) {
                        done();
                        return;
                    }
                    done("shouldn't have an error");
                    return;
                }
                done("response text should include 'Password or username is incorrect'");
            })
    });

    it("Test Api Login", (done) => {
        request(app)
            .post('/api/login')
            .send(existingUser)
            .expect(200)
            .end((err, res) => {
                //check if the response is a JSON object
                res.body.should.be.a('object');
                //check if the response has a token property
                res.body.should.have.property('token');
                //check if the token is a string
                res.body.token.should.be.a('string');
                if (!err) {
                    done();
                    return;
                }
                done("Should not have an error");
            })
    });

    it("Test Api Login with wrong password", (done) => {
        const wrongPasswordUser = {"username": existingUser.username, "password": "tesT!!"};
        request(app)
            .post('/api/login')
            .send(wrongPasswordUser)
            .expect(200)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eq('Login failed');
                err.toString().should.contain('got 401 "Unauthorized"');
                done();
            })
    });

    it("Test creating a product without being logged in", (done) => {
        const product = {"name": "test", "price": 10, "description": "test", "image": "test"};
        request(app)
            .post('/api/products/create')
            .send(product)
            .expect(200)
            .end((err, res) => {
                err.toString().should.contain('got 401 "Unauthorized"');
                done();
            })
    });

    it("Test creating a product while being logged in", (done) => {
        const product = {"name": "test", "price": 10, "description": "test", "imageUrl": "test"};
        const admin = {"username": "admin", "password": "admin"};
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzMzRlNDVmZjMyMGQzYTJmN2U0Y2RjNSJ9LCJpYXQiOjE2NjU4MTY0NDV9.VGMkS63Yva_Z7RyQ9azb2X0mV6Rr2BKHVcyoOst07XA";
        request(app)
            .post('/api/products/create')
            .set('Authorization', "Bearer " + token)
            .send(product)
            .expect(201)
            .end((err, res) => {
                console.log(res.body);
                createdProduct = res.body.product._id;
                console.log(err);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eq('Product created successfully');
                if (!err) {
                    done();
                    return;
                }
                done("Should not have an error");
            })
    });

    it("Test deleting a product while being logged in", (done) => {
        const product = {"name": "test", "price": 10, "description": "test", "imageUrl": "test"};
        const admin = {"username": "admin", "password": "admin"};
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzMzRlNDVmZjMyMGQzYTJmN2U0Y2RjNSJ9LCJpYXQiOjE2NjU4MTY0NDV9.VGMkS63Yva_Z7RyQ9azb2X0mV6Rr2BKHVcyoOst07XA";
        createdProduct = "63536259745dec208165dcba";
        request(app)
            .del('/api/products/' + createdProduct)
            .set('Authorization', "Bearer " + token)
            .send(product)
            .expect(200)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eq('Product deleted successfully');
                if (!err) {
                    done();
                    return;
                }
                done("Should not have an error");
            })
    });

    it("Test visiting the products page when not logged in", (done) => {
        request(app)
            .get('/products/new')
            .expect(302)
            .end((err, res) => {
                res.text.should.contain("Redirecting to /login");
                if (!err) {
                    done();
                    return;
                }
                done("Should not have an error");
            })
    });

}

// Node.JS weirdness required to run an async function from the top level
(async () => {
    await runTests();
})();