const { httpStatusCodes } = require("../constants/constants");

exports.errRes = (err, req, res, next) => {
  return res
    .status(err.statusCode || httpStatusCodes["Internal Server Error"])
    .json({ status: "error", message: err.message || "Server Error" });
};
