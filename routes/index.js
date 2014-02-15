
/*
 * GET home page.
 */

exports.root = function(req, res){
  	res.redirect('index');
};

exports.index = function(req, res){
  	res.render('index', {  });
};