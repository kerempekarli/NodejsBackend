const { insert, list, modify, remove, findOne } = require("../services/tasks");
const httpStatus = require("http-status");

const create = (req, res) => {
  req.body.user_id = req.user._id;
  insert(req.body)
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
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: "Proje bilgisi eksik" });
  }
  list({ task_id: req.params.taskId })
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
    modify(req.params.id, req.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Kayıt sırasında bir problem oluştu." })
      );
  }
};

const deleteTask = (req, res) => {
  remove(req.params.id)
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
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Silme işlemi sırasında bir problem oluştu." })
    );
};

const makeComment = (req, res) => {
  req.body.user_id = req.user;
  console.log(req.body.user_id);
  findOne({
    _id: req.params.id,
  })
    .then((mainTask) => {
      if (!mainTask) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "böyle bir kullanıcı bulunmamaktadır" });
      }

      mainTask.comments = mainTask.comments.filter(
        (c) => c._id !== req.params.commendId
      );
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
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Kayıt sırasında bir problem oluştu" })
    );
};

const deleteComment = (req, res) => {
  findOne({
    _id: req.params.id,
  })
    .then((mainTask) => {
      if (!mainTask) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "böyle bir kullanıcı bulunmamaktadır" });
      }

      mainTask.comments = mainTask.comments.filter(c => c._id.toString() !== req.params.commendId)
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
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Kayıt sırasında bir problem oluştu" })
    );
};

const 

module.exports = {
  create,
  index,
  update,
  deleteTask,
  makeComment,
  deleteComment,
};
