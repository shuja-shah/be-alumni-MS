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
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
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
      default: true,
    },
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
  
