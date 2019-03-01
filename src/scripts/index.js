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

async function handleInputFiles() {
  try {
    toggleLoading(true);

    const records = await parseCsvReports();
    const report = await ZCR.renderChartReading(records[0]);

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
    const report = await ZCR.renderChartReading(record);
    
    toggleLoading(false);
    $('#report-wrapper').html(report);
  } catch (error) {
    toggleLoading(false);
    console.debug(error);
    alert(error.message);
  }
}

$(document).ready(() => {
  loadFixtures();
});
