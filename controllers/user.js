const User = require("../models/user");

const getUserById = (req, res, next, id) => {
  console.log("id", id);

  User.findById(id)
    .exec()
    .then((user) => {
      // console.log("get user by id", user);
      if (user !== null) {
        req.profile = {
          _id: user._id,
        };
        next();
      } else {
        return res.status(404).json({
          error: "User not exists",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .exec()
    .then((user) => {
      // console.log("get user", user);
      if (user !== null) {
        return res.status(200).json(user);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

const updateUser = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.profile._id }, req.body, { new: true })
    .exec()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

const getAllUser = (req, res, next) => {
  User.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

module.exports = { getUserById, getUser, updateUser, getAllUser };
