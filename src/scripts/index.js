function registerPartials() {
  Handlebars.registerPartial('clientInfo', Handlebars.templates.client_info);
  Handlebars.registerPartial('footer', Handlebars.templates.footer);
  Handlebars.registerPartial('generalReadings', Handlebars.templates.general_readings);
  Handlebars.registerPartial('opportunities', Handlebars.templates.opportunities);
  Handlebars.registerPartial('questions', Handlebars.templates.questions);
}

function parseCsvReports() {
  return new Promise((resolve, reject) => {
    const inputFile = $('#reports-input')[0].files[0];
    const fileReader = new FileReader();

    fileReader.onload = async event => {
      try {
        const csvData = String(event.target.result);
        const records = await ZCR.parseCsv(csvData);
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
    $('#report-container').text('Loading...');
    const records = await parseCsvReports();
    const [record] = records;
    const currentYear = new Date().getFullYear();
    const lasoImage = await ZCR.fetchLasoImage(record);
    const report = Handlebars.templates.report({ ...record, currentYear, lasoImage });
    $('#report-container').html(report);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

$(document).ready(() => {
  registerPartials();
});
