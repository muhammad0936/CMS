let cssCode = '';
export default function addStyle(templateElements){
    cssCode = '\n<style>\n';
    for(let element of templateElements){
        if(!element.elementStyle[0])
            continue;
        cssCode+= '#'+ 'element'+element.dataValues._id +
        (element.dataValues.pseudoClass? ': '+element.dataValues.pseudoClass: '')+'{\n';
        for(let cssCommand of element.elementStyle)
        {
            cssCode+= cssCommand.dataValues.property+': '+cssCommand.dataValues.value+';\n';
        }
        cssCode+= '}\n';
    };
    cssCode += '\n</style>';
    return cssCode;
}