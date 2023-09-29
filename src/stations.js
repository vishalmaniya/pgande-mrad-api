const axios = require('axios')

const stations = async (request, h) => {
  try {
    const gatewayUrl = process.env.AWS_GATEWAY_URL
    const gatewayApiKey = process.env.AWS_GATEWAY_KEY
    const headers = {
      'x-api-key': gatewayApiKey
    }

    const response = await axios.get(gatewayUrl, { headers })

    return h.response(response.data)
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error // Rethrow the error to handle it in the route handler
  }
}

module.exports = { stations }
