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
    $('#reports-input')[0].value = null;
    return;
  }

  $('.loading-ring').removeClass('hidden');
  $('#report-container').empty();
}

function downloadReport(report, record) {
  const { checksum, id } = record;
  const reportBlob = new Blob([report], { type: "text/html;charset=utf-8" });
  const anchor = document.createElement('a', { id: 'report-download' });
  anchor.href = URL.createObjectURL(reportBlob);
  anchor.download = `${id}_${checksum.substring(checksum.length - 6)}.html`;
  anchor.click();
}

async function handleInputFiles() {
  try {
    toggleLoading(true);

    const records = await parseCsvReports();
    const [record] = records;
    const report = await ZCR.renderChartReading(record);

    toggleLoading(false);
    downloadReport(report, record);
    $('#report-wrapper').html(report);
  } catch (error) {
    toggleLoading(false);
    console.debug(error);
    alert(error.message);
  }
}

// $(document).ready(() => {
// });
