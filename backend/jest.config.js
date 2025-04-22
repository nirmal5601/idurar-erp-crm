module.exports = {
    // Jest configuration to handle path aliases
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Adjust the path to match your project structure
    },
  
    // Ensure Jest uses the right environment for your code
    testEnvironment: 'node',
  
    // If you're using Babel, you can use this configuration to transform JS files
    transform: {
      '^.+\\.js$': 'babel-jest', // Use babel-jest to transform JS files
    },
  
    // This ensures that Jest can handle the necessary file extensions
    moduleFileExtensions: ['js', 'json', 'node'],
  };
  