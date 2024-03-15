export default `
    createTemplate(templateInput: templateInputData): String!
    deleteTemplate(templateId: Int!): String!
    editTemplate(templateInput: editTemplateInputData): String!
    editTemplateOrder(input: editTemplateOrderInputData): String!
    mergeTemplates(Ids: mergeTemplatesInputData): String!
`