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
                            title: 'vccint',
                            xlabel: "Time",
                            ylabel: "Voltage (mV)",
                            drawPoints: true,
                            showRoller: true,
                          });
      
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

      //real data
      var getData = function(){
            //grab data
            $.when($.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/00000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/01000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/02000000")).done(function(offset_temp, raw_temp, scale_temp){
                   console.log(["when", offset_temp, raw_temp, scale_temp]);
                   //add data
                   var t = new Date();
                   addPoint(tempdata1, tempPlot, t, offset_temp, raw_temp, scale_temp, 0.001);
                   //addPoint(intdata1, vccintPlot, t, undefined, raw_int, scale_int);
                  
                   setTimeout(getData, 2000);
            });
            /*$.when($.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/11000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/12000000")).done(function(raw_int, scale_int){

                   //add data
                   var t = new Date();
                   //addPoint(tempdata1, tempPlot, t, offset_temp, raw_temp, scale_temp, 0.001);
                   //addPoint(intdata1, vccintPlot, t, undefined, raw_int, scale_int);
                   
                  
            });
            */
          


        }

getData();
});