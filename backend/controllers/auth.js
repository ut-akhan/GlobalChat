import User from '../models/User.js';
import StatusCodes from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import UnauthenticatedError from '../errors/unauthenticated.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password, user.password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  jwt.sign({email: user.email, id: user._id}, 'jwtSecret', {}, (err, token) => {
    if (err) throw err;
    res.cookie('token', token).status(StatusCodes.OK).json(user);
  });
}

export {
  login,
  register,
}
