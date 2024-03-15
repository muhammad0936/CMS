import validator from 'validator';
// import models :
import User from '../../models/user.mjs';
import Template from '../../models/template.mjs';
import Element from '../../models/element.mjs';
import CssCommand from '../../models/cssCommand.mjs';

import createTemplateCode from '../../util/convertToHtmlCode.mjs';
import addStyle from '../../util/convertToCssCode.mjs';

import {Op, fn, col, literal} from 'sequelize'
import HtmlPageTemplate from '../../models/htmlPageTemplate.mjs';

export default {
    
createTemplate: async({templateInput}, req)=>{
    const {name, description} = templateInput;
    if(!req.session.isLoggedIn || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const validationErrors = [];
    if(name)
    if(!validator.isLength(name, {max: 50 })){
        validationErrors.push({message: 'Enter name with maximum length 50!'});
    }
    if(description )
    if(!validator.isAlphanumeric(description.replace(/\s+/g, ''))||!validator.isLength(description, {min:5,max:500})){
        validationErrors.push({message: 'The description must contain only alphabet letters and numbers with length between 5 and 500!'});
    }
    if(validationErrors.length > 0)
    {
        const error = new Error('Validation failed!');
        error.data = validationErrors;
        error.status = 422;
        throw error;
    }
    const template = await Template.create({name: name, description: description, creatorId: req.session.user._id});
    return 'Template created.';
},
editTemplate: async({templateInput}, req)=> {
    const {_id} = templateInput;
    if(!req.session.isLoggedIn || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const template = await Template.findByPk(_id);
    if(!template)
    {
        const error = new Error('Template not found!');
        error.status = 404;
        throw error;
    }
    for( let property in templateInput)
    {
        if(templateInput[property])
            template[property] = templateInput[property];
    }
    await template.save();
    return 'template has edited';
},
editTemplateOrder: async({input}, req)=> {
    if(!req.session.isLoggedIn || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const htmlPageTemplate = await HtmlPageTemplate.findByPk(input.htmlPageTemplateId);
    if(!htmlPageTemplate)
    {
        const error = new Error('Template not found in this page!');
        error.status = 404;
        throw Error;
    }
    const htmlPageTemplates = await HtmlPageTemplate.findAll({where:{htmlPageId: htmlPageTemplate.htmlPageId}});
    if(input.order > htmlPageTemplate.order)
    {
        for(let template of htmlPageTemplates)
        {
            if(template.order > htmlPageTemplate.order && template.order <= input.order)
                {
                    template.order--;
                    await template.save();
                }
        }
    }
    else if(input.order < htmlPageTemplate.order)
    {
        for(let template of htmlPageTemplates)
        {
            if(template.order < htmlPageTemplate.order && template.order >= input.order)
                {
                    template.order++;
                    await template.save();
                }
        }
    }
    htmlPageTemplate.order = input.order;
    await htmlPageTemplate.save();
    return 'Template order edited'
},
findTemplate: async({searchTemplate}, req)=> {
    if(!req.session.isLoggedIn || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    searchTemplate = searchTemplate.trim().replace(/\s+/g, ' ').toLowerCase();
    var templates = await Template.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchTemplate + '%' ||''
            }
        }
    });
    templates = templates.concat(await Template.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchTemplate.split(' ')[0] + searchTemplate.split(' ')[1] + searchTemplate.split(' ')[2] + '%' ||''
            },
            _id: {
                [Op.notIn]: templates.map(t=>t._id)
            }
        }
    }));
    templates = templates.concat(await Template.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchTemplate.split(' ')[0] + searchTemplate.split(' ')[1] + '%' ||''
            },
            _id: {
                [Op.notIn]: templates.map(t=>t._id)
            }
        }
    }));
    templates = templates.concat(await Template.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchTemplate.split(' ')[0] + '%' ||''
            },
            _id: {
                [Op.notIn]: templates.map(t=>t._id)
            }
        }
    }));
    templates = templates.concat(await Template.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchTemplate.split(' ')[1] + '%' ||''
            },
            _id: {
                [Op.notIn]: templates.map(t=>t._id)
            }
        }
    }));
    
    templates = templates.concat(await Template.findAll({
        where: {
            description: {
                [Op.like]: '%' + searchTemplate.split(' ')[0] + searchTemplate.split(' ')[1] + searchTemplate.split(' ')[2] + '%' ||''
            },
            _id: {
                [Op.notIn]: templates.map(t=>t._id)
            }
        }
    }));
    templates = templates.concat(await Template.findAll({
        where: {
            description: {
                [Op.like]: '%' + searchTemplate.split(' ')[0] + searchTemplate.split(' ')[1] + '%' ||''
            },
            _id: {
                [Op.notIn]: templates.map(t=>t._id)
            }
        }
    }));
    templates = templates.concat(await Template.findAll({
        where: {
            description: {
                [Op.like]: '%' + searchTemplate.split(' ')[0] + '%' ||''
            },
            _id: {
                [Op.notIn]: templates.map(t=>t._id)
            }
        }
    }));
    templates = templates.concat(await Template.findAll({
        where: {
            description: {
                [Op.like]: '%' + searchTemplate.split(' ')[1] + '%' ||''
            },
            _id: {
                [Op.notIn]: templates.map(t=>t._id)
            }
        }
    }));
    return templates
},
getUserTemplates: async({userId}, req)=> {
    const user = await User.findByPk(userId, {
        include: [{
            model: Template,
            as: 'Templates'
        }]
    });
    if(!req.session.isLoggedIn || !user)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    return user.Templates
},
getTemplate: async({templateId}, req)=> {
    if(!req.session.isLoggedIn || !req.session.user || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 422;
        throw error;
    }
    const template = await Template.findByPk(templateId, {
        include: [{
            model: Element,
            as: 'elements'
        }]
    });
    if(!template)
    {
        const error = new Error('Template not found!');
        error.status = 404;
        throw error;
    }
    return template
},

