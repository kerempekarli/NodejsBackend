const { insert, list, modify, remove } = require("../services/sections");
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
  console.log(req.params.projectId)
    if(!req?.params?.projectId){return res.status(httpStatus.BAD_REQUEST).send({error: "Proje bilgisi eksik"})}
  list({project_id: req.params.projectId})
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

const deleteSection = (req, res) => {
  remove(req.params.id)
    .then((deletedProject) => {
      if(!deletedProject){
        res.status(httpStatus.NOT_FOUND).send({
          message:"Böyle bir kayıt bulunmamaktadır"
        })
      }
      res.status(httpStatus.OK).send({
        message: "Section silindi"
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Silme işlemi sırasında bir problem oluştu." })
    );
};

module.exports = {
  create,
  index,
  update,
  deleteSection,
};
