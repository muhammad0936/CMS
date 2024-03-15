export default `
    findHtmlPage(searchPage: String!): [htmlPage]!
    getHtmlPage(htmlPageId: Int!): String!
    getHtmlPageTemplates(htmlPageId: Int!): [htmlPageTemplate]!
    `