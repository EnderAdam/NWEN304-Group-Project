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

module.exports = postProduct;