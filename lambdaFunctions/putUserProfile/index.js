const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME_USERS,
    Key: {
      Username: event.requestContext.authorizer.jwt.claims["cognito:username"],
    },
    UpdateExpression: `set CanConfirmWhom = :whom, CanPerformChores = :chores`,
    ExpressionAttributeValues: {
      ":whom": body.CanConfirmWhom,
      ":chores": body.CanPerformChores,
    },
  };

  docClient.update(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(null, { message: err });
    } else {
      callback(null, JSON.stringify(data));
    }
  });
};
