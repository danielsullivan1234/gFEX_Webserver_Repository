$(document).ready(function () {
    
      var vccpintdata = [],
          t = new Date(),
          i;
          for (i = -20; i <= 0; i += 1) {
                  var x = new Date(t.getTime() + i * 2000);
                  var y = 0;
                  vccpintdata.push([x, y]);
                  vccpintdata1 = vccpintdata;
          }
      var charts = {};

      var g = new Dygraph(document.getElementById("vccpint"), vccpintdata,
                          {
                            legend: 'always',
                            title: 'vccpint',
                            drawPoints: true,
                            showRoller: true,
                            //rollPeriod: 20,
                            labels: ['Time', 'Voltage (mV)']
                          });
      
      //real data 
      var count = 20; 
      var getData = function(){

            $.when($.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/41000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/42000000")).done(function(raw, scale){

                    
                    var x = new Date(), // current time
                        rawData = +raw[0].data,
                        scaleData = +scale[0].data,
                        y = rawData*scaleData;
                        vccpintdata1.push([x, y]);
                        count++;
                        vccpintdata = vccpintdata1.slice(-20);
                        g.updateOptions( { 'file': vccpintdata } );
                    //console.log(offsetData);
                    //console.log(scaleData);
                    //console.log(rawData);
                    console.log("vccpint " + y);
                    //console.log(data1.length);
                    setTimeout(getData, 2000); 
            });
        }
getData();
});

