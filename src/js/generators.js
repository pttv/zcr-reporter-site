import Handlebars from 'handlebars/runtime';
import { fetchChartImage } from './fetchers';

require('./configs/templates.handlebars');

export function registerPartials() {
  Handlebars.registerPartial('chartImage', Handlebars.templates.chart_image);
  Handlebars.registerPartial('clientInfo', Handlebars.templates.client_info);
  Handlebars.registerPartial('footer', Handlebars.templates.footer);
  Handlebars.registerPartial('generalReadings', Handlebars.templates.general_readings);
  Handlebars.registerPartial('header', Handlebars.templates.header);
  Handlebars.registerPartial('opportunities', Handlebars.templates.opportunities);
  Handlebars.registerPartial('questions', Handlebars.templates.questions);
}

export async function renderChartReading(record) {
  const currentYear = new Date().getFullYear();
  const chartImage = await fetchChartImage(record);
  return Handlebars.templates.report({ ...record, currentYear, chartImage });
}
