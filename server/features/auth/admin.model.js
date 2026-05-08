const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
    googleId: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
adminSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
