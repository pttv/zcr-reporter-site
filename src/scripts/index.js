function registerPartials() {
  Handlebars.registerPartial('chartImage', Handlebars.templates.chart_image);
  Handlebars.registerPartial('clientInfo', Handlebars.templates.client_info);
  Handlebars.registerPartial('footer', Handlebars.templates.footer);
  Handlebars.registerPartial('generalReadings', Handlebars.templates.general_readings);
  Handlebars.registerPartial('header', Handlebars.templates.header);
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
  });
}

function toggleLoading(loading) {
  if (!loading) {
    $('.loading-ring').addClass('hidden');
    return;
  }

  $('.loading-ring').removeClass('hidden');
  $('#report-container').empty();
}

async function renderChartReading(record) {
  const currentYear = new Date().getFullYear();
  const chartImage = await ZCR.fetchChartImage(record);
  return Handlebars.templates.report({ ...record, currentYear, chartImage });
}

async function handleInputFiles() {
  try {
    toggleLoading(true);

    const records = await parseCsvReports();
    const report = await renderChartReading(records[0]);

    toggleLoading(false);
    $('#report-wrapper').html(report);
  } catch (error) {
    toggleLoading(false);
    console.debug(error);
    alert(error.message);
  }
}

async function loadFixtures() {
  try {
    toggleLoading(true);
    const response = await fetch('/static/fixtures.json');
    const record = await response.json();
    const report = await renderChartReading(record);
    
    toggleLoading(false);
    $('#report-wrapper').html(report);
  } catch (error) {
    toggleLoading(false);
    console.debug(error);
    alert(error.message);
  }
}

$(document).ready(() => {
  registerPartials();
  // loadFixtures();
});
