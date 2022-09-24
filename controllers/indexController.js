const index = (req, res) => {
    res.render('index', {title: 'Express'});
}

const gorillaJacob = (req, res) => {
    res.render('login', {user: req.user});
}

module.exports = {
    index, gorillaJacob
}