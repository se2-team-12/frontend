$(document).ready( function () {

	let inView = "dashboard-view";
	const dashboardTable = $('#gateway-table').DataTable();

	let gatewayInFocus;
	let gatewayFocusTable;

	$.ajax({url: "https://team12.softwareengineeringii.com/api/clientSide/onDemand/1234", success: function(result){
     		let dataSet = [];
     		for(var i in result) {
     			let item = result[i];

  				if(item["IsClear"] == true && item["Type"]){

  					let dataRow = [item["GatewayId"], item["Type"], item["Result"]]
  					dataSet.push(dataRow);
  				
  				}
			}

			console.log(dataSet);

			$('#gateway-onDemand-table').DataTable( {
	        	data: dataSet,
	        	columns: [
	            	{ title: "GatewayId" },
	            	{ title: "Type" },
	            	{ title: "Result"}
	        	]
	    	} );


   	 	}});

	$("div.nav li.nav-item").click(function(){

		let navValue = $(this).attr("data-id");

				
		if(navValue == "gateway-focus"){
			$("section#"+inView).fadeOut();
			setTimeout(function(){ $("section#" + navValue).fadeIn();}, 400);

			let gatewayId = $(this).attr("data-gateway-id");

			$("section#gateway-focus h3#gateway-label").text("Gateway " + gatewayId);

			let ajaxUrl = "https://team12.softwareengineeringii.com/api/clientSide/" + gatewayId;

			gatewayFocusTable = $('#gateway-focus-table').DataTable( {
    			ajax: {
        			url: ajaxUrl,
        			dataSrc: function (json) {
		      					var return_data = new Array();
		      					for(var i=0;i< json.length; i++){

		      						if(json[i].TimeStamp){
		      							var timeEpoch = json[i].TimeStamp;
		      							var d = new Date(0);
		      							d.setUTCSeconds(timeEpoch);

		        						return_data.push({
						          			'GatewayId': json[i].GatewayId,
						          			'TimeStamp' : d.toLocaleString(),
		        						})
		      						}
		      						
		      					}
		      					return return_data;
    						}
    			},
    			columns: [
			        { data: "GatewayId" },
			        { data: "TimeStamp" },
    			],
    			"order": [[1, 'desc']]
			} );

			gatewayInFocus = gatewayId;
		}

		else if(navValue != inView){
			$("section#"+inView).fadeOut();
			setTimeout(function(){ $("section#" + navValue).fadeIn();}, 400);
		}

		inView = navValue;
				
		
	});

	   		

	$("#gateway-table tbody tr").click(function (e) {
	   	let id = $(this).attr("data-id");

	   	$("section#"+inView).fadeOut();
		setTimeout(function(){ $("section#gateway-focus").fadeIn();}, 400);
		$("section#gateway-focus h3#gateway-label").text("Gateway " + id);
		inView = "gateway-focus";
	   	gatewayInFocus = id;

	   	let ajaxUrl = "https://team12.softwareengineeringii.com/api/clientSide/" + id;
	   	console.log(ajaxUrl);

		gatewayFocusTable = $('#gateway-focus-table').DataTable( {
    		ajax: {
        			url: ajaxUrl,
        			dataSrc: ''
    			},
    		columns: [
		        { data: "GatewayId" },
		        { data: "TimeStamp" },
		        { data: "status" },
			]
		} );
	})

	$("#onDemandDiagnostic").click(function(){
		const diagnostic = $("#diagnosticSelect").val();
		const gatewayId = gatewayInFocus;

		$.post( "https://team12.softwareengineeringii.com/api/clientSide", { ODD: diagnostic, GatewayId: gatewayId })
		  .done(function( data ) {
		    alert( "Data Loaded: " + data );

		});




	});
});	
