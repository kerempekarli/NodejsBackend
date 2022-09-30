const User = require("../models/Users");

const insert = (data) => {
  const user = new User(data);
  return user.save();
};

const list = () => {
  return User.find({});
};

const loginUser = (loginData) => {
  return User.findOne(loginData);
};

const modify = (where, data ) => {
  if(data?.password) delete data.password
  return User.findOneAndUpdate(where,data,{new: true});
}

module.exports = {
  insert,
  list,
  loginUser,
  modify,
  
};
