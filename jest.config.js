module.exports = {
  // ... other Jest configuration
  moduleNameMapper: {
    '\\.css$': require.resolve('./spec/mock-styles.js'),
  },
};