import { buildSchema } from 'graphql';
// Import types and inputs
import elementTypes from './types&inputs/element.mjs';
import htmlPageTypes from './types&inputs/htmlPage.mjs';
import styleTypes from './types&inputs/style.mjs';
import templateTypes from './types&inputs/template.mjs';
import userTypes from './types&inputs/user.mjs';
// Import queries
import elementQueries from './queries/element.mjs';
import htmlPageQueries from './queries/htmlPage.mjs';
import styleQueries from './queries/style.mjs';
import templateQueries from './queries/template.mjs';
import userQueries from './queries/user.mjs';
// Import mutations
import elementMutations from './mutations/element.mjs';
import htmlPageMutations from './mutations/htmlPage.mjs';
import styleMutations from './mutations/style.mjs';
import templateMutations from './mutations/template.mjs';
import userMutations from './mutations/user.mjs';
export default buildSchema(`
    ${elementTypes}
    ${htmlPageTypes}
    ${styleTypes}
    ${templateTypes}    
    ${userTypes}
type rootQuery{
    ${elementQueries}
    ${htmlPageQueries}
    ${styleQueries}
    ${templateQueries}
    ${userQueries}    
}

type rootMutation {
    ${elementMutations}
    ${htmlPageMutations}
    ${styleMutations}
    ${templateMutations}
    ${userMutations}    
}
schema {
    query: rootQuery
    mutation: rootMutation
}
`)