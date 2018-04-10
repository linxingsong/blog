const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    url:  'mongodb://eric:Joe273745421@ds131329.mlab.com:31329/blog',
    secret: crypto
  } 
