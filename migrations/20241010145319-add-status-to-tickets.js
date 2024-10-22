'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tickets', 'status', {
      type: Sequelize.ENUM('open', 'in_progress', 'closed'),
      defaultValue: 'open',
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tickets', 'status');
  }
};

