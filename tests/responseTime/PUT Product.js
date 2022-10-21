async function putProduct(token, idsLocal, idsRemote) {
    const data = {
        "name": "Updated Test Product",
        "price": 200,
        "description": "This is an updated test product",
        "imageUrl": "https://www.notgoogle.com"
    }
    const remoteUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/`;
    const localUrl = `http://localhost:3000/api/products/`;
    let responseTimesLocal = [];
    let responseTimesRemote = [];

    // Update 10 products and measure the time it takes to Update each one
    for (let id of idsLocal) {
        let start = new Date().getTime();
        await fetch(localUrl + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        let end = new Date().getTime();
        responseTimesLocal.push(end - start);
    }

    for (let id of idsRemote) {
        let start = new Date().getTime();
        await fetch(remoteUrl + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        let end = new Date().getTime();
        responseTimesRemote.push(end - start);
    }

    // Average results
    let localTotal = 0;
    let remoteTotal = 0;
    for (let i = 0; i < responseTimesRemote.length; i++) {
        localTotal += responseTimesLocal[i];
        remoteTotal += responseTimesRemote[i];
    }
    let localAverage = localTotal / responseTimesLocal.length;
    let remoteAverage = remoteTotal / responseTimesRemote.length;

    console.log(`Local Average: ${localAverage}ms`);
    console.log(`Remote Average: ${remoteAverage}ms`);
}

module.exports = putProduct;