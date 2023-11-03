const mongoose = require('mongoose')

const sensorSchema = mongoose.Schema({

  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  _ideas: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
  _type: { type: mongoose.Schema.Types.ObjectId, ref: 'SensorType' },
  instance: String,
  name: String,
  tag: String,
  description: String,
  image: String,
  passcode: String,
  destroyed: Date,
  archived: Boolean,
  enabled: Boolean,
  created: Date

})

sensorSchema.pre('save', function (next) {
  if (!this.created) this.created = new Date()
  next()
})

sensorSchema.pre('findOne', function (next) {
  this.where({ destroyed: null })
  this.populate('_type')
  next()
})

sensorSchema.pre('find', function (next) {
  this.where({ destroyed: null })
  this.populate('_type')
  next()
})

module.exports = mongoose.model('Sensor', sensorSchema)
