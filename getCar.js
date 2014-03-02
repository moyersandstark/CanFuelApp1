// This app was created by Darryl Moyers and Tyler Stark of Moyers & Stark Inc.
// The idea for this app came to us on: Friday, February 28 @ 9:30 PM
// The app was completed on: Sunday, March 2 @ 3:30 PM
//
// Hello Open Data World!
//
// Thank you!
//
// Moyers & Stark
//

var apiKey = "?api_key=1587818d7869e8b8261653e2a34e760685a12ad6bd8497f32e12f245513cd653";
var callback = "&callback=?";
var Vehicle1 = '';
var Vehicle2 = '';
var CityFuelConsumption_V1_int = '';
var CityFuelConsumption_V1_lbl = '';
var CityFuelConsumption_V2_int = '';
var CityFuelConsumption_V2_lbl = '';
var HighwayFuelConsumption_V1_int = '';
var HighwayFuelConsumption_V1_lbl = '';
var HighwayFuelConsumption_V2_int = '';
var HighwayFuelConsumption_V2_lbl = '';
var EstimatedFuelConsumption_V1_int = '';
var EstimatedFuelConsumption_V1_lbl = '';
var EstimatedFuelConsumption_V2_int = '';
var EstimatedFuelConsumption_V2_lbl = '';
var CO2Emissions_V1_int = '';
var CO2Emissions_V1_lbl = '';
var CO2Emissions_V2_int = '';
var CO2Emissions_V2_lbl = '';
var readyToCompare = false;

function getLoadPage(){
    //alert("Start of Page Load");
    
    if (/Android|AppleWebKit|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.getElementById('btnGooglePlay').hidden = true;
    } else {
        document.getElementById('btnGooglePlay').hidden = false;
    }
    
    ShowHideLabels("lblSearchResultsHeader","none");
    ShowHideLabels("lblCityFuelConsumption","none");
    ShowHideLabels("lblHighwayFuelConsumption","none");
    ShowHideLabels("lblEstimatedFuelConsumption","none");
    ShowHideLabels("lblCO2Emissions","none");
    
    ShowHideLabels("lblAverageHeader","none");
    ShowHideLabels("lblCityFuelConsumption_AVG","none");
    ShowHideLabels("lblHighwayFuelConsumption_AVG","none");
    ShowHideLabels("lblEstimatedFuelConsumption_AVG","none");
    ShowHideLabels("lblCO2Emissions_AVG","none");
    
    ShowHideLabels("lblRecallHeader","none");
    ShowHideLabels("lblRecallInformation","none");
    
    ShowHideLabels("lblSearchResultsHeader_VR","none");
    ShowHideLabels("lblCityFuelConsumption_VR","none");
    ShowHideLabels("lblHighwayFuelConsumption_VR","none");
    ShowHideLabels("lblEstimatedFuelConsumption_VR","none");
    ShowHideLabels("lblCO2Emissions_VR","none");
    
    document.getElementById('btnCompare').disabled = true;
		
    getYears("lbYears"); // This calls the getYears()" function to load the the years into control: lbYears
    getYears("lbYears_COM"); // This calls the getYears()" function to load the the years into control: lbYears_COM
    getYears("lbYears_VR"); // This calls the getYears()" function to load the the years into control: lbYears_VR
    getVehicleClasses_VR();
    RefreshListboxes();
    
}

function getYears(controlId) { // This function will use an API to create a list of years to populate lbYears
    
	var urlCall = 'http://namara.io/api/v0/data_sets/a6b02399-3205-4d7f-9329-68ed76f0347f?api_key=1587818d7869e8b8261653e2a34e760685a12ad6bd8497f32e12f245513cd653&order=%7B%22column%22:0,%22direction%22:1%7D&callback=?';
		
	var years = new Array();			
			
	jQuery(function() {
	  $.ajax(urlCall, {
		dataType: 'jsonp',
		success: function(result) {
			var resources = result.resources;
			var i = 0
			$.each(resources, function(x, y){
				var title = y.title;
				var id = y.id;
				var year = title.substring((title.length)-4);
				years[i]=year;
				AddItemToListbox(controlId, year, id);
				i++;
			});
		}
	  });
	});    
    
}

function getMakes(controlId, resourceId) { // This function will use an API to create a list of makes to populate lbMakes

    var url = 'http://namara.io/api/v0/resources/';
	var resourceType = '/data/aggregate';
	var aggregateClause = '&aggregate=%7B%22column%22:1,%22operation%22:%22distinct%22%7D';
    var urlCall = url+resourceId+resourceType+apiKey+aggregateClause+callback;
    	
    jQuery(function() {

      $.ajax(urlCall, {
        dataType: 'jsonp',
        success: function(result) {
            $.each(result[0], function(i, e){
                $.each(e, function(x, y){
                    var makes = y;
                    AddItemToListbox(controlId, makes, makes);
                });
            });
        }
      });
    });
    
}

