const express = require('express');
const router = express.Router();                               
const jwtController = require('../controllers/controllers');   
const auth = require('../middleware/auth');                    

router.post('/register', jwtController.register);
router.post('/login', jwtController.login);
router.get('/dashboard', auth, jwtController.dashboard);

module.exports = router;
