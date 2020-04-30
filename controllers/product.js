const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

// middleware

const getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec()
    .then((product) => {
      req.product = product;
      next();
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

// actual routes

const getProduct = (req, res, next) => {
  req.product.photo = undefined;
  res.status(200).json(req.product);
};

const getAllProducts = (req, res, next) => {
  const limit = req.query.limit || 8;
  const sortBy = req.query.sortBy || "_id";
  Product.find()
    .select("-photo")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .populate("category")
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length > 0) {
        return res.status(200).json({
          productCount: docs.length,
          productd: docs,
        });
      }
      res.status(200).json({
        message: "No Products in database",
      });
    })
    .catch((err) => res.status(400).json(err));
};

const createProduct = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(500).json({
        error: "Error occured while uploading image",
      });
    }

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    let product = new Product(fields);
    if (file.photo) {
      if (file.photo.size > 2 * 1024 * 1024) {
        res.status(400).json({
          error: "File is too big to upload",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    product
      .save()
      .then((doc) => {
        res.status(201).json(doc);
      })
      .catch((err) => res.status(500).json(err));
  });
};

const updateProduct = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(500).json({
        error: "Error occured while uploading image",
      });
    }

    let product = req.product;
    product = _.extend(req.product, fields);

    if (file.photo) {
      if (file.photo.size > 2 * 1024 * 1024) {
        res.status(400).json({
          error: "File is too big to upload",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    product
      .save()
      .then((doc) => {
        res.status(201).json({
          message: "Product updated",
          doc,
        });
      })
      .catch((err) => res.status(500).json(err));
  });
};

const deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.product._id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Product deleted",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  getProduct,
  updateProduct,
  getAllProducts,
};
