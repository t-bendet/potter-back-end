const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
const Story = require("./Story");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
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
    house: {
      type: String,
      default: "first year wizard",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("stories", {
  ref: "Story",
  localField: "_id",
  foreignField: "owner",
});

//TODO add tokens checker function to check if tokens are expierd

//TODO replace password with ******************

// express converts obj to JSON in the response,this method will attach to every response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};
//methods are used on model instances
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "alohomora");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
// static methods are used on the model itself
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

//every time a password is saved(including when creating an account)
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.plugin(uniqueValidator, {
  message: "Error,{VALUE} is already taken, expected {PATH} to be unique.   ",
});

//TODO add remove all posts,blogs and drawings
//when a user is deleted,delete all of his data

userSchema.pre("remove", async function (next) {
  const user = this;
  await Story.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
