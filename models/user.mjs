import { DATE, STRING, INTEGER } from 'sequelize';
import sequelize from '../util/database.mjs';

const user = sequelize.define('user', {
    _id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fname: {
        type: STRING,
        allowNull: false
    },
    lname: {
        type: STRING
    },
    email: {
        type: STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: STRING,
        allowNull: false 
    },
    userName: {
        type: STRING,
        allowNull: false,
        unique: true
    },
    bio: {
        type: STRING,
        defaultValue: "يا هلا بالرَّبع",
        //
    },
    birthDate: {
        type: STRING,
        allowNull: false
    }
});



export default user;