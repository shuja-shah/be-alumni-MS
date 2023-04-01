const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    zip: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_alumni: {
      type: Boolean,
      default: false,
    },
    is_student: {
      type: Boolean,
      default: true,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
  
