const userService = require("../services/userService");
// const { CustomError, httpStatusCodes } = require("../constants/constants");

exports.registerUser = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ message: "Registration successfully done" });
  } catch (error) {
    return next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const user = await userService.login(req.body);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await userService.fetchAllUser();
    // return res.send(httpStatusCodes.Created, users);
    return res.status(200).json({ message: "success", data: users });
  } catch (error) {
    return next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.fetchUser(req.params.id);
    return res.status(200).json({ message: "Success", userData: user });
  } catch (error) {
    return next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    return res.status(200).json({
      message: "Successfully updated the user details",
      // data: user
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.delete(req.params.id);
    return res.status(200).json({ message: "Successfully deleted the user" });
  } catch (error) {
    return next(error);
  }
};
