const { Router } = require("express");
const {
  loginUser,
  registerUser,
} = require("./userController");

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
