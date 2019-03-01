import { parseCsv } from './parsers';
import { renderChartReading, registerPartials } from './generators';

registerPartials();
window.ZCR = { parseCsv, renderChartReading };
