const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const usersParams = {
    TableName: process.env.DYNAMODB_TABLE_NAME_USERS,
    Key: {
      Username: event.requestContext.authorizer.jwt.claims["cognito:username"],
    },
  };

  docClient.get(usersParams, function (err, userProfile) {
    if (err) {
      // TODO: properly handle err
      console.log(err);
      callback(err);
    } else {
      const choresParams = {
        TableName: process.env.DYNAMODB_TABLE_NAME_CHORES,
        KeyConditionExpression: "#owner = :payeeUsername",
        FilterExpression: "IsPaid = :false",
        ExpressionAttributeNames: {
          "#owner": "Owner",
        },
        ExpressionAttributeValues: {
          ":payeeUsername": userProfile.Item.CanConfirmWhom.Username,
          ":false": false,
        },
      };

      docClient.query(choresParams, function (err, chores) {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          callback(null, chores);
        }
      });
    }
  });
};
