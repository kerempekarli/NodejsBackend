const ServiceForUser = require("../services/Users");
const UserService = new ServiceForUser();

const ServiceForProject = require("../services/Project");
const ProjectService = new ServiceForProject();

const httpStatus = require("http-status");
const uuid = require("uuid");
const path = require("path");

const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const eventEmitter = require("../scripts/events/eventEmitter");
const { dirname } = require("path");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);

  UserService.create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send("response " + response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const index = (req, res) => {
  UserService.list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus[500]).send("hata"));
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  UserService.findOne(req.body)
    .then((user) => {
      if (!user) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "Böyle bir kullanıcı bulunmamaktadır" });
      }
      user = {
        ...user.toObject(),
        tokens: {
          access_token: generateAccessToken({ name: user.full_name, ...user }),
          refresh_token: generateRefreshToken({
            name: user.full_name,
            ...user,
          }),
        },
      };
      console.log(user);
      res.status(200).send(user);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const projectList = (req, res) => {
  ProjectService
    .list({ user_id: req.user?._id })
    .then((projects) => {
      res.status(httpStatus.OK).send(projects);
    })
    .catch(() =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Projeleri getirirken beklenmedik bir hata oluştu.",
      })
    );
};

const resetPassword = (req, res) => {
  const new_password =
    uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  UserService.updateWhere(
    { email: req.body.email },
    { password: passwordToHash(new_password) }
  )
    .then((updatedUser) => {
      if (!updatedUser) console.log("USER YOK:>>", updatedUser);
      eventEmitter.emit("send_email", {
        to: updatedUser.email, // list of receivers
        subject: "Sifre Sıfırlama", // Subject line
        text: "12421",
        html: `<b>Talebiniz üzerine şifreniz sıfırlanmıştır</b> <br/> Giriş yaptıktan sonra şifrenizi değiştirmeyi unutmayın <br/> Yeni şifreniz <b>${new_password}<b/>`,
      });
      res.status(httpStatus.OK).send({
        message:
          "Şifre sıfırlama işlemi için e-posta adresinize gereken bilgiler gönderilmiştir",
      });
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Şifre resetleme sırasında bir problem oluştu." })
    );
};

const update = (req, res) => {
  UserService.update({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(200).send(updatedUser);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Güncelleme işlemi sırasında bir problem oluştu" })
    );
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  UserService.update({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(200).send(updatedUser);
    })
    .catch(
      (e) =>
        console.log(e) &&
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Güncelleme işlemi sırasında bir problem oluştu" })
    );
};

const deleteUser = (req, res) => {
  UserService.delete(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser) {
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
};

const updateProfileImage = (req, res) => {
  //! 1- Resim KONTROLÜ
  console.log(req.files);

  if (!req?.files?.profile_image) {
    res.status(httpStatus.BAD_REQUEST).send({
      error: "Bu işlemi yapabilmek için yeterli veriye sahip değilsiniz",
    });
  }

  const extension = path.extname(req.files.profile_image.name);
  fileName = `${req?.user._id}.${extension}`;
  folderPath = path.join(
    __dirname,
    "../",
    "uploads/users",
    req.files.profile_image.name
  );
  req.files.profile_image.mv(folderPath, function (err) {
    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
    }
    UserService.update({ _id: req.user._id }, { profile_image: fileName })
      .then((updatedUser) => {
        res.status(httpStatus[200]).send(updatedUser);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            error: "Upload Başarılı fake kayıt sırasında bir hata oluştu",
          })
      );
  });
  //! 2- Upload İşlemi
  //! 3- DB Save İşlemi
  //! 4- Responses
};

module.exports = {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage,
};
