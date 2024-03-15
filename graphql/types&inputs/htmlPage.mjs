export default `
input createHtmlPageInputData{
    name: String
    description: String
}

input addToHtmlPageInputData{
    htmlPageId: Int!
    templateId: Int!
    order: Int
}

type htmlPage{
    _id: Int
    name: String
    description: String
}

type htmlPageTemplate{
    _id: Int!
    templateId: Int!
    order: Int!
    name: String!
    description: String
}
`