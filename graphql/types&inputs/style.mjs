export default `
input cssCommandInput {
    elementId: Int!
    property: String!
    value: String!
    pseudoClass: String
}

type cssCommand{
    _id: Int
    property: String
    value: String
    pseudoClass: String
}
`