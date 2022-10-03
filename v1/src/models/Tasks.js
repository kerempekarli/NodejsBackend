const Mongoose = require("mongoose");
const logger = require("../scripts/logger/tasks");

const TaskSchema = new Mongoose.Schema(
  {
    title: String,
    description: String,
    assigned_to: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
    due_date: Date,
    statuses: [String],
    section_id: {
      type: Mongoose.Types.ObjectId,
      ref: "section",
    },
    project_id: {
      type: Mongoose.Types.ObjectId,
      ref: "project",
    },
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
    order: Number,
    isComplated: Boolean,
    comments: [
      {
        comment: String,
        commend_at: Date,
        user_id: {
          type: Mongoose.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    media: [
      {
        file: String,
        user_id: {
          type: Mongoose.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    sub_tasks: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "task"
      }
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TaskSchema.post("save", (doc) => {
  logger.log({
    level : "info",
    message : doc
  })
});

module.exports = Mongoose.model("task", TaskSchema);
