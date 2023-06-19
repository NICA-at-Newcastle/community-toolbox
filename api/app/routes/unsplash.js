var clientId = process.env.UNSPLASH_CLIENT_ID

var unsplash = require('unsplash-js');
var nodeFetch =  require('node-fetch');

const unsplasInstance = unsplash.createApi({
  accessKey: clientId,
  fetch: nodeFetch,
});

// unsplash.init(clientId)

module.exports = function (app, passport) {
  // Search unsplash
  app.get('/unsplash/search/:query',
    (req, res) => {
      // query, page, perPage, color, orientation, callback      
      unsplasInstance.search.getPhotos({query: req.params.query}).then(result => {
        if (result.errors) {
          // handle error here
          console.log('error occurred: ', result.errors[0]);
        } else {
          const feed = result.response;
      
          // extract total and results array from response
          const { total, results } = feed;
      
          // handle success here        
          res.json(results)
        }
      });
    })
}
