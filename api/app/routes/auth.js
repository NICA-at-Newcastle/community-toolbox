const configAuth = require('../../config/auth')

const User = require('../../app/models/user')
const mail = require('../services/mail')

const DEV_URL = 'localhost:8080'
const PROD_URL = 'ideaboard.co.uk'
const PROD_API_URL = 'https://api.ideaboard.co.uk'

module.exports = function (app, passport) {

  app.post('/login',
    passport.authenticate('local-login'),
    (req, res) => {
      res.json({
        status: 'authenticated',
        user: {
          _id: req.user._id,
          created: req.user.created,
          profile: req.user.profile
        }
      })
    })

  app.post('/signup', function (req, res, next) {

    // Get form params
    const email = req.body.email

    // Check if user exists..
    let errors = []

    // Check name exists
    if (req.body.name.length < 3) {
      errors.push({
        text: 'Name should be longer than 3 characters',
        type: 'error'
      })
    }

    User.findOne({ 'local.email': email }, (err, user) => {
      if (err) { return done(err) }
      if (user) {
        errors.push({
          text: 'That email has already been taken',
          type: 'error'
        })
      }
      // If there are issues with the signup throw them back
      if (errors.length > 0) {
        return res.json({
          errors: errors
        })
      }
      // Else continue
      else {
        passport.authenticate('local-signup')(req, res, next)
      }
    })
  })

  // app.post('/OLDsignup',
  //   passport.authenticate('local-signup'),
  //   (req, res) => {
  //     mail.sendMail(req.body.email, 'Howdy', 'welcome', { user: req.user })
  //     res.json({
  //       status: 'authenticated',
  //       user: {
  //         _id: req.user._id,
  //         created: req.user.created,
  //         profile: req.user.profile
  //       }
  //     })
  //   },
  //   (req, res) => {
  //     res.json({
  //       status: 'oops'
  //     })
  //   })

  app.get('/logout', (req, res) => {
    req.logout()
    res.json({
      status: 'unauthenticated',
      user: undefined
    })
  })

  app.post('/auth/forgot',
    (req, res) => {
      const resetCode = 'sduhsd'
      let resetLink = (req.params.instance !== 'ideaboard') ? `https://${req.params.instance}.${PROD_URL}/reset/${resetCode}` : `https://${PROD_URL}/reset/${resetCode}`
      resetLink = (req.params.instance && req.params.instance !== 'localhost') ? resetLink : `http://${DEV_URL}/reset/${resetCode}`
      User.findOneAndUpdate({ 'local.email': req.body.email }, { code: resetCode }).exec((err, user) => {
        if (err) console.error(err)
        mail.sendMail(user.local.email, 'Forgotten Password', 'forgot', { user, resetLink })
        res.json({
          status: 'success'
        })
      })
    }
  )

  app.post('/auth/reset',
    (req, res) => {
      User.findOne({ code: req.body.code }).exec((err, user) => {
        if (err) console.error(err)
        user.code = undefined
        user.local.password = user.generateHash(req.body.password)
        user.save((saveErr) => {
          if (saveErr) { throw saveErr }
          res.json({
            status: 'success'
          })
        })
      })
    }
  )

  app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({
        status: 'authenticated',
        user: {
          _id: req.user._id,
          created: req.user.created,
          profile: req.user.profile
        }
      })
    } else {
      res.json({
        status: 'unauthenticated',
        user: undefined
      })
    }
  })

  // FACEBOOK ROUTES

  app.get('/auth/facebook/login/:instance', function (req, res, next) {
    passport.authenticate('facebook', { callbackURL: `${PROD_API_URL}/auth/facebook/callback/${req.params.instance}` })(req, res, next);
  });

  app.get('/auth/facebook/callback/:instance', function (req, res, next) {

    let redirectUri = `http://${DEV_URL}`

    if (req.params.instance === 'ideaboard') {
       redirectUri = `https://${PROD_URL}`
    }
    else if (req.params.instance !== 'localhost') {
      redirectUri = `https://${req.params.instance}.${PROD_URL}`
    }
    passport.authenticate('facebook', {
      callbackURL: `${PROD_API_URL}/auth/facebook/callback/${req.params.instance}`,
      successRedirect: `${redirectUri}/profile`,
      failureRedirect: `${redirectUri}/join`
    })(req, res, next);
  });
}
