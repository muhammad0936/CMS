import Template from '../../models/template.mjs';
import Element from '../../models/element.mjs';

import allHtmlElements from '../../util/htmlElements.mjs';

import {Op} from 'sequelize'

export default {
    
createElement: async({elementInput}, req)=>{
    elementInput.parentId = elementInput.parentId || null;
    if(!req.session.isLoggedIn || !req.session.user || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 422;
        throw error;
    }
    const template = await Template.findOne({
        where: {_id: elementInput.templateId},
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
    if(req.session.user._id !== template.creatorId)
    {
        const error = new Error('Not authorized');
        error.data = {message: 'You are trying to change the template you dont have!'};
        error.status = 401;
        throw error;
    }
    elementInput.elementName = elementInput.elementName.toLowerCase();
    const isExists = allHtmlElements.htmlElements.findIndex(e => e === elementInput.elementName);
    if(isExists == -1)
    {
        const error = new Error();
        error.data = {message: 'Choose a valid html element!'};
        error.status = 422;
        throw error;    
    }

    const parentElement = await Element.findByPk(elementInput.parentId);
    // console.log(parentElement)
    if(template.elements[0] && !parentElement)
    {
        const error = new Error('Parent element not found!');
        error.status = 422;
        throw error;
    }
    // console.log(elementInput.templateId)
    // console.log(parentElement.templateId)
    if(parentElement&& (parentElement.templateId !== elementInput.templateId))
    {
        const error = new Error('Choose an element from the template you deal with please!');
        error.status = 400;
        throw error;
    }
    elementInput.parentId = (template.elements[0])?elementInput.parentId: null;
    const siblings = await Element.findAll({
        where: { parentId: elementInput.parentId}
    });
    console.log(siblings.length)
    if(!elementInput.order || elementInput.order > siblings.length+1 || elementInput.order<0 )
         elementInput.order = siblings.length+1
    const siblingsToUpdate = await Element.findAll({
        where: {
            parentId: elementInput.parentId,
            order: {
                [Op.gte]: elementInput.order
            }
        }
    });
    for (let sibling of siblingsToUpdate) {
        sibling.order++;
        await sibling.save();
    }
    const createdElement = await Element.create(elementInput);
    createdElement.id = "element"+createdElement._id;
    await createdElement.save();
    await createdElement.setParentElement(parentElement);
    return 'element created.';
},

deleteElement: async({elementId}, req) => {
    if(!req.session.isLoggedIn)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const element = await Element.findByPk(elementId);
    if(!element)
    {
        const error = new Error('Element not found!');
        error.status = 404;
        throw error;
    }
    const template = await Template.findByPk(element.templateId);
    if(!template)
    {
        const error = new Error('Template not found!');
        error.status = 404;
        throw error;
    }
    if(template.creatorId !== req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    await element.destroy();
    return 'Element has deleted.';
},

editElement: async({elementInput}, req)=> {
    if(!req.session.isLoggedIn || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const { _id } = elementInput;
    const element = await Element.findByPk(_id);
    if(!element)
    {
        const error = new Error('Element not found!');
        error.status = 404;
        throw error;
    }
    const template = await Template.findByPk(element.templateId);
    if(!template)
    {
        const error = new Error('Template not found!');
        error.status = 404;
        throw error;
    }
    if(elementInput.order && element.order >= elementInput.order)
    {
        const siblings = await Element.findAll({
            where: {
                parentId: element.parentId,
                order: {
                    [Op.and]: {
                        [Op.gte]: elementInput.order,
                        [Op.lt]: element.order
                    }
                }
            }
        });
        for(let element of siblings)
        {
            element.order++
            await element.save();
        }
    }
    else if(elementInput.order && element.order < elementInput.order)
    {
        const siblings = await Element.findAll({
            where: {
                parentId: element.parentId,
                order: {
                    [Op.and]: {
                        [Op.gt]: element.order ,
                        [Op.lte]: elementInput.order
                    }
                }
            }
        });
        for(let element of siblings)
        {
            element.order--
            await element.save();
        }
    }
    for( let property in elementInput)
    {
        if(['_id','parentId','templateId','updatedAt','createdAt'].includes(property))
            continue;
        element[property] = elementInput[property];
    }

    await element.save();
    return `Element with id {${element._id}} has edited.`
},
}