function getModels(controlId, resourceId, selectedMake) { // This function will use an API to create a list of makes to populate lbModels
    
	var url = 'http://namara.io/api/v0/resources/';
	var resourceType = '/data/aggregate';
	var aggregateClause = '&aggregate=%7B%22column%22:2,%22operation%22:%22distinct%22%7D&where=[%7B%22column%22:1,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(selectedMake)+'%22%7D]';
    var urlCall = url+resourceId+resourceType+apiKey+aggregateClause+callback;
	
	console.log(urlCall);
	
	var modelsArray = new Array();
    var specificModelsArray = new Array();
    jQuery(function() {

      $.ajax(urlCall, {
        dataType: 'jsonp',
        success: function(result) {
            var ControlId = "lbModels";
            $.each(result[0], function(i, e){
				var count = 0;
                $.each(e, function(x, y){
					var model = $.trim(y);
					var url = 'http://namara.io/api/v0/resources/';
					var resourceType = '/data';
					var whereClause = '&where=[%7B%22column%22:1,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(selectedMake)+'%22%7D,%7B%22column%22:2,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(model)+'%22%7D]';
					var urlCall2 = url+resourceId+resourceType+apiKey+whereClause+callback;

					jQuery(function() {
						$.ajax(urlCall2, {
							dataType: 'jsonp',
							success: function(result2) {
								$.each(result2, function(a, b){
									var specificModel = b[2];
									var modelIndex = b[2]+'__'+b[4]+'__'+b[6]+'__'+b[7];
									specificModel += ' ('+b[4]+'L';
									
									if (b[7] == 'D'){
										specificModel += ' Diesel';
									}else if (b[7] == 'E'){
										specificModel += ' Ethanol';
									}else if (b[7] == 'N'){
										specificModel += ' Natural Gas';
									}
									
									if (b[6].indexOf("3") !== -1){
										specificModel += '; 3-speed';
									}else if (b[6].indexOf("4") !== -1){
										specificModel += '; 4-speed';
									}else if (b[6].indexOf("5") !== -1){
										specificModel += '; 5-speed';
									}else if (b[6].indexOf("6") !== -1){
										specificModel += '; 6-speed';
									}else if (b[6].indexOf("7") !== -1){
										specificModel += '; 7-speed';
									}else if (b[6].indexOf("8") !== -1){
										specificModel += '; 8-speed';
									}
									
									if (b[6].indexOf("AS") !== -1){
										specificModel += ' auto + select-shift';
									}else if (b[6].indexOf("AM") !== -1){
										specificModel += ' auto-manual';
									}else if (b[6].indexOf("AV") !== -1){
										specificModel += ' CVT';
									}else if (b[6].indexOf("M") !== -1){
										specificModel += ' manual';
									}else if (b[6].indexOf("A") !== -1){
										specificModel += ' auto';
									}
									
									specificModel += ')';
									specificModel = modelIndex+'++'+specificModel;
									specificModelsArray.push(specificModel);
								});
								count +=1;
								if (count == e.length){
									specificModelsArray.sort();
									$.each(specificModelsArray, function(m, n){
									var res = n.split("++");									
									AddItemToListbox(controlId, res[1], res[0]);
									});
								}
							}
						});
					});
					
                });
			});
		}
      });
    }); 
}

function getVehicleClasses_VR() { // This function will use an API to create a list of years to populate lbYears
    
	var url = "http://namara.io/api/v0/data_sets/";
	var dataSetId = "a6b02399-3205-4d7f-9329-68ed76f0347f";
	var urlCall = url + dataSetId + apiKey + callback;
		
	var controlId = "lbVehicleClasses_VR";
	var vehicleClassesArray = new Array();			
			
	jQuery(function() {
	  $.ajax(urlCall, {
		dataType: 'jsonp',
		success: function(result) {
			var resources = result.resources;
			var i = 0
			$.each(resources, function(x, y){
				var id = y.id;
				
				var urlCall2 = 'http://namara.io/api/v0/resources/'+id+'/data/aggregate?api_key=1587818d7869e8b8261653e2a34e760685a12ad6bd8497f32e12f245513cd653&aggregate=%7B%22column%22:3,%22operation%22:%22distinct%22%7D'
				//console.log(urlCall2);
				$.ajax(urlCall2, {
				dataType: 'jsonp',
				success: function(result2){
					$.each(result2[0], function(a, b){
						$.each(b, function(c, d){
							var vehicleClass = $.trim(d);
							if(vehicleClassesArray.indexOf(vehicleClass) == -1){
								vehicleClassesArray.push(vehicleClass);
								//console.log(vehicleClassesArray);
							}
						});
					});
					if (x == resources.length-1){
						vehicleClassesArray.sort();
						$.each(vehicleClassesArray, function(m, n){
							AddItemToListbox(controlId, n, n);
						});
					}
				}					
				});
			});			
		}
	  });
	});		    
}


