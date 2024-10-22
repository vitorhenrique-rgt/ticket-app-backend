'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Users',
    timestamps: true
  });

  // Associação com o modelo Company
  User.associate = function(models) {
    User.belongsTo(models.Company, {
      foreignKey: 'companyId',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
