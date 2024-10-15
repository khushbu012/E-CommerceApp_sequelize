const jwt = require("jsonwebtoken");
const SECRET_KEY = "djfdjhfhhdnskj";

exports.requireSignIn = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.slice(7);
    }
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! Please login to access this resource.",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY || SECRET_KEY);
    req.user = decoded; // if we will console this then it will give us id, creation and expiration time

    next();
  } catch (error) {
    res.status(400).json({ success: "failed", error: error.message });
  }
};
