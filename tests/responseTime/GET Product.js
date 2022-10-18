async function getProducts() {
    const id = "632e9adc45ac4aaec91deb8e";
    const localUrl = `http://localhost:3000/api/products/${id}`;

    let responseTimesLocal = [];

    for (let i = 0; i < 10; i++) {
        let start = new Date().getTime();
        await fetch(localUrl);
        let end = new Date().getTime();
        responseTimesLocal.push(end - start);
    }

    // Average results
    let localTotal = 0;
    for (let i = 0; i < responseTimesLocal.length; i++) {
        localTotal += responseTimesLocal[i];
    }
    let localAverage = localTotal / responseTimesLocal.length;

    console.log(`Average: ${localAverage}ms`);
}

module.exports = getProducts;