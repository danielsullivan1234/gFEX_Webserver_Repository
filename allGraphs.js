$(document).ready(function () {
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


      var tempPlot = new Dygraph(document.getElementById("temp"), tempdata,
                          {
                            title: 'Board Temperature',
                            xlabel: "Time",
                            ylabel: "Temperature(K)",
                            drawPoints: true,
                            showRoller: true,
                          });
      var vccintPlot = new Dygraph(document.getElementById("vccint"), intdata,
                          {
                            title: 'Programmable Logic (PL) Internal Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                            showRoller: true,
                          });
      var vccauxPlot = new Dygraph(document.getElementById("vccaux"), auxdata,
                          {
                            title: 'PL Auxiliary Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                            showRoller: true,
                          });
      var vccbramPlot = new Dygraph(document.getElementById("vccbram"), bramdata,
                          {
                            title: 'PL RAM Block Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                            showRoller: true,
                          });
      var vccpintPlot = new Dygraph(document.getElementById("vccpint"), pintdata,
                          {
                            title: 'Processing System (PS) Internal Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                            showRoller: true,
                          });
      var vccpauxPlot = new Dygraph(document.getElementById("vccpaux"), pauxdata,
                          {
                            title: 'PS Auxiliary Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                            showRoller: true,
                          });
      var vccoddrPlot = new Dygraph(document.getElementById("vccoddr"), oddrdata,
                          {
                            title: 'PS DDR I/O Supply Voltage',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                            showRoller: true,
                          });
      var vccrefPlot = new Dygraph(document.getElementById("vccref"), refposdata,
                          {
                            title: 'Input Reference Voltage (+/-)',
                            xlabel: "Time",
                            ylabel: "Pos Voltage (mV)",
                            drawPoints: true,
                            showRoller: true,
                          });

//want ping response as well
      var sync = Dygraph.synchronize(tempPlot, vccintPlot, vccauxPlot, vccbramPlot);

      //real data
      var getData = function(){
            
            //var i=0;
            var callback = function(){
              i--;
              if(i==0) setTimeout(getData, 2000);
            }

            var addPoint = function(data, plot, time, offset, raw, scale, overallScale){
              offset = (typeof offset === 'undefined') ? [{'data': 0}] : offset;
              overallScale = (typeof overallScale === 'undefined') ? 1 : overallScale;

              var rawData = +raw[0].data,
                  offsetData = +offset[0].data,
                  scaleData  = +scale[0].data,
                  y = (rawData+offsetData)*scaleData*overallScale;

              data.push([time, y]);
              plot.updateOptions( {'file': data.slice(-20)} );

            };
            var i = 1;
            //grab data
            $.when($.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/00000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/01000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/02000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/11000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/12000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/21000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/22000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/31000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/32000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/41000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/42000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/51000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/52000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/61000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/62000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/71000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/72000000")).done(function(offset_temp, raw_temp, scale_temp, raw_int, scale_int, 
                    raw_aux, scale_aux, raw_bram, scale_bram, raw_pint, scale_pint, raw_paux, scale_paux, raw_oddr, scale_oddr, raw_refpos, scale_refpos){
                  
                   //add data
                   var t = new Date();
                   addPoint(tempdata1, tempPlot, t, offset_temp, raw_temp, scale_temp, 0.001);
                   addPoint(intdata1, vccintPlot, t, undefined, raw_int, scale_int);
                   addPoint(auxdata1, vccauxPlot, t, undefined, raw_aux, scale_aux);
                   addPoint(bramdata1, vccbramPlot, t, undefined, raw_bram, scale_bram);
                   addPoint(pintdata1, vccpintPlot, t, undefined, raw_pint, scale_pint);
                   addPoint(pauxdata1, vccpauxPlot, t, undefined, raw_paux, scale_paux);
                   addPoint(oddrdata1, vccoddrPlot, t, undefined, raw_oddr, scale_oddr);
                   addPoint(refposdata1, vccrefPlot, t, undefined, raw_refpos, scale_refpos);
                  
                   callback();
            });
            
          


        }

getData();
});