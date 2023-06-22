const DEV_URL = 'http://localhost:8888'
// TODO: test this
const PROD_URL = `https://*.${process.env.DEPLOYMENT}`

module.exports = {
  redirectUri: function (instance) {    
    switch (instance) {
      case 'default':
        return DEV_URL
      case 'master':
        return PROD_URL.replace('*.', '')
      case 'ideaboard':
        return PROD_URL.replace('*.', '')
      default:
        return PROD_URL.replace('*', instance)
    }
  }
}