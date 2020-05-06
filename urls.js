const creds = require('./creds');

module.exports = {
  college_scorecard: 'https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=',
  google_sheets: `https://sheets.googleapis.com/v4/spreadsheets/13RXNOiQ9FKsWcHnVS6JJl7WVCDGJAeb_E0Pf8h6cB5M/values/sheet?key=${creds.sheets_key}`
}