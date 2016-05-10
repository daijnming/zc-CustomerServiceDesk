/**
 * @author Treagzhao
 */


var template = {};

template.listItem = ''+
	'<li title="{{=it.uname}}" >'+
	'<a href="javascript:;" class="user"  name="{{=it.uname}}" usource="0" data-uid="c8502966db3f40538794a4e9ab9a8c49"><i class="fa fa-laptop"><span class="newIcon"></span></i><span class="uname" style="width: 230px;">{{=it.uname}}</span><span class="lastMsg"><span style="color:#ffad01">sfsad</span></span><span class="badge badge-red msg-count"></span><i class="user-del"  style="display: none;"><span class="newIcon"></span></i><span class="ohide">{{=it.uname}}</span></a>'+
'</li>'+
'';

module.exports = template;
