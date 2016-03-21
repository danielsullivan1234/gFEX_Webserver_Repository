$(document).ready(function () {
    
      var tempdata = [],
          t = new Date(),
          i;
          for (i = -20; i <= 0; i += 1) {
                  var x = new Date(t.getTime() + i * 2000);
                  var y = 0;
                  tempdata.push([x, y]);
                  tempdata1 = tempdata;
          }
          console.log(tempdata);

      var charts = {};

      var g1 = new Dygraph(document.getElementById("temp"), tempdata,
                          {
                            legend: 'always',
                            title: 'Board Temperature',
                            drawPoints: true,
                            showRoller: true,
                            //rollPeriod: 20,
                            labels: ['Time', 'Temperarure Data']
                          });
      
      //real data 
      var count = 20; 
      var getData = function(){
            

            $.when($.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/00000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f010020/01000000"),
                   $.getJSON("http://ipbus1.uchicago.edu:7777/read/f0000020/0f020020/02000000")).done(function(offset, raw, scale){

                    
                    var x = new Date(), // current time
                        rawData = +raw[0].data,
                        offsetData = +offset[0].data,
                        scaleData = +scale[0].data/1000,
                        y = (rawData+offsetData)*scaleData;
                        tempdata1.push([x, y]);
                        count++;
                        tempdata = tempdata1.slice(-20);
                        g1.updateOptions( { 'file': tempdata } );
                    //console.log(offsetData);
                    //console.log(scaleData);
                    //console.log(rawData);
                    console.log("temp " + y);
                    //console.log(y);
                    //console.log(data1.length);
                    
            });
                   setTimeout(getData, 2000); 
        }
getData();
});

