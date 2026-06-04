const express = require('express');
const { getSkills } = require('../controllers/metaController');

const router = express.Router();

router.get('/skills', getSkills);

module.exports = router;
