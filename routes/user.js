
/*
 * GET users listing.
 */

exports.login = function(req, res){
  res.render('login', {});
};

exports.login_submit = function(db) {
	return function(req, res) {
		var query = {
			'email': req.body.email,
			'password': req.body.password
		};

		db.collection('users').find(query, {}).toArray(function (err, items) {
			if (items.length) { // login successful
				// auth data
				req.session.user_id = items[0]['_id'];
				
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