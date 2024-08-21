const UserModel = require("../../models/users.model");

// create new user
exports.addUser = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    const result = await UserModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "User create Error!", error });
  }
};

// Delete a specific user by database _id
exports.deleteUser = async (req, res) => {
  const userDatabaseId = req.params.id;
  try {
    // Use Mongoose deleteOne to delete the user
    const result = await UserModel.deleteOne({ _id: userDatabaseId });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: "User deleted successfully" });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error deleting User", error: err });
  }
};
// get a User by id
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await UserModel.findById(id);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "User user not found!", error });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    // Use Mongoose updateOne to update the designation
    const result = await UserModel.updateOne({ _id: id }, { $set: updateData });
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: "Error updating designation", error: err });
  }
};
