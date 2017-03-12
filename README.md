# Clubhouse Project Analytics

![Example Project Screenshot](http://i.imgur.com/GuQ38ae.png)

A library that fetches data from your Clubhouse organization and displays various metrics using Google Charts. Demonstrates how to combine [the Clubhouse API](https://clubhouse.io/api) and [Google Charts](https://developers.google.com/chart/interactive/docs/gallery) to create an analytics dashboard that measures any arbitrary aspect of your Clubhouse data.

### Installation

Install [Node.js](https://nodejs.org/en/download/) on your machine if you don't already have it installed.

```shell
# Clone the repo.
git clone git@github.com:clubhouse/project-analytics.git
cd project-analytics

# Install node dependencies. You only need to do this once.
npm install

# Add your Clubhouse API token as an environment variable.
# (Go to Clubhouse > Settings > Your Account > API Tokens to create one.)
CLUBHOUSE_API_TOKEN="MY TOKEN"
```

### Usage

```shell
# Fetch and compile your data by project. You can use a partial project name,
# e.g. "AP" will match projects starting with both "API" and "App". Leaving off
# the project-name will list the projects you have access to.
node fetch.js <project-name>

# Or, just fetch and compile data for all active (non-archived) projects:
node fetch.js all

# Finally, open the HTML file in your browser and select a project:
open index.html
```
