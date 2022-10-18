async function putProduct(token, ids) {
    const data = {
        "name": "Updated Test Product",
        "price": 200,
        "description": "This is an updated test product",
        "imageUrl": "https://www.notgoogle.com"
    }
    const localUrl = `http://localhost:3000/api/products/`;
    let responseTimes = [];

    // Create 10 products and measure the time it takes to create each one
    for (let id of ids) {
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
        responseTimes.push(end - start);
    }

    // Average results
    let localTotal = 0;
    for (let i = 0; i < responseTimes.length; i++) {
        localTotal += responseTimes[i];
    }
    let localAverage = localTotal / responseTimes.length;

    console.log(`Average: ${localAverage}ms`);
}

module.exports = putProduct;