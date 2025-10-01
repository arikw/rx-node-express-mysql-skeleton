const environment = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

// Sequelize looks for a configuration matching the NODE_ENV variable
module.exports = {
  [environment]: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    migrationStorageTableName: '_sequelize_meta',
    dialectOptions: {
      multipleStatements: true
    }
  }
};
