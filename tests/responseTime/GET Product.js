async function getProducts() {
    const id = "632ee522f3b50dc8f864c657"; // TODO CHANGE THIS LATER
    const herokuUrl = `http://nwen304theconnoisseurs.herokuapp.com/api/products/${id}`;
    const localUrl = `http://localhost:3000/api/products/${id}`;

    let responseTimesHeroku = [];
    let responseTimesLocal = [];
    for (let i = 0; i < 10; i++) {
        let start = new Date().getTime();
        await fetch(herokuUrl);
        let end = new Date().getTime();
        responseTimesHeroku.push(end - start);
    }

    for (let i = 0; i < 10; i++) {
        let start = new Date().getTime();
        await fetch(localUrl);
        let end = new Date().getTime();
        responseTimesLocal.push(end - start);
    }

// Average results
    let herokuTotal = 0;
    let localTotal = 0;
    for (let i = 0; i < responseTimesHeroku.length; i++) {
        herokuTotal += responseTimesHeroku[i];
        localTotal += responseTimesLocal[i];
    }
    let herokuAverage = herokuTotal / responseTimesHeroku.length;
    let localAverage = localTotal / responseTimesLocal.length;

    console.log(`Heroku average: ${herokuAverage}ms`);
    console.log(`Local average: ${localAverage}ms`);
}

module.exports = getProducts;