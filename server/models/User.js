const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
     type: String,
     match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
      },

    dob: {
     type: Date,
    },

    gender: {
      type: String,
     enum: ["Male", "Female", "Other"],
     },
    image: { type: String },

    status: {
      type: Boolean,
      // required: [true, "Status is required"],
      default: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    addresses: [
  {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    landmark: String,
    pincode: String,
    alternatePhone: String,
    addressType: {
  type: String,
  enum: ["Home", "Office", "Other"],
  default: "Home",
},

isPrimary: {
  type: Boolean,
  default: false,
},
  },
],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);


module.exports = {
  User: mongoose.model("User", userSchema),
};