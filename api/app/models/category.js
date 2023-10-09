const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({

  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  _ideas: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
  instance: String,
  name: String,
  tag: String,
  description: String,
  passcode: String,
  destroyed: Date,
  archived: Boolean,
  created: Date

})

categorySchema.pre('save', function (next) {
  if (!this.created) this.created = new Date()
  next()
})

categorySchema.pre('findOne', function (next) {
  this.where({ destroyed: null })
  this.populate('_user', 'profile')
  next()
})

categorySchema.pre('find', function (next) {
  this.where({ destroyed: null })
  this.populate('_user', 'profile')
  next()
})

module.exports = mongoose.model('Category', categorySchema)
