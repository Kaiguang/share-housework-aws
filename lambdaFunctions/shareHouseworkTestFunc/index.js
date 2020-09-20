exports.handler = (event, context, callback) => {
  const data = {
    DYNAMODB_TABLE_NAME_CHORES: process.env.DYNAMODB_TABLE_NAME_CHORES,
    DYNAMODB_TABLE_NAME_USERS: process.env.DYNAMODB_TABLE_NAME_USERS,
  };

  callback(null, data);
};
