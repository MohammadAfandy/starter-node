'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('calendar', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      day_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      day: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('default', 'holiday', 'leave'),
        allowNull: false,
        defaultValue: 'default',
      },
      is_dayoff: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.STRING,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      updated_by: {
        type: Sequelize.INTEGER,
      },

      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }).then(() => {
      queryInterface.addConstraint('calendar', {
        fields: ['day', 'month', 'year'],
        type: 'unique',
        name: 'idx_calendar_unique_day_month_year'
      });
      queryInterface.addConstraint('calendar', {
        fields: ['date'],
        type: 'unique',
        name: 'idx_calendar_unique_date'
      });
      queryInterface.addIndex('calendar', ['type'], { name: 'idx_calendar_type' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('calendar');
  }
};
