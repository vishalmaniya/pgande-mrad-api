# PG&E - MRAD Node.js AWS Lambda Function

This AWS Lambda function retrieve station information, processes the data, and stores it in an S3 bucket in CSV format. It fulfills the specified requirements using the Hapi framework nodejs app.

## Prerequisites

Before setting up and deploying the Lambda function, make sure you have the following:

- Docker installed on your local machine.
- An AWS account with permissions to create Lambda functions, S3 buckets, and IAM roles.
- AWS CLI configured with your AWS credentials.

## Copy .env.sample to .env (if .env doesn't already exist)

```
cp -n .env.sample .env
```

## Docker Setup

1. Clone this repo to your local machine:

   ```bash
   git clone https://github.com/vishalmaniya/pgande-mrad-api.git
   cd gande-mrad-api
   ```

2. Build and start the Docker Compose services:

   ```bash
   docker-compose up -d
   ```

3. Create a `.env` file in the root directory of the project with the following environment variables:

   ```
   AWS_GATEWAY_URL=<Your_AWS_gateway_url>
   AWS_GATEWAY_KEY=<Your_AWS_gateway_Key>
   API_TOKEN=<Your_API_token>
   ```

## Usage

### Local Development with Docker

To run the Lambda function locally in a Docker container, follow these steps:

1. Docker Compose will start the services defined in docker-compose.yml

   ```bash
   docker-compose up -d
   ```

2. Open a web browser or use a tool like Postman to make a GET request to:

   ```
   curl --location 'localhost:3000/stations' \
   --header 'Authorization: Bearer <token>'
   ```

### AWS Deployment

Assuming you have created `stations` lambda function by adding required permission

To deploy your AWS Lambda function using the provided command,

1. Deploy the Lambda function to AWS by running the following command:
   Navigate to the /src/lambda/stations directory

2. make sure you have installed node_module by running

```bash
   npm install
```

3. Create a zip file containing the Lambda function code and any dependencies:
   zip -r deployment-package.zip .

```bash
  zip -r deployment-package.zip . -x "__tests__/*"
```

4. Update the Lambda function code using the AWS CLI:

```bash
  aws lambda update-function-code \
  --function-name stations \
  --zip-file fileb://deployment-package.zip
```

## Unit Test

To run unit tests for the API call, execute the following command:

```bash
npm run unit
```

## Folder Structure

- `src`: Contains the node js app code
- `src/lambda`: Contains the Lambda function code.
- `__test__`: Contains unit tests.

## Demo API gateway url

To trigger `stations` lambda function, use below sample url:

```
https://pjrmvjpoui.execute-api.us-east-1.amazonaws.com/default/stations
```
