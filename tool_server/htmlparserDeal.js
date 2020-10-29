/**
 * head 标签内的元素 
 * 只保留 正常的script link 元素 
 * 对于meta标签  脚本的 prelaod prefetch 统统删除。
 */

const cheerio = require('cheerio');
const logger = require("./logger")(__filename);

module.exports = function htmlparserDeal(htmlResourceData){
    try {
        const $ = cheerio.load(htmlResourceData);
    
        $('head').children().each(function(index, element){
            const tagNameWhiteList = ['script','link'];
            let tagName = element.tagName.toLowerCase();
    
            if(tagNameWhiteList.includes(tagName)){
                const elementAttrRel = $(this).attr('rel');
                if(elementAttrRel == 'preload') $(this).remove();
            }else{
                $(this).remove()
            }
        })
    
        $('#__next').attr('id','__next_rich_text_server')
        let headHtmlStr = $('head').html();
        let bodyHtmlStr = $('body').html();
        return `<head>${headHtmlStr}</head>${bodyHtmlStr}`;
    } catch (error) {
        logger.error('html parser error :', error);
    }   
}


