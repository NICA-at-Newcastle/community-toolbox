const mongoose = require('mongoose')

const sensorTypeSchema = mongoose.Schema({

  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  _ideas: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
  instance: String,
  name: String,
  tag: String,
  description: String,
  passcode: String,
  archived: Boolean,
  created: Date

})

sensorTypeSchema.pre('save', function (next) {
  if (!this.created) this.created = new Date()
  next()
})

sensorTypeSchema.pre('findOne', function (next) {
  next()
})

sensorTypeSchema.pre('find', function (next) {
  next()
})

module.exports = mongoose.model('SensorType', sensorTypeSchema)
