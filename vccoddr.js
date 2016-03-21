$(document).ready(function () {
    console.log("vccoddr here");
      var vccoddrdata = [],
          t = new Date(),
          i;
          for (i = -20; i <= 0; i += 1) {
                  var x = new Date(t.getTime() + i * 2000);
                  var y = 0;
                  vccoddrdata.push([x, y]);
                  vccoddrdata1 = vccoddrdata;
          }
          console.log("data" + vccoddrdata);

      var charts = {};

      var g = new Dygraph(document.getElementById("vccoddr"), vccoddrdata,
                          {
                            legend: 'always',
                            title: 'vccoddr',
                            drawPoints: true,
                            showRoller: true,
                            //rollPeriod: 20,
                            labels: ['Time', 'Voltage (mV)']
                          });
      
      //real data 
      var count = 20; 
      var getData = function(){

            $.when($.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/61000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/62000000")).done(function(raw, scale){

                    
                    var x = new Date(), // current time
                        rawData = +raw[0].data,
                        scaleData = +scale[0].data,
                        y = rawData*scaleData;
                        vccoddrdata1.push([x, y]);
                        count++;
                        vccoddrdata = vccoddrdata1.slice(-20);
                        g.updateOptions( { 'file': vccoddrdata } );
                    //console.log(offsetData);
                    //console.log(scaleData);
                    //console.log(rawData);
                    console.log("vccoddr " + y);
                    //console.log(data1.length);
                    setTimeout(getData, 2000); 
            });
        }
getData();
});

