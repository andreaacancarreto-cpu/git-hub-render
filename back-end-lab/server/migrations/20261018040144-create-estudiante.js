'use strict';
/** @type {import('sequelize-cli').Migration} */
// crea la tabla estudiantes igual que el script que se corre en DBeaver
// (carnet, nombre, carrera, promedio) para que local y render sean iguales
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('estudiantes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      carnet: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true // no se puede repetir el carnet
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      carrera: {
        type: Sequelize.STRING(100)
      },
      promedio: {
        type: Sequelize.DECIMAL(4, 2), // NUMERIC(4,2): maximo 99.99
        defaultValue: 0
      }
    });
  },
  // para regresar la migracion: npx sequelize-cli db:migrate:undo
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('estudiantes');
  }
};
