import Text from '../models/Text.js';
import StatusCodes from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js'
import User from '../models/User.js';

const getAllTexts = async (req, res) => {
  const texts = await Text.find().sort('createdAt');
  res.status(StatusCodes.OK).json({texts, count:texts.length});
}

const postText = async (req, res) => {
  req.body.createdBy = req.body.userId;
  // if (!req.user) {
  //   req.body.createdBy = req.body.userId;
  // }
  const {name} = await User.findById(req.body.createdBy);
  req.body.name = name;
  const text = await Text.create(req.body);
  res.status(StatusCodes.CREATED).json({text});
}

export {
  getAllTexts, postText
}