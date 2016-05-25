var template = {};

var tranfiletype = '<img style="vertical-align: middle; margin-right: 2px;" src="'+'{{=it.fileIcon}}'+'"><a style="font-size:10px;" target="_blank" href="'+'{{=it.url}}'+'">'+'{{=it.filename}}'+'{{=it.extension}}'+'</a>';
var fileImage='<img class="webchat_img_upload upNowImg" src="' + '{{=it.url}}' + '" />';

template.tranfiletype = tranfiletype;
template.fileImage = fileImage;
module.exports = template;