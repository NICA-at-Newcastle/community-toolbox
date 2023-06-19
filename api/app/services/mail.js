'use strict'
const configMail = require('../../config/mail.js')

const _map = require('lodash/map')
const _forEach = require('lodash/forEach')

const nodemailer = require('nodemailer')
const nodemailerSendgrid = require('nodemailer-sendgrid');
const path = require('path')
var EmailTemplate = require('email-templates')
var templatesDir = path.resolve(__dirname, '../../templates')

const SENDGRID_API_KEY = configMail.sendgridAPIKey
const MAIL_FROM_NAME = configMail.fromName
const MAIL_FROM_ADDRESS = configMail.fromAddress

const User = require('../models/user')

const utilities = require('../../app/utilities')

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(nodemailerSendgrid({
  apiKey: SENDGRID_API_KEY
}))

module.exports = {
  sendMail: function (to, subject, template, data, from) {
    console.log('Sending mail...')

    var templatePath = path.join(templatesDir, template)
    
    if (!from)
      from = `"${MAIL_FROM_NAME}" <${MAIL_FROM_ADDRESS}>`;

    var emailTemplate = new EmailTemplate();
    

    emailTemplate.renderAll(templatePath, data).then(results => {
         let mailOptions = {
            from: from, // sender address
            to: to, // list of receivers CSV
            subject: subject,
            html: results.html,
            text: results.text
          }
      transporter.sendMail(mailOptions).then(([res]) => {
        console.log('Message delivered with code %s %s', res.statusCode, res.statusMessage);
    })
    .catch(err => {
        console.log('Errors occurred, failed to deliver message');
        if (err.response && err.response.body && err.response.body.errors) {
            err.response.body.errors.forEach(error => console.log('%s: %s', error.field, error.message));
        } else {
            console.log(err);
        }
    });
    }).catch(console.error);
  },
  sendUpdate: function (idea, update) {
    console.log('Sending updates...')
    const subscriberIds = _map(idea._subscribers, (subscriber) => {
      return subscriber._user
    })
    console.log('subscriberIds')
    console.log(subscriberIds)
    User.find({
      '_id': { $in: subscriberIds }
    }, (err, users) => {
      if (err) console.error(err)
      console.log('users')
      console.log(users)
      _forEach(users, (user) => {
        this.sendMail(user.local.email, 'Update Received', 'update-received', { user: user, idea: idea, update: update, url: utilities.redirectUri(idea.instance) })
      })
    })
  }
}
