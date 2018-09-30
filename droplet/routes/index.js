const express = require('express');
const router = express.Router({});

/* GET home page. */
router.get('/', function (req, res) {
  	res.render('../views/index.ejs');
});

router.options('/', function (req, res) {
    res.header('Allow', 'GET').status(204).send();
});

module.exports = router;
