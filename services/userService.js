const User = require("../models/users");
const { CustomError, httpStatusCodes } = require("../constants/constants");
const {
  hashPassword,
  comparePassword,
} = require("../middleware/passwordEncrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "djfdjhfhhdnskj";

exports.register = async (userData) => {
  try {
    const { username, email, phone, address, role, password, confirmPassword } =
      userData;

    if (
      !username ||
      !email ||
      !phone ||
      !address ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      throw new CustomError(
        httpStatusCodes["Bad Request"],
        "Missing fields. Please enter all the required fields."
      );
    }

    if (password !== userData.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      throw new CustomError(
        httpStatusCodes["Bad Request"],
        "Username is already taken. Please choose a different one."
      );
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new CustomError(
        httpStatusCodes["Bad Request"],
        "Email is already in use. Please use a different email."
      );
    }

    const encrypted_password = await hashPassword(password);

    const newUser = {
      username,
      email,
      phone,
      address,
      role,
      password: encrypted_password,
    };
    const createdUser = await User.create(newUser);

    if (!createdUser) {
      throw new Error("Error Creating New User");
    }
    return createdUser.toJSON();
  } catch (error) {
    throw error;
  }
};

exports.login = async (userData) => {
  try {
    const { email, password } = userData;
    if (!email || !password) {
      throw new CustomError(
        httpStatusCodes["Unprocessable Entity"],
        "Please provide both Email and Password"
      );
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(
        httpStatusCodes["Not Found"],
        "Email is not registered. Do registeration first"
      );
    }

    const password_match = await comparePassword(password, user.password);
    if (!password_match) {
      return { Error: "Wrong Password" };
    }

    const token = jwt.sign(
      { id: user.user_id },
      process.env.SECRET_KEY || SECRET_KEY,
      {
        expiresIn: process.env.LOGIN_EXPIRES || "28d",
      }
    );

    return {
      success: true,
      message: "Login Successfully Done",
      token,
      // userData: user,
    };
  } catch (error) {
    throw error;
  }
};

exports.fetchAllUser = async () => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "address", "createdAt", "updatedAt"],
      },
    });
    if (users.length === 0) {
      throw new CustomError(httpStatusCodes["Not Found"], "No users found");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

exports.fetchUser = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password", "address", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      throw new CustomError(
        httpStatusCodes["Not Found"],
        "User not found. InvalidID"
      );
    }
    return user;
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, userData) => {
  try {
    if (!id) {
      throw new Error({ message: "Please Enter ID" });
    }
    const { username, email, phone, address, role, password } = userData;
    const user = await User.findByPk(id);

    if (!user) {
      throw new CustomError(httpStatusCodes["Not Found"], "User not found");
    }

    // Update user fields based on the model
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.role = role || user.role;

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();
    return { data: user.toJSON() };
  } catch (error) {
    throw error;
  }
};

exports.delete = async (id) => {
  try {
    const user = await User.destroy({ where: { user_id: id } });

    if (!user) {
      throw new CustomError(
        httpStatusCodes["Not Found"],
        "User not found. InvalidID"
      );
    }
  } catch (error) {
    throw error;
  }
};
