module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      // Todo: If we agree on a naming convention for test files, we can add .client.test.js to the testMatch array
      // If we do this, we can remove the second regex that excludes server.test.js files
      testMatch: ['**/**/*.test.js', '!**/?(*.)+(server.test).js'],
      moduleNameMapper: {
        '\\.css$': require.resolve('./spec/mock-styles.js'),
      },
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['**/**/*.server.test.js'],
      moduleNameMapper: {
        '\\.css$': require.resolve('./spec/mock-styles.js'),
      },
    },
  ]
};