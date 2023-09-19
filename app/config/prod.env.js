module.exports = {
  NODE_ENV: '"production"',
  API_ADDRESS: `'${process.env.API_ADDRESS || "https://api.ideaboard.co.uk"}'`,
  DEPLOYMENT: `'${process.env.DEPLOYMENT || "ideaboard.co.uk"}'`,
  FB_AUTH_ENABLED: `'${process.env.FB_AUTH_ENABLED} || "false"}'`,
  APP_NAME: `'${process.env.APP_NAME || "Ideaboard"}'`,
  INSTITUTION: `'${process.env.INSTITUTION || "Open Lab"}'`,
  LEGAL: `'${process.env.LEGAL || "https://raw.githubusercontent.com/digitalinteraction/legal/master/ideaboard"}'`
}

