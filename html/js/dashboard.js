$(document).ready( function () {

	let useremail;
	let usertoken;

	

	const userGateways = ["5bde6bf82c7ac54bbdf5bb85", "5bde7e392c7ac54bbdf5bbaa"];
	const names = ["test", "Batool"];

	checkCookie();


	let inView = "dashboard-view";
	

	let gatewayInFocus;


	let gatewayFocusTable;
	let onDemandTable;
	let dailyDiagnosticTable;

	function checkCookie() {
	    useremail = getCookie("team12softwareuseremail");
	    usertoken = getCookie("team12softwaretoken");
	    if (useremail != "") {
	        alert("Welcome");

	        //get usergateways
	        $.get("https://team12.dev.softwareengineeringii.com/api/clientSide/gateways/" + useremail, function( data ) {
  				
  				for (var i = data.length - 1; i >= 0; i--) {
  					let gatewayId = data[i].GatewayId;

  					userGateways.push(gatewayId);
  				}
  				
  				
			});

	        initGatewaysDashboard();

	    } else {
	        window.location.href = "./index.html";
	    }
	}

	function getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	}
	
	function initGatewaysDashboard(){

		

		let navHtml = "";
		let dashboardTable = $('#gateway-table').DataTable({
			  'createdRow': function( row, data, dataIndex ) {
			      $(row).attr('data-id', userGateways[dataIndex]);
			  },
			});

		for (var i = 0; i < userGateways.length; i++) {
			let gatewayId = userGateways[i];
			navHtml += '<li class="nav-item" data-id="gateway-focus" data-gateway-id="' + gatewayId + '">Gateway ' + (i+1) + '</li>'
			
			dashboardTable.row.add([i + 1, names[i]]).draw();

			$("#software-download-form select").append("<option value='" + gatewayId + "'>Gateway " + (i+1) + "</option>")
		}

		$("#nav-gateway-select").html(navHtml);

	}

	function focusGateway(gatewayId){

			$("section#"+inView).fadeOut();

			let title =  userGateways.indexOf(gatewayId) + 1;
			setTimeout(function(){ $("section#gateway-focus").fadeIn();}, 400);
			$("section#gateway-focus h3#gateway-label").text("Gateway " + title + " Heartbeats");
		

			inView = "gateway-focus";
	   		gatewayInFocus = gatewayId;

			// $("section#gateway-focus h3#gateway-label").text("Gateway " + gatewayId);

			let timestampAjax = "https://team12.dev.softwareengineeringii.com/api/clientSide/" + gatewayId;
			// 

			let timeStampData = [];

			$.get( timestampAjax, function( data ) {
  				
  				for (var i = data.length - 1; i >= 0; i--) {
  					let date = new Date(0);
  					date.setUTCSeconds(data[i].TimeStamp)
  					date = date.toISOString();

  					let dataitem = {"timestamp" : date, "type" : "heartbeat"};
  					
  					timeStampData.push(dataitem);
  				}
  				
  				
			});

			console.log(timeStampData)



			$('.eventcontrol').EventControl({
		  		hammertime: true,
		  		onhover: function(item, element, event, inout) {
		    		if (inout == 'out') {
		      			$('.eventcontrol-target').html('');
		      			element.css('color', element.data('clr'));
		    		} 
		    		else {
		      			var x = ['<h2>', moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'), '</h2>'];
				    	$('.eventcontrol-target').html(x.join(''));
					    $('.eventcontrol-target').css('color', element.css('color'));
					    element.data('clr', element.css('color'));
					    element.css('color', '#9b59b6');
		    		}
		  		},
				onclick: function(item, element, event) {
				    alert(item.timestamp);
				  },
		  		data: timeStampData

		});

			// });
			if(gatewayFocusTable){
				gatewayFocusTable.destroy();
			}

			gatewayFocusTable = $('#gateway-focus-table').DataTable( {
    			ajax: {
        			url: timestampAjax,
        			dataSrc: function (json) {
		      					var return_data = new Array();
		      					for(var i=0;i< json.length; i++){

		      						if(json[i].TimeStamp){
		      							var timeEpoch = json[i].TimeStamp;
		      							var d = new Date(0);
		      							d.setUTCSeconds(timeEpoch);

		        						return_data.push({
						          			'TimeStamp' : d.toLocaleString(),
		        						})
		      						}
		      						
		      					}
		      					return return_data;
    						}
    			},
    			columns: [
			        { data: "TimeStamp" },
    			],
    			"order": [[0, 'desc']]
			} );

			setInterval( function () {
				console.log("reload");
    			gatewayFocusTable.ajax.reload( null, false ); // user paging is not reset on reload
			}, 30000 );

			if(onDemandTable){
				onDemandTable.destroy();
			}
			if(dailyDiagnosticTable){
				dailyDiagnosticTable.destroy();
			}
			loadFocusGatewayData(gatewayId);

	}

	function loadFocusGatewayData(gatewayId){


		//Load On Demand Diagnostics for Gateway id
		$.ajax({url: "https://team12.dev.softwareengineeringii.com/api/clientSide/onDemand/" + gatewayId, success: function(result){
     		let dataSet = [];
     		for(var i in result) {
     			let item = result[i];

     			//item["IsClear"] == true && 
  				if(item["Type"]){

  					let dataRow = [item["Type"], item["Result"]]
  					dataSet.push(dataRow);
  				
  				}
			}

			// console.log(dataSet);

			onDemandTable = $('#gateway-onDemand-table').DataTable( {
	        	data: dataSet,
	        	columns: [
	            	{ title: "Type" },
	            	{ title: "Result"}
	        	]
	    	} );



   	 	}});


		dailyDiagnosticTable = $("#gateway-dailyDiagnostic-table").DataTable( {
    			ajax: {
        			url:"https://team12.dev.softwareengineeringii.com/api/clientSide/dailyDiagnostic/" + gatewayId,
        			dataSrc: function (json) {
		      					var return_data = new Array();
		      					for(var i=0;i< json.length; i++){

		      						if(json[i].Result){
		      							return_data.push({
			      							Date: "11/4/2018",
			      							Time: "",
			      							Type: json[i].Type,
			      							Result: json[i].Result
		      							})
		      						}
		      						
		      						
		      					}
		      					return return_data;
    						}
    			},
    			columns: [
			        { data: "Date" },
			        { data: "Time"},
			        { data: "Type"},
			        { data: "Result"}
    			],
    			"order": [[1, 'desc']]
			} );
		
	}

	function createNewGateway(){


		let url = "https://team12.dev.softwareengineeringii.com/api/clientSide/createNewGateway"

	}



	$("div.nav li.nav-item").click(function(){

		let navValue = $(this).attr("data-id");

				
		if(navValue == "gateway-focus"){
			let gatewayId = $(this).attr("data-gateway-id");
			focusGateway(gatewayId);
		}

		else if(navValue != inView){
			$("section#"+inView).fadeOut();
			setTimeout(function(){ $("section#" + navValue).fadeIn();}, 400);
		}

		inView = navValue;
					
	});

	   		

	$("#gateway-table tbody tr").click(function (e) {
	   	let id = $(this).attr("data-id");

	   focusGateway(id);

	
	});

	$("#onDemandDiagnostic").submit(function(e){
		e.preventDefault();
		const diagnostic = $("#diagnosticSelect").val();
		const gatewayId = gatewayInFocus;

		$.post( "https://team12.dev.softwareengineeringii.com/api/clientSide", { ODD: diagnostic, GatewayId: gatewayId })
		  .done(function( data ) {
		    alert( "Diagnostic Request Sent!");

		});

	});

	$("#daily-diagnostic-form").submit(function(e){
		e.preventDefault();
		let formData = {};
		let diagnostic = $("#dailyDiagnosticSelect").val();

		let time = $("#diagnostic-time").val().split(":");

		let hour = time[0];
		let minute = time[1];

		formData["Type"] = diagnostic;
		formData["DDD"] = diagnostic;
		formData["GatewayId"] = gatewayInFocus;
		formData["dailyHour"] = hour;
		formData["dailyMin"] = minute;
		formData["dailySecond"] = "00";

		//console.log(formData);

		let url =  "https://team12.dev.softwareengineeringii.com/api/clientSide/dailyDiagnostic";

		$.ajax({
  			type: "POST",
  			url: url,
  			data: formData,
  			success: function(msg){
        		console.log(msg);
        		alert("Update Successful!");
  			},
  			error: function(XMLHttpRequest, textStatus, errorThrown) {
     			alert(errorThrown);
  			}
		});


	});


	

});	
