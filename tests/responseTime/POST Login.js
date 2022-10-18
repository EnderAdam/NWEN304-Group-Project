async function POSTLogin() {
    const localUrl = `http://localhost:3000/api/login`;

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