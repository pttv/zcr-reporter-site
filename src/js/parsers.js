import _ from 'lodash';
import $ from 'lodash/fp';
import csv from 'csv';

const meaningsMetadata = require('./meanings.json');

const generalSectionOrders = ['I', 'II', 'III', 'IV'];

const parseTextBlock = $.flow(
  $.split(/\n+/gi),
  $.map(_.trim),
  $.map(line => _.replace(line, /^-\s*/, '')),
  $.compact,
  $.flatten,
);

function parseGeneralReadings(rawReadings, index, key) {
  const { meanings, title } = meaningsMetadata[key];
  const order = generalSectionOrders[index];
  const readings = parseTextBlock(rawReadings);
  return { meanings, readings, title: `${order}. ${title}` };
}

function parseQuestions(questions) {
  const compacted = _.compact(questions);
  const coupled = _.slice(compacted, 0, compacted.length - (compacted.length % 2));
  if (_.isEmpty(coupled)) return undefined;

  const titles = _.filter(coupled, (__, idx) => idx % 2 === 0);
  const answers = _.reject(coupled, (__, idx) => idx % 2 === 0);
  const pairs = _.unzip([titles, answers]);

  return _.map(pairs, ([title, answer], index) => ({
    answer: parseTextBlock(answer),
    title: `${index + 1}. ${_.trim(title)}`,
  }));
}

function parseRecordRows(records) {
  return _.map(records, rec => {
    const [
      id,
      fullName,
      contactDetail,
      gender,
      birthHour,
      birthDay,
      birthMonth,
      birthYear,
      menhTaiQuan,
      phucDiThe,
      phuTuNo,
      dienTatHuynh,
      rawOpportunities,
      ...rawQuestions
    ] = rec;

    const generalReadings = [
      parseGeneralReadings(menhTaiQuan, 0, 'menh_tai_quan'),
      parseGeneralReadings(phucDiThe, 1, 'phuc_di_the'),
      parseGeneralReadings(phuTuNo, 2, 'phu_tu_no'),
      parseGeneralReadings(dienTatHuynh, 3, 'dien_tat_huynh'),
    ];

    const opportunities = parseTextBlock(rawOpportunities);

    const questions = parseQuestions(rawQuestions);

    return {
      birthDay,
      birthHour,
      birthMonth,
      birthYear,
      contactDetail,
      fullName,
      gender,
      generalReadings,
      id,
      opportunities,
      questions,
    };
  });
}

/* eslint-disable import/prefer-default-export */

export function parseCsv(csvData) {
  const stringifiedCsvData = String(csvData);

  return new Promise((resolve, reject) => {
    csv.parse(stringifiedCsvData, (error, rawRecords) => {
      if (error != null) {
        reject(error);
        return;
      }

      // Filter records with valid ID
      const records = _.filter(rawRecords, ([id]) => _.startsWith(id, 'OLN'));
      resolve(parseRecordRows(records));
    });
  });
}