function getSearchResults(resourceId, selectedMake, selectedModel) { // This function will use an API to create a list of makes to populate lbModels
        	
    var SearchResultsHeader = '';
    var SelectedVehicleClass = ''; 
    
    document.getElementById('lblSearchResultsHeader').innerHTML = '';
    document.getElementById('lblCityFuelConsumption').innerHTML = 'City Fuel Consumption (L/100K)';
    document.getElementById('lblHighwayFuelConsumption').innerHTML = 'Highway Fuel Consumption (L/100K)';
    document.getElementById('lblEstimatedFuelConsumption').innerHTML = 'Estimated Fuel Consumption Per Year (per 20,000 km)';
    document.getElementById('lblCO2Emissions').innerHTML = 'CO2 Emisssions';
    
    document.getElementById('lblAverageHeader').innerHTML = '';
    document.getElementById('lblCityFuelConsumption_AVG').innerHTML = '';
    document.getElementById('lblHighwayFuelConsumption_AVG').innerHTML = '';
    document.getElementById('lblEstimatedFuelConsumption_AVG').innerHTML = '';
    document.getElementById('lblCO2Emissions_AVG').innerHTML = '';
 
    var res = selectedModel.split("__");
	var model = res[0];
	var engine = res[1];
	var transmission = res[2];
	var fuel = res[3];
    
	var url = 'http://namara.io/api/v0/resources/';
	var resourceType = '/data';
	var whereClause = '&where=[%7B%22column%22:1,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(selectedMake)+'%22%7D,%7B%22column%22:2,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(model)+'%22%7D,%7B%22column%22:4,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(engine)+'%22%7D,%7B%22column%22:6,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(transmission)+'%22%7D,%7B%22column%22:7,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(fuel)+'%22%7D]';
    var urlCall = url+resourceId+resourceType+apiKey+whereClause+callback;
	    
    jQuery(function() {
      $.ajax(urlCall, {
        dataType: 'jsonp',
        success: function(result) {
            var ControlId = "lblSearchResults";
            $.each(result[0], function(i, e){
                var results = e;
                
                if(i == 0) {
                   SearchResultsHeader = results + ' ';
                                   
                } else if(i == 1) {
                    SearchResultsHeader += results + ' '
                    
                } else if(i == 2) {
                    SearchResultsHeader += results + ' '
                    
                } else if(i == 3) {
                    SearchResultsHeader += '(' + results + ')';
                    Vehicle1 = SearchResultsHeader;
                    SelectedVehicleClass = results;
                    $("#lblSearchResultsHeader").append(SearchResultsHeader);
                    
                } else if(i == 8) { // If CityFuelConsumption
                    var CityFuelConsumption = '<strong>'+results+' L</strong>';
                    CityFuelConsumption_V1_int = results;
                    CityFuelConsumption_V1_lbl = CityFuelConsumption;
                    $("#lblCityFuelConsumption").append(': ' + CityFuelConsumption);
                    
                    var resourceType = '/data/aggregate';
					var aggregateClause = '&aggregate=%7B%22column%22:9,%22operation%22:%22avg%22%7D&where=[%7B%22column%22:3,%22selector%22:%22eq%22,%22value%22:%22'+result[0][3]+'%22%7D]';
					var urlCall1 = url+resourceId+resourceType+apiKey+aggregateClause+callback;
					$.ajax(urlCall1, {
						dataType: 'jsonp',
						success: function(result1){
						//alert("Chosen vehicle's average city fuel consumption is "+CityFuelConsumption);
						var CityFuelConsumption_AVG = ("City Fuel Consumption (L/100K): "+Math.round(result1[0].result) + " L");
                        $("#lblCityFuelConsumption_AVG").append(CityFuelConsumption_AVG);
                            
						}
					});
                
                } else if(i == 9) { // If HighwayFuelConsumption
                    var HighwayFuelConsumption = '<strong>'+results+' L</strong>';
                    HighwayFuelConsumption_V1_int = results;
                    HighwayFuelConsumption_V1_lbl = HighwayFuelConsumption;
                    $("#lblHighwayFuelConsumption").append(': ' + HighwayFuelConsumption);
                    
                    var resourceType = '/data/aggregate';
					var aggregateClause = '&aggregate=%7B%22column%22:9,%22operation%22:%22avg%22%7D&where=[%7B%22column%22:3,%22selector%22:%22eq%22,%22value%22:%22'+result[0][3]+'%22%7D]';
					var urlCall1 = url+resourceId+resourceType+apiKey+aggregateClause+callback;
					$.ajax(urlCall1, {
						dataType: 'jsonp',
						success: function(result1){
						//console.log("Chosen vehicle's average highway fuel consumption is "+HighwayFuelConsumption);
						var HighwayFuelConsumption_AVG = ("Highway Fuel Consumption (L/100K): "+Math.round(result1[0].result) + " L");
                        $("#lblHighwayFuelConsumption_AVG").append(HighwayFuelConsumption_AVG);
                            
						}
					});
                    
                } else if(i == 10) { // If EstimatedFuelConsumption
                    var EstimatedFuelConsumption = '<strong>'+results+' L</strong>';
                    EstimatedFuelConsumption_V1_int = results;
                    EstimatedFuelConsumption_V1_lbl = EstimatedFuelConsumption;
                    $("#lblEstimatedFuelConsumption").append(': ' + EstimatedFuelConsumption);
                    
                    var resourceType = '/data/aggregate';
					var aggregateClause = '&aggregate=%7B%22column%22:10,%22operation%22:%22avg%22%7D&where=[%7B%22column%22:3,%22selector%22:%22eq%22,%22value%22:%22'+result[0][3]+'%22%7D]';
					var urlCall1 = url+resourceId+resourceType+apiKey+aggregateClause+callback;
					$.ajax(urlCall1, {
						dataType: 'jsonp',
						success: function(result1){
						//console.log("Chosen vehicle's estimated annual fuel consumption is "+EstimatedFuelConsumption);
						var EstimatedFuelConsumption_AVG = ("Estimated Fuel Consumption Per Year (per 20,000 km): "+Math.round(result1[0].result) + " L");
                        $("#lblEstimatedFuelConsumption_AVG").append(EstimatedFuelConsumption_AVG);
                            
						}
					});
                
                } else if(i == 11) { // If CO2Emissions
                    var CO2Emissions = '<strong>'+results+' kg</strong>';
                    CO2Emissions_V1_int = results;
                    CO2Emissions_V1_lbl = CO2Emissions;
                    $("#lblCO2Emissions").append(': ' + CO2Emissions);
                    
                    var resourceType = '/data/aggregate';
					var aggregateClause = '&aggregate=%7B%22column%22:10,%22operation%22:%22avg%22%7D&where=[%7B%22column%22:3,%22selector%22:%22eq%22,%22value%22:%22'+result[0][3]+'%22%7D]';
					var urlCall1 = url+resourceId+resourceType+apiKey+aggregateClause+callback;
					$.ajax(urlCall1, {
						dataType: 'jsonp',
						success: function(result1){
						//console.log("Chosen vehicle's estimated CO2 emissions (kg/year) are "+CO2Emissions);
						var CO2Emissions_AVG = ("CO2 Emisssions: "+Math.round(result1[0].result) + " kg");
                        $("#lblCO2Emissions_AVG").append(CO2Emissions_AVG);
                            
						}
					});
                    
                }
                
            });
            
            $("#lblAverageHeader").append("Averages for Vehicle in this Class: ");
            
            ShowHideLabels("lblSearchResultsHeader","block");
            ShowHideLabels("lblCityFuelConsumption","block");
            ShowHideLabels("lblHighwayFuelConsumption","block");
            ShowHideLabels("lblEstimatedFuelConsumption","block");
            ShowHideLabels("lblCO2Emissions","block");
            ShowHideLabels("lblAverageHeader","block");
            ShowHideLabels("lblCityFuelConsumption_AVG","block");
            ShowHideLabels("lblHighwayFuelConsumption_AVG","block");
            ShowHideLabels("lblEstimatedFuelConsumption_AVG","block");
            ShowHideLabels("lblCO2Emissions_AVG","block");
            ShowHideLabels("lblRecallHeader","block");
            ShowHideLabels("lblRecallInformation","block");
            
        }
      });
    });
    
}

