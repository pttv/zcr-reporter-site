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
        reject(error);
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

function downloadReport(report, id) {
  const reportBlob = new Blob([report], { type: "text/html;charset=utf-8" });
  const anchor = document.createElement('a', { id: 'report-download' });
  anchor.href = URL.createObjectURL(reportBlob);
  anchor.download = `${id}.html`;
  anchor.click();
}

async function handleInputFiles() {
  try {
    toggleLoading(true);

    const records = await parseCsvReports();
    const [record] = records;
    const report = await ZCR.renderChartReading({ ...getInjectedValues(), ...record });

    toggleLoading(false);
    downloadReport(report, record.id);
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
    const report = await ZCR.renderChartReading({ ...getInjectedValues(), ...record });
    
    toggleLoading(false);
    $('#report-wrapper').html(report);
  } catch (error) {
    toggleLoading(false);
    console.debug(error);
    alert(error.message);
  }
}

function getInjectedValues() {
  const metas = $('head meta');
  const links = $('head link:not([rel=stylesheet])');
  return {
    ...ZCR.INJECTED_VALUES,
    headTags: _.map([...metas, ...links], 'outerHTML').join('\n'),
  };
}

// $(document).ready(() => {
//   loadFixtures();
// });
