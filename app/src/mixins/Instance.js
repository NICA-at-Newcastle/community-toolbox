import config from '@/config'

// TODO: using different subdomain name from instance name
const getInstance = (subdomain) => { return Object.values(config.instances).reduce((a, i) => (i.subdomain === subdomain) ? i : a, {}) }

export const instance = () => {
  const url = window.location.origin
  const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i)
  const domain = matches[1]
  const subdomain = domain.split('.')[0]
  let instance = (subdomain.includes('localhost')) ? 'localhost' : getInstance(subdomain)

  if (typeof instance === 'undefined') {
    instance = 'localhost'
  }
  return instance
}
