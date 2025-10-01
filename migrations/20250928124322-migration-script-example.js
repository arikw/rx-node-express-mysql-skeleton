'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(/*sql*/ `
      START TRANSACTION;
      SELECT 1;
      COMMIT;
    `);
  },

  down: async () => {}
};
