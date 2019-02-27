import _ from 'lodash';
import $ from 'lodash/fp';
import csv from 'csv';

const meaningsMetadata = require('./meanings.json');

const parseTextBlock = $.flow(
  $.split(/\n+/gi),
  $.map(_.trim),
  $.map(line => _.replace(line, /^-\s+/, '')),
  $.flatten,
);

function parseGeneralReadings(rawReadings, key) {
  const { meanings, title } = meaningsMetadata[key];
  const readings = parseTextBlock(rawReadings);

  return { meanings, readings, title };
}

function parseQuestions(questions) {
  const compacted = _.compact(questions);
  const coupled = _.slice(compacted, 0, compacted.length - (compacted.length % 2));
  if (_.isEmpty(coupled)) return undefined;

  const titles = _.filter(coupled, (__, idx) => idx % 2 === 0);
  const answers = _.reject(coupled, (__, idx) => idx % 2 === 0);
  const pairs = _.unzip([titles, answers]);

  return _.map(pairs, ([title, answer], index) => ({
    answer: _.trim(answer),
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
      generalReadings1,
      generalReadings2,
      generalReadings3,
      generalReadings4,
      rawOpportunities,
      ...rawQuestions
    ] = rec;

    const generalReadings = [
      parseGeneralReadings(generalReadings1, 'menh_tai_quan'),
      parseGeneralReadings(generalReadings2, 'phuc_di_the'),
      parseGeneralReadings(generalReadings3, 'phu_tu_no'),
      parseGeneralReadings(generalReadings4, 'dien_tat_huynh'),
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
