import { INTEGER, STRING } from 'sequelize';
import sequelize from '../util/database.mjs';
const htmlPageTemplates = sequelize.define('htmlPageTemplate', {
    _id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order : {
        type: INTEGER,
        allowNull: false
    },
    templateId: {
        type: INTEGER,
        allowNull: false,
        unique: false
    },
    htmlPageId: {
        type: INTEGER,
        allowNull: false,
        unique: false
    }
    
});

export default htmlPageTemplates;