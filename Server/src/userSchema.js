const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String, // Added field to store refresh tokens if needed.
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    "6d135b832fb8e00e6b6fa3322840754af0aeb4ab35804cd943a31264317bd8b80a4695aa939ac238d2adf27e6147c9fb",
    {
      expiresIn: "1d",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    "f7b53be8fcf76307254b57fa28120f438323d9e48d5d6a65c11c1cf44b1a8209f82c169e699f433e18608bd03d6820ab",
    {
      expiresIn: "10d",
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
