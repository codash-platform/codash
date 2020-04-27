# CoDash - COVID-19 Dashboard

This frontend app focuses on providing (yet one more) dashboard to visualize the COVID-19 data.

Live demo: https://coronavirusguides.com

### Getting started

1. Clone this repo
2. Run `npm install`
3. Run `npm start`

Additional info:
* edit `.env` to modify some of the environment variables
* to autoformat the code -> run the code linter `npm run pretty`
* run `npm run start:prod` if you want to run the production version (minimized code)
* to run without the webpack server, run `npm run build` and then `npm run serve`


## Tech Stack

Main frameworks: React with Redux and Saga

UI framework: React Bootstrap and React Bootstrap Table

Build system: Babel with Webpack

    
## Data Source

The current data source is the ECDC - European Centre for Disease Prevention and Control.

More info can be found here: https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide