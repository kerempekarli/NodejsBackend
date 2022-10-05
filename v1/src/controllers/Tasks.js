const { insert, list, modify, remove, findOne } = require("../services/tasks");
const httpStatus = require("http-status");

const TaskServiceClass = require("../services/Taskss")
const TaskService = new TaskServiceClass();


const create = (req, res) => {
  req.body.user_id = req.user._id;
  TaskService.create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send("response" + response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const index = (req, res) => {
  console.log(req.params.taskId);
  if (!req?.params?.taskId) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: "Proje bilgisi eksik" });
  }
  TaskService.list({ task_id: req.params.taskId })
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus[500]).send("hata"));
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID Bilgisi Eksik",
    });
  } else {
    TaskService.update(req.params.id, req.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu." }));
  }
};

const deleteTask = (req, res) => {
  TaskService.delete(req.params.id)
    .then((deletedProject) => {
      if (!deletedProject) {
        res.status(httpStatus.NOT_FOUND).send({
          message: "Böyle bir kayıt bulunmamaktadır",
        });
      }
      res.status(httpStatus.OK).send({
        message: "task silindi",
      });
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Silme işlemi sırasında bir problem oluştu." }));
};

const makeComment = (req, res) => {
  req.body.user_id = req.user;
  TaskService.findOne({
    _id: req.params.id,
  })
    .then((mainTask) => {
      if (!mainTask) {
        return res.status(httpStatus.NOT_FOUND).send({ message: "böyle bir kullanıcı bulunmamaktadır" });
      }

      const comment = {
        ...req.body,
        commented_at: new Date(),
        user_id: req.user,
      };
      mainTask.comments.push(comment);
      mainTask
        .save()
        .then((updatedDoc) => {
          res.status(200).send(updatedDoc);
        })
        .catch((e) =>
          res.send(500).send({
            error: "Kayıt sırasında bir hata oluştu",
          })
        );
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu" }));
};

const deleteComment = (req, res) => {
  TaskService.findOne({
    _id: req.params.id,
  })
    .then((mainTask) => {
      if (!mainTask) {
        return res.status(httpStatus.NOT_FOUND).send({ message: "böyle bir kullanıcı bulunmamaktadır" });
      }

      mainTask.comments = mainTask.comments.filter((c) => c._id.toString() !== req.params.commendId);
      mainTask
        .save()
        .then((updatedDoc) => {
          res.status(200).send(updatedDoc);
        })
        .catch((e) =>
          res.send(500).send({
            error: "Kayıt sırasında bir hata oluştu",
          })
        );
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu" }));
};

const addSubtask = (req, res) => {
  if (!req.params.id) return res.status(400).send({ message: "ID bilgisi gerekli" });
  req.body.user_id = req.user;
  TaskService.findOne({
    _id: req.params.id,
  })
    .then((mainTask) => {
      if (!mainTask) {
        return res.status(httpStatus.NOT_FOUND).send({ message: "böyle bir kullanıcı bulunmamaktadır" });
      }
      // SUBTASK CREATE
      req.body.user_id = req.user._id;
      insert({ ...req.body, user_id: req.user })
        .then((subTask) => {
          // SUBTASK REFERANSI MAİN TASK ÜZERİNDE GÖSTERİLİR
          mainTask.sub_tasks.push(subTask);
          mainTask
            .save()
            .then((updatedDoc) => {
              // Kullanıcıya yeni döküman gönderilir
              res.status(200).send(updatedDoc);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu" }));
        })
        .catch((e) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
        });
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu" }));
};

const fetchTask = (req,res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: "ID bilgisi gerekli." });
  }
  TaskService.findOne({
    _id: req.params.id,
  },true)
    .then((task) => {
      if (!task) {
        return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kayıt bulunmamaktadır." });
      }
      res.status(200).send(task);
    })
    .catch((e) => res.status(500).send(e));
};



module.exports = {
  create,
  index,
  update,
  deleteTask,
  makeComment,
  deleteComment,
  addSubtask,
  fetchTask,
};
