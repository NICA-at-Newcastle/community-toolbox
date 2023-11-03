const DEV_URL = 'http://localhost:8888'
// TODO: test this
const PROD_URL = `https://*.${process.env.DEPLOYMENT}`

module.exports = {
  redirectUri: function (subdomain) {
    console.log("instance: ", subdomain)
    console.log("Redirect URL: ", PROD_URL.replace('*', subdomain))
    switch (subdomain) {
      case 'default':
        return DEV_URL
      case 'ctb':
        return PROD_URL.replace('*.', '')
      case 'main':
        return PROD_URL.replace('*.', '')
      case 'ideaboard':
        return PROD_URL.replace('*.', '')
      default:
        return PROD_URL.replace('*', subdomain)
    }
  }
}