const axios = require('axios')
const { stations } = require('../stations')

jest.mock('axios')

describe('stations', () => {
  it('should return station data on successful HTTP request', async () => {
    axios.get.mockResolvedValue({
      data: {
        message: 'ata fetched, modified, and uploaded to S3.',
        s3ObjectUrl: 'someurl'
      }
    })

    // Mock request and response objects
    const request = {}
    const h = {
      response: jest.fn()
    }

    process.env.AWS_GATEWAY_URL = 'mock-gateway-url'
    process.env.AWS_GATEWAY_KEY = 'mock-api-key'

    await stations(request, h)

    expect(axios.get).toHaveBeenCalledWith('mock-gateway-url', {
      headers: { 'x-api-key': 'mock-api-key' }
    })

    expect(h.response).toHaveBeenCalledWith({
      message: 'ata fetched, modified, and uploaded to S3.',
      s3ObjectUrl: 'someurl'
    })

    delete process.env.AWS_GATEWAY_URL
    delete process.env.AWS_GATEWAY_KEY
  })
})
