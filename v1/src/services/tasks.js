const Task = require("../models/Tasks");

const insert = (TaskData) => {

  const tempTask = new Task(TaskData);
  return tempTask.save();
}

const list = (where) => {
   return Task.find(where || {}).populate({
    path : "user_id",
    select : "full_name email"
   })
}


const modify = (id,data) => {
  return Task.findByIdAndUpdate(id,data,{new: true})
}
const remove = (id) => {
  return Task.findByIdAndDelete(id)
}


module.exports = {
    insert, list, modify,remove
};