# gFEX_Webserver_Repository

Welcome to my repository!  This repository holds the code to the webpage that I developed for the gFEX Monitoring System.

The code in here is written in JavaScript and formatted using Jade.  We are sourcing a local build of dygraphs and run using the allGraphs.js file to generate the graphs that the webserver page displays.  The primary feature of the page is the display of various graphs that update at a specified interval.  In allGraphs.js, see getData() and notice that callback() uses a 2000ms delay before fetching new data (currently line 119).  There are also helpful links on the page as well as buttons that link to the past data files for each graph so that users may analyze the monitoring data at a later time.


## allGraphs.js Explained

The first function defined in allGraphs.js is ```firstdata``` which simply generates arrays of input length.  These arrays are used to generate zeros as initial data in each graph for the first data points.  This simply is implemented so that the graphs display new data immediately, instead of waiting for the required 20 points to fill the graphs.  These points will disappear once new data has been acquired, and can be truncated when analyzing a downloaded data file.

```
var firstdata = function(n){
        var initData = [],
            t = new Date();
        for (var i = -n; i <= 0; i += 1) {
                var x = new Date(t.getTime() + i * 2000); //the 2000 signifies how many milliseconds back in time from when the function
                                                          //is called that each zero point is (i.e. 0, -2s, -4s, etc.).
                var y = 0;
                initData.push([x, y]);
          }
          return initData;
        };
        //creates two arrays per graph of 20 dated/timed 0s
        //the arrays witht the 1 at the end are where the long term data are kept while the arrays without the 1 are truncated for the graphs
        tempdata = firstdata(20);
        tempdata1 = firstdata(20);
```

Next, for each graph 2 arrays are instantiated of length 20, which is the number of data points displayed on the each graph.

Then, beginning on line 40, each graph is instantiated.  These graphs are Dygraphs objects, whose source code is locally built in the ```dygraphs-combined.js``` file.  Each graph is given an Id that is used to reference it in the Jade files.  The 'XXXdata' arrays are used as an input argument for each Dygraph.

```
var tempPlot = new Dygraph(document.getElementById("temp"), tempdata,
                          {
                            title: 'Board Temperature',
                            xlabel: "Time",
                            ylabel: "Temperature(K)",
                            drawPoints: true,
                          });
```
Each graph is also synchronized so that the position of the cursor on one graph is matched on the other ones.  The synchronize function is from Dygraphs and it takes as arguments the Dygraph objects we want to sync.  The zoom feature is set to false for the synchronization because it causes problems with the dynamic update feature.
```
      var sync = Dygraph.synchronize(tempPlot, vccintPlot, vccauxPlot, vccbramPlot, vccpintPlot, vccpauxPlot, vccoddrPlot, vccposPlot, vccnegPlot, {
        selection: true,
        zoom: false
      });
```

### getData() explained
The getData function is where the majority of the work of allGraphs.js is performed.  This function, as its name suggests, obtains monitoring data from the board.

the ```callback()``` function sets the delay between each round of data acquisition.  The time is in milliseconds, so:
```
var callback = function(){
              i--;
              if(i==0) setTimeout(getData, 2000);
}
```
sets the delay to 2 seconds.  In practice, the delay will be much longer.  It is just this short in order to see more clearly what issues the webpage may have.  Decrementing ```i``` is a check that the necessary data have been requested.

Here is the meat of the graphical display code:
```
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
```
The function does not need to have ```offset``` be defined (it is undefined for all plots except Temperature)
Lines 128-131 produce a final y coordinate for each plot, and this is then pushed to the data array as a pair of time and data.  The graphs only display the most recent twenty data points by slicing back 20 points in the data array.  This is so that after a long time, the graph is not cluttered with all the data points acquired since running the page.  Instead, the data rolls by and only the previous 20 points are visible.  The entirity of the past data can still be accessed from the Past Data Files links.

The data is being grabbed from Giordon Stark's personal website mirroring the Uchicago-Secure network, where the board in the E-Shop is connected.  Each URL clearly maps to the proper pins: ```http://giordonstark.com:8880/read/f0000020/0f010020/52000000``` In the final string of numerals following the last ```/```, the first number denotes which sensor port is being read (0 is temperature through 8 being ```vccrefneg```).  The second number corresponds to raw, offset, and scale data (0, 1, 2, respectively).

The URLs are read using a ```when()```, ```done()```, and ```fail()``` function:
```
$.when($.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/00000000"),
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f010020/01000000"),
                   .......
                   $.getJSON("http://giordonstark.com:8880/read/f0000020/0f020020/82000000")).done(function(offset_temp, raw_temp, scale_temp, raw_int, scale_int,
                    raw_aux, scale_aux, raw_bram, scale_bram, raw_pint, scale_pint, raw_paux, scale_paux, raw_oddr, scale_oddr, raw_refpos, scale_refpos, raw_refneg, scale_refneg){
                    raw_aux, scale_aux, raw_bram, scale_bram, raw_pint, scale_pint, raw_paux, scale_paux, raw_oddr, scale_oddr, raw_refpos, scale_refpos, raw_refneg, scale_refneg){

                   //add data
                   var t = new Date();
                   addPoint(tempdata1, tempPlot, t, offset_temp, raw_temp, scale_temp, 0.001);
                   ........
                   addPoint(refnegdata1, vccnegPlot, t, undefined, raw_refneg, scale_refneg);

                   callback();
                }).fail(function(offset_temp, raw_temp, scale_temp, raw_int, scale_int, raw_aux, scale_aux, raw_bram, scale_bram, raw_pint, scale_pint, raw_paux, scale_paux, raw_oddr, scale_oddr, raw_refpos, scale_refpos, raw_refneg, scale_refneg){console.log('caught an error');callback();});
		//The above fail function is to catch errors and keep the page running even when some of the data fail to come back

```
The ```when()``` function executes a series of ```$.getJSON()``` requests that reads the ```data``` data from each URL, and once each has been received, the ```done()``` function resolves.  In this case, it executes ```addPoint()``` for each graph.  Sometimes, data is dropped over the network.  The ```fail()``` function prevents this from crashing the page by calling ```callback()``` so that the requests can be made again.  

This concludes the portion of ```getData()``` that obtains and plots the new data on each graph.

The next bunch of code relates to the text file data output and it still has some bugs.  Here is the code that constructs the Board Temperature Past Data File:
```
function printTemp() {
				var row_width = 40;
				var content = "Temperature Data\n";
				content += "Time" + new Array(row_width + 1).join(" ") + "Temperature(K)\n";
				for (var i = 0; i < tempdata1.length; i += 2) {
				    content += tempdata1[i] + new Array(row_width - tempdata1[i].length + 9).join(" ");
				    content += tempdata1[i+1];
				    content += "\n";
				}
				uri = "data:application/octet-stream," + encodeURIComponent(content);
				location.href = uri;
}
```


## Installing

```
git clone https://github.com/danielsullivan1234/gFEX_Webserver_Repository.git
cd gFEX_Webserver_Repository
nvm use v5.5.0
npm install
npm start
```

and then navigate your browser to [http://localhost:3000](http://localhost:3000).

##Curent bugs
--Toolbar navigation is sloppy and more helpful links need to be added (or dropped?)


##Future Plans
--SPI integration
--I2C integration
