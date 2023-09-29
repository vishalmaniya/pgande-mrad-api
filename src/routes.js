const { stations } = require('./stations')

const routes = [
  {
    method: 'GET',
    path: '/stations',
    handler: stations
  }
]

module.exports = routes
