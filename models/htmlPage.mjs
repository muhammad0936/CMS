import { INTEGER, STRING } from 'sequelize';
import sequelize from '../util/database.mjs';

const htmlPage = sequelize.define('htmlPage', {
    _id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING,
        defaultValue: 'htmlPage ' + Date.now()
    },
    description: STRING
},{
    // paranoid: true
});

export default htmlPage;