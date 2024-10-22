'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requesterId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    companyId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Companies', // Referenciando o model Companies
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'closed'),
      defaultValue: 'open',
      allowNull: false,
    },
  }, {});

  Ticket.associate = function(models) {
    Ticket.belongsToMany(models.Tag, {
      through: 'TicketTag',
      foreignKey: 'ticketId',
      otherKey: 'tagId',
    });

    // Associação com o model User para requesterId e adminId
    Ticket.belongsTo(models.User, { as: 'requester', foreignKey: 'requesterId' });
    Ticket.belongsTo(models.User, { as: 'admin', foreignKey: 'adminId' });

    // Associação com o model Company
    Ticket.belongsTo(models.Company, { foreignKey: 'companyId' });
  };

  return Ticket;
};
