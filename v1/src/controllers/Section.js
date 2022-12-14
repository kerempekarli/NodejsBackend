const httpStatus = require("http-status");
const Service = require("../services/Sections");
const SectionService = new Service()
const ServiceProject = require("../services/Project")
const ProjectService = new ServiceProject()

class Section {
   create(req, res) {

    req.body.user_id = req.user._id;
    SectionService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send("response" + response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };  
  
   index(req, res) {
  
      if(!req?.params?.projectId){return res.status(httpStatus.BAD_REQUEST).send({error: "Proje bilgisi eksik"})}
  
      SectionService.list({project_id: req.params.projectId})
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus[500]).send("hata"));
  };
  
   update(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "ID Bilgisi Eksik",
      });
    } else {
      SectionService.update(req.params.id, req.body)
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
  
   deleteSection(req, res) {
    SectionService.delete(req.params.id)
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
}

module.exports = new Section()





