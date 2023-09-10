const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is missing, cannot compare!');

  try {
    const passwordMatch = await bcrypt.compare(password, this.password);
    return passwordMatch;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
    return false; // Return false in case of an error
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
