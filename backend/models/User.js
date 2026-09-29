const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },
    appleId: {
      type: String,
      default: null,
      sparse: true,
    },
    authProvider: {
      type: String,
      default: 'local',
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'Student',
    },
    bio: {
      type: String,
      default: 'Computer Science student & lifelong learner.',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving (only if password exists and is modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
