const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME_CHORES,
    KeyConditionExpression: "#owner = :owner",
    FilterExpression: "#IsPaid = :false",
    ExpressionAttributeNames: {
      "#owner": "Owner",
      "#IsPaid": "IsPaid",
    },
    ExpressionAttributeValues: {
      ":owner": event.requestContext.authorizer.jwt.claims["cognito:username"],
      ":false": false,
    },
  };

  docClient.query(params, function (err, data) {
    if (err) {
      // TODO: properly handle err
      console.log(err);
      callback(err);
    } else {
      // TODO: things if success
      callback(null, data);
    }
  });
};
