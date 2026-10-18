'use strict';
const {
  Model
} = require('sequelize');

// modelo de la tabla Estudiantes (tiene que coincidir con la migracion)
module.exports = (sequelize, DataTypes) => {
  class Estudiante extends Model {
    static associate(models) {
      // por ahora no tiene relaciones con otras tablas
    }
  }
  Estudiante.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    carrera: DataTypes.STRING,
    edad: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Estudiante',
  });
  return Estudiante;
};
