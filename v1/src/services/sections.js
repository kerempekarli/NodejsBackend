const Section = require("../models/Sections");

const  insert = (sectionData) => {
  const Section = new Section(sectionData);
    return Section.save();
}

const list = (where) => {
   return Section.find(where || {}).populate({
    path : "user_id",
    select : "full_name email"
   })
}


const modify = (id,data) => {
  return Section.findByIdAndUpdate(id,data,{new: true})
}
const remove = (id) => {
  return Section.findByIdAndDelete(id)
}


module.exports = {
    insert, list, modify,remove
};