import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const MAX_VAL_FOR_PHONE_NUMBER = 9999999999;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "{PATH} is required"],
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
  },
  name: {
    type: String,
    required: [true, "{PATH} is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "{PATH} is required"],
    minLength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot conatin 'password'");
      }
    },
  },

  phone: {
    type: Number,
    required: [true, "{PATH} is required"],
    trim: true,
    validate(value) {
      if (parseInt(value) > MAX_VAL_FOR_PHONE_NUMBER) {
        throw new Error("Phone number is not valid");
      }
    },
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  userRole: {
    type: String,
    enum: ["customer", "company"],
    default: "customer",
  },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisisnewsecretcode");
  user.tokens = user.tokens.concat({ token });
  user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User with this email was not found");
  }
  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    throw new Error("Email and password didn't match");
  }

  return user;
};

// hashing plain password before saving

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const hashedPassword = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10)
    );
    console.log({ hashedPassword });
    user.password = hashedPassword;
  }

  next();
});

// userSchema.pre("remove", async function (next) {
//   const user = this;
//   await Task.deleteMany({ owner: user._id });

//   next();
// });

const User = mongoose.model("User", userSchema);

export { User };
