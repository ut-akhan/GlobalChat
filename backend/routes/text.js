import express from 'express';

const router = express.Router();

import { postText, getAllTexts } from '../controllers/text.js';

router.route('/').post(postText).get(getAllTexts);

export default router;