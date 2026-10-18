'use strict';
/** @type {import('sequelize-cli').Migration} */
// migracion generada con: npx sequelize-cli model:generate --name Estudiante ...
// le agregue allowNull y unique para que no se guarden registros vacios
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Estudiantes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // no se puede repetir el correo
      },
      carrera: {
        type: Sequelize.STRING
      },
      edad: {
        type: Sequelize.INTEGER
      },
      // fechas que llena sequelize solo
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  // para regresar la migracion: npx sequelize-cli db:migrate:undo
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Estudiantes');
  }
};
