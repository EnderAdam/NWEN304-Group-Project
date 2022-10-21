async function getProducts() {
    const id = "632e9adc45ac4aaec91deb8e";
    const remoteUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/${id}`;
    const localUrl = `http://localhost:3000/api/products/${id}`;

    let responseTimesLocal = [];
    let responseTimesRemote = [];

    for (let i = 0; i < 10; i++) {
        let start = new Date().getTime();
        await fetch(localUrl);
        let end = new Date().getTime();
        responseTimesLocal.push(end - start);
    }

    for (let i = 0; i < 10; i++) {
        let start = new Date().getTime();
        await fetch(remoteUrl);
        let end = new Date().getTime();
        responseTimesRemote.push(end - start);
    }

    // Average results
    let localTotal = 0;
    let remoteTotal = 0;
    for (let i = 0; i < responseTimesLocal.length; i++) {
        localTotal += responseTimesLocal[i];
        remoteTotal += responseTimesRemote[i];
    }
    let localAverage = localTotal / responseTimesLocal.length;
    let remoteAverage = remoteTotal / responseTimesRemote.length;

    console.log(`Local Average: ${localAverage}ms`);
    console.log(`Remote Average: ${remoteAverage}ms`);
}

/**
 * Load test the GET Products endpoint with 500 and 1000 concurrent requests
 */
async function getProductsLoad() {
    const id = "632e9adc45ac4aaec91deb8e";
    const remoteUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/${id}`;

    let responseTimes500 = [];
    let responseTimes1000 = [];
    let promises = [];


    // 500 concurrent requests
    for (let i = 0; i < 500; i++) {
        let start = new Date().getTime();
        promises.push(fetch(remoteUrl).then(() => {
            let end = new Date().getTime();
            responseTimes500.push(end - start);
        }));
    }
    await Promise.all(promises);
    promises = [];

    // 1000 concurrent requests
    for (let i = 0; i < 1000; i++) {
        let start = new Date().getTime();
        promises.push(fetch(remoteUrl).then(() => {
            let end = new Date().getTime();
            responseTimes1000.push(end - start);
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
}

module.exports = [getProducts, getProductsLoad];