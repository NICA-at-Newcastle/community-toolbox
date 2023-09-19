const mongoose = require('mongoose')

const sensorSchema = mongoose.Schema({

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

sensorSchema.pre('save', function (next) {
  if (!this.created) this.created = new Date()
  next()
})

sensorSchema.pre('findOne', function (next) {
  this.populate('_user', 'profile')
  next()
})

sensorSchema.pre('find', function (next) {
  this.populate('_user', 'profile')
  next()
})

module.exports = mongoose.model('Sensor', sensorSchema)
