import element from './myResolvers/element.mjs';
import htmlPage from './myResolvers/htmlPage.mjs';
import style from './myResolvers/style.mjs';
import template from './myResolvers/template.mjs';
import user from './myResolvers/user.mjs';

export default {
    ...element,
    ...htmlPage,
    ...style,
    ...template,
    ...user
 }

