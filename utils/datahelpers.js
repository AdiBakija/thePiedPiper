'use strict';
// Helper function to validate JSON
const isJson = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};

// Helper function to serialize JSON.
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
}

module.exports = {
  isJson,
  serialize,
  query
};
