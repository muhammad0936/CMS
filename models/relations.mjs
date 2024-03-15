import sequelize from '../util/database.mjs';

import User from './user.mjs';
import Template from './template.mjs';
import Element from './element.mjs';
import CssCommand from './cssCommand.mjs';
import HtmlPage from './htmlPage.mjs';
import htmlPageTemplates from './htmlPageTemplate.mjs';
export default async()=> {
User.belongsToMany(User, { 
  through: 'Follows', 
  foreignKey: 'followerId', 
  otherKey: 'followedId',
  as: 'followed'
});

User.belongsToMany(User, { 
  through: 'Follows', 
  foreignKey: 'followedId', 
  otherKey: 'followerId',
  as: 'follower'
});

User.hasMany(HtmlPage, {
  foreignKey: 'creatorId',
  as: 'htmlPage'
});

HtmlPage.belongsTo(User, {
  foreignKey: 'creatorId',
  as: 'creator'
});

HtmlPage.belongsToMany(Template, {
  through: {model: htmlPageTemplates, unique: false},
  foreignKey: htmlPageTemplates.templateId,
  otherKey: htmlPageTemplates.htmlPageId, 
  as: 'templates',
  // onDelete: 'CASCADE'
});

Template.belongsToMany(HtmlPage, {
  through: {model: htmlPageTemplates, unique: false},
  foreignKey: htmlPageTemplates.htmlPageId, 
  otherKey: htmlPageTemplates.templateId,
  as: 'templateHtmlPage'
});


User.hasMany(Template, {
  foreignKey: 'creatorId',
  as: 'Templates'
});


Template.belongsTo(User, {
  foreignKey: 'creatorId',
  as: 'creator'
});

Template.hasMany(Element, {
  foreignKey: 'templateId',
  as: 'elements',
  onDelete: 'CASCADE'
});

Element.belongsTo(Template, {
  foreignKey: 'templateId',
  as: 'template'
});

Element.hasMany(Element, {
  as: 'childElements',
  foreignKey: 'parentId',
  onDelete: 'CASCADE'
});

Element.belongsTo(Element, {
  as: 'parentElement',
  foreignKey: 'parentId'
});

Element.hasMany(CssCommand, {
  foreignKey: 'elementId',
  as: 'elementStyle',
  onDelete: 'CASCADE'
});

CssCommand.belongsTo(Element, {
  foreignKey: 'elementId',
  as: 'element'
});

await sequelize.sync();
}