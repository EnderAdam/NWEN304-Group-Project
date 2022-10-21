async function postProduct(token) {
    const data = {
        "name": "Test Product",
        "price": 100,
        "description": "This is a test product",
        "imageUrl": "https://www.google.com"
    }
    const remoteUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/create`;
    const localUrl = `http://localhost:3000/api/products/create`;
    let productIdsRemote = [];
    let productIdsLocal = [];

    let responseTimesRemote = [];
    let responseTimesLocal = [];


    // Create 10 products and measure the time it takes to create each one
    for (let i = 0; i < 10; i++) {
        let start = new Date().getTime();
        let response = await fetch(remoteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        let end = new Date().getTime();
        responseTimesRemote.push(end - start);
        // Get the ID of the product we just created
        let json = await response.json();
        productIdsRemote.push(json.product._id);
    }

    for (let i = 0; i < 10; i++) {
        let start = new Date().getTime();
        let response = await fetch(localUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        let end = new Date().getTime();
        responseTimesLocal.push(end - start);
        // Get the ID of the product we just created
        let json = await response.json();
        productIdsLocal.push(json.product._id);
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

    return [productIdsLocal, productIdsRemote];
}

/**
 * Load test the POST Products endpoint with 500 and 1000 concurrent requests
 */
async function postProductLoad(token) {
    const data = {
        "name": "Test Product",
        "price": 100,
        "description": "This is a test product",
        "imageUrl": "https://www.google.com"
    }
    const remoteUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/create`;

    let productIds500 = [];
    let productIds1000 = [];

    let responseTimes500 = [];
    let responseTimes1000 = [];
    let promises = [];


    // 500 concurrent requests
    for (let i = 0; i < 500; i++) {
        let start = new Date().getTime();
        promises.push(fetch(remoteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(async response => {
            let end = new Date().getTime();
            responseTimes500.push(end - start);
            let json = await response.json();
            productIds500.push(json.product._id);
        }));
    }
    await Promise.all(promises);
    promises = [];

    // 500 concurrent requests
    for (let i = 0; i < 1000; i++) {
        let start = new Date().getTime();
        promises.push(fetch(remoteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(async response => {
            let end = new Date().getTime();
            responseTimes1000.push(end - start);
            let json = await response.json();
            productIds1000.push(json.product._id);
        }));
    }
    await Promise.all(promises);


    // Average results
    let total500;
    let total1000;

    total500 = responseTimes500.reduce((a, b) => a + b, 0);
    total1000 = responseTimes1000.reduce((a, b) => a + b, 0);

    let average500 = total500 / responseTimes500.length;
    let average1000 = total1000 / responseTimes1000.length;

    console.log(`500 Concurrent Requests Average: ${average500}ms`);
    console.log(`1000 Concurrent Requests Average: ${average1000}ms`);
    return [productIds500, productIds1000];
}

module.exports = [postProduct, postProductLoad];