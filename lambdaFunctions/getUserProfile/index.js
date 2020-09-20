const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const newUserProfile = {
    Username: event.requestContext.authorizer.jwt.claims["cognito:username"],
    RequestingRoommate: { Username: "", Nickname: "" },
    RoommateRequestedBy: { Username: "" },
    CanConfirmWhom: { Username: "", Nickname: "" },
    CanPerformChores: [],
  };

  const createNewUserProfile = () => {
    docClient.put(
      {
        TableName: process.env.DYNAMODB_TABLE_NAME_USERS,
        Item: newUserProfile,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          callback(null, { message: err });
        } else {
          callback(null, JSON.stringify({ Item: newUserProfile }));
        }
      }
    );
  };

  docClient.get(
    {
      TableName: process.env.DYNAMODB_TABLE_NAME_USERS,
      Key: {
        Username:
          event.requestContext.authorizer.jwt.claims["cognito:username"],
      },
    },
    function (err, data) {
      if (err) {
        console.log(err);
        callback(null, { message: err });
      } else if (data.Item === undefined) {
        console.log("Cannot find user profile, creating a new one.");
        createNewUserProfile();
      } else {
        callback(null, JSON.stringify(data));
      }
    }
  );
};
