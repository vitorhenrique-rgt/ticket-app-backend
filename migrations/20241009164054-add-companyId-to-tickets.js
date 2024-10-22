'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tickets', 'companyId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Companies', // Nome da tabela Companies
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tickets', 'companyId');
  }
};
