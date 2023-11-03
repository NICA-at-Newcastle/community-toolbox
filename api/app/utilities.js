const DEV_URL = 'http://localhost:8888'
// TODO: test this
const PROD_URL = `https://*.${process.env.DEPLOYMENT}`

module.exports = {
  redirectUri: function (subdomain) {
    switch (subdomain) {
      case 'default':
        return DEV_URL
      case 'sensemystreet':
        return PROD_URL.replace('*.', '')
      case 'main':
        return PROD_URL.replace('*.', '')
      case 'ideaboard':
        return PROD_URL.replace('*.', '')
      default:
        return PROD_URL.replace('*', instance)
    }
  }
}