import Sequelize from 'sequelize';

const sequelize = new Sequelize('cms', 'root', '00000', {
  dialect: 'mysql',
  host: 'localhost',
  logging: false
});

export default sequelize;

// Table definitions: 