getHtmlTemplate: async({templateId}, req)=>{
    if(!req.session.isLoggedIn)
    {
        const error = new Error('Not authorized!');
        error.status = 403;
        throw error;
    }
const template = await Template.findByPk(templateId,{include: [{
    model: Element,
    as: 'elements',
    include: [{
        model: CssCommand,
        as: 'elementStyle'
    }]
}]
});
if(!template || !template.elements)
{
    const error = new Error('Template not found!');
    error.status = 404;
    throw error;
}
var outerDiv = template.elements.find(e=>e.parentId===null);
if(!outerDiv)
{
    const error = new Error('This is an empty template!');
    error.status = 403;
    throw error;
}

var templateCode = await createTemplateCode(outerDiv);
templateCode+= addStyle(template.elements);
console.log(templateCode)
return templateCode
},

deleteTemplate: async({templateId}, req)=>{
    if(!req.session.isLoggedIn)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const template = await Template.findByPk(templateId);
    if(!template)
    {
        const error = new Error('Template not found!');
        error.status = 404;
        throw error;
    }
    if(req.session.user._id !== template.creatorId)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    await template.destroy();
    return "Template has removed"
},

mergeTemplates: async({Ids}, req)=> {
    const {childId, parentId, parentElementId} = Ids;
    if(!req.session.isLoggedIn)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw  error;
    }
    const child = await Template.findByPk(childId, {
        include: [{
            model: Element,
            as: 'elements'
        }]
    });
    const parent = await Template.findByPk(parentId);
    const parentElement = await Element.findByPk(parentElementId);
    if(!child)
    {
        const error = new Error('Child template not found!');
        error.status = 404;
        throw error;
    }
    if(!parent)
    {
        const error = new Error('Parent template not found!');
        error.status = 404;
        throw error;
    }
    if(!parentElement)
    {
        const error = new Error('Parent element not found!');
        error.status = 404;
        throw error;
    }
    if(parentElement.templateId !== parent._id)
    {
        const error = new Error('Please choose a parent element from the parent template!');
        error.status = 403;
        throw error;
    }
    if(parent.creatorId !== req.session.user._id||
        child.creatorId !== req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    child.elements = child.elements.map(e=> {
        if(e.parentId === null)
            e.parentId = parentElementId;
        e.templateId = parent._id;
        return e;
    });
    for(let element in child.elements)
    {
        await child.elements[element].save();
    }
    await child.destroy();
    return "templates have merged."
},
}