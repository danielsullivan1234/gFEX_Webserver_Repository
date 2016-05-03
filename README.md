# gFEX_Webserver_Repository

We are sourcing a local build of dygraphs and run using the allGraphs.js file to generate the graphs that the webserver page displays.

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

--500 Internal Service Errors kill the page it seems, because we will never get the response we are looking for.  This may include a timeout feature, but that could have big consequences for the analysis functions between graphs, as well as the synchronizability.  This may be a big problem to solve, or it may be just a fluke error.  Today 5/3 is the first time I am seeing it

--text output is in development, will start with buttons but hopefully use toolbar navigation once it is running properly

##Future Plans
--SPI integration in development
--I2C integration soon to come after
