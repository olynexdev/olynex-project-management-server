const Department = require("../models/department.model");

exports.addDepartment = async (req, res) => {
    const body = req.body;
    try {
        const result = await Department.create(body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: "Department Insert Error!", error });
    }
};
