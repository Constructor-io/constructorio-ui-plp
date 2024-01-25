// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['**/**/*.test.(js|jsx)', '!**/**/*.server.test.(js|jsx)'],
      moduleNameMapper: {
        '\\.css$': require.resolve('./spec/mock-styles.js'),
      },
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['**/**/*.server.test.(js|jsx)'],
      moduleNameMapper: {
        '\\.css$': require.resolve('./spec/mock-styles.js'),
      },
    },
  ],
};
