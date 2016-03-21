$(document).ready(function () {
    console.log("vccaux here");
      var vccauxdata = [],
          t = new Date(),
          i;
          for (i = -20; i <= 0; i += 1) {
                  var x = new Date(t.getTime() + i * 2000);
                  var y = 0;
                  vccauxdata.push([x, y]);
                  vccauxdata1 = vccauxdata;
          }
          console.log("data" + vccauxdata);

      var charts = {};

      var g = new Dygraph(document.getElementById("vccaux"), vccauxdata,
                          {
                            legend: 'always',
                            title: 'vccaux',
                            drawPoints: true,
                            showRoller: true,
                            //rollPeriod: 20,
                            labels: ['Time', 'Voltage (mV)']
                          });
      
      //real data 
      var count = 20; 
      var getData = function(){

            $.when($.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/21000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/22000000")).done(function(raw, scale){

                    
                    var x = new Date(), // current time
                        rawData = +raw[0].data,
                        scaleData = +scale[0].data,
                        y = rawData*scaleData;
                        vccauxdata1.push([x, y]);
                        count++;
                        vccauxdata = vccauxdata1.slice(-20);
                        g.updateOptions( { 'file': vccauxdata } );
                    //console.log(offsetData);
                    //console.log(scaleData);
                    //console.log(rawData);
                    console.log("vccaux " + y);
                    //console.log(data1.length);
                    setTimeout(getData, 2000); 
            });
        }
getData();
});

