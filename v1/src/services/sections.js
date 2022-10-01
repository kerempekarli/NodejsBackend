const Section = require("../models/Sections");

const insert = (sectionData) => {

  const tempSection = new Section(sectionData);
  return tempSection.save();
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