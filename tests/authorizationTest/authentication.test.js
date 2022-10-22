const User = require("../../models/account");
const app = require("../../app");
const request = require("supertest");
const chai = require("chai");
const should = require("chai").should();

async function runTests() {
    const newUser = {"username": "-5test-new@techbrij.com", "password": "tesT!"};
    const existingUser = {"username": "1test-new@techbrij.com", "password": "tesT!"};

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

    it('Create a user', (done) => {
        // const expectedResponse = [user]
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
        // const expectedResponse = [user]
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
}

// describe("# Auth APIs", () => {
//     const apiBase = process.env.API_BASE || '/api';
//     const newUser = {"username": "test-new@techbrij.com", "password": "tesT!"};
//     it("should create user", () => {
//         console.log("should create user");
//         return request.post('/login')
//             .send(newUser)
//             .expect(200)
//             .then(res => {
//                 res.body.success.should.be.true;
//             });
//     });
//
//     it("should retrieve the token", () => {
//         return cleanExceptDefaultUser().then(res => {
//             return loginWithDefaultUser().then(res => {
//                 res.status.should.equal(200);
//                 res.body.success.should.be.true;
//                 res.body.token.should.not.be.empty;
//             });
//         });
//     });
//
//     it("should not login with the right user but wrong password", () => {
//         return request.post(apiBase + '/auth/signin')
//             .send({"username": newUser.username, "password": "random"})
//             .expect(401);
//     });
//
//     it("should return invalid credentials error", () => {
//         return request.post(apiBase + '/auth/signin')
//             .send({"username": newUser.username, "password": ""})
//             .expect(401)
//             .then(res => {
//                 return request.post(apiBase + '/auth/signin')
//                     .send({"username": newUser.username, "password": "mypass"})
//                     .expect(401);
//             });
//     });
// });

// Node.JS weirdness required to run an async function from the top level
(async () => {
    await runTests();
})();