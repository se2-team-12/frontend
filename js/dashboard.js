$(document).ready( function () {

	const userGateways = ["5bde6bf82c7ac54bbdf5bb85", "5bde7e392c7ac54bbdf5bbaa"];
	const names = ["test", "Batool"];
	let inView = "dashboard-view";
	

	let gatewayInFocus;


	let gatewayFocusTable;
	let onDemandTable;
	let dailyDiagnosticTable;
	
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

			// let ajaxUrl = "https://team12.dev.softwareengineeringii.com/api/clientSide/" + gatewayId;

			// gatewayFocusTable = $('#gateway-focus-table').DataTable( {
   //  			ajax: {
   //      			url: ajaxUrl,
   //      			dataSrc: function (json) {
		 //      					var return_data = new Array();
		 //      					for(var i=0;i< json.length; i++){

		 //      						if(json[i].TimeStamp){
		 //      							var timeEpoch = json[i].TimeStamp;
		 //      							var d = new Date(0);
		 //      							d.setUTCSeconds(timeEpoch);

		 //        						return_data.push({
			// 			          			'GatewayId': json[i].GatewayId,
			// 			          			'TimeStamp' : d.toLocaleString(),
		 //        						})
		 //      						}
		      						
		 //      					}
		 //      					return return_data;
   //  						}
   //  			},
   //  			columns: [
			//         { data: "GatewayId" },
			//         { data: "TimeStamp" },
   //  			],
   //  			"order": [[1, 'desc']]
			// } );

			loadFocusGatewayData(gatewayId);

	}

	function loadFocusGatewayData(gatewayId){


		//Load On Demand Diagnostics for Gateway id
		if(!onDemandTable){


		$.ajax({url: "https://team12.dev.softwareengineeringii.com/api/clientSide/onDemand/" + gatewayId, success: function(result){
     		let dataSet = [];
     		for(var i in result) {
     			let item = result[i];

  				if(item["IsClear"] == true && item["Type"]){

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

		}

		if(!dailyDiagnosticTable){
			dailyDiagnosticTable = $("#gateway-dailyDiagnostic-table").DataTable();
		}
	}

	function createNewGateway(){


		let url = "https://team12.dev.softwareengineeringii.com/api/clientSide/createNewGateway"

	}



	initGatewaysDashboard();



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
		  oncreate: function(item, element) {
		    if (item.type == 'error') {
		      element.css('color', '#e74c3c');
		    } else if (item.type == 'warning') {
		      element.css('color', '#e67e22');
		    } else {
		      element.css('color', '#1abc9c');
		    }
		  },
		  onclick: function(item, element, event) {
		    alert(item.timestamp);
		  },
  data: [
    {
    "timestamp": "2016-03-02T10:57:03+01:00",
    "type": "warning",
    },
    {
    "timestamp": "2016-03-02T11:10:39+01:00",
      "type": "",
    },
    {
    "timestamp": "2016-03-02T12:56:32+01:00",
    "type": "",
    }

    ]

	});

});	
