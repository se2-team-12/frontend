$(document).ready(function(){
	const registerToggle = $("#register-toggle");
	const loginToggle = $("#login-toggle");
	const registerForm = $("form#register");
	const loginForm = $("form#login");
	$(registerToggle).click(function(){
		loginForm.fadeOut();
		setTimeout(function(){ registerForm.fadeIn()}, 400);
		registerToggle.removeClass("deselected")
		loginToggle.addClass("deselected")

	});
	$(loginToggle).click(function(){
		registerForm.fadeOut();
		setTimeout(function(){ loginForm.fadeIn()}, 400);
		registerToggle.addClass("deselected");
		loginToggle.removeClass("deselected");
			
	});

	$(registerForm).submit(function(e){
		e.preventDefault();

		let formData = $(this).serializeArray();

		$.ajax({
  			type: "POST",
  			url: "https://team12.dev.softwareengineeringii.com/api/clientSide/register",
  			data: formData,
  			success: function(msg){
        		alert( "Data Saved: " + msg );
  			},
  			error: function(XMLHttpRequest, textStatus, errorThrown) {
     			let errorJSON = XMLHttpRequest.responseJSON;

     			let errorCode = errorJSON.error.code;

     			console.log(errorCode);
     			if(errorCode == 11000){
     				alert("Email already in use. Try a different email");
     			}
  			}
		});
		
	});

	$("form#login").submit(function(e){
		e.preventDefault();
		let formData = $(this).serializeArray();
		$.ajax({
  			type: "POST",
  			url: "https://team12.dev.softwareengineeringii.com/api/clientSide/login",
  			data: formData,
  			success: function(msg){

  				if(msg.status == 0){
  					alert("Email and Password did not match. Please try again");
  				}
  				else if (msg.status == 1){
  					window.location.href = "./dashboard.html";
  				}
        		
  			},
  			error: function(XMLHttpRequest, textStatus, errorThrown) {
     			// let errorJSON = XMLHttpRequest.responseJSON;

     			// let errorCode = errorJSON.error.code;

     			// console.log(errorCode);
     			alert("Something went wrong! Try again in a bit");
  			}
		});

	});


});