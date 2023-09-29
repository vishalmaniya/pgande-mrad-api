const axios = require('axios')
const fs = require('fs/promises')
const { parse } = require('json2csv')
const { S3 } = require('aws-sdk')

const s3 = new S3()
const s3BucketName = 'stations-bucket'
const s3ObjectKey = 'output.csv'

const fetchStations = async () => {
  try {
    const response = await axios.get(
      'https://gbfs.divvybikes.com/gbfs/en/station_information.json'
    )
    const data = response.data.data

    const modifiedData = processStationData(data)

    const csv = convertToCSV(modifiedData)

    await writeToFS(csv)
    await uploadToS3(csv)

    const s3ObjectUrl = await generatePresignedUrl(s3BucketName, s3ObjectKey)

    return {
      message: 'Data fetched, modified, and uploaded to S3.',
      s3ObjectUrl
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error // Rethrow the error to handle it in the route handler
  }
}

const processStationData = (data) => {
  const stations = data.stations

  const modifiedData = stations
    .filter((station) => station.capacity < 12)
    .map((station) => {
      const {
        external_id: externalId,
        station_id: stationId,
        legacy_id: legacyId,
        rental_methods, // Remove
        rental_uris, // Remove
        ...restOfStationData
      } = station

      const modifiedStation = {
        externalId,
        stationId,
        legacyId,
        ...restOfStationData
      }

      return modifiedStation
    })

  return modifiedData.filter((station) => station.capacity < 12)
}

const convertToCSV = (data) => {
  return parse(data)
}

const writeToFS = async (csv) => {
  try {
    await fs.writeFile('/tmp/output.csv', csv)
  } catch (error) {
    console.error('Error writing to filesystem:', error)
    throw error
  }
}

const uploadToS3 = async (csv) => {
  const params = {
    Bucket: s3BucketName,
    Key: s3ObjectKey,
    Body: csv
  }

  try {
    await s3.upload(params).promise()
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw error
  }
}

async function generatePresignedUrl(bucketName, objectKey) {
  try {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Expires: 3600 // expire in 1 hour
    }

    // Generate the pre-signed URL
    const url = await s3.getSignedUrlPromise('getObject', params)

    return url
  } catch (error) {
    console.error('Error generating pre-signed URL:', error)
    throw error
  }
}

const handler = async (event, context) => {
  try {
    const result = await fetchStations()

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error: ${error.message}` })
    }
  }
}

exports.handler = handler
exports.fetchStations = fetchStations
exports.processStationData = processStationData
exports.convertToCSV = convertToCSV
exports.writeToFS = writeToFS
exports.uploadToS3 = uploadToS3
exports.generatePresignedUrl = generatePresignedUrl
