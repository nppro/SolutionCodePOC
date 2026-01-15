const Supplier = require("../models/supplier.model.js");

const { body, validationResult } = require("express-validator");

exports.create = [
  // Validate and sanitize the name field.
  body("name", "The student name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("address", "The student address is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("city", "The student city is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("state", "The student state is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "phone",
    "Phone number should be 10 digit number plus optional country code"
  )
    .trim()
    .isMobilePhone()
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const supplier = new Supplier(req.body);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("supplier-add", {
        title: "Create Genre",
        supplier: supplier,
        errors: errors.array(),
      });

      return;
    }

    try {
      await Supplier.create(supplier);
      res.redirect("/students");
    } catch (err) {
      res.render("500", {
        message: `Error occurred while creating the Student.`,
      });
    }
  },
];

exports.findAll = async (req, res) => {
  try {
    const data = await Supplier.getAll();
    res.render("supplier-list-all", { students: data });
  } catch (error) {
    res.render("500", {
      message: "The was a problem retrieving the list of students",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).send({
        message: `Not found Student with id ${req.params.id}.`,
      });
    }
    res.render("supplier-update", { supplier });
  } catch (error) {
    res.render("500", {
      message: `Error retrieving student with id ${req.params.id}`,
    });
  }
};

exports.update = [
  // Validate and sanitize the name field.
  body("name", "The student name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("address", "The student address is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("city", "The student city is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("state", "The student state is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "phone",
    "Phone number should be 10 digit number plus optional country code"
  )
    .trim()
    .isMobilePhone()
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const supplier = new Supplier(req.body);
    supplier.id = req.body.id;

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("supplier-update", {
        supplier: supplier,
        errors: errors.array(),
      });

      return;
    }

    try {
      const result = await Supplier.updateById(req.body.id, supplier);
      if (!result) {
        res.status(404).send({
          message: `Student with id ${req.body.id} Not found.`,
        });
        return;
      }
      res.redirect("/students");
    } catch (error) {
      res.render("500", {
        message: `Error updating Student with id ${req.body.id}`,
      });
    }
  },
];

exports.remove = async (req, res) => {
  try {
    const result = await Supplier.delete(req.params.id);
    if (!result) {
      res.status(404).send({
        message: `Not found Student with id ${req.params.id}.`,
      });
      return;
    }
    res.redirect("/students");
  } catch (error) {
    res.render("500", {
      message: `Could not delete Student with id ${req.body.id}`,
    });
  }
};

exports.removeAll = async (req, res) => {
  try {
    await Supplier.removeAll();
    res.send({ message: `All students were deleted successfully!` });
  } catch (error) {
    res.render("500", {
      message: `Some error occurred while removing all students.`,
    });
  }
};
