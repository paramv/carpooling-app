var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'trippie'
    },
    port: 3000,
    db: 'mongodb://localhost/trippie-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'trippie'
    },
    port: 3000,
    db: 'mongodb://localhost/trippie-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'trippie'
    },
    port: 3000,
    db: 'mongodb://localhost/trippie-production'
  }
};

module.exports = config[env];
