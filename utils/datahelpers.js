'use strict';
const fs = require('fs');

// Helper function to validate JSON
const isJson = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};

// Helper function to serialize JSON in pretty print.
const serialize = (data) => {
  return JSON.stringify(data, null, 2);
};

// Helper function to query given data
const query = (data, key) => {
  let buffer = JSON.parse(data);
  let result;
  buffer.forEach((obj) => {
    if (obj[key] !== undefined) {
      result = obj[key];
    }
  });
  return result;
};

const writeToEmptyFile = (data, file) => {
  let json = [];
  json.push(data);
  fs.writeFile(file, serialize(json), 'utf-8', (err) => {
    if (err) throw err;
    console.log('Initial entry has been created.');
  });
};

const writeToFileWithContent = (file, content, data) => {
  let json = JSON.parse(content);
  json.push(data);
  fs.writeFile(file, serialize(json), 'utf-8', (err) => {
    if (err) throw err;
    console.log('File has been updated.');
  });
};

const writeFile = (data, file) => {
  let parsedData = JSON.parse(data);
  // Buffer of existing contents of JSON file.
  fs.readFile(file, (err, content) => {
    if (err) throw err;
    // If contents exist in the file, treat it as an array of objects.
    // Otherwise, create an empty array and add the data.
    if (content.length !== 0) {
      writeToFileWithContent(file, content, parsedData);
    } else {
      // If file is empty, create JSON structure as array of objects.
      writeToEmptyFile(parsedData, file);
    }
  });
};

module.exports = {
  isJson,
  query,
  writeFile,
  serialize,
};
