const async = require('async')

const Sensor = require('../../app/models/sensor')

const utilities = require('../../app/utilities')

module.exports = function (app, passport) {
  // Get categories
  app.get('/sensors',
    (req, res) => {
      console.log(`Getting categories for - ${req.instance}`)
      Sensor.find({ instance: req.instance }).exec((err, categories) => {
        if (err) { return console.error(err) }
        res.json(categories)
      })
    })
  // Get sensor
  app.get('/sensor/:id',
    (req, res) => {
      async.series({
        sensor: function (callback) {
          Sensor.findOne({ _id: req.params.id }).exec(callback)
        }
      }, function (err, results) {
        if (err) console.error(err)
        res.json({ sensor: results.sensor })
      })
    })
  // Create sensor
  app.post('/sensor',
    (req, res) => {
      if (req.isAuthenticated()) {

        let data = req.body

        // Set instance
        data.sensor.instance = req.instance

        data.sensor._user = req.user._id
        const sensor = new Sensor(data.sensor)

        sensor.save((err) => {
          if (err) console.error(err)
          // mail.sendMail(req.user.local.email, 'Sensor Created', 'sensor-created', { user: req.user, sensor: sensor, url: utilities.redirectUri(utilities.redirectUri) })
          res.json({ sensor })
        })
      } else {
        res.status(401)
      }
    })
  // Update sensor
  app.put('/sensor',
    (req, res) => {
      if (req.isAuthenticated()) {
        Sensor.findOneAndUpdate(
          { _id: req.body._id },
          req.body, (err, sensor) => {
            if (err) console.error(err)
            res.json({ sensor })
          })
      } else {
        res.status(401)
      }
    })
}
