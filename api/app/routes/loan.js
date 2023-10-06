const async = require('async')

const _get = require('lodash/get')
const _find = require('lodash/find')

const mail = require('../../app/services/mail')
const utilities = require('../../app/utilities')
const config = require('../../config.js')

const Loan = require('../../app/models/loan')
const Sensor = require('../../app/models/sensor')
const User = require('../../app/models/user')

module.exports = function (app, passport) {
  app.get('/loans',
    (req, res) => {
      console.log(`Getting loans for - ${req.instance}`)
      Loan.find({ instance: req.instance }).exec((err, loans) => {
        if (err) { return console.error(err) }
        res.json({ loans })
      })
    })
  app.get('/manage/loans',
    (req, res) => {
      if (!req.isAuthenticated()) return res.status(401)
      const instance = (req.instance.indexOf('localhost') !== -1) ? 'default' : req.instance

      const isAdmin = _find(_get(req.user, '_permissions'), { type: 'admin', instance })

      if (!isAdmin) return res.status(401)


      async.series({
        loans: function (callback) {
          Loan.find({ instance: instance }).exec(callback)
        },
        sensors: function (callback) {
          Sensor.find({ instance: instance }).exec(callback)
        }
      }, function (err, results) {
        if (err) console.error(err)
        res.json({ sensors: results.sensors, loans: results.loans })
      })
    })
  // Get loans
  app.get('/loans/:target',
    (req, res) => {
      Loan.find({ _target: req.params.target }).exec((err, loans) => {
        if (err) { return console.error(err) }
        res.json(loans)
      })
    })
  // Get loan
  app.get('/loan/:id',
    (req, res) => {
      async.series({
        loan: function (callback) {
          Loan.findOne({ _id: req.params.id }).exec(callback)
        }
      }, function (err, results) {
        if (err) console.error(err)
        res.json({ loan: results.loan })
      })
    })
  // contact 
  app.get('/loan/contact/:id',
    (req, res) => {
      if (!req.isAuthenticated()) return res.status(401)
      const instance = (req.instance.indexOf('localhost') !== -1) ? 'default' : req.instance

      const isAdmin = _find(_get(req.user, '_permissions'), { type: 'admin', instance })

      if (!isAdmin) return res.status(401)

      async.series({
        user: function (callback) {
          User.findOne({ _id: req.params.id }).exec(callback)
        }
      }, function (err, results) {
        if (err) console.error(err)
        res.json({ name: results.user.profile.name, email: results.user.local.email })
      })
    })
  // Post loan
  app.post('/loan',
    (req, res) => {
      if (req.isAuthenticated()) {
        var data = req.body
        data._user = req.user._id

        // Set instance
        data.instance = req.instance

        const loan = new Loan(data)

        loan.save((err) => {
          if (err) console.error(err)
          const instance = config.instances[loan.instance]
          const adminEmail = _get(instance, 'admin.email', process.env.ADMIN_EMAIL)
          mail.sendMail(adminEmail, 'Sensor Loan Booked', 'sensor-booked', { user: req.user, loan: loan, url: utilities.redirectUri(utilities.redirectUri), instance: req.instance })
          res.json({ loan })
        })
      } else {
        res.status(401)
      }
    })
  // Destroy loan
  app.post('/loan/destroy',
    async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401)
      const isAdmin = _find(_get(req.user, '_permissions'), { type: 'admin', instance: req.instance })

      if (!isAdmin) return res.status(401)

      Loan.findOneAndUpdate(
        { _id: req.body.id },
        { destroyed: new Date() },
        { upsert: true },
        (err, loan) => {
          if (err) console.error(err)

          res.json({ loan: loan })
        })
    })
  // update loan
  app.put('/loan',
    async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401)

      const isAdmin = _find(_get(req.user, '_permissions'), { type: 'admin', instance: req.instance })

      if (!isAdmin) return res.status(401)

      let loan = await Loan.findOne({ _id: req.body.id })

      loan.start = req.body.start
      loan.end = req.body.end

      loan = await loan.save()

      // TODO - send email to loan initiator
      // Create notification
      // const notificationObj = new Notification({
      //   _user: req.body.userId,
      //   type: 'permissions',
      //   text: 'Your permissions have been updated by ' + req.user.profile.name,
      //   instance: req.instance
      // })

      // const notification = await notificationObj.save()

      // mail.sendMail(user.local.email, 'Permissions Updated', 'permissions', { user: req.user, recipient: user, url: utilities.redirectUri(utilities.redirectUri), instance: req.instance })
      res.json({ msg: 'done' })
    })

}
