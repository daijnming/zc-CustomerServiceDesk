var template = {};

var zcReplyOuter = '<li class="js-detalBar detalBar show"><input utype="'
+'{{=it.utype}}'+
'" type="text" class="newInput" maxlength={{=it.maxlength}} placeholder="请输入..." ><span class="'
+'{{=it.clsDelName}}'+
'">删除</span><span class="'
+'{{=it.clsUpName}}'+'" >置顶</span></li>';

template.zcReplyOuter = zcReplyOuter;

module.exports = template;
