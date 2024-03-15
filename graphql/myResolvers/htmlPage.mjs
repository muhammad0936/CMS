import User from '../../models/user.mjs';
import Template from '../../models/template.mjs';
import Element from '../../models/element.mjs';
import CssCommand from '../../models/cssCommand.mjs';
import HtmlPage from '../../models/htmlPage.mjs';

import createTemplateCode from '../../util/convertToHtmlCode.mjs';
import addStyle from '../../util/convertToCssCode.mjs';

import {Op} from 'sequelize'
import HtmlPageTemplate from '../../models/htmlPageTemplate.mjs';

export default {
    
createHtmlPage: async({ htmlPageInput},req)=> {
    const {name, description} = htmlPageInput;
    console.log(htmlPageInput)
    let user
    if(req.session.user)
    {
        user = await User.findByPk(req.session.user._id);
    }
    if(!req.session.isLoggedIn || !user)
    {
        const error = new Error('Not authorized!');
        error.status = 404;
        throw error;
    }
    console.log(name, ' ', description)
    await HtmlPage.create({
        name: name,
        description: description,
        creatorId: req.session.user._id
    });
    return 'Html Page created'
},
findHtmlPage: async({searchPage}, req)=> {
    if(!req.session.isLoggedIn || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    searchPage = searchPage.trim().replace(/\s+/g, ' ').toLowerCase();
    var pages = await HtmlPage.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchPage + '%' ||''
            }
        }
    });
    pages = pages.concat(await HtmlPage.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchPage.split(' ')[0] + searchPage.split(' ')[1] + searchPage.split(' ')[2] + '%' ||''
            },
            _id: {
                [Op.notIn]: pages.map(t=>t._id)
            }
        }
    }));
    pages = pages.concat(await HtmlPage.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchPage.split(' ')[0] + searchPage.split(' ')[1] + '%' ||''
            },
            _id: {
                [Op.notIn]: pages.map(t=>t._id)
            }
        }
    }));
    pages = pages.concat(await HtmlPage.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchPage.split(' ')[0] + '%' ||''
            },
            _id: {
                [Op.notIn]: pages.map(t=>t._id)
            }
        }
    }));
    pages = pages.concat(await HtmlPage.findAll({
        where: {
            name: {
                [Op.like]: '%' + searchPage.split(' ')[1] + '%' ||''
            },
            _id: {
                [Op.notIn]: pages.map(t=>t._id)
            }
        }
    }));
    
    pages = pages.concat(await HtmlPage.findAll({
        where: {
            description: {
                [Op.like]: '%' + searchPage.split(' ')[0] + searchPage.split(' ')[1] + searchPage.split(' ')[2] + '%' ||''
            },
            _id: {
                [Op.notIn]: pages.map(t=>t._id)
            }
        }
    }));
    pages = pages.concat(await HtmlPage.findAll({
        where: {
            description: {
                [Op.like]: '%' + searchPage.split(' ')[0] + searchPage.split(' ')[1] + '%' ||''
            },
            _id: {
                [Op.notIn]: pages.map(t=>t._id)
            }
        }
    }));
    pages = pages.concat(await HtmlPage.findAll({
        where: {
            description: {
                [Op.like]: '%' + searchPage.split(' ')[0] + '%' ||''
            },
            _id: {
                [Op.notIn]: pages.map(t=>t._id)
            }
        }
    }));
    pages = pages.concat(await HtmlPage.findAll({
        where: {
            description: {
                [Op.like]: '%' + searchPage.split(' ')[1] + '%' ||''
            },
            _id: {
                [Op.notIn]: pages.map(t=>t._id)
            }
        }
    }));
    return pages
},
addToHtmlPage: async({addToHtmlPageInput}, req) => {
    let { htmlPageId, templateId, order } = addToHtmlPageInput;
    if(!req.session.isLoggedIn || !req.session.user || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const htmlPage = await HtmlPage.findByPk(htmlPageId,{
        include: [{
            model: Template,
            as: 'templates'
        }]
    });
    if(!htmlPage)
    {
        const error = new Error('Html page not found!');
        error.status = 404;
        throw error;
    }
    const template = await Template.findByPk(templateId);
    if(!template)
    {
        const error = new Error('Template not found!');
        error.status = 404;
        throw error;
    }
    if(htmlPage.creatorId !== req.session.user._id || template.creatorId !== req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const siblings = await HtmlPageTemplate.findAll({
        where: {
            htmlPageId: htmlPageId
        }
    });
    order = (!order || (order > siblings.length) || order < 1)? siblings.length+1: order;
    const siblingsToUpdate = await HtmlPageTemplate.findAll({
        where: {
            htmlPageId: htmlPageId, 
            order: {
                [Op.gte]: order
            }
        }
    });
    for( let template of siblingsToUpdate)
    {
        template.order+=1;
        await template.save();
    }
    
    await HtmlPageTemplate.create({templateId: templateId, htmlPageId: htmlPageId, order: order});
    return 'template added.'
},

getHtmlPage: async({htmlPageId}, req) => {
    if(!req.session.isLoggedIn || !req.session.user || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const htmlPage = await HtmlPage.findByPk(htmlPageId, {
        include: [{
            model: Template,
            as: 'templates',
            include: [{
                model: Element,
                as: 'elements',
                include: [{
                    model: CssCommand,
                    as: 'elementStyle'
                }]
            }]
        }]
    });
    if(!htmlPage.templates[0])
    {
        const error = new Error('This page is empty!');
        error.status = 403;
        throw error;
    }
    var htmlPageCode = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>`;
    let allElements = [];
    for(let template of htmlPage.templates)
    {
        allElements = allElements.concat(template.elements)
        const outerDiv = template.elements.find(e => e.parentId === null);
        if(!outerDiv)
            continue
        var templateCode = await createTemplateCode(outerDiv);
        htmlPageCode+= templateCode;
    }
    htmlPageCode+= addStyle(allElements);
    htmlPageCode+= `
    </body>
    </html>`
    console.log(htmlPageCode);
    return htmlPageCode;
},
getHtmlPageTemplates: async({htmlPageId}, req) => {
    if(!req.session.isLoggedIn || !req.session.user || !req.session.user._id)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const htmlPageTemplates = await HtmlPageTemplate.findAll({where: {htmlPageId: htmlPageId}});
    const templates = [];
    for(let t of htmlPageTemplates)
    {
        const template = await Template.findByPk(t.templateId);
        templates.push({...t.dataValues,...template.dataValues});
    };
    return templates
}
}