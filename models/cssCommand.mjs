import { BOOLEAN, INTEGER, NUMBER, STRING } from 'sequelize';
import sequelize from '../util/database.mjs';

const cssCommand = sequelize.define('css_command', {
    _id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        property: {
            type: STRING,
            allowNull: false
        },
        value: {
            type: STRING,
            allowNull: false
        },
        pseudoClass: STRING
}, {});

export default cssCommand;