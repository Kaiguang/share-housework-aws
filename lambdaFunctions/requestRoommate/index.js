const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body);

  docClient.update(
    {
      TableName: process.env.DYNAMODB_TABLE_NAME_USERS,
      Key: {
        Username:
          event.requestContext.authorizer.jwt.claims["cognito:username"],
      },
      UpdateExpression: `set RequestingRoommate = :requestingWhom`,
      ExpressionAttributeValues: {
        ":requestingWhom": body.RequestingRoommate,
      },
    },
    function (err, data) {
      if (err) {
        console.log(err);
        callback(null, { message: err });
      } else {
        docClient.update(
          {
            TableName: process.env.DYNAMODB_TABLE_NAME_USERS,
            Key: {
              Username: body.RequestingRoommate.Username,
            },
            UpdateExpression: `set RoommateRequestedBy = :whom`,
            ExpressionAttributeValues: {
              ":whom": {
                Username:
                  event.requestContext.authorizer.jwt.claims[
                    "cognito:username"
                  ],
              },
            },
          },
          function (err, data) {
            if (err) {
              console.log(err);
              callback(null, { message: err });
            } else {
              callback(null, JSON.stringify(data));
            }
          }
        );
      }
    }
  );
};
