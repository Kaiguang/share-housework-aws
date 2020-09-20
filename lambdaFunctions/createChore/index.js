const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const timeCreated = Date.now().toString();
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME_CHORES,
    Item: {
      Owner: event.requestContext.authorizer.jwt.claims["cognito:username"],
      TimeCreated: timeCreated,
      Chore: body.chore,
      Cents: body.cents,
      IsPaid: false,
      IsConfirmed: false,
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      // TODO: properly handle err
      console.log(err);
      callback(err);
    } else {
      // TODO: things if success
      callback(null, JSON.stringify({ timeCreated }));
    }
  });
};
