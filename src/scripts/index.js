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

async function handleInputFiles() {
  try {
    $('.loading-ring').removeClass('hidden');
    $('#report-container').empty();

    const records = await parseCsvReports();
    const [record] = records;
    const currentYear = new Date().getFullYear();
    const chartImage = await ZCR.fetchChartImage(record);
    const report = Handlebars.templates.report({ ...record, currentYear, chartImage });

    $('.loading-ring').addClass('hidden');
    $('body').html(report);
    // $('#report-wrapper').html(report);
  } catch (error) {
    console.debug(error);
    alert(error.message);
    $('.loading-ring').addClass('hidden');
  }
}

$(document).ready(() => {
  registerPartials();
});
