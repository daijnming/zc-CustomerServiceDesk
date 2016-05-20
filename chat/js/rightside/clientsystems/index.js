
var Client = function(node,core,data){

  var global = core.getGlobal();
  //TODO 预加载对象
  // var someOne;
  var clientNav,//自定义导航
      clientBody,//自定义窗体
      dropdownMenu,//自定义iframe菜单
      dropdownListMenu,//多个自定义iframe菜单
      clientSysIframe;//自定义iframe
  var mainJson={'showClientSys':null};

  //TODO 模板/js/资源引用
  var loadFile = require('../../util/load.js')();

  //初始化iframe
  var initData = function(){
    //初始化数据
    clientNav = $(node).find('.js-nav-tabs #clientSystem');
    clientBody = $(node).find('.js-tab-content #clientSystem');
    clientSysIframe = $(clientBody).find('#clientSysIframe');
    dropdownMenu = $(clientNav).find('.js-dropdown-toggle');//a标签

    $.ajax({
  		type:"post",
  		cache:false,
  		url:'admin/getIframe.action',
  		data:{
  		 uid:global.id,
  		 userId:data.uid
  	   },
  		dataType:"json",
  		success:function(data){
        // data = [{'机器人':'http://baidu.com'}];
        // data = [{'机器人机器人机器人机器人':'http://baidu.com'},{'qq':'http://www.qq.com'}];
        //TODO 三种情况  返回值为空  返回值为1  返回值大于1
  			if(data.length<1)
  			{
          $(clientNav).addClass('hide');
  				 return;
  			}else if(data.length == 1){
          $(clientNav).removeClass('hide');
          for(var i=0;i<data.length;i++){
              for(var tmp in data[i]){
                  $(clientSysIframe).height($(node).find('.js-tab-content').height());
                  $(clientSysIframe).width($(node).find('.js-tab-content').width());
                  $(dropdownMenu).attr('addrurl',data[i][tmp]).attr('data-toggle','tab');
                  $(dropdownMenu).on('click',function(){
                      $(clientSysIframe).attr("src", $(dropdownMenu).attr('addrurl')).ready();
                  });
                  $(clientSysIframe).attr("src", $(dropdownMenu).attr('addrurl')).ready();
              }
          }
          }else{
              var parentDom = $(dropdownMenu);
              loadFile.load(global.baseUrl+'views/rightside/menutemp.html').then(function(value){
                var _html = doT.template(value)({
                  'list':data
                });
                parentDom.after(_html);
                dropdownListMenu = $(clientNav).find('.js-dropdown-menu');//ul菜单
                $(dropdownMenu).on('click',function(){
                  //iframe状态
                  if($(dropdownListMenu).hasClass('show')){
                    $(dropdownListMenu).removeClass('show').animate({'margin-top':'-200'},500);
                  }else{
                    $(dropdownListMenu).addClass('show').animate({'margin-top':'0'},500);
                  }
                });
                $(dropdownListMenu).on('click','li',showClientSys);
              });
              if(mainJson.showClientSys)
              {
                  for(var key  in data[mainJson.showClientSys - 1])
                  {
                      $(clientSysIframe).attr("src",data[mainJson.showClientSys - 1][key]);
                  }
              }
              else
              {
                  //判断列表中是否有数据
                  $(clientNav).removeClass('hide');
              }
          }
  		}
  	});
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
  //二级iframe菜单点击事件
	var init = function() {
		initData();
	};
  init();
};
module.exports = Client;
