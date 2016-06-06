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
