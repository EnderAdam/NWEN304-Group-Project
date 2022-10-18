async function POSTLogin() {
    const herokuUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/login`;
    const localUrl = `http://localhost:3000/api/login`;

    let local = await fetch(localUrl, {
        method: 'POST', headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        }, body: JSON.stringify({username: "admin", password: "admin"})
    });
    let heroku = await fetch(herokuUrl, {
        method: 'POST', headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        }, body: JSON.stringify({username: "admin", password: "admin"})
    });
    let herokuJson = await heroku.json()
    let localJson = await local.json()
    let herokuToken = herokuJson.token;
    let localToken = localJson.token;

    return [herokuToken, localToken];
}

module.exports = POSTLogin;