function ShowHideLabels(controlId, visible) {
    
    document.getElementById(controlId).style.display = visible;
    
}

function getSearchResults_COM(resourceId, selectedMake, selectedModel) { // This function will use an API to create a list of makes to populate lbModels
        	
    var SearchResultsHeader_COM = '';
    
    var res = selectedModel.split("__");
	var model = res[0];
	var engine = res[1];
	var transmission = res[2];
	var fuel = res[3];
    
	var url = 'http://namara.io/api/v0/resources/';
	var resourceType = '/data';
	var whereClause = '&where=[%7B%22column%22:1,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(selectedMake)+'%22%7D,%7B%22column%22:2,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(model)+'%22%7D,%7B%22column%22:4,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(engine)+'%22%7D,%7B%22column%22:6,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(transmission)+'%22%7D,%7B%22column%22:7,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(fuel)+'%22%7D]';
    var urlCall = url+resourceId+resourceType+apiKey+whereClause+callback;
	    
    jQuery(function() {
      $.ajax(urlCall, {
        dataType: 'jsonp',
        success: function(result) {
            //var ControlId = "lblSearchResults";
            $.each(result[0], function(i, e){
                var results = e;
                
                if(i == 0) {
                   SearchResultsHeader_COM = results + ' ';
                                   
                } else if(i == 1) {
                    SearchResultsHeader_COM += results + ' '
                    
                } else if(i == 2) {
                    SearchResultsHeader_COM += results + ' '
                    
                } else if(i == 3) {
                    SearchResultsHeader_COM += '(' + results + ')';
                    Vehicle2 = SearchResultsHeader_COM;
                    //$("#lblSearchResultsHeader").append(SearchResultsHeader);
                    
                } else if(i == 8) { // If CityFuelConsumption
                    var CityFuelConsumption = '<strong>'+results+' L</strong>';
                    CityFuelConsumption_V2_int = results;
                    CityFuelConsumption_V2_lbl = CityFuelConsumption;
                    //$("#lblCityFuelConsumption").append(CityFuelConsumption);
                
                } else if(i == 9) { // If HighwayFuelConsumption
                    var HighwayFuelConsumption = '<strong>'+results+' L</strong>';
                    HighwayFuelConsumption_V2_int = results;
                    HighwayFuelConsumption_V2_lbl = HighwayFuelConsumption;
                    //$("#lblHighwayFuelConsumption").append(HighwayFuelConsumption);
                    
                } else if(i == 10) { // If EstimatedFuelConsumption
                    var EstimatedFuelConsumption = '<strong>'+results+' L</strong>';
                    EstimatedFuelConsumption_V2_int = results;
                    EstimatedFuelConsumption_V2_lbl = EstimatedFuelConsumption
                    //$("#lblEstimatedFuelConsumption").append(EstimatedFuelConsumption);
                
                } else if(i == 11) { // If CO2Emissions
                    var CO2Emissions = '<strong>'+results+' kg</strong>';
                    CO2Emissions_V2_int = results;
                    CO2Emissions_V2_lbl = CO2Emissions;
                    //$("#lblCO2Emissions").append(CO2Emissions);
                    
                    
                } else {
                    //$("#lblSearchResults").append(results);
                    //$("#lblSearchResults").append("<br>");
                }
                
                
            });
            
        }
      });
    });
    
}


