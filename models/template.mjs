import { INTEGER, STRING } from 'sequelize';
import sequelize from '../util/database.mjs';

const template = sequelize.define('template', {
    _id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING,
        defaultValue: 'template ' + Date.now()
    },
    description: STRING
},{
    // paranoid: true
});


export default template;