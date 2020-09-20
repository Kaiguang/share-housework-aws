const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body);

  docClient.update(
    {
      TableName: process.env.DYNAMODB_TABLE_NAME_CHORES,
      Key: {
        Owner: event.requestContext.authorizer.jwt.claims["cognito:username"],
        TimeCreated: body.timeCreated,
      },
      UpdateExpression: "set IsPaid = :true",
      ExpressionAttributeValues: {
        ":true": true,
        ":false": false,
      },
      ConditionExpression: "IsConfirmed = :true AND IsPaid = :false",
    },
    function (err, data) {
      if (err) {
        // TODO: properly handle err
        console.log(err);
        callback(null, { message: err });
      } else {
        callback(null, { message: "Payment confirmed" });
      }
    }
  );
};
