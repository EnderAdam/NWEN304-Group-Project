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

module.exports = getProducts;