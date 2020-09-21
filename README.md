# Share Housework AWS Serverless Backend

## 1. AWS Resources Used

- API Gateway
  - HTTP API
- CloudFormation
- Cognito
  - User Pool
- DynamoDB
- IAM
- Lambda
- S3 (implicit use by SAM)

## 2. Configure Before Deploying to AWS

### 2.1. Edit `template.yaml`

Remove either the postfixes `.dev` or `.prod` for different environment.

Create an IAM Role for Lambda functions, attaching the _AmazonDynamoDBFullAccess_ and _AWSLambdaBasicExecutionRole_ AWS managed policies to the role, and put the role's ARN in this file as a YAML anchor.

Create a Cognito User Pool and its app client, remember to **not** generate an app client secret, then follow the comments in `template.yaml`.

### 2.2. Edit `samconfig.toml`

Remove either the postfixes `.dev` or `.prod` for different environment.

Edit `stack_name`, or change it in the later steps when deploying using the SAM CLI `--guided` option.

## 3. Deploy with AWS SAM

```shell
sam build
sam deploy --guided
```

### 3.1. Update CORS for HTTP API

In the AWS API Gateway console, update the CORS for the API with the following:

- Access-Control-Allow-Origin: \*
- Access-Control-Allow-Headers: authorization, content-type
- Access-Control-Allow-Methods: \*
