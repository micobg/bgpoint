
/*
 * GET users listing.
 */

exports.login = function(req, res){
  // res.send("respond with a resource");
  res.render('login', { title: 'Express' });
};

exports.login_submit = function(db) {
	return function(req, res) {
		var query = {
			'email': req.body.email,
			'password': req.body.password
		};

		db.collection('users').find(query, {}).toArray(function (err, items) {
			if (items.length) {
				console.log(items);
				res.redirect('map_index');
			} else {
				console.log('sdsdsdsdssdsdssd');
				res.json(false);
			}
		});
	};
};