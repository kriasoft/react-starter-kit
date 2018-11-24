module.exports = {
  development: {
    storage: './database.sqlite',
    dialect: 'sqlite',
  },
  production: {
    username: 'null',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
