// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['**/**/*.test.(js|jsx)', '!**/**/*.server.test.(js|jsx)'],
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['**/**/*.server.test.(js|jsx)'],
    },
  ]
};
