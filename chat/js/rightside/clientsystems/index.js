
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
	// var template = require('./template.js');
  var loadFile = require('../../util/load.js')();
  var Promise = require('../../util/promise.js');


  //初始化iframe
  var initData = function(){
    parseDOM();

    var promise = new Promise();
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
        // console.log(data);
        //data=[];
        // data = [{'机器人':'http://baidu.com'}];
        data = [{'机器人机器人机器人机器人':'http://baidu.com'},{'qq':'http://www.qq.com'}];
        // data=[{'机器人':'http://www.baidu.com?partnerId=&email=422293027@qq.com&sign=55230d63f78ffb668ea4db4c6006a3b2'},
      //     {'qq':'http://www.qq.com?partnerId=&email=422293027@qq.com&sign=55230d63f78ffb668ea4db4c6006a3b2'}
      // ];
        //TODO 三种情况  返回值为空  返回值为1  返回值大于1
  			if(data.length<1)
  			{
          $(clientNav).addClass('hide');
  				 return;
  			}else if(data.length == 1){
          $(clientNav).removeClass('hide');
          // $(drowdownMenu).attr('href','.js-clientSystem');
          for(var i=0;i<data.length;i++){
              for(var tmp in data[i]){
                  $(clientSysIframe).height($(".rightBox .tab-content").height());
                  $(clientSysIframe).width($(".rightBox .tab-content").width());
                  $(dropdownMenu).attr('addrurl',data[i][tmp]).attr('data-toggle','tab');
                  $(dropdownMenu).on('click',function(){
                      $(clientSysIframe).attr("src", $(dropdownMenu).attr('addrurl')).ready();
                  });
              }
          }
          }else{
              var parentDom = $(dropdownMenu);
              loadFile.load(global.baseUrl+'views/rightside/menutemp.html').then(function(value){
                var _html = doT.template(value)({
                  'list':data
                });
                parentDom.after(_html);
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
              // $(drowdownListMenu).hide();
              // $(drowdownMenu).on('click',function(){
              //   $(drowdownListMenu).show();
              // });
          }
          promise.resolve();
  		}
  	});
    return promise;
  };
  function showClientSys(obj){
  	mainJson.showClientSys = $(obj).parent().index() + 1;
  	$(clientSysIframe).height($(".rightBox .tab-content").height());
  	$(clientSysIframe).width($(".rightBox .tab-content").width());
  	$(clientSysIframe).attr("src", $(obj).attr('addrurl')).ready();

  }
  var parseDOM = function() {
    clientNav = $(node).find('.js-nav-tabs #clientSystem');
    clientBody = $(node).find('.js-tab-content #clientSystem');
    dropdownMenu = $(clientNav).find('.js-dropdown-toggle');
    clientSysIframe = $(clientBody).find('#clientSysIframe');
    dropdownListMenu = $(clientNav).find('.js-dropdown-menu');
  };

  var onReceive = function(value,data) {

  };
  var onloadHandler = function(evt,data) {

  };
  var bindLitener = function() {
    // $(document.body).on("RightSide.onload",onloadHandler);
    $(dropdownListMenu).hide();
    $(dropdownListMenu).on('click',function(){
      $(dropdownListMenu).show();
    });
  };

  var initPlugsin = function() {
    // initData();
  };
	var init = function() {
		// parseDOM();
		bindLitener();
		initPlugsin();
	};
  // init();
  initData().then(function(){
    init();
    console.log($(dropdownListMenu));
  });

};

module.exports = Client;
