import { INJECTED_VALUES } from './constants';
import { renderChartReading, registerPartials } from './generators';
import { parseCsv } from './parsers';

registerPartials();
window.ZCR = { INJECTED_VALUES, parseCsv, renderChartReading };
