$(document).ready(function() {

  
});

$(window).resize(editTemplate());

// events
$('#btnLogin').on('click', loginSubmit);

function editTemplate() {
	$('#login-box').width(window.innerWidth - 400);
	console
	$('#login-box').css("margin-top", window.innerHeight/2 - 150);
}

function loginSubmit() {
	var loginData = {
	  'email': $('#login-form fieldset input#inputEmail').val(),
	  'password': $('#login-form fieldset input#inputPassword').val()
	}
	$.ajax({
		type: 'POST',
		data: loginData,
		url: '/login_submit',
		dataType: 'JSON'
	}).done(function (response) {
		alert('Wrong email or password');
	});
};


/*function loginSubmit(event) {
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still at zero
	if(errorCount === 0) {

		// If it is, compile all user info into one object
		var loginData = {
		  'email': $('#login-form fieldset input#inputEmail').val(),
		  'password': $('#login-form fieldset input#inputPassword').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'GET',
			data: loginData,
			url: '/login_submit',
			dataType: 'JSON'
		}).done(function (response) {
			// Check for successful (blank) response
			if (response.msg === '') {
				//res.location('map_index');
				res.redirect('map_index');
			}
			else {
				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
			}
		});
	}
	else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
}*/