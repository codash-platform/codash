# CoDash - COVID-19 Dashboard <img align="right" width="300" src="https://github.com/codash-platform/codash/blob/master/static/images/logo/logo_large.png?raw=true" alt="CoDash" >

This frontend app focuses on providing (yet one more) dashboard to visualize the COVID-19 data.

Live demo: https://codash.io

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

More info can be found [here](https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide).

## Credits

Theme inspired from [ArchitectUI Bootstrap 4 ReactJS Theme FREE](https://github.com/DashboardPack/architectui-react-theme-free)

Logo - [Alex Nae](mailto:naealexandrunicolae@gmail.com) - check out his [game](https://www.theundergroundkinggame.com/)

Development & Testing - [Marius Popa](mailto:contact@popa-marius.com) 