import Element from '../models/element.mjs'
var htmlTemplateCode = '';
export default async function createTemplateCode(outerDiv, level = 0){
    // Create a string of tabs equal to the current level
    let tabs = '\t'.repeat(level);

    //Append the name of the element and it's properties:
    htmlTemplateCode += tabs + '<' +
    outerDiv.dataValues.elementName || 'div';
    for(let property in outerDiv.dataValues ){
        if(outerDiv.dataValues[property] &&
                !['_id','elementName','content','createdAt','updatedAt','templateId','parentId','elementStyle','childElements']
                .includes(property))
        {
            htmlTemplateCode+= ' '+
            property+
            '="'+outerDiv.dataValues[property]+
            '"';
        }
    }
    htmlTemplateCode+= '> \n';
    //****

    //Processing the content: 

    if (outerDiv.dataValues.content) {
        let contentLines = outerDiv.dataValues.content.split('\n');
        for (let i = 0; i < contentLines.length; i++) {
            htmlTemplateCode += tabs + '\t' + contentLines[i] + '\n';
        }
    }
    //****
    const outerDiv2 = await Element.findByPk(outerDiv._id, {
        include: [{
            model: Element,
            as: 'childElements'
        }]
    })
    if(outerDiv2.dataValues.childElements)
    for(let child of outerDiv2.childElements)
    {
        await createTemplateCode(child , level + 1);
    }

    //Close the tag:
    htmlTemplateCode+= tabs + '</'+((outerDiv.dataValues.parentId!== null)?outerDiv.dataValues.elementName:'div')+'>\n';
    //*****
    
    // So that it doesn't append the template code again if it called the function multiple times
    const returnedValue = htmlTemplateCode;
    if(!outerDiv.dataValues.parentId)
        htmlTemplateCode = '';
    return returnedValue;
}
