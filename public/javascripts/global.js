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
		if (typeof response.redirect === 'string') {
			window.location = response.redirect
		} else {
			alert('Wrong email or password');
		}
	});
};