function RefreshListboxes(SenderId) {
    //alert(SenderId);
    // ****************************************************************************************
    // ****************************************************************************************
    // THIS FUNCTION IS CALLED DURING THE "ON CHANGE" EVENT FOR THE YEARS, MAKES AND MODELS ***
    // IT DETERMINES WHICH LISTBOXES ARE ENABLED (AND DISABLED) AND IF ALL THREE LISTBOXES  ***
    // ARE NOT (SELECT), THEN EXECUTE A SEARCH BASED UPON THE USER'S SEARCH CRITERIA **********
    // ****************************************************************************************
    // ****************************************************************************************
        
    var e_Years = document.getElementById("lbYears"); // Finds control lbYears
    var selectedYear = e_Years.options[e_Years.selectedIndex].value; // Sets selected value to variable SelectedYear
    
	var e_lbMakes = document.getElementById("lbMakes"); // Finds control lbMakes
    var selectedMake = e_lbMakes.options[e_lbMakes.selectedIndex].value; // Sets selected value to variable SelectedMake
    
    var e_lbModels = document.getElementById("lbModels"); // Finds control lbModels
    var selectedModel = e_lbModels.options[e_lbModels.selectedIndex].value; // Sets selected value to variable SelectedModels
    
    var e_Years_COM = document.getElementById("lbYears_COM"); // Finds control lbYears
    var selectedYear_COM = e_Years_COM.options[e_Years_COM.selectedIndex].value; // Sets selected value to variable SelectedYear
    
	var e_lbMakes_COM = document.getElementById("lbMakes_COM"); // Finds control lbMakes
    var selectedMake_COM = e_lbMakes_COM.options[e_lbMakes_COM.selectedIndex].value; // Sets selected value to variable SelectedMake
    
    var e_lbModels_COM = document.getElementById("lbModels_COM"); // Finds control lbModels
    var selectedModel_COM = e_lbModels_COM.options[e_lbModels_COM.selectedIndex].value; // Sets selected value to variable SelectedModels
    
    var btnCompare = document.getElementById("btnCompare"); // Finds control lbModels
    
    var e_lbVehicleClasses_VR = document.getElementById("lbVehicleClasses_VR"); // Finds control lbModels
    var selectedVehicleClass_VR = e_lbVehicleClasses_VR.options[e_lbVehicleClasses_VR.selectedIndex].value; // Sets selected value to variable SelectedVehicleClass
    
    var e_lbYears_VR = document.getElementById("lbYears_VR"); // Finds control lbModels
    var selectedYear_VR = e_lbYears_VR.options[e_lbYears_VR.selectedIndex].value; // Sets selected value to variable SelectedYear_VR    
    
    if(SenderId == "lbYears") { // If the user's selected change is on lbYears
        ClearAllItemsInListbox("lbMakes"); // Clear all list items in lbMakes
        ClearAllItemsInListbox("lbModels"); // Clear all list items in lbModels
                
        if(selectedYear != "(Select)") { // If lbYears selected value IS NOT (Select)
            e_lbMakes.disabled = false; // Enable lbMakes
            
            readyToCompare = false;
            
            ShowHideLabels("lblSearchResultsHeader","none");
            ShowHideLabels("lblCityFuelConsumption","none");
            ShowHideLabels("lblHighwayFuelConsumption","none");
            ShowHideLabels("lblEstimatedFuelConsumption","none");
            ShowHideLabels("lblCO2Emissions","none");
            ShowHideLabels("lblAverageHeader","none");
            ShowHideLabels("lblCityFuelConsumption_AVG","none");
            ShowHideLabels("lblHighwayFuelConsumption_AVG","none");
            ShowHideLabels("lblEstimatedFuelConsumption_AVG","none");
            ShowHideLabels("lblCO2Emissions_AVG","none");
            ShowHideLabels("lblRecallHeader","none");
            ShowHideLabels("lblRecallInformation","none");
            
            getMakes("lbMakes", selectedYear); // This calls the "getManufacturers" function to load the make's list items
            
        } else {
            e_lbMakes.disabled = true;
            e_lbModels.disabled = true;
            e_lbMakes.selectedIndex = 0;
            e_lbModels.selectedIndex = 0;
            
            readyToCompare = false;
            
            ShowHideLabels("lblSearchResultsHeader","none");
            ShowHideLabels("lblCityFuelConsumption","none");
            ShowHideLabels("lblHighwayFuelConsumption","none");
            ShowHideLabels("lblEstimatedFuelConsumption","none");
            ShowHideLabels("lblCO2Emissions","none");
            ShowHideLabels("lblAverageHeader","none");
            ShowHideLabels("lblCityFuelConsumption_AVG","none");
            ShowHideLabels("lblHighwayFuelConsumption_AVG","none");
            ShowHideLabels("lblEstimatedFuelConsumption_AVG","none");
            ShowHideLabels("lblCO2Emissions_AVG","none");
            ShowHideLabels("lblRecallHeader","none");
            ShowHideLabels("lblRecallInformation","none");
            
        }
        
    } else if(SenderId == "lbMakes") {
        ClearAllItemsInListbox_2("lbModels"); // Clear all list items in lbModels
        
        if(selectedMake != "(Select)") { // If lbMakes selected value IS NOT (Select)  
            e_lbModels.disabled = false; // Enable lbModels
            
            readyToCompare = false;
            
            ShowHideLabels("lblSearchResultsHeader","none");
            ShowHideLabels("lblCityFuelConsumption","none");
            ShowHideLabels("lblHighwayFuelConsumption","none");
            ShowHideLabels("lblEstimatedFuelConsumption","none");
            ShowHideLabels("lblCO2Emissions","none");
            ShowHideLabels("lblAverageHeader","none");
            ShowHideLabels("lblCityFuelConsumption_AVG","none");
            ShowHideLabels("lblHighwayFuelConsumption_AVG","none");
            ShowHideLabels("lblEstimatedFuelConsumption_AVG","none");
            ShowHideLabels("lblCO2Emissions_AVG","none");
            ShowHideLabels("lblRecallHeader","none");
            ShowHideLabels("lblRecallInformation","none");
            
            getModels("lbModels", selectedYear, selectedMake); // Populate lbModles based upon user's selected value of lbMakes
            
        } else {
            e_lbModels.disabled = true;
            e_lbModels.selectedIndex = 0;
            
            readyToCompare = false;
            
            ShowHideLabels("lblSearchResultsHeader","none");
            ShowHideLabels("lblCityFuelConsumption","none");
            ShowHideLabels("lblHighwayFuelConsumption","none");
            ShowHideLabels("lblEstimatedFuelConsumption","none");
            ShowHideLabels("lblCO2Emissions","none");
            ShowHideLabels("lblAverageHeader","none");
            ShowHideLabels("lblCityFuelConsumption_AVG","none");
            ShowHideLabels("lblHighwayFuelConsumption_AVG","none");
            ShowHideLabels("lblEstimatedFuelConsumption_AVG","none");
            ShowHideLabels("lblCO2Emissions_AVG","none");
            ShowHideLabels("lblRecallHeader","none");
            ShowHideLabels("lblRecallInformation","none");
            
        }
        
    } else if(SenderId == "lbModels") {
        
        if(selectedModel != "(Select)") {
            readyToCompare = true;
            
            getSearchResults(selectedYear, selectedMake, selectedModel);
            getRecallResults(selectedYear, selectedMake, selectedModel);
        }
        
    } else if(SenderId == "lbVehicleClasses_VR") {
        
        ClearAllItemsInListbox_VR("lbYears_VR");
        getYears("lbYears_VR"); // This calls the getYears()" function to load the the years into control: lbYears_VR
        
        ShowHideLabels("lblSearchResultsHeader_VR","none");
        ShowHideLabels("lblCityFuelConsumption_VR","none");
        ShowHideLabels("lblHighwayFuelConsumption_VR","none");
        ShowHideLabels("lblEstimatedFuelConsumption_VR","none");
        ShowHideLabels("lblCO2Emissions_VR","none");
        
    } else if(SenderId == "lbYears_VR") {
                
        if(selectedYear_VR != "(Select)") {
            var resourceId = selectedYear_VR;
            var selectedClass = selectedVehicleClass_VR;
            getVehicleRankings(resourceId,selectedClass);
        }
        
    } else if(SenderId == "lbYears_COM") {
        ClearAllItemsInListbox_COM("lbMakes_COM"); // Clear all list items in lbMakes
        ClearAllItemsInListbox_2_COM("lbModels_COM"); // Clear all list items in lbModels
        
        if(selectedYear_COM != "(Select)") { // If lbYears selected value IS NOT (Select)
            e_lbMakes_COM.disabled = false; // Enable lbMakes
            getMakes("lbMakes_COM", selectedYear_COM); // This calls the "getManufacturers" function to load the make's list items
            
        } else {
            e_lbMakes_COM.disabled = true;
            e_lbModels_COM.disabled = true;
            e_lbMakes_COM.selectedIndex = 0;
            e_lbModels_COM.selectedIndex = 0;
            btnCompare.disabled = true;
            
        }
        
    } else if(SenderId == "lbMakes_COM") {
        ClearAllItemsInListbox_2_COM("lbModels_COM"); // Clear all list items in lbModels
        
        if(selectedMake_COM != "(Select)") { // If lbMakes selected value IS NOT (Select)  
            e_lbModels_COM.disabled = false; // Enable lbModels
            getModels("lbModels_COM", selectedYear_COM, selectedMake_COM); // Populate lbModles based upon user's selected value of lbMakes
            
        } else {
            e_lbModels_COM.disabled = true;
            e_lbModels_COM.selectedIndex = 0;
            btnCompare.disabled = true;
            
        }
        
    } else if(SenderId == "lbModels_COM") {
        
        if(selectedModel_COM != "(Select)") {
            
            if(readyToCompare == true) {
                btnCompare.disabled = false;
            }
            
            getSearchResults_COM(selectedYear_COM, selectedMake_COM, selectedModel_COM);
            
        } else {
            btnCompare.disabled = true;
            
        }
        
    }
    
}

