
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
			if (items.length) { // login successful
				req.session.user_id = items[0]['_id']; // it's bad but times up
 				res.send({ redirect: 'index' });
			} else {
				res.send(false);
			}
		});
	};
};

exports.logout = function (req, res) {
	delete req.session.user_id;
	res.redirect('login');
}