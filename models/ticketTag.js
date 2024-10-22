'use strict';

module.exports = (sequelize, DataTypes) => {
  const TicketTag = sequelize.define('TicketTag', {
    id: { // Adicione esta linha
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tickets', // Nome da tabela
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tags', // Nome da tabela
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {});

  TicketTag.associate = function(models) {
    TicketTag.belongsTo(models.Ticket, {
      foreignKey: 'ticketId',
    });
    TicketTag.belongsTo(models.Tag, {
      foreignKey: 'tagId',
    });
  };

  return TicketTag;
};
  