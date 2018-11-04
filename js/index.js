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
  			url: "https://team12.dev.softwareengineeringii.com/api/clientSide/user",
  			data: formData,
  			success: function(msg){
        		alert( "Data Saved: " + msg );
  			},
  			error: function(XMLHttpRequest, textStatus, errorThrown) {
     			alert("some error" + errorThrown + textStatus);
  			}
		});
		
	});

	$("form#login").submit(function(e){
		e.preventDefault();
		let formData = $(this).serializeArray();
		$.ajax({
  			type: "POST",
  			url: "https://team12.dev.softwareengineeringii.com/api/clientSide/users/login",
  			data: formData,
  			success: function(msg){
        		window.location.href = "./dashboard.html";
  			},
  			error: function(XMLHttpRequest, textStatus, errorThrown) {
     			alert("some error");
  			}
		});


		
	});
});