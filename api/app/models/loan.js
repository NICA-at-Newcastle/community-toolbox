const mongoose = require('mongoose')

const loanSchema = mongoose.Schema({

  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  _target: mongoose.Schema.Types.ObjectId,
  instance: String,
  motivation: String,
  start: Date,
  end: Date,
  created: Date,
  destroyed: Date
})

loanSchema.pre('save', function (next) {
  if (!this.created) this.created = new Date()
  next()
})

loanSchema.pre('findOne', function (next) {
  this.where({ destroyed: null })
  this.populate('_user', '_id')
  next()
})

loanSchema.pre('find', function (next) {
  this.where({ destroyed: null })
  this.populate('_user', '_id')
  next()
})

module.exports = mongoose.model('Loan', loanSchema)