function AddItemToListbox(ControlId, Text,Value) {
    
    var opt = document.createElement("option"); // Create an object
    document.getElementById(ControlId).options.add(opt); // Find the object using variable "ControlId"
    opt.value = Value; // Set the object's value
    opt.text = Text; // Set the object's text value

}

function ClearAllItemsInListbox(controlId) {
        
 $(function (controlId) {
        $('#lbMakes').empty();
        $('#lbModels').empty();
     
    });   
    
    var list = document.getElementById(controlId);
    
    var oSelField = document.getElementById("controlId");
	var oOption = document.createElement("OPTION");
    list.options.add(oOption);
	oOption.text = "(Select)"
	oOption.value = "(Select)";

}

function ClearAllItemsInListbox_2(ControlId) {

 $(function () {
        $('#lbModels').empty();
     
    });   
    
    var list = document.getElementById(ControlId);
    
    var oSelField = document.getElementById("ControlId");
	var oOption = document.createElement("OPTION");
    list.options.add(oOption);
	oOption.text = "(Select)"
	oOption.value = "(Select)";

}

function ClearAllItemsInListbox_COM(controlId) {
        
 $(function (controlId) {
        $('#lbMakes_COM').empty();
        $('#lbModels_COM').empty();
     
    });   
    
    var list = document.getElementById(controlId);
    
    var oSelField = document.getElementById("controlId");
	var oOption = document.createElement("OPTION");
    list.options.add(oOption);
	oOption.text = "(Select)"
	oOption.value = "(Select)";

}

function ClearAllItemsInListbox_2_COM(ControlId) {

 $(function () {
        $('#lbModels_COM').empty();
     
    });   
    
    var list = document.getElementById(ControlId);
    
    var oSelField = document.getElementById("ControlId");
	var oOption = document.createElement("OPTION");
    list.options.add(oOption);
	oOption.text = "(Select)"
	oOption.value = "(Select)";

}

function ClearAllItemsInListbox_VR(controlId) {
        
 $(function (controlId) {
        $('#lbYears_VR').empty();
     
    });   
    
    var list = document.getElementById(controlId);
    
    var oSelField = document.getElementById("controlId");
	var oOption = document.createElement("OPTION");
    list.options.add(oOption);
	oOption.text = "(Select)"
	oOption.value = "(Select)";

}

