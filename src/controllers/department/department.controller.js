const DepartmentModel = require("../../models/department.model");

// post new department
exports.addDepartment = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    const result = await DepartmentModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Department Insert Error!", error });
  }
};

// get all department data
exports.getDepartment = async (req, res) => {
  try {
    const result = await DepartmentModel.find();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: "Department get Error!", err });
  }
};

// Delete a specific department by ID
exports.deleteDepartment = async (req, res) => {
  const departmentId = req.params.id; // Get the department ID from request params
  try {
    // Use Mongoose deleteOne to delete the department
    const result = await DepartmentModel.deleteOne({ _id: departmentId });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: "Department deleted successfully" });
    } else {
      res.status(404).send({ message: "Department not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error deleting department", error: err });
  }
};

// Update a specific department by ID
exports.updateDepartment = async (req, res) => {
  const departmentId = req.params.id;
  const updateData = req.body;
  try {
    // Use Mongoose updateOne to update the department
    const result = await DepartmentModel.updateOne(
      { _id: departmentId },
      updateData
    );
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: "Error updating department", error: err });
  }
};
