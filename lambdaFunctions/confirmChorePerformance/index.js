const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body);

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
      const choreParams = {
        TableName: process.env.DYNAMODB_TABLE_NAME_CHORES,
        Key: {
          Owner: userProfile.Item.CanConfirmWhom.Username,
          TimeCreated: body.timeCreated,
        },
        ConditionExpression: "IsConfirmed = :false AND IsPaid = :false",
        UpdateExpression: "set IsConfirmed = :true",
        ExpressionAttributeValues: {
          ":false": false,
          ":true": true,
        },
      };

      docClient.update(choreParams, function (err, data) {
        if (err) {
          // TODO: properly handle err
          console.log(err);
          callback(null, { message: err });
        } else {
          callback(null, { message: "Chore performance confirmed" });
        }
      });
    }
  });
};
