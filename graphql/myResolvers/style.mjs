import validator from 'validator';
import Template from '../../models/template.mjs';
import Element from '../../models/element.mjs';
import CssCommand from '../../models/cssCommand.mjs';
export default {
    
giveStyle: async({cssCommands}, req)=>{
    if(!req.session.isLoggedIn)
    {
        const error = new Error('Not authorized!');
        error.status = 401;
        throw error;
    }
    const validationErrors = [];
    for( let c of cssCommands){
        if(!validator.isLength(c.property, {max:25}))
        {
            validationErrors.push({message: 'Too long property name!'});
        }
        if(!validator.isLength(c.value, {max: 100}))
        {
            validationErrors.push({message: 'Too long property value!'});
        }
        if(c.pseudoClass)
            if(!validator.isLength(c.pseudoClass, {min: 1, max: 30}))
            {
                validationErrors.push({message: 'Too long pseudo class!'});
            }
    }
    if(validationErrors.length>0)
    {
        const error = new Error('Validation failed!');
        error.data = validationErrors;
        error.status= 422;
        throw error;
    }
    const element = await Element.findByPk(cssCommands[0].elementId);
    if(!element)
    {
        const error = new Error('Element not found!');
        error.status = 404;
        throw error;
    }
    const template = await Template.findByPk(element.templateId);
    if(template.creatorId !== req.session.user._id)
    {
        const error = new Error('Not authorized');
        error.data = {message: 'You are trying to change the template you dont have!'};
        error.status = 401;
        throw error;
    }
    for( let c of cssCommands){
        const element = await Element.findByPk(c.elementId, {
            include:[{
            model:CssCommand,
            as:'elementStyle'
        }]
    });
        if(!element)
        {
            const error = new Error('Element not found!');
            error.status = 404;
            throw error;
        }
        const commandIndex = element.elementStyle.findIndex(e=>{return (e.property==c.property&&e.pseudoClass==c.pseudoClass)});
        if(commandIndex >= 0)
        { 
            const editedCommand = await CssCommand.findByPk(element.elementStyle[commandIndex]._id);
            editedCommand.value = c.value;
            await editedCommand.save()
        }
        else
            await CssCommand.create({property: c.property, value: c.value, pseudoClass: c.pseudoClass, elementId: c.elementId});
    }
        
    return 'Styles associated.'
},
}