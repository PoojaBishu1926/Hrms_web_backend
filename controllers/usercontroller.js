const User = require("../models/users");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const {
      employeeCode,
      firstName,
      lastName,
      email,
      mobileNumber,
      gender,
      dateOfBirth,
      joiningDate,
      department,
      designation,
      reportingManager,
      role,
      status,
      address,
      aadharNumber,
      panNumber,
      bankDetails,
      emergencyContact,
      password
    } = req.body;

    // Check for required fields
    if (!employeeCode || !firstName || !lastName || !email || !mobileNumber || !department || !designation || !password) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    // Check for duplicates
    const existingUser = await User.findOne({
      $or: [
        { employeeCode },
        { email },
        { mobileNumber },
      ],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with given employeeCode, email, or mobile number already exists." });
    }

    // Create user
    const user = await User.create({
      employeeCode,
      name: {
        first: firstName,
        last: lastName,
      },
      email,
      mobileNumber,
      gender,
      dateOfBirth,
      joiningDate,
      department,
      designation,
      reportingManager,
      role,
      status,
      address,
      aadharNumber,
      panNumber,
      bankDetails,
      emergencyContact,
      password
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users (with optional filters)
exports.getUsers = async (req, res) => {
  try {
    const { department, role, status } = req.query;

    // Build filter object
    const filter = {};
    if (department) filter.department = department;
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
