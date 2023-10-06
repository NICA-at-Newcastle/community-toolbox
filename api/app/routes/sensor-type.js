const async = require('async')

const SensorType = require('../../app/models/sensor-type')

const utilities = require('../../app/utilities')

module.exports = function (app, passport) {
  // Get sensor types
  app.get('/sensortypes',
    (req, res) => {
      console.log(`Getting types for - ${req.instance}`)
      SensorType.find({ instance: req.instance }).exec((err, types) => {
        if (err) { return console.error(err) }
        res.json(types)
      })
    })
  // Get type
  app.get('/sensortype/:id',
    (req, res) => {
      async.series({
        type: function (callback) {
          SensorType.findOne({ _id: req.params.id }).exec(callback)
        }
      }, function (err, results) {
        if (err) console.error(err)
        res.json({ type: results.type })
      })
    })
  // Create type
  app.post('/sensortype',
    (req, res) => {
      if (req.isAuthenticated()) {

        let data = req.body

        // Set instance
        data.type.instance = req.instance

        data.type._user = req.user._id
        const sensorType = new SensorType(data.type)

        sensorType.save((err) => {
          if (err) console.error(err)
          // mail.sendMail(req.user.local.email, 'SensorType Created', 'category-created', { user: req.user, category: category, url: utilities.redirectUri(utilities.redirectUri) })
          res.json({ sensorType })
        })
      } else {
        res.status(401)
      }
    })
  // Update category
  app.put('/sensor/type',
    (req, res) => {
      if (req.isAuthenticated()) {
        SensorType.findOneAndUpdate(
          { _id: req.body._id },
          req.body, (err, sensorType) => {
            if (err) console.error(err)
            res.json({ sensorType })
          })
      } else {
        res.status(401)
      }
    })
}
