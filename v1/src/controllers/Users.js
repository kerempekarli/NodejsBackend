const { insert, list, loginUser, modify } = require("../services/Users");
const projectService = require("../services/Projects");
const httpStatus = require("http-status");
const uuid = require("uuid");

const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const eventEmitter = require("../scripts/events/eventEmitter");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);

  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send("response " + response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus[500]).send("hata"));
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
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
  console.log(req.user);
  projectService
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
    uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  modify({ email: req.body.email }, { password: passwordToHash(new_password) })
    .then((updatedUser) => {
      if (!updatedUser) console.log("USER YOK:>>", updatedUser);
      eventEmitter.emit("send_email",{
        to: updatedUser.email, // list of receivers
        subject: "Sifre Sıfırlama", // Subject line
        text: "12421",
        html: `<b>Talebiniz üzerine şifreniz sıfırlanmıştır</b> <br/> Giriş yaptıktan sonra şifrenizi değiştirmeyi unutmayın <br/> Yeni şifreniz <b>${new_password}<b/>`
      });
      res.status(httpStatus.OK).send({
        message:"Şifre sıfırlama işlemi için e-posta adresinize gereken bilgiler gönderilmiştir"
      })
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Şifre resetleme sırasında bir problem oluştu." })
    );
};

const update = (req, res) => {
  modify({_id: req.user?._id}, req.body).then(updatedUser => {
    req.status().send(updatedUser)
  })
  .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"Güncelleme işlemi sırasında bir problem oluştu"}))

}

module.exports = {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update
};
