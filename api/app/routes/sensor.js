const async = require('async')

const _get = require('lodash/get')
const _find = require('lodash/find')

const Sensor = require('../../app/models/sensor')
const SensorType = require('../../app/models/sensor-type')

const utilities = require('../../app/utilities')

module.exports = function (app, passport) {
  // Get sensors
  app.get('/sensors/:typeId?',
    (req, res) => {
      const query = (req.params.typeId === 'undefined' || typeof req.params.typeId === 'undefined') ? { instance: req.instance } : { instance: req.instance, _type: req.params.typeId }
      Sensor.find(query).exec((err, sensors) => {
        if (err) { return console.error(err) }
        console.log(sensors)
        res.json(sensors)
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
        if (data.sensor.image && data.sensor.image.location) {
          data.sensor.image = data.sensor.image.location
        }
        // add sensor type
        if (typeof data.sensor._type !== 'object') {
          const sensorType = new SensorType({ instance: req.instance, _user: req.user._id, name: data.sensor._type, tag: data.sensor.typeTag })
          sensorType.save((err) => {
            if (err) console.error(err)
            data.sensor._type = sensorType
            console.log(sensorType)
            const sensor = new Sensor(data.sensor)

            sensor.save((err) => {
              if (err) console.error(err)
              // mail.sendMail(req.user.local.email, 'Sensor Created', 'sensor-created', { user: req.user, sensor: sensor, url: utilities.redirectUri(utilities.redirectUri) })
              res.json({ sensor })
            })
          })
        } else {
          const sensor = new Sensor(data.sensor)
          sensor.save((err) => {
            if (err) console.error(err)
            // mail.sendMail(req.user.local.email, 'Sensor Created', 'sensor-created', { user: req.user, sensor: sensor, url: utilities.redirectUri(utilities.redirectUri) })
            res.json({ sensor })
          })
        }

      } else {
        res.status(401)
      }
    })
  // Update sensor
  app.put('/sensor',
    async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401)

      const isAdmin = _find(_get(req.user, '_permissions'), { type: 'admin', instance: req.instance })

      if (!isAdmin) return res.status(401)

      let sensor = await Sensor.findOneAndUpdate({ _id: req.body._id, instance: req.instance }, req.body)
      console.log(Sensor)
      sensor = await Sensor.findOne({ _id: req.body._id })
      res.json({ sensor })
    })
  // destory sensor
  app.post('/sensor/destroy',
    async (req, res) => {

      if (!req.isAuthenticated()) return res.status(401)

      const isAdmin = _find(_get(req.user, '_permissions'), { type: 'admin', instance: req.instance })

      if (!isAdmin) return res.status(401)

      Sensor.findOneAndUpdate(
        { _id: req.body.id },
        { destroyed: new Date() },
        { upsert: true },
        (err, sensor) => {
          if (err) console.error(err)
          res.json({ sensor: sensor })
        })
    })
}
