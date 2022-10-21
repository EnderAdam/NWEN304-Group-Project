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

/**
 * Load test the PUT Products endpoint with 500 and 1000 concurrent requests
 */
async function putProductLoad(token, productIds500, productIds1000) {
    const data = {
        "name": "Updated Test Product",
        "price": 200,
        "description": "This is an updated test product",
        "imageUrl": "https://www.notgoogle.com"
    }
    const remoteUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/`;


    let responseTimes500 = [];
    let responseTimes1000 = [];
    let promises = [];


    // 500 concurrent requests
    for (let id of productIds500) {
        let start = new Date().getTime();
        promises.push(fetch(remoteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(async () => {
            let end = new Date().getTime();
            responseTimes500.push(end - start);
        }));
    }
    await Promise.all(promises);
    promises = [];

    // 1000 concurrent requests
    for (let id of productIds1000) {
        let start = new Date().getTime();
        promises.push(fetch(remoteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(async () => {
            let end = new Date().getTime();
            responseTimes1000.push(end - start);
        }));
    }
    await Promise.all(promises);


    // Average results
    let total500 = responseTimes500.reduce((a, b) => a + b, 0);
    let total1000 = responseTimes1000.reduce((a, b) => a + b, 0);

    let average500 = total500 / responseTimes500.length;
    let average1000 = total1000 / responseTimes1000.length;

    console.log(`500 Concurrent Requests Average: ${average500}ms`);
    console.log(`1000 Concurrent Requests Average: ${average1000}ms`);
    return [productIds500, productIds1000];
}

module.exports = [putProduct, putProductLoad];