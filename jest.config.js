// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      moduleNameMapper: {
        '\\.css$': require.resolve('./spec/mock-styles.js'),
        '\\.svg$': require.resolve('./spec/mock-icons.js'),
      },
      testMatch: ['**/**/*.test.(js|jsx|ts|tsx)', '!**/**/*.server.test.(js|jsx|ts|tsx)'],
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['**/**/*.server.test.(js|jsx)'],
      moduleNameMapper: {
        '\\.css$': require.resolve('./spec/mock-styles.js'),
        '\\.svg$': require.resolve('./spec/mock-icons.js'),
      },
    },
  ],
};
