
var Fastlayer = function(node,core,config){

  // event();
  //TODO 规定
  /*
  * 没有特殊意义
  * 所有 var onXX = function(){} 全在bindLitener中定义
  * 所有 function onXX = function(){} 均是在方法内部引用执行
  */
    var global = core.getGlobal();
    //参数
    var fastData = config.fastData;
    var id = config.id;
    config.repBtnType = true;//隐藏添加新回复按钮
    var That = this;
    //全局配置参数
    var alertList = {
      l001:'确定删除该快捷分组？',
      l002:'确定删除该快捷回复？'
    };

    //TODO 预加载对象
    // var someOne;
    var loadNode;//快捷回复列表
    var fastNode;//弹出层快捷回复列表
    var oFastLeft;//弹出层快捷回复组
    var oFastRight;//弹出层快捷回复
    var oAddNewGroup;//添加新分组
    var oAddNewRep;//添加新回复
    var oDialogArea;//弹出层

    //TODO 模板/js/资源引用

  	var parseDOM = function() {
      fastNode = node;
      oFastLeft = $(fastNode).find('.js-leftContent ul');
      oFastRight = $(fastNode).find('.js-rightContent ul');
      oAddNewGroup = $(fastNode).find('.js-addNewGroup');
      oAddNewRep = $(fastNode).find('.js-addNewRep');
      oDialogArea = $(fastNode).find('.js-content');
  	};
    //触发快捷回复更新
    var onReLoadHandler = function(boo){
      $(node).find('.js-quickContent ul li.detalBar span').removeClass('hide');
      $($(node).find('.js-quickLeft ul li')[0]).find('span.upLeftGroup').addClass('hide');
      $($(node).find('.js-quickRight ul li')[0]).find('span.upRightRep').addClass('hide');
      if(boo)$(document.body).trigger('rightside.oReLoadRightGroup');
    };
    //点击左侧快捷回复分组条
    var onFastTap = function(){
      var $this = $(this);
      $this.addClass('activeLine').siblings('li').removeClass('activeLine');
       $this.find('input').addClass('activeLine').parent('li').siblings('li').find('input').removeClass('activeLine');
       //清空右侧回复
       var oLi =$(oFastRight).find('li');
       $(oLi).removeClass('show');
       for(var i=0;i<oLi.length;i++){
         if($(oLi[i]).attr('gid')==$this.attr('gid')){
           $(oLi[i]).addClass('show');
           $(oLi[i]).find('input').removeClass('hide');
         }
       }
       //判断是否有选中分组名称
       if($this.hasClass('activeLine'))$(oAddNewRep).show();else $(oAddNewRep).hide();
    };

    //快捷删除
    var onDelFast = function(){
      var $this = $(this);
      var title,
          oIndex,
          cId,
          url,
          sendId,
          data;
      if($this.siblings('input').attr('utype')=='left'){
          title = alertList.l001;
          cId = $this.parent('.detalBar').attr('gid');
          url = 'reply/delreplyGroup.action';
          sendId = 'groupId';
          data={
            'groupId':cId,
            'userId':id
          };
      }else{
          title = alertList.l002;
          cId = $this.parent('.detalBar').attr('qid');
          url = 'quick/delquickReply.action';
          sendId = 'id';
          data={
            'groupId':cId,
            'userId':id
          };
      }
      $this.text('确认删除');
      //确认删除
      if($this.hasClass('sureDel')){
        // if(confirm(title)){
          if(cId)
          {
            $.ajax({
              type:"post",
              url:url,
              data:data,
              dataType:"json",
              success:function(data){
                if(data.status)
                {
                  $this.parent('.detalBar').animate({
                    'height':0
                  },300,function(){
                    $this.parent('.detalBar').remove();
                  });
                  onReLoadHandler(true);
                }
              }
            });
          }
      // }
      }else $this.addClass('sureDel');
  };

  //快捷置顶
  var onUpFast = function(){
    var $this = $(this);
    var url,
        sendId,
        cId,
        data;
    if($this.siblings('input').attr('utype')=='left'){
      url = 'reply/setTopGroup.action';
      cId = $this.parent('.detalBar').attr('gid');
      sendId = 'groupId';
      data ={
        'groupId':cId,
        'userId':id
      };

    }else{
      url = 'quick/setTopReply.action';
      cId = $this.parent('.detalBar').attr('qid');
      sendId="id";
      data={
        'id':cId,
        'userId':id
      };
    }
    if(sendId){
      $.ajax({
        type:"post",
        url:url,
        data:data,
        dataType:"json",
        success:function(data){
          if(data.status)
          {
            var oLi = $this.parent('li');
            var oUl = $this.parents('ul');
            $(oLi).find('input').animate({
              'height':35
            },200,function(){
              $(oUl).prepend(oLi);
              $(oLi).find('input').css('height',30);
            });
            onReLoadHandler(true);
          }
        }
      });
    }
  };
  var onFastkeyParess = function(e){
    var $that = $(this);
    var key = e.which;
      if (key == 13&&!e.shiftKey) {
        $that.blur();
        // console.log('e');
        return false;
      }
  };
    var onFastBlur = function(evn){
      if($(oFastLeft).find('li').hasClass('activeLine'))$(oAddNewRep).show();else $(oAddNewRep).hide();
      var $this = $(this);
      if($this.val().replace(/(^\s*)|(\s*$)/g,"")===""||$this.val()===null||$this.val()===undefined){
        var oGroupId =$this.parent('li.detalBar').attr('gid');
        //

        if(oGroupId)							//修改分组名
        {
          $this.val(That.inputText);

        }else{

          $this.parent('li.detalBar').remove();
        }
        // This.leftfocus=false;
        return;
      }
      // console.log($this.val()+":"+That.inputText);
      if($this.val()==That.inputText){
        //未做任何修改
        return;
      }
        if($this.attr('utype')=='left') onFastBlurs.onFastLeftBlurSaveData($this);//左侧快捷分组
        else onFastBlurs.onFastRightBlurSaveData($this);//右侧快捷回复

    };
    var onFastFocus = function(){
      That.inputText = $(this).val();
    };
    //初始化数据
  	var onloadHandler = function() {
      config.repBtnType = false;
  };

  var onAddNewFast = function(evn){
    //清除新加框 class
    $(node).find('.js-content ul li').find('input').removeClass('newInput');
    var obj = evn.target.className==='js-addNewGroup'?oFastLeft:oFastRight;
    var clsDelName,
        clsUpName,
        utype;
        //判断分组还是回复
    if(obj==oFastLeft){
      clsDelName = 'delLeftGroup';
      clsUpName = 'upLeftGroup';
      utype='left';
    }else{
      clsDelName = 'delRightGroup';
      clsUpName = 'upRightGroup';
      utype='right';
    }
    var template = require('./template.js');
    var conf = $.extend({
        "utype" :utype,
        "clsDelName" : clsDelName,
        'clsUpName' : clsUpName
    });
      var _html = doT.template(template.zcReplyOuter)(conf);
      var oListInput = $(obj).find('li')[$(obj).find('li').length-1];
    if($(obj).find('li').length > 0){
      if(!$(oListInput).find('input').val()){
        $(oListInput).remove();
      }else{
        $(obj).append(_html);
        $(node).find('.js-content li input.newInput').focus();
      }
    }else{
      $(obj).append(_html);
    }
  };
  var onDialogArea = function(){
    var oListInput = $(oFastLeft).find('li')[$(oFastLeft).find('li').length-1];
    if($(oFastLeft).find('li').length > 0){
      if(!$(oListInput).find('input').val()){
        $(oListInput).remove();
      }
    }
  };
  //失去焦点保存数据
  var onFastBlurs = {
    //左侧快捷分组
    onFastLeftBlurSaveData:function(obj){
            var $this = $(obj);
            var oGroupId = $this.parent('li.detalBar').attr('gid');
            var groupName = $(obj).val().replace(/(^\s*)|(\s*$)/g,"");
            if(oGroupId)							//修改分组名
            {
              var upGroupNameUrl = 'reply/updreplyGroup.action';   //?groupId='+ oGroupId +'&&groupName=' + groupName;
              $.ajax({
                type:"post",
                url:upGroupNameUrl,
                data:{
                  'groupId':oGroupId,
                  'groupName':groupName,
                  'userId':id
                },
                dataType:"json",
                success:function(data){
                  if(data.status)
                  {
                    onReLoadHandler(true);
                     $(obj).val(groupName);
                  }
                }
              });
            }
            else						//新增分组
            {
               var addGroupUrl = 'reply/addreplyGroup.action';//?groupName='+ groupName +'&&userId='+ myid +'&&companyId=' + This.companyId;
               $.ajax({
                type:"post",
                url:addGroupUrl,
                data:{
                  'groupName':groupName,
                  'userId':id
                },
                dataType:"json",
                success:function(data){
                  if(data.status)
                  {
                    onReLoadHandler(true);
                  }
                }
              });
            }
    },
    //右侧快捷回复
    onFastRightBlurSaveData:function(obj){
                var $this = $(obj);
                var oLi = $this.parent('.detalBar');
      					var oInde = $(oLi).index();
      					var oGroupId = $(oLi).attr('gid');
      					var oText = $this.val();
      					var oQuickid = oLi.attr('qid');
      					// $this.html("正在保存...");
      					if(oQuickid)								//修改
      					{
      						var changeQuickUrl = 'quick/updquickReply.action';//?id='+ oQuickid +'&&value='+ oText;
      						$.ajax({
      							type:"post",
      							url:changeQuickUrl,
      							data:{
      								'id':oQuickid,
      								'value':oText,
      								'userId':id
      							},
      							dataType:"json",
      							success:function(data){
      								if(data.status)
      								{
                        onReLoadHandler(true);
      								}
      							}
      						});
      					}
      					else										//添加
      					{
                  //获取分组id
                  var li = $(oFastLeft).find('li');
                  if($(oFastLeft)&&li.length>0){
                    for (var i = 0; i < li.length; i++) {
                      if($(li[i]).hasClass('activeLine'))oGroupId=$(li[i]).attr('gid');
                    }
                  }
      						var addQuickUrl = 'quick/addquickReply.action';//?groupId='+ oGroupId +'&&value='+ oText;
      						$.ajax({
      							type:"post",
      							url:addQuickUrl,
      							data:{
      								'groupId':oGroupId,
      								'value':oText,
      								'userId':id
      							},
      							dataType:"json",
      							success:function(data){
      								if(data.status)
      								{
      									onReLoadHandler(true);
      								}
      							}
      						});
      					}
    }
};
//取消删除
var onCancalDel = function(){
  $(node).find('.delLeftGroup').removeClass('sureDel');
  $(node).find('.delRightRep').removeClass('sureDel');
  $(oFastLeft).find('.delLeftGroup').text('删除');
  $(oFastRight).find('.delLeftRep').text('删除');
};
var bindLitener = function() {
  onloadHandler();
  $(oFastLeft).on('click','li',onFastTap);
  $(oFastLeft).on('click','span.delLeftGroup',onDelFast);
  $(oFastLeft).on('click','span.upLeftGroup',onUpFast);
  $(oFastLeft).on('keypress','input',onFastkeyParess);
  $(oFastLeft).on('blur','input',onFastBlur);
  $(oFastLeft).on('focus','input',onFastFocus);
  ///
  $(oFastRight).on('click','span.delRightRep',onDelFast);
  $(oFastRight).on('click','span.upRightRep',onUpFast);
  $(oFastRight).on('keypress','input',onFastkeyParess);
  $(oFastRight).on('blur','input',onFastBlur);
  $(oFastRight).on('focus','input',onFastFocus);
  //
  $(oAddNewGroup).on('click',onAddNewFast);
  $(oAddNewRep).on('click',onAddNewFast);
  //取消删除
  $(oFastLeft).delegate('li','mouseleave',onCancalDel);

};
var initConfig = function(){
  if($(node).find('.js-content .js-leftContent li.activeLine').length<=0)  $(oAddNewRep).hide();
  else  $(oAddNewRep).show();
};
var init = function() {
	parseDOM();
	bindLitener();
  onReLoadHandler();
  initConfig();
};
init();
};
module.exports = Fastlayer;
