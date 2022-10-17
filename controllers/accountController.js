/**
 * The purchases page for a given user
 * @param req - The request object
 * @param res - The response object
 */
const purchases = (req, res) => {
    const user = req.user;
    res.render("account/purchases", {purchases: user.purchases});
}

module.exports = {
    purchases
}