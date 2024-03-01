function getDefault(req, res, next) {
    res.send('Response from default controller');
}

module.exports = {
    getDefault,
};
