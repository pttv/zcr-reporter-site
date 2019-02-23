function registerPartials() {
  Handlebars.registerPartial('userInfo', Handlebars.templates.user_info);
}

function parseCsvReports() {
  return new Promise((resolve, reject) => {
    const inputFile = $('#reports-input')[0].files[0];
    const fileReader = new FileReader();

    fileReader.onload = async event => {
      try {
        const csvData = String(event.target.result);
        const records = await ZCR.parseCsv(csvData);
        console.debug(JSON.stringify(records[0]));
        resolve(records);
      } catch (error) {
        alert(error.message);
      }
    };
    
    fileReader.readAsText(inputFile);
  })
}

async function handleInputFiles() {
  try {
    const records = await parseCsvReports();
    const report = Handlebars.templates.report(records[0]);
    $('#report-container').html(report);
  } catch (error) {
    alert(JSON.stringify(error));
  }
}

async function loadFixtureData() {
  try {
    const response = await fetch('/static/fixture.json');
    const record = await response.json();
    const report = Handlebars.templates.report(record);
    $('#report-container').html(report);
  } catch (error) {
    
  }
}
