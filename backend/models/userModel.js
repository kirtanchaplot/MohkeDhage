import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      sparse: true,
      unique: true,
      set: v => v ? v.toLowerCase() : v,
      get: v => v
    },

    mobile: {
      type: String,
      sparse: true,
      unique: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit mobile number!`
      }
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function(next) {
  if (this.email || this.mobile) {
    next();
  } else {
    next(new Error('Either email or mobile number is required'));
  }
});

const User = mongoose.model("User", userSchema);

export default User;