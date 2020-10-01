const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const timeCreated = body.timeCreated;

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME_CHORES,
    Key: {
      Owner: event.requestContext.authorizer.jwt.claims["cognito:username"],
      TimeCreated: timeCreated,
    },
  };

  docClient.delete(params, function (err, data) {
    if (err) {
      const errorJSON = JSON.stringify(err, null, 2);
      console.error(`Unable to delete item. Error JSON: ${errorJSON}`);
      callback(errorJSON);
    } else {
      const successJSON = JSON.stringify({ timeCreated }, null, 2);
      callback(null, `Item deleted successful at timeCreated: ${successJSON}`);
    }
  });
};
