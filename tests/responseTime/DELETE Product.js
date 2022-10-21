async function deleteProduct(token, idsLocal, idsRemote) {
    const remoteUrl = `https://nwen304theconnoisseurs.herokuapp.com/api/products/`;
    const localUrl = `http://localhost:3000/api/products/`;
    let responseTimesRemote = [];
    let responseTimesLocal = [];

    // Delete 10 products and measure the time it takes to delete each one
    for (let id of idsRemote) {
        let start = new Date().getTime();
        await fetch(remoteUrl + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let end = new Date().getTime();
        responseTimesRemote.push(end - start);
    }

    for (let id of idsLocal) {
        let start = new Date().getTime();
        await fetch(localUrl + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let end = new Date().getTime();
        responseTimesLocal.push(end - start);
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

module.exports = deleteProduct;