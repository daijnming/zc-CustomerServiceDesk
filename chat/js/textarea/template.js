var template = {};

var tranfiletype = '<img src="'+'{{=it.fileIcon}}'+'" style="vertical-align: middle; margin-right: 2px;" class="uploadedFile"><a style="font-size:10px;" target="_blank" href="'+'{{=it.url}}'+'">'+'{{=it.filename}}'+'{{=it.extension}}'+'</a>';
var fileImage='<a href="' + '{{=it.url}}' + '" target="_blank"><img src="' + '{{=it.url}}' + '" class="webchat_img_upload upNowImg uploadedFile" /></a>';
var uploading='<div class="systeamTextBox systeamNowText js-systeamTextBox'+'{{=it.date}}'+'"><p class="systeamText">正在上传 '+'{{=it.filename}}{{=it.extension}}'+'</p></div>';

template.tranfiletype = tranfiletype;
template.fileImage = fileImage;
template.uploading = uploading;
module.exports = template;