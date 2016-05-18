$(document).ready(function () {
      
      //This function creates an array of 'n' 0s dated before the time of first call
      //In practice, this will be the beginning of the graphs,
      //so we can start seeing new data without waiting for 20 data points to fill the graphs
      var firstdata = function(n){
        var initData = [],
            t = new Date();
        for (var i = -n; i <= 0; i += 1) {
                var x = new Date(t.getTime() + i * 2000);
                var y = 0;
                initData.push([x, y]);
          }
          return initData;
        };
        //creates two arrays per graph of 20 dated/timed 0s
        //the arrays witht the 1 at the end are where the long term data are kept while the arrays without the 1 are truncated for the graphs
        tempdata = firstdata(20);
        tempdata1 = firstdata(20);
        intdata= firstdata(20);
        intdata1= firstdata(20);
        auxdata= firstdata(20);
        auxdata1= firstdata(20);
        bramdata= firstdata(20);
        bramdata1= firstdata(20);
        pintdata= firstdata(20);
        pintdata1= firstdata(20);
        pauxdata= firstdata(20);
        pauxdata1= firstdata(20);
        oddrdata= firstdata(20);
        oddrdata1= firstdata(20);
        refposdata= firstdata(20);
        refposdata1= firstdata(20);
        refnegdata= firstdata(20);
        refnegdata1= firstdata(20);


      //Initialize Dygraphs (sourced in /public/js/DygraphsCombined.js) with necessary labels and data
      //also gives and id that is called in the Jade files
      var tempPlot = new Dygraph(document.getElementById("temp"), tempdata,
                          {
                            title: 'Board Temperature',
                            xlabel: "Time",
                            ylabel: "Temperature(K)",
                            drawPoints: true,
                          });
      var vccintPlot = new Dygraph(document.getElementById("vccint"), intdata,
                          {
                            title: 'Programmable Logic (PL) Internal Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                          });
      var vccauxPlot = new Dygraph(document.getElementById("vccaux"), auxdata,
                          {
                            title: 'PL Auxiliary Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                          });
      var vccbramPlot = new Dygraph(document.getElementById("vccbram"), bramdata,
                          {
                            title: 'PL RAM Block Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                          });
      var vccpintPlot = new Dygraph(document.getElementById("vccpint"), pintdata,
                          {
                            title: 'Processing System (PS) Internal Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                          });
      var vccpauxPlot = new Dygraph(document.getElementById("vccpaux"), pauxdata,
                          {
                            title: 'PS Auxiliary Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                          });
      var vccoddrPlot = new Dygraph(document.getElementById("vccoddr"), oddrdata,
                          {
                            title: 'PS DDR I/O Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                          });
      var vccposPlot = new Dygraph(document.getElementById("vccpos"), refposdata,
                          {
                            title: 'Positive Input Reference Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                          });
      var vccnegPlot = new Dygraph(document.getElementById("vccneg"), refnegdata,
                          {
                            title: 'Negative Input Reference Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                          });

      //This function is from Dygraphs and it synchronizes the cursors.  It does not work well synchronizing selectable regions
      //That is the zoom: false command
      //The dynamic update causes problems with the zooming
      var sync = Dygraph.synchronize(tempPlot, vccintPlot, vccauxPlot, vccbramPlot, vccpintPlot, vccpauxPlot, vccoddrPlot, vccposPlot, vccnegPlot, {
        selection: true,
        zoom: false
      });

      //real data
      //This is the meat of the data acquisition
      var getData = function(){

            //var i=0;
            var callback = function(){
              i--;
              if(i==0) setTimeout(getData, 2000);
            }

            //Takes 7 arguments, even though some nodes have no offset
            var addPoint = function(data, plot, time, offset, raw, scale, overallScale){
              offset = (typeof offset === 'undefined') ? [{'data': 0}] : offset;
              overallScale = (typeof overallScale === 'undefined') ? 1 : overallScale;

              //Generates actual data point from three arguments, even if offset is undefined
              var rawData = +raw[0].data,
                  offsetData = +offset[0].data,
                  scaleData  = +scale[0].data,
                  y = (rawData+offsetData)*scaleData*overallScale;

              //push the data to the data array for each graph
              data.push([time, y]);
              //Display only the last 20 data points
              //Second array is left intact so past data can still be found
              plot.updateOptions( {'file': data.slice(-20)} );

            };
            var i = 1;
            //grab data from Giordon's website; the when statement waits for each getJSON request to come back
            //before executing the done command.  When it is done, the data are added to the different plots
            $.when($.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/00000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/01000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/02000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/11000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/12000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/21000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/22000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/31000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/32000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/41000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/42000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/51000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/52000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/61000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/62000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/71000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/72000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/71000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/72000000")).done(function(offset_temp, raw_temp, scale_temp, raw_int, scale_int,
                    raw_aux, scale_aux, raw_bram, scale_bram, raw_pint, scale_pint, raw_paux, scale_paux, raw_oddr, scale_oddr, raw_refpos, scale_refpos, raw_refneg, scale_refneg){

                   //add data
                   var t = new Date();
                   addPoint(tempdata1, tempPlot, t, offset_temp, raw_temp, scale_temp, 0.001);
                   addPoint(intdata1, vccintPlot, t, undefined, raw_int, scale_int);
                   addPoint(auxdata1, vccauxPlot, t, undefined, raw_aux, scale_aux);
                   addPoint(bramdata1, vccbramPlot, t, undefined, raw_bram, scale_bram);
                   addPoint(pintdata1, vccpintPlot, t, undefined, raw_pint, scale_pint);
                   addPoint(pauxdata1, vccpauxPlot, t, undefined, raw_paux, scale_paux);
                   addPoint(oddrdata1, vccoddrPlot, t, undefined, raw_oddr, scale_oddr);
                   addPoint(refposdata1, vccposPlot, t, undefined, raw_refpos, scale_refpos);
                   addPoint(refnegdata1, vccnegPlot, t, undefined, raw_refneg, scale_refneg);

                   callback();
                }).fail(function(offset_temp, raw_temp, scale_temp, raw_int, scale_int, raw_aux, scale_aux, raw_bram, scale_bram, raw_pint, scale_pint, raw_paux, scale_paux, raw_oddr, scale_oddr, raw_refpos, scale_refpos, raw_refneg, scale_refneg){console.log('caught an error');callback();});
		//The above fail function is to catch errors and keep the page running even when some of the data fail to come back
		
            //Toy array for making the buttons and stuff work....
            var myarray = [],
		t = new Date();
		for (var i = -20; i <= 0; i += 1) {
		    	var x = new Date(t.getTime() + i * 2000);
		    	var y = 500000000000000000;
		    	myarray.push([x, y]);
			}


		function printTemp() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Temperature(K)\n";
				for (var i = 0; i < myarray.length; i += 2) {
				    content += myarray[i] + new Array(row_width - myarray[i].length + 9).join(" ");
				    content += myarray[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
		}
		function printVccint() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Millivolts(mV)\n";
				for (var i = 0; i < myarray.length; i += 2) {
				    content += myarray[i] + new Array(row_width - myarray[i].length + 9).join(" ");
				    content += myarray[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
		}
		function printVccaux() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Millivolts(mV)\n";
				for (var i = 0; i < myarray.length; i += 2) {
				    content += myarray[i] + new Array(row_width - myarray[i].length + 9).join(" ");
				    content += myarray[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
		}
		function printVccbram() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Millivolts(mV)\n";
				for (var i = 0; i < myarray.length; i += 2) {
				    content += myarray[i] + new Array(row_width - myarray[i].length + 9).join(" ");
				    content += myarray[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
		}
		function printVccpint() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Millivolts(mV)\n";
				for (var i = 0; i < tempdata1.length; i += 2) {
				    content += tempdata1[i] + new Array(row_width - tempdata1[i].length + 9).join(" ");
				    content += tempdata1[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
		}
		function printVccpaux() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Millivolts(mV)\n";
				for (var i = 0; i < myarray.length; i += 2) {
				    content += myarray[i] + new Array(row_width - myarray[i].length + 9).join(" ");
				    content += myarray[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
		}
		function printVccoddr() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Millivolts(mV)\n";
				for (var i = 0; i < myarray.length; i += 2) {
				    content += myarray[i] + new Array(row_width - myarray[i].length + 9).join(" ");
				    content += myarray[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
		}
		function printVccpos() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Millivolts(mV)\n";
				for (var i = 0; i < myarray.length; i += 2) {
				    content += myarray[i] + new Array(row_width - myarray[i].length + 9).join(" ");
				    content += myarray[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
		}
		function printVccneg() {
				var row_width = 40;
				var content = "";
				content += "Time" + new Array(row_width + 1).join(" ") + "Millivolts(mV)\n";
				for (var i = 0; i < myarray.length; i += 2) {
				    content += myarray[i] + new Array(row_width - myarray[i].length + 9).join(" ");
				    content += myarray[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;

		}
		$('#BUTTONtemp').click(printTemp);
		$('#BUTTONvccint').click(printVccint);
		$('#BUTTONvccaux').click(printVccaux);
		$('#BUTTONvccbram').click(printVccbram);
		$('#BUTTONvccpint').click(printVccpint);
		$('#BUTTONvccpaux').click(printVccpaux);
		$('#BUTTONvccoddr').click(printVccoddr);
		$('#BUTTONvccpos').click(printVccpos);
		$('#BUTTONvccneg').click(printVccneg);




        }
//Finally we call the getData function to set everything in motion
getData();
});
