const axios = require('axios')
const { S3 } = require('aws-sdk')
const fs = require('fs/promises')
const {
  fetchStations,
  processStationData,
  convertToCSV,
  writeToFS,
  uploadToS3,
  generatePresignedUrl
} = require('../index')

jest.mock('axios')

jest.mock('aws-sdk', () => {
  const S3 = jest.fn(() => ({
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    }),
    getSignedUrlPromise: jest.fn().mockResolvedValue('mocked-url')
  }))

  return { S3 }
})

jest.mock('fs/promises', () => ({
  writeFile: jest.fn()
}))

const mockResponseData = {
  data: {
    data: {
      stations: [
        {
          external_id: '1',
          station_id: '101',
          capacity: 10
        },
        {
          external_id: '2',
          station_id: '102',
          capacity: 15
        }
      ]
    }
  }
}

beforeAll(() => {
  axios.get.mockResolvedValue(mockResponseData)
})

describe('Aws Lambda stations', () => {
  describe('fetchStations', () => {
    it('should fetch data, modify it, write to FS, upload to S3, and generate a pre-signed URL', async () => {
      const result = await fetchStations()

      expect(result).toBeDefined()
      expect(result.message).toBe('Data fetched, modified, and uploaded to S3.')
      expect(result.s3ObjectUrl).toBeDefined()
    })
  })

  describe('processStationData', () => {
    it('processes station data correctly', () => {
      const stationData = {
        stations: [
          {
            external_id: 'ext1',
            station_id: 'station1',
            legacy_id: 'legacy1',
            capacity: 10,
            rental_methods: 'methods1',
            rental_uris: 'uris1'
          }
        ]
      }

      const result = processStationData(stationData)

      expect(result).toEqual([
        {
          externalId: 'ext1',
          stationId: 'station1',
          legacyId: 'legacy1',
          capacity: 10
        }
      ])
    })
  })

  describe('convertToCSV', () => {
    it('converts data to CSV format', () => {
      const data = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 }
      ]

      const result = convertToCSV(data)

      expect(result).toBe('"name","age"\n"Alice",30\n"Bob",25')
    })
  })

  describe('writeToFS', () => {
    it('writes data to the filesystem', async () => {
      const csvData = 'name,age\nAlice,30\nBob,25\n'

      await writeToFS(csvData)

      expect(fs.writeFile).toHaveBeenCalledWith('/tmp/output.csv', csvData)
    })
  })

  describe('uploadToS3', () => {
    it('uploads data to S3', async () => {
      const csvData = 'name,age\nAlice,30\nBob,25\n'
      await uploadToS3(csvData)

      expect(S3).toHaveBeenCalled()
    })
  })

  describe('generatePresignedUrl', () => {
    it('generates a pre-signed S3 URL', async () => {
      const result = await generatePresignedUrl('my-bucket', 'my-object')

      expect(result).toBe('mocked-url')
    })
  })
})