/*
This function has 2 required and 3 optional parameters:
* REQUIRED resourceId = the json resourceId from the Namara API that correlates to one year's data set. This is the year we'll be comparing.
* REQUIRED selectedClass = the class of vehicles that the user wants to see rankings for.
* OPTIONAL criteria = a 3-letter string defining which criteria we want to rank by:
	'cty' = City Fuel Economy
	'hwy' = Highway Fuel Economy
	'ova' = Overall Fuel Economy (based on 60/40 city/highway driving)
	'co2' = Amount of CO2 Emissions produced
	**DEFAULT = 'ova'**
* OPTIONAL quantity = an integer limiting how many records to return.
	**DEFAULT = 5**
* OPTIONAL rank = a 1 or -1 that indicates whether to sort the criteria in ascending or descending order. 
	NOTE: -1 (descending) is worst to first because lower values are desirable when it comes to fuel economy
	**DEFAULT = 1**
*/
function getVehicleRankings(resourceId, selectedClass, criteria, quantity, rank) { 
        
    var VechileRankingString = '';
    document.getElementById('lblSearchResultsHeader_VR').innerHTML = '';
    document.getElementById('lblCityFuelConsumption_VR').innerHTML = 'City Fuel Consumption (L/100K)';
    document.getElementById('lblHighwayFuelConsumption_VR').innerHTML = 'Highway Fuel Consumption (L/100K)';
    document.getElementById('lblEstimatedFuelConsumption_VR').innerHTML = 'Estimated Fuel Consumption Per Year (per 20,000 km)';
    document.getElementById('lblCO2Emissions_VR').innerHTML = 'CO2 Emisssions';
	
    //resourceId="de19440d-5bfe-4cf6-96eb-751576b4ad84";
    //selectedClass="COMPACT";
    //quantity = 1;
    
	criteria = typeof criteria !== 'undefined' ? criteria : 'ova';
	quantity = typeof quantity !== 'undefined' ? quantity : 5;
	rank = typeof rank !== 'undefined' ? rank : 1;
	    	
	var url = 'http://namara.io/api/v0/resources/';
	var resourceType = '/data';
	
	var whereClause = '&where=[%7B%22column%22:3,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(selectedClass)+'%22%7D]';
	var orderBy = '';
	if(criteria == 'cty'){
		orderBy = '&order=%7B%22column%22:8,%22direction%22:'+rank+'%7D';
	}else if (criteria == 'hwy'){
		orderBy = '&order=%7B%22column%22:9,%22direction%22:'+rank+'%7D';
	}else if (criteria == 'ova'){
		orderBy = '&order=%7B%22column%22:10,%22direction%22:'+rank+'%7D';
	}else if (criteria == 'co2'){
		orderBy = '&order=%7B%22column%22:11,%22direction%22:'+rank+'%7D';
	}
	if (quantity > 0){
		limit = '&limit='+quantity;
	}
    //var whereClause = '&where=[%7B%22column%22:1,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(selectedMake)+'%22%7D,%7B%22column%22:2,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(selectedModel)+'%22%7D]';
    var urlCall = url+resourceId+resourceType+apiKey+whereClause+orderBy+limit+callback;
    
    jQuery(function() {
      $.ajax(urlCall, {
        dataType: 'jsonp',
        success: function(result) {
            $.each(result[0], function(i, e){
                var results = e;
                
                if(i == 0) {
                   VechileRankingString = results + ' ';
                                   
                } else if(i == 1) {
                    VechileRankingString += results + ' '
                    
                } else if(i == 2) {
                    VechileRankingString += results + ' '
                    
                } else if(i == 3) {
                    VechileRankingString += '(' + results + ')'
                    $("#lblSearchResultsHeader_VR").append(VechileRankingString);
                    
                } else if(i == 8) { // If CityFuelConsumption
                    var CityFuelConsumption = ': <strong>'+results+' L</strong>';
                    $("#lblCityFuelConsumption_VR").append(CityFuelConsumption);
                
                } else if(i == 9) { // If HighwayFuelConsumption
                    var HighwayFuelConsumption = ': <strong>'+results+' L</strong>';
                    $("#lblHighwayFuelConsumption_VR").append(HighwayFuelConsumption);
                    
                } else if(i == 10) { // If EstimatedFuelConsumption
                    var EstimatedFuelConsumption = ': <strong>'+results+' L</strong>';
                    $("#lblEstimatedFuelConsumption_VR").append(EstimatedFuelConsumption);
                
                } else if(i == 11) { // If CO2Emissions
                    var CO2Emissions = ': <strong>'+results+' kg</strong>';
                    $("#lblCO2Emissions_VR").append(CO2Emissions);
                    
                }
                
            });
            
            ShowHideLabels("lblSearchResultsHeader_VR","block");
            ShowHideLabels("lblCityFuelConsumption_VR","block");
            ShowHideLabels("lblHighwayFuelConsumption_VR","block");
            ShowHideLabels("lblEstimatedFuelConsumption_VR","block");
            ShowHideLabels("lblCO2Emissions_VR","block");
            
        }
      });
    });
    
}

