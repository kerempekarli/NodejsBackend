const httpStatus = require("http-status");
const Service = require("../services/Project");
const ProjectService = new Service();
const ApiError = require("../errors/ApiError");

class Projects {
  create(req, res) {
    req.body.user_id = req.user;
    ProjectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send("response" + response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  index(req, res) {
    ProjectService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus[500]).send("hata"));
  }

  update(req, res, next) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "ID Bilgisi Eksik",
      });
    } else {
      ProjectService.update(req.params.id, req.body)
        .then((updatedProject) => {
          if (!updatedProject) {
            return next(new ApiError("Böyle bir kayıt bulunmamaktadır", 404));
          }
          res.status(httpStatus.OK).send(updatedProject);
        })
        .catch((e) => next(new ApiError(e?.message, e?.statusCode)));
    }
  }

  deleteProject(req, res) {
    ProjectService.delete(req.params.id)
      .then((deletedProject) => {
        if (!deletedProject) {
          res.status(httpStatus.NOT_FOUND).send({
            message: "Böyle bir kayıt bulunmamaktadır",
          });
        }
        res.status(httpStatus.OK).send({
          message: "Proje silindi",
        });
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Silme işlemi sırasında bir problem oluştu." })
      );
  }
}
module.exports = new Projects();
