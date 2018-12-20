
exports = module.exports = function (req, res) {
  res.status(302).redirect('/' + req.languages[0] + req.url)
}