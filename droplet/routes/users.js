const express = require('express');
const router = express.Router({});

/* GET users listing. */
router.get('/', function (req, res) {
    res.json({
        'status': 'OK'
    });
});

router.get('/:userId/dashboard', function(req, res){
	const params =  req.params;

	const data = params;

	res.render('../views/dashboard.ejs', data);
});

router.post('/', function (req, res) {
    res.status(201).json(req.body);
});

router.put('/', function (req, res) {
    res.status(202).send();
});

router.delete('/', function (req, res) {
    res.status(202).send();
    process.exit();
});

router.patch('/', function (req, res) {
    res.status(202).json(req.body);
});

router.options('/', function (req, res) {
    res.header('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD').status(204).send();
});

module.exports = router;
