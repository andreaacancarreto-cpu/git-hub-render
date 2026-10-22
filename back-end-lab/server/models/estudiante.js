'use strict';
const {
  Model
} = require('sequelize');

// modelo de la tabla estudiantes (tiene que coincidir con el script de DBeaver)
module.exports = (sequelize, DataTypes) => {
  class Estudiante extends Model {
    static associate(models) {
      // por ahora no tiene relaciones con otras tablas
    }
  }
  Estudiante.init({
    carnet: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    carrera: DataTypes.STRING(100),
    promedio: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
      // la columna es NUMERIC(4,2), si se pasa de 99.99 postgres da error
      validate: {
        min: { args: [0], msg: 'El promedio no puede ser negativo' },
        max: { args: [99.99], msg: 'El promedio no puede ser mayor a 99.99' }
      }
    }
  }, {
    sequelize,
    modelName: 'Estudiante',
    tableName: 'estudiantes',
    timestamps: false // la tabla del script no tiene createdAt ni updatedAt
  });
  return Estudiante;
};
