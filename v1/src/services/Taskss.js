const BaseService = require("./BaseService.js");
const BaseModel = require("../models/Tasks");
class Task extends BaseService {
  constructor() {
    super(BaseModel);
  }

  list = (where) => {
    return this.BaseModel.findOne(where || {}).populate({
      path: "user_id",
      select: "full_name email",
    });
  };

  findOne = (where, expand) => {
    if (!expand) return BaseModel.findOne(where);
    return this.BaseModel.findOne(where).populate([
      {
        path: "user_id",
        select: "full_name email profile_image",
      },
      {
        path: "comments",
        populate: {
          path: "user_id",
          select: "full_name email profile_image",
        },
      },
      {
        path: "sub_tasks",
        select:
          "title description isCompleted assigned_to due_date order statuses",
      },
    ]);
  };
}

module.exports = Task;
