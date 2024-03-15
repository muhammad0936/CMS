export default `
input templateInputData{
    name: String
    description: String
}

input editTemplateInputData{
    _id: Int!
    name: String
    description: String
}

input editTemplateOrderInputData{
    htmlPageTemplateId: Int!
    order: Int!
}

input mergeTemplatesInputData{
    childId: Int!
    parentId: Int!
    parentElementId: Int!
}

type Template{
_id: Int
name: String
description: String
}

type fullTemplate{
    _id: Int
    name: String
    description: String
    elements: [Element]
}
`