const Category = require("../models/category");

const addCategory = (req, res, next) => {
  // console.log(req.body);
  const category = new Category(req.body);
  category
    .save()
    .then((doc) => {
      return res.status(201).json({
        message: "Category Created",
        doc,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const getAllCategories = (req, res, next) => {
  Category.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const getCategoryById = (req, res, next, categoryId) => {
  // const categoryId = req.body.category;
  // console.log(categoryId);

  Category.findById(categoryId)
    .exec()
    .then((category) => {
      req.category = category;
      next();
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const updateCategory = (req, res, next) => {
  const categoryId = req.category._id;
  console.log(categoryId);
  Category.findByIdAndUpdate(categoryId, req.body, { new: true })
    .exec()
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const getCategory = (req, res, next) => {
  res.status(200).json(req.category);
};

const deleteCategory = (req, res, next) => {
  const category = req.category;
  Category.deleteOne({ _id: category._id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Category Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
  getCategory,
};
