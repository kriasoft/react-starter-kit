module.exports = {
  development: {
    url: process.env.DATABASE_URL,
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
