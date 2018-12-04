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

module.exports = {
  isJson,
  serialize,
};
