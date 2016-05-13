/**
 * @author Treagzhao
 */
var template = {};

var zcShadowLayer = '<div class="zc-shadow-layer">'+
'</div>';

var zcModalOuter = ''+
'<div class="bootbox  fade in" tabindex="-1" role="dialog" aria-hidden="false" style="display: block;">'+
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
            '<div class="modal-header">'+
                '<button type="button" class="bootbox-close-button close" data-dismiss="modal" aria-hidden="true">'+
                    '×'+
                '</button><h4 class="modal-title">{{=it.title || "提示"}}</h4>'+
            '</div>'+
            '<div class="modal-body">'+

            '</div>'+
            '{{ if((it.footer !== false) ) { }}'+
            '<div class="modal-footer">'+
                '<button class="btn btn-danger js-cancel-btn">'+
                    '{{=it.cancelText || "取消"}}'+
                '</button>'+
                '<button class="btn btn-success js-ok-btn">'+
                    '{{=it.okText || "确定"}}'+
                '</button>'+
            '</div>'+
            '{{ } }}'+
        '</div>'+
    '</div>'+
'</div>'+
'';

var zcAlertTemplate = ''+
    '<div class="modal-alert-content">'+
        '<p class="large">{{=it.text}}</p>'+
        '<p>{{=it.info}}</p>'+
    '</div>'+
'';
template.zcAlertTemplate= zcAlertTemplate;
template.zcModalOuter = zcModalOuter;
template.zcShadowLayer=zcShadowLayer;

module.exports = template;