function ShowComparison() {
    
    document.getElementById('lblVehicle1').innerHTML = Vehicle1;
    document.getElementById('lblVehicle2').innerHTML = Vehicle2;
    document.getElementById('lblCityFuelConsumption_V1').innerHTML = CityFuelConsumption_V1_lbl;
    document.getElementById('lblCityFuelConsumption_V2').innerHTML = CityFuelConsumption_V2_lbl;
    document.getElementById('lblHighwayFuelConsumption_V1').innerHTML = HighwayFuelConsumption_V1_lbl;
    document.getElementById('lblHighwayFuelConsumption_V2').innerHTML = HighwayFuelConsumption_V2_lbl;
    document.getElementById('lblEstimatedFuelConsumption_V1').innerHTML = EstimatedFuelConsumption_V1_lbl;
    document.getElementById('lblEstimatedFuelConsumption_V2').innerHTML = EstimatedFuelConsumption_V2_lbl;
    document.getElementById('lblCO2Emissions_V1').innerHTML = CO2Emissions_V1_lbl;
    document.getElementById('lblCO2Emissions_V2').innerHTML = CO2Emissions_V2_lbl;
        
    if (CityFuelConsumption_V1_int < CityFuelConsumption_V2_int) {
        //alert("V1 is better");
        document.getElementById('lblCityFuelConsumption_V1').setAttribute("class", "label-success");
        document.getElementById('lblCityFuelConsumption_V2').setAttribute("class", "label-primary");
        
    } else {
        //alert("V2 is better");
        document.getElementById('lblCityFuelConsumption_V1').setAttribute("class", "label-primary");
        document.getElementById('lblCityFuelConsumption_V2').setAttribute("class", "label-success");
    }
    
    if (HighwayFuelConsumption_V1_int < HighwayFuelConsumption_V2_int) {
        //alert("V1 is better");
        document.getElementById('lblHighwayFuelConsumption_V1').setAttribute("class", "label-success");
        document.getElementById('lblHighwayFuelConsumption_V2').setAttribute("class", "label-primary");
        
    } else {
        //alert("V2 is better");
        document.getElementById('lblHighwayFuelConsumption_V1').setAttribute("class", "label-primary");
        document.getElementById('lblHighwayFuelConsumption_V2').setAttribute("class", "label-success");
    }
    
    if (EstimatedFuelConsumption_V1_int < EstimatedFuelConsumption_V2_int) {
        //alert("V1 is better");
        document.getElementById('lblEstimatedFuelConsumption_V1').setAttribute("class", "label-success");
        document.getElementById('lblEstimatedFuelConsumption_V2').setAttribute("class", "label-primary");
        
    } else {
        //alert("V2 is better");
        document.getElementById('lblEstimatedFuelConsumption_V1').setAttribute("class", "label-primary");
        document.getElementById('lblEstimatedFuelConsumption_V2').setAttribute("class", "label-success");
    }
    
    if (CO2Emissions_V1_int < CO2Emissions_V2_int) {
        //alert("V1 is better");
        document.getElementById('lblCO2Emissions_V1').setAttribute("class", "label-success");
        document.getElementById('lblCO2Emissions_V2').setAttribute("class", "label-primary");
        
    } else {
        //alert("V2 is better");
        document.getElementById('lblCO2Emissions_V1').setAttribute("class", "label-primary");
        document.getElementById('lblCO2Emissions_V2').setAttribute("class", "label-success");
    }
    
}

function getRecallResults(selectedYear, selectedMake, selectedModel){
	
	var url = 'http://namara.io/api/v0/resources/';
	var resourceId = 'ca8b833a-f9a9-4c26-990b-e34695cfae5a';
	var resourceType = '/data';
	
	var res = selectedModel.split("__");
	var model = res[0];
	
	if (model.indexOf("AWD") !== -1){
		arr = model.split(" AWD");
		model = arr[0];
	}else if (model.indexOf("4WD") !== -1){
		arr = model.split(" 4WD");
		model = arr[0];
	}else if (model.indexOf("4X4") !== -1){
		arr = model.split(" 4X4");
		model = arr[0];
	}else if (model.indexOf("FFV") !== -1){
		arr = model.split(" FFV");
		model = arr[0];
	}
	
	var selectedMake = typeof selectedMake !== 'undefined' ? selectedMake : 'HONDA';
	var selectedYear = typeof selectedYear !== 'undefined' ? selectedYear : '2010';

	
	var whereClause = '&where=[%7B%22column%22:1,%22selector%22:%22eq%22,%22value%22:2007%7D,%7B%22column%22:5,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(model)+'%22%7D,%7B%22column%22:4,%22selector%22:%22eq%22,%22value%22:%22'+encodeURIComponent(selectedMake)+'%22%7D,%7B%22column%22:8,%22selector%22:%22ne%22,%22value%22:%22Compliance%20Mfr%22%7D,%7B%22column%22:8,%22selector%22:%22ne%22,%22value%22:%22Compliance%20TC%22%7D]';
    var urlCall = url+resourceId+resourceType+apiKey+whereClause+callback;
	var recallDataArray = new Array();

	console.log(urlCall);
	
	jQuery(function() {

      $.ajax(urlCall, {
        dataType: 'jsonp',
        success: function(result) {
			//var controlId = "lbMakes";
            /*$.each(result[0], function(i, e){
				$.each(e, function(a, b){
					var make = $.trim(b);
					if(makesArray.indexOf(make) == -1){
						makesArray.push(make);
						AddItemToListbox(controlId, make, make);
					}
				});
            });*/
			$.each(result,function(i,e){
				var recallData = '<tr><td><h5>Number of vehicles affected: </h5>'+e[6]+'<br><h5>Comments on recall: </h5>'+e[9]+'<br><h5>More Information: </h5><a href="http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/detail.aspx?lang=eng&&rn='+e[0]+'">Link to Government Recall Details</a></td></tr>';   
				if(recallDataArray.indexOf(recallData) == -1){
					recallDataArray.push(recallData);
				}
				if (i == result.length-1){
					var recallInformation = '<table>'; 
					$.each(recallDataArray,function(a,b){
						recallInformation+=b;
					});
					recallInformation += '</table>';
					//console.log(recallInformation);
                    document.getElementById('lblRecallInformation').innerHTML = '';
                    document.getElementById('lblRecallInformation').innerHTML = recallInformation;
				}
			});
            
            if (result.length == 0) {
                document.getElementById('lblRecallInformation').innerHTML = '';
                document.getElementById('lblRecallInformation').innerHTML = 'No recalls found for this vehicle';
            }
		}
      });
    });
}