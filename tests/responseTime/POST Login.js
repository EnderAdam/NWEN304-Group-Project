async function POSTLogin() {
    const localUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/login`;

    let local = await fetch(localUrl, {
        method: 'POST', headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        }, body: JSON.stringify({username: "admin", password: "admin"})
    });
    let localJson = await local.json()
    return localJson.token;
}

module.exports = POSTLogin;