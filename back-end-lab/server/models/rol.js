'use strict';
const { Model } = require('sequelize');

// tabla roles del script (admin, usuario)
module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {
      // un rol lo pueden tener muchos usuarios
      Rol.hasMany(models.Usuario, { foreignKey: 'rol_id' });
    }
  }
  Rol.init({
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Rol',
    tableName: 'roles',
    timestamps: false
  });
  return Rol;
};
