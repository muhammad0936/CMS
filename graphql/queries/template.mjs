export default `
    findTemplate(searchTemplate: String!): [Template]!
    getUserTemplates(userId: Int!): [Template]!
    getTemplate(templateId: Int): fullTemplate!
    getHtmlTemplate(templateId: Int!): String!
`