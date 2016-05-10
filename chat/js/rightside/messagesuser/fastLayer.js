
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
      L001:'确定删除该快捷分组？',
      L002:'确定删除该快捷回复？'
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

    var onFastMouseOver = function(){
      var $this = $(this);
      $this.addClass('active').siblings('li').removeClass('active');
      $this.find('input').addClass('active').parent('li').siblings('li').find('input').removeClass('active');
    };
    var onFastMouseLeave = function(){
      var $this = $(this);
      $this.removeClass('active');
      $this.find('input').removeClass('active');//.blur();
      //if($(this).find('input').hasClass('activeLine'))$(this).find('input').blur();
    };
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
          title = alertList.L001;
          cId = $this.parent('.detalBar').attr('gid');
          url = 'reply/delreplyGroup.action';
          sendId = 'groupId';
          data={
            'groupId':cId,
            'userId':id
          };
      }else{
          title = alertList.L002;
          cId = $this.parent('.detalBar').attr('qid');
          url = 'quick/delquickReply.action';
          sendId = 'id';
          data={
            'groupId':cId,
            'userId':id
          };
      }
      if(confirm(title)){
						if(cId)
						{
							$.ajax({
								type:"post",
								url:url,
								data:data,
								dataType:"jsonp",
								success:function(data){
									if(data.status)
									{
										$this.parent('.detalBar').remove();
										// This.load(true);
									}
								}
							});
						}
						else
						{
							$this.parent('.detalBar').remove();
						}
						// $('.quickLeft .addGroupBtn').show();
    }
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
          dataType:"jsonp",
          success:function(data){
            if(data.status)
            {
              var oLi = $this.parent('li');
              var oUl = $this.parents('ul');
              $(oUl).prepend(oLi);
              // This.load(true);
            }
          }
        });
      }
					// $('.quickLeft .addGroupBtn').show();
    };
    var onFastkeyParess = function(e){
      var $that = $(this);
      var key = e.which;
        if (key == 13&&!e.shiftKey) {
          $that.blur();
          console.log('e');
          return false;
        }
    };
    var onFastBlur = function(evn){
      if($(oFastLeft).find('li').hasClass('activeLine'))$(oAddNewRep).show();else $(oAddNewRep).hide();
      var $this = $(this);
      if($this.val().replace(/(^\s*)|(\s*$)/g,"")==""||$this.val()==null||$this.val()==undefined){
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
    //
    // var onReceive = function(value,data) {
    //
    // };
    //初始化数据
  	var onloadHandler = function() {
      config.repBtnType = false;
  };

  var onAddNewFast = function(evn){
    var obj = evn.target.className=='js-addNewGroup'?oFastLeft:oFastRight;
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
      $layer = $(template.zcReplyOuter);
      var _html = doT.template(template.zcReplyOuter)(conf);
      var oListInput = $(obj).find('li')[$(obj).find('li').length-1];
    if($(obj).find('li').length > 0){
      if(!$(oListInput).find('input').val()){
        $(oListInput).remove();
      }else{
        $(obj).append(_html);
        // $(oFastLeft).find('input').focus();
      }
    }else{
      $(obj).append(_html);
      // $(oFastLeft).find('input').focus();
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
                dataType:"jsonp",
                success:function(data){
                  if(data.status)
                  {
                    alert('更新成功');
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
                dataType:"jsonp",
                success:function(data){
                  if(data.status)
                  {
                    alert('新增成功');
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
      							dataType:"jsonp",
      							success:function(data){
      								if(data.status)
      								{
                        alert('回复保存成功');
      									// $this.html("保存");
      									// $this.hide();
      									// $this.nextAll().hide();
      									// This.load(true);
      									// $this.parents('.reply').find('.quickBtn').show();
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
      							dataType:"jsonp",
      							success:function(data){
      								if(data.status)
      								{
      									alert('回复添加成功');
      								}
      							}
      						});
      					}
    }
  };

  	var bindLitener = function() {
      onloadHandler();
      // initConfig();
      // $(window).on('core.onload',onloadHandler);
      $(oFastLeft).on('mouseover','li',onFastMouseOver);
      $(oFastLeft).on('mouseleave','li',onFastMouseLeave);
      $(oFastLeft).on('click','li',onFastTap);
      $(oFastLeft).on('click','span.delLeftGroup',onDelFast);
      $(oFastLeft).on('click','span.upLeftGroup',onUpFast);
      $(oFastLeft).on('keypress','input',onFastkeyParess);
      $(oFastLeft).on('blur','input',onFastBlur);
      $(oFastLeft).on('focus','input',onFastFocus);
      ///
      $(oFastRight).on('mouseover','li',onFastMouseOver);
      $(oFastRight).on('mouseleave','li',onFastMouseLeave);
      $(oFastRight).on('click','span.delRightRep',onDelFast);
      $(oFastRight).on('click','span.upRightRep',onUpFast);
      $(oFastRight).on('keypress','input',onFastkeyParess);
      $(oFastRight).on('blur','input',onFastBlur);
      $(oFastRight).on('focus','input',onFastFocus);
      //
      $(oAddNewGroup).on('click',onAddNewFast);
      $(oAddNewRep).on('click',onAddNewFast);

  	};
  	var init = function() {
  		parseDOM();
  		bindLitener();

  	};
    // $(document.body).on('core.onload',init());
  	init();
};
module.exports = Fastlayer;
