async function getAllProducts() {
    const localUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/`;

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

module.exports = getAllProducts;