function registerPartials() {
  Handlebars.registerPartial('footer', Handlebars.templates.footer);
  Handlebars.registerPartial('generals', Handlebars.templates.generals);
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
    const currentYear = 2019;
    const lasoImage = 'https://tuvivietnam.vn/laso/temp/Nguyen_van_A_2019_8244aac9.jpg';
    const report = Handlebars.templates.report({ ...record, currentYear, lasoImage });
    $('#report-container').html(report);
  } catch (error) {
  }
}
