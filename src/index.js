const Hapi = require('hapi')
require('dotenv').config()
const BearerToken = require('hapi-auth-bearer-token')
const routes = require('./routes')

async function startServer() {
  // Create a new server
  const server = new Hapi.Server({ port: 3000 })

  await server.register(BearerToken)
  server.auth.strategy('bearer', 'bearer-access-token', {
    validate: async (request, token, h) => {
      const isValid = token === process.env.API_TOKEN
      const credentials = { token }
      const artifacts = {}

      return { isValid, credentials, artifacts }
    }
  })

  // Set the default authentication strategy
  server.auth.default('bearer')

  server.route(routes)

  // Start the server
  await server.start()
  console.log('Server running on', server.info.uri)
}

startServer().catch((err) => {
  console.error(err)
})
