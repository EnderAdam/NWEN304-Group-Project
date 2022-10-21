async function postProduct(token) {
    const data = {
        "name": "Test Product",
        "price": 100,
        "description": "This is a test product",
        "imageUrl": "https://www.google.com"
    }
    const localUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/create`;
    let productIds = [];

    let responseTimes = [];

    // Create 10 products and measure the time it takes to create each one
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
        responseTimes.push(end - start);
        // Get the ID of the product we just created
        let json = await response.json();
        productIds.push(json.product._id);
    }

    // Average results
    let localTotal = 0;
    for (let i = 0; i < responseTimes.length; i++) {
        localTotal += responseTimes[i];
    }
    let localAverage = localTotal / responseTimes.length;

    console.log(`Average: ${localAverage}ms`);

    return productIds;
}

module.exports = postProduct;