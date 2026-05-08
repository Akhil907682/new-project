const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Admin = require('./admin.model');
const Student = require('./student.model');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerAdmin = async (userData) => {
  const { name, email, password } = userData;

  const adminExists = await Admin.findOne({ email });
  const studentExists = await Student.findOne({ email });

  if (adminExists || studentExists) {
    throw new Error('Email is already registered');
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role: 'admin',
    authProvider: 'local',
  });

  if (admin) {
    return {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    };
  } else {
    throw new Error('Invalid admin data');
  }
};

const registerStudent = async (userData) => {
  const { name, email, password, course } = userData;

  const adminExists = await Admin.findOne({ email });
  const studentExists = await Student.findOne({ email });

  if (adminExists || studentExists) {
    throw new Error('Email is already registered');
  }

  const student = await Student.create({
    name,
    email,
    password,
    course,
    role: 'student',
    authProvider: 'local',
  });

  if (student) {
    return {
      _id: student._id,
      name: student.name,
      email: student.email,
      course: student.course,
      role: student.role,
      token: generateToken(student._id),
    };
  } else {
    throw new Error('Invalid student data');
  }
};

const login = async (email, password) => {
  let user = await Student.findOne({ email }).select('+password');
  let userType = 'student';

  if (!user) {
    user = await Admin.findOne({ email }).select('+password');
    userType = 'admin';
  }

  if (user && user.authProvider === 'google') {
    throw new Error('This account uses Google sign-in. Please use "Continue with Google" instead.');
  }

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

const googleLogin = async (credential) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name, email_verified } = payload;

  if (!email_verified) {
    throw new Error('Google email not verified');
  }

  let user = await Student.findOne({ $or: [{ email }, { googleId }] });
  let isAdmin = false;

  if (!user) {
    user = await Admin.findOne({ $or: [{ email }, { googleId }] });
    if (user) isAdmin = true;
  }

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      await user.save();
    }
  } else {
    // Default new google signups to Student, requires course update later if needed
    user = await Student.create({
      name,
      email,
      googleId,
      course: 'Pending Validation', // Or another default
      authProvider: 'google',
      role: 'student',
    });
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

const getMe = async (userId) => {
  let user = await Student.findById(userId);
  if (!user) {
    user = await Admin.findById(userId);
  }
  return user;
};

module.exports = {
  registerAdmin,
  registerStudent,
  login,
  googleLogin,
  getMe,
};
