import { renderChartReading, registerPartials } from './generators';
import { parseCsv } from './parsers';

registerPartials();
window.ZCR = { parseCsv, renderChartReading };
