'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a first name"
        },
        notEmpty: {
          msg: "Please enter your first name."
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a last name"
        },
        notEmpty: {
          msg: "Please enter your last name."
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a valid email"
        },
        notEmpty: {
          msg: "Please enter an email address."
        },
        isEmail: {
          msg: 'Please provide a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a password."
        },
        notEmpty: {
          msg: "Please provide a password."
        }
      }
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Course, { 
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };
  return User;
};