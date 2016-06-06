
var initailClient = false;
var mainJson={'showClientSys':null};

var Client = function(node,core,data){
  var global = core.getGlobal();
  // console.log(data);
  //TODO 预加载对象
  var clientNav,//自定义导航
      clientWrap,//自定义窗体
      dropdownMenu,//自定义iframe菜单
      dropdownListMenu,//多个自定义iframe菜单 ul
      clientSysIframe,//自定义iframe
      tabContent;//容器窗口
  // var mainJson={'showClientSys':null},
      var listData;//iframe数据

  //TODO 模板/js/资源引用
  var loadFile = require('../../util/load.js')();
  var Promise = require('../../util/promise.js');

  //初始化iframe
  var initData = function(){
    var promise = new Promise();
    $.ajax({
  		type:"post",
  		cache:false,
  		url:'/chat/admin/getIframe.action',
  		data:{
  		 uid:global.id,
  		 userId:data.uid
  	  },
  		dataType:"json",
  		success:function(data){
        // data = [{'机器人':'http://baidu.com'}];
        // data = [{'页面一':'http://172.16.5.174:8000/index.html?partnerId=123'},
        // {'页面二':'http://172.16.5.174:8000/index2.html?partnerId=456'}];
        listData = data;
        promise.resolve();
  		}
  	});
    return promise;
  };
  //二级菜单点击事件
  function showClientSys(){
    //移除菜单
    $(dropdownListMenu).removeClass('show').animate({'margin-top':'-200'},500);
    var $this = $(this);
    mainJson.showClientSys = $this.index() + 1;
    $(clientSysIframe).height($(node).find('.js-tab-content').height());
    $(clientSysIframe).width($(node).find('.js-tab-content').width());
  	$(clientSysIframe).attr("src", $this.find('a').attr('addrurl')).ready();
  }
  //初始化Dom
  var parseDOM  = function(){
    clientNav = $(node).find('.js-nav-tabs .js-dropdownNav');
    clientWrap = $(node).find('.js-tab-content .js-clientSystemWrap');
    clientSysIframe = $(node).find('.js-tab-content .js-clientSysIframe');
    dropdownMenu = $(clientNav).find('.js-dropdown-toggle');//a标签
    dropdownListMenu = $(clientNav).find('.js-dropdown-menu');//ul菜单
    tabContent = $(node).find('.js-tab-content');
  };
  //菜单点击事件
  var onDropDownMenu= function(){
    //iframe状态
    if($(dropdownListMenu).hasClass('show')){
      $(dropdownListMenu).removeClass('show').animate({'margin-top':'-200'},500);
    }else{
      $(dropdownListMenu).addClass('show').animate({'margin-top':'0'},500);
    }
  };
  //绑定事件
  var bindListener = function(){
    if(initailClient)return;
    $(dropdownMenu).on('click',onDropDownMenu);
    initailClient=true;
  };
  //绑定数据
  var bindData = function(){
    //TODO 三种情况  返回值为空  返回值为1  返回值大于1
    if(listData&&listData.length>0){
      var _data = listData;
      if(_data.length == 1){
        //如果iframe长度为1
        $(clientNav).removeClass('hide');
        for(var i=0;i<_data.length;i++){
            for(var tmp in _data[i]){
                $(clientSysIframe).height($(tabContent).height());
                $(clientSysIframe).width($(tabContent).width());
                $(dropdownMenu).attr('addrurl',_data[i][tmp]).attr('data-toggle','tab');
                $(dropdownMenu).on('click',function(){
                    $(clientSysIframe).attr("src", $(dropdownMenu).attr('addrurl')).ready();
                });
                $(clientSysIframe).attr("src", $(dropdownMenu).attr('addrurl')).ready();
            }
          }
      }else{
        //如果iframe长度大于1
        var parentDom = $(dropdownListMenu);
        loadFile.load(global.baseUrl+'views/rightside/menutemp.html').then(function(value){
          var _html = doT.template(value)({
            'list':_data
          });
          parentDom.html(_html);
          $(dropdownListMenu).on('click','li',showClientSys);
        });
        if(mainJson.showClientSys)
        {
            for(var key  in _data[mainJson.showClientSys - 1])
            {
                $(clientSysIframe).attr("src",_data[mainJson.showClientSys - 1][key]);
            }
        }
        else
        {
            //判断列表中是否有数据
            $(clientNav).removeClass('hide');
        }
      }
    }else{
      $(clientNav).addClass('hide');
      return;
    }
  };
  //二级iframe菜单点击事件
	var init = function() {
    parseDOM();
    bindData();
    bindListener();

	};
  initData().then(init);
};
module.exports = Client;
