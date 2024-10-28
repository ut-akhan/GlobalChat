import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {PORT, mongoDBURL} from '../config.js';

const TextSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  name: {
    type: String,
    required: [true, 'Please provide name']
  },
  message: {
    type: String,
    required: [true, 'Please provide message'],
    maxlength: 1000,
  },
  
}, {timestamps: true});

export default mongoose.model('Text', TextSchema);