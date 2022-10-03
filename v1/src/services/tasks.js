const Task = require("../models/Tasks");

const findOne = (where, expand) => {
  if (!expand) return Task.findOne(where);
  return Task.findOne(where).populate({
    path: "user_id",
    select: "full_name, email, profile_image",
  });
};

const insert = (TaskData) => {
  const tempTask = new Task(TaskData);
  return tempTask.save();
};

const list = (where) => {
  return Task.findOne(where || {}).populate({
    path: "user_id",
    select: "full_name email",
  });
};

const modify = (id, data) => {
  return Task.findByIdAndUpdate(id, data, { new: true });
};
const remove = (id) => {
  return Task.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
  findOne,
};
