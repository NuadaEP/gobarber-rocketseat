module.exports = (req, res, next) => {
  if (req.session.user.provider) {
    return res.redirect('/app/dashboard')
  }

  return next()
}
