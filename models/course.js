'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a title'
        },
        notEmpty: {
          msg: 'Please enter a title for the course'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a course description'
        },
        notEmpty: {
          msg: ' Please enter a course description'
        }
      }
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {});

  Course.associate = function(models) {
    Course.belongsTo(models.User, { 
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };
  return Course;
};