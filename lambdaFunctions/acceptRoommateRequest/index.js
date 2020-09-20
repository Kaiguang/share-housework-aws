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
      UpdateExpression: `set RequestingRoommate = :requestingWhom, RoommateRequestedBy = :requestedBy, CanConfirmWhom = :canConfirmWhom`,
      ExpressionAttributeValues: {
        ":requestingWhom": { Username: "", Nickname: "" },
        ":requestedBy": { Username: "" },
        ":canConfirmWhom": {
          Username: body.RoommateRequestedBy.Username,
          Nickname: "",
        },
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
              Username: body.RoommateRequestedBy.Username,
            },
            UpdateExpression: `set RequestingRoommate = :requestingWhom, RoommateRequestedBy = :requestedBy, CanConfirmWhom = :canConfirmWhom`,
            ExpressionAttributeValues: {
              ":requestingWhom": { Username: "", Nickname: "" },
              ":requestedBy": { Username: "" },
              ":canConfirmWhom": {
                Username:
                  event.requestContext.authorizer.jwt.claims[
                    "cognito:username"
                  ],
                Nickname: "",
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
