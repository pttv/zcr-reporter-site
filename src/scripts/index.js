function parseReportsInput() {
  try {
    const inputFile = $('#reports-input')[0].files[0];
    const fileReader = new FileReader();
    fileReader.onload = async event => {
      try {
        const csvData = String(event.target.result);
        const records = await ZCR.parseCsv(csvData);
        const report = Handlebars.templates.report(records[0]);
        $('#report-container').html(report);
      } catch (error) {
        alert(error.message);
      }
    };
    fileReader.readAsText(inputFile);
  } catch (error) {
    alert(error.message);
  }
}
