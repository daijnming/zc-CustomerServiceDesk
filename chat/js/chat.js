// var apihost = "http://172.16.8.69:8080/chat/"
// var apihost = "http://101.200.12.241/chat/";
var apihost = "/chat/";
var sendurl = apihost+"admin/send1.action"
var oldsend = apihost+"admin/send.action"
var outurl = apihost+"admin/out.action"
var leaveurl = apihost+"admin/leave.action"
var busyurl = apihost+"admin/busy.action"
var onlineurl =apihost+"admin/online.action"
var getOldMsg = false;
var mainJson = {"showClientSys":null,"reqTableNow":3,"reqTablePage":1,"reqTableAllPage":0,"hisDate":{}};
var ronIdGroup = {}; //融云用户id组

var config = {
  overTime: 15000 // 超时时间
}

// files:base64文件流
// dom: 对应的dom
window.checkFile = function(files, dom){
    var file = files[0],
        reader = new FileReader();

    // 如果是字符串 直接赋值
    if (typeof files === 'string') {
        dom[0].src = files;
        return false;
    }

    if(!/image\/\w+/.test(file.type)){
     // console.log('不是图片');
      return false;
    }
    // onload是异步操作
    reader.onload = function(e){
        //console.log(e.target.result)
        //console.log(dom)
        dom[0].src = e.target.result;
    }

    reader.readAsDataURL(file);
}

var sendError = function(content,isRe, dom){

  if (isRe) {
    dom.show();
    dom.prev().find('.msg_time').text(new Date().format("hh:mm:ss"))
    dom.removeClass('msgReplyErrorActive').addClass('msgReplyErrorDefault');
    // dom.parent().parent().append(dom.parent());
  } else {
    dom.append('<div data-content="' + content + '" class="msgReplyError msgReplyErrorDefault fr"></div>');
  }

  // $('.msgReplyError').unbind('click');
  $('.msgReplyError').unbind('click').bind('click', function(){
    $(this).removeClass('msgReplyErrorDefault').addClass('msgReplyErrorActive');
    var self = $(this);
        replyContent = self.attr('data-content').trim(),
        oNow = $('.mainNav .leftScroll .active'),      //当前对话用户的标签
        oUserId = $(oNow).attr('uid'),
        oUserCid = $(oNow).attr('cid'),
        sender = getQueryStr("id");

        self.hide();
        self.prev().find('.msg_time').text(new Date().format("hh:mm:ss"))
        self.removeClass('msgReplyErrorActive').addClass('msgReplyErrorDefault');
        self.parent().parent().append(self.parent());

        send(oUserCid, replyContent, function(state){

          // 模拟 重发状态:成功
          // state = 1;
          if (state === 1) self.hide();
          // self.prev().find('.msg_time').text(new Date().format("hh:mm:ss"))
          // self.removeClass('msgReplyErrorActive').addClass('msgReplyErrorDefault');
          // self.parent().parent().append(self.parent());
        }, true, self);
    // },2000);

  })
}

$.fn.focusEnd=function(){
    return this.each(function(){
        var A=this;
        if(A.style.display!="none"){
            if($.browser.msie){
                A.focus();
                var B=A.createTextRange();
                B.collapse(false);
                B.select()
            }else{
                A.setSelectionRange(A.value.length,A.value.length);
                A.focus()
            }
        }
    });
};
function historyTabClick(){

	$("#history input[name='utypeRadios']:eq(0)").attr("checked",'checked');

	getUserListByType(1);
}

// 历史记录列表中三个条件的选择
var huserlistMore = true,
    huserPageNum = 1;
function getUserListByType(pageNow){

  // 每次点击初始化为1
  historyPageNum = 1;
  pageNow = parseInt(pageNow);
  setTimeout(function(){
    var redioGroup = $('.c-redio');

    for (var i = 0;i < redioGroup.length;i++) redioGroup.eq(i).removeClass('c-redio-active').addClass('c-redio-noActive');
    redioGroup.eq(parseInt(pageNow) - 1).addClass('c-redio-active').removeClass('c-redio-noActive');
  },100);
	// huserPageNum=pageNow;

	if (pageNow == 1) {
		$("#history #historyusers").html("");
		hsitoryMore=true;
	}
	// var checktype=$("#history input[name='utypeRadios']:checked").val();
  var checktype = pageNow;
	var url="";
	switch(checktype){
	case 1:
		url=apihost+"admin/get_histroryUser.action";
		break;
	case 2:
		url=apihost+"admin/query_marklist.action";
		break;

	case 3:
		url=apihost+"admin/query_blacklist.action";
		break;



	}
//	url=url+"?uid="+myid+"&pageNow="+pageNow;
	//yyy 不传页数
	$.post(url,{
    uid: myid,
    pageNow: pageNow
  },function(json){

    // if (checktype == 2) {
    //   json = [{"id":"54fedacc14f849d4aaf727d46d77ea7e","pid":"088ad376b6514ed0a191067308c284fe","uname":"北京市光环新网","type":0,"sysNum":"088ad376b6514ed0a191067308c284fe","way":1,"purl":"https://test.sobot.com/pusher","status":0,"puid":null,"tel":"","qq":"","email":"","remark":"","source":0,"os":10,"browser":10,"ip":"124.42.103.133","address":"北京市光环新网","partnerId":"","lastCid":"3125d0c2d84f47d8af6e63c0b8b70d58","lastAdminId":"4d8d417f66004d7b9ba27d30c3f8f511","isblack":0,"ismark":1,"visitTitle":"","visitUrl":"","lastTime":"2016-02-23 15:17:00","face":"","groupId":"","groupName":"","appId":"","token":"","rongyunId":"","passwd":"","t":1456211820893,"ts":"2016-02-23 15:17:00","blackT":-1,"salt":"","createTime":1456211445696,"weixin":"","updateUserId":"4d8d417f66004d7b9ba27d30c3f8f511","lastMsg":"","adminMarkSet":",4d8d417f66004d7b9ba27d30c3f8f511"},{"id":"3153595ea53447189f06e57e4e9055bc","pid":"088ad376b6514ed0a191067308c284fe","uname":"北京市联通","type":0,"sysNum":"088ad376b6514ed0a191067308c284fe","way":1,"purl":"https://test.sobot.com/pusher","status":0,"puid":null,"tel":"","qq":"","email":"","remark":"","source":0,"os":10,"browser":10,"ip":"111.200.55.8","address":"北京市联通","partnerId":"","lastCid":"d32c8c79f80a42948f183b668029a87a","lastAdminId":"4d8d417f66004d7b9ba27d30c3f8f511","isblack":0,"ismark":0,"visitTitle":"","visitUrl":"","lastTime":"2016-02-18 11:56:49","face":"","groupId":"","groupName":"","appId":"","token":"","rongyunId":"","passwd":"","t":1456107424197,"ts":"2016-02-22 10:17:04","blackT":-1,"salt":"","createTime":1455507663587,"weixin":"","updateUserId":"4d8d417f66004d7b9ba27d30c3f8f511","lastMsg":"","adminMarkSet":"4d8d417f66004d7b9ba27d30c3f8f511,"}];
    // }
    // else if (checktype == 3) {
    //   json = [];
    // }
        //console.log(json);
        switch(checktype){
            case 1:
                if(json.length<1){
                    $('#historylist').addClass('noperson');
                    $('#historylist').removeClass('noStar');
                     $('#historylist').removeClass('noBlock');
                }else{
                    $('#historylist').removeClass('noStar');
                    $('#historylist').removeClass('noperson');
                    $('#historylist').removeClass('noBlock');
                }
                break;
            case 2:
                if(json.length<1){
                    $('#historylist').addClass('noStar');
                    $('#historylist').removeClass('noperson');
                    $('#historylist').removeClass('noBlock');
                }else{
                    $('#historylist').removeClass('noStar');
                    $('#historylist').removeClass('noperson');
                    $('#historylist').removeClass('noBlock');
                }
                break;
            case 3:
                if(json.length<1){
                    $('#historylist').addClass('noBlock');
                    $('#historylist').removeClass('noperson');
                    $('#historylist').removeClass('noStar');
                }else{
                    $('#historylist').removeClass('noStar');
                    $('#historylist').removeClass('noperson');
                    $('#historylist').removeClass('noBlock');
                }
                break;
            default:
                break;
        }
    $("#history #historyusers").html('');
		if(json.length < 1)
		{
			//$("#history #hisijintiantoryusers").html("");
			hsitoryMore=false;
			return;
		}
		bOk=true;				//dyy 拿到数据允许继续滚动加载
		//var formIcon = ['<i class="fa fa-laptop"></i>','<i class="fa fa-weixin"></i>','<i class="fa fa-code"></i>','<i class="fa fa-weibo"></i>','<i class="fa fa-mobile"></i>','<i class="fa fa-mobile"></i>'];
        //TODO Delete201604211540
		//var formIcon = ['<i class="fa fa-laptop"><span class="newIcon"></span></i>','<i class="fa fa-weixin"><span class="newIcon"></span></i>','<i class="fa fa-code"><span class="newIcon"></span></i>','<i class="fa fa-weibo"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>'];

    var datastr=new Date().format("yy-MM-dd");

		for(var i = 0 ; i < json.length ; i++)
		{
			  var jsondata=json[i];
			  var ts=jsondata.ts?jsondata.ts:"----/--/-- --:--:--";
			  var udate=ts.slice(2,10);
			  if(udate==datastr){
				  udate=ts.substr(11,5);
			  }else{

				  udate=ts.substr(5,5)
			  }

			  var sName = jsondata.uname;
        var uname = jsondata.uname; //decodeURI(decodeURI(data.uname));
	          if(/.*[\u4e00-\u9fa5]+.*$/.test(uname))
	          {
	          	var textLength = 6;
	          }
	          else
	          {
	          	var textLength = 9;
	          }

	          //if(uname.length > textLength)
	          //{
	          //	uname = uname.substring(0,textLength) + '...';
	          //}

	          var re = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
	          var newStr = '';
	          for (var j = 0; j < uname.length; j++) {
					newStr = newStr + uname.substr(j, 1).replace(re, '');
				}
			 if(newStr.length > textLength)
			 {
				newStr = newStr.substring(0,textLength) + '...';

			 }
		      uname = newStr;

			  if(!jsondata.lastMsg){
				  jsondata.lastMsg = '无留言';
			  }else{
				  if(jsondata.lastMsg.indexOf('<p>') !== -1){
					  //有p
					  var lm1 = jsondata.lastMsg.substring(3);
					  var lm2 = lm1.substring(0,jsondata.lastMsg.lastIndexOf('</p>')-3);
					  jsondata.lastMsg = lm2;
					  if(jsondata.lastMsg.length>11){
						  jsondata.lastMsg = (jsondata.lastMsg).substring(0,10)+'...';
					  }
				  }
          else if (jsondata.lastMsg.indexOf('<img') !== -1) {

            // 判断是否有表情
            //if (jsondata.lastMsg.indexOf('webchat_img_face') !== -1) {
            //  jsondata.lastMsg = '[附文本]';
            //}

            if(jsondata.lastMsg.indexOf('webchat_img_upload') !== -1) {
              jsondata.lastMsg = '[图片]';
            }else if (jsondata.lastMsg.indexOf('webchat_voice')!= -1 ){
                jsondata.lastMsg = '[语音]';
            }
            else {
              jsondata.lastMsg = '[富附件]';
            }
          }
          else{

            if(jsondata.lastMsg.length>11){
              jsondata.lastMsg = (jsondata.lastMsg).substring(0,10)+'...';
            }
				  }
			  }
            //TODO 判断 用户自定义头像
            var ZC_FaceUrl='';
            if(jsondata.face){
                jsondata.face = decodeURIComponent(jsondata.face);
                ZC_FaceUrl =   ZC_Extend.member.formIcon('')(jsondata.face);
            }else{
                ZC_FaceUrl = ZC_Extend.member.formIcon(jsondata.source);
            }
            if(jsondata.lastMsgSenderType==0) jsondata.lastMsg = '<span style="color:#ffad01">'+jsondata.lastMsg+'</span>';
            var historyuser = "<li id='historyuser_"+jsondata.id+"'><a href='javascript:;' class='user' cid='"+jsondata.id+"' name='"+sName+"'source='"+jsondata.source+"' uid='"+jsondata.id+"'>"+ ZC_FaceUrl +"<span class='uname'>" +uname+"</span><span class='oldLastMsg'>"+jsondata.lastMsg+"</span><span  class='badge'>["+udate+"]</span><span class='ohide'>"+ sName+"</span></a></li>";
			  $("#history #historyusers").append(historyuser);
       }
		//yy 重置高度
		// resizeChat();
       //dyy 当屏幕无滚动条时
        var fHeight = parseFloat($("#historylist").height());
        var fScrollHeight = $("#historyusers")[0].scrollHeight;
        if(fHeight >= fScrollHeight){
            huserPageNum+=1;
            // gethistroylist(historyPageNum);
            // getUserListByType(huserPageNum);
        }
        //end
	},"JSONP");

}

/*yhw begin*/
//获取历史记录用户列表"ts":"2015-06-26 10:13:28"   此方法暂时不使用
var hsitoryMore=true;
var historyPageNum=1;
function gethistroylist(pageNow){
	historyPageNum=pageNow;
	var getUrl=apihost+"admin/get_histroryUser.action";

	if(pageNow==1){
		$("#history #historyusers").html("");
		hsitoryMore=true;
	}

  $.post(getUrl, {
    uid: myid,
    pageNow: pageNow
  },function(json) {
    if(json.length < 1)
    {
      hsitoryMore=false;
      return;
    }
    //var formIcon = ['<i class="fa fa-laptop"></i>','<i class="fa fa-weixin"></i>','<i class="fa fa-code"></i>','<i class="fa fa-weibo"></i>','<i class="fa fa-mobile"></i>','<i class="fa fa-mobile"></i>'];
      //TODO Delete 20160421543
    //var formIcon = ['<i class="fa fa-laptop"><span class="newIcon"></span></i>','<i class="fa fa-weixin"><span class="newIcon"></span></i>','<i class="fa fa-code"><span class="newIcon"></span></i>','<i class="fa fa-weibo"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>'];
        var datastr=new Date().format("yy-MM-dd");
    for(var i = 0 ; i < json.length ; i++)
    {
        var jsondata=json[i];
        var ts=jsondata.ts?jsondata.ts:"----/--/-- --:--:--";
        var udate=ts.slice(2,10);
        if(udate==datastr){
          udate=ts.substr(11,5);
        }else{

          udate=ts.substr(5,5)
        }
        var sName = jsondata.uname;
            var uname = jsondata.uname; //decodeURI(decodeURI(data.uname));
            if(/.*[\u4e00-\u9fa5]+.*$/.test(uname))
            {
              var textLength = 6;
            }
            else
            {
              var textLength = 9;
            }

            if(uname.length > textLength)
            {
              uname = uname.substring(0,textLength) + '...';
            }

            var re = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
            var newStr = '';
            for (var j = 0; j < uname.length; j++) {
            newStr = newStr + uname.substr(j, 1).replace(re, '');
          }
          uname = newStr;
        //TODO 判断 用户自定义头像
        var ZC_FaceUrl='';
        if(jsondata.face){
            jsondata.face = decodeURIComponent(jsondata.face);
            ZC_FaceUrl =   ZC_Extend.member.formIcon('')(jsondata.face);
        }else{
            ZC_FaceUrl = ZC_Extend.member.formIcon(jsondata.source);
        }
        var historyuser = "<li id='historyuser_"+jsondata.id+"'><a href='javascript:;' class='user' cid='"+jsondata.lastCid+"' name='"+sName+"' uid='"+jsondata.id+"'>"+ ZC_FaceUrl +"<span class='uname'>" +uname+"</span><span  class='badge'>["+udate+"]</span><span class='ohide'>"+ sName+"</span></a></li>";
        $("#history #historyusers").append(historyuser);
       }
  },'json')

	// $.getJSON(getUrl,function(json){
		// if(json.length < 1)
		// {
		// 	hsitoryMore=false;
		// 	return;
		// }
		// //var formIcon = ['<i class="fa fa-laptop"></i>','<i class="fa fa-weixin"></i>','<i class="fa fa-code"></i>','<i class="fa fa-weibo"></i>','<i class="fa fa-mobile"></i>','<i class="fa fa-mobile"></i>'];
		// var formIcon = ['<i class="fa fa-laptop"><span class="newIcon"></span></i>','<i class="fa fa-weixin"><span class="newIcon"></span></i>','<i class="fa fa-code"><span class="newIcon"></span></i>','<i class="fa fa-weibo"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>'];
    //     var datastr=new Date().format("yy-MM-dd");
		// for(var i = 0 ; i < json.length ; i++)
		// {
		// 	  var jsondata=json[i];
		// 	  var ts=jsondata.ts?jsondata.ts:"----/--/-- --:--:--";
		// 	  var udate=ts.slice(2,10);
		// 	  if(udate==datastr){
		// 		  udate=ts.substr(11,5);
		// 	  }else{
    //
		// 		  udate=ts.substr(5,5)
		// 	  }
		// 	  var sName = jsondata.uname;
	  //         var uname = jsondata.uname; //decodeURI(decodeURI(data.uname));
	  //         if(/.*[\u4e00-\u9fa5]+.*$/.test(uname))
	  //         {
	  //         	var textLength = 6;
	  //         }
	  //         else
	  //         {
	  //         	var textLength = 9;
	  //         }
    //
	  //         if(uname.length > textLength)
	  //         {
	  //         	uname = uname.substring(0,textLength) + '...';
	  //         }
    //
	  //         var re = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
	  //         var newStr = '';
	  //         for (var j = 0; j < uname.length; j++) {
		// 				newStr = newStr + uname.substr(j, 1).replace(re, '');
		// 			}
		//       uname = newStr;
		// 	  var historyuser = "<li id='historyuser_"+jsondata.id+"'><a href='javascript:;' class='user' cid='"+jsondata.lastCid+"' name='"+sName+"' uid='"+jsondata.id+"'>"+ formIcon[jsondata.source] +"<span class='uname'>" +uname+"</span><span  class='badge'>["+udate+"]</span><span class='ohide'>"+ sName+"</span></a></li>";
		// 	  $("#history #historyusers").append(historyuser);
    //    }
	// })
}
var blackMore=true;blackPageNum=1;
//获取黑名单列表  此方法暂时不使用
function getblacklist(pageNow){
	blackPageNum=pageNow;
	var getUrl=apihost+"admin/query_blacklist.action?uid="+myid+"&pageNow="+pageNow+"&callback=?";
	if(pageNow==1){
		$("#blacklist #blackusers").html("");
		   blackMore=true;
	}
	$.getJSON(getUrl,function(json){
		if(json.length < 1)
		{
			//$("#blacklist #blackusers").html("");
			blackMore=false;
			return;
		}
		 //var formIcon = ['<i class="fa fa-laptop"></i>','<i class="fa fa-weixin"></i>','<i class="fa fa-code"></i>','<i class="fa fa-weibo"></i>','<i class="fa fa-mobile"></i>','<i class="fa fa-mobile"></i>'];
        //TODO Delete 201604211545
		//var formIcon = ['<i class="fa fa-laptop"><span class="newIcon"></span></i>','<i class="fa fa-weixin"><span class="newIcon"></span></i>','<i class="fa fa-code"><span class="newIcon"></span></i>','<i class="fa fa-weibo"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>'];
		 var datastr=new Date().format("yy-MM-dd");
		for(var i = 0 ; i < json.length ; i++)
		{
			var jsondata=json[i];
			  var ts=jsondata.ts?jsondata.ts:"----/--/-- --:--:--";
			  var udate=ts.slice(2,10);
			  if(udate==datastr){
				   // udate="今天"
					 udate=ts.substr(11,5);
				  }else{
					 udate=ts.substr(5,5)
		      }
			  var sName = jsondata.uname;
	          var uname = jsondata.uname; //decodeURI(decodeURI(data.uname));
	          if(/.*[\u4e00-\u9fa5]+.*$/.test(uname))
	          {
	          	var textLength = 6;
	          }
	          else
	          {
	          	var textLength = 9;
	          }

	          if(uname.length > textLength)
	          {
	              //	uname = uname.substring(uname.length - textLength,uname.length) + '...';
		          	uname = uname.substring(0,textLength) + '...';
	          }

	          var re = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
	          var newStr = '';
	          for (var j = 0; j < uname.length; j++) {
						newStr = newStr + uname.substr(j, 1).replace(re, '');
					}
		      uname = newStr;
            //TODO 判断 用户自定义头像
            var ZC_FaceUrl='';
            if(jsondata.face){
                jsondata.face = decodeURIComponent(jsondata.face);
                ZC_FaceUrl =   ZC_Extend.member.formIcon('')(jsondata.face);
            }else{
                ZC_FaceUrl = ZC_Extend.member.formIcon(jsondata.source);
            }
			var blackuser = "<li id='blackusers_"+jsondata.id+"'><a href='javascript:;' class='user' cid='"+jsondata.id+"' name='"+sName+"' uid='"+jsondata.id+"'>"+ ZC_FaceUrl +"<span class='uname'>" +uname+"</span><span class='badge'>["+udate+"]</span><span class='ohide'>"+ sName +"</span></a></li>";
			$("#blacklist #blackusers").append(blackuser);
       }
	})
}


//滚动下拉加载事件注册
var bOk=true;										//dyy 滚动加载开关
function controlScroll(){

	 var range = 30;             //距下边界长度/单位px
     var elemt = 500;           //插入元素高度/单位px
     var maxnum = 20;            //设置加载最多次数
     var num = 1;
     var num2 = 1;
     var totalheight = 0;


     var historymain = $("#historyusers");                     //主体元素
     $("#historylist").scroll(function(){
         var srollPos = $("#historylist").scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
         var nScrollHight = $(this)[0].scrollHeight;
         var nScrollTop = $(this)[0].scrollTop;
         if(nScrollTop==0)return;
         totalheight = parseFloat($("#historylist").height()) + parseFloat(nScrollTop);
 		 if((nScrollHight-range) <= totalheight  && hsitoryMore && bOk) {
 			bOk=false;
      historyPageNum++;
 			gethistroylist(historyPageNum);
        //  alert(nScrollHight-range);
         }
     });

    /* 业务修改方法暂时不使用
     * var blackymain = $("#blackusers");                     //主体元素
     $("#blacklist").scroll(function(){
         var srollPos = $("#blacklist").scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
         var  nScrollHight = $(this)[0].scrollHeight;
         var nScrollTop = $(this)[0].scrollTop;
         if(nScrollTop==0)return;
         totalheight = parseFloat($("#blacklist").height()) + parseFloat(nScrollTop);
 		 if((nScrollHight-range) <= totalheight  && blackMore) {
 			blackPageNum++;
 			getblacklist(blackPageNum);
        //  alert(nScrollHight-range);
         }
     });*/



}
/*yhw end*/
window.controlScroll = controlScroll;
//处理客服列表json和事件
function getPeopleList()
{
	var getUrl = apihost+"admin/getOhterAdminList.action";
	//var getUrl = "webchat/getOhterAdminList.action?pid="+ 3 + "&id=" + 6;
	$.post(getUrl,{uid:myid},function(json){
		var imgUrl = ["admin/img/offline.png","admin/img/online.png","admin/img/busy.png"];
		var oDom = '',sClass = "zhuan oHide";
		var onlineStatus ='glyphicon glyphicon-minus-sign';
		var redClass ='';
		var oType = "";

		if(json.length < 1)
		{
			$(".bootbox .listBox").html("现在没有其他客服在线。。。");
			return;
		}
		for(var i = 0 ; i < json.length ; i++)
		{
			if(json[i].status == 1 || json[i].status == 2)
			{
				sClass = "zhuan";

			}

			if (json[i].status == 1) {
				//默认忙碌，1是在线
				onlineStatus ='glyphicon glyphicon-ok-sign';
			} else {
        onlineStatus ='glyphicon glyphicon-minus-sign';
      }
			var localGroupName =json[i].groupName;
			var groupName = [];
			for(var j=0;j<localGroupName.length;j++){
				//如果超长
				if(localGroupName[j].length>5){
					localGroupName[j] = localGroupName[j].substring(0,5)+'...'
				}
				groupName.push(localGroupName[j]);
			}
			var groupNameAll = groupName.join('/');
			if(groupNameAll.length>15){
				groupNameAll = groupNameAll.substring(0,15)+'...';
			}
			//截取长字符
			//new
			if(json[i].count == json[i].maxcount){
				redClass = 'redClass';
			}
			oDom +=
				'<tr>'
					+'<td class="">'+'<span class="'+onlineStatus+'"></span>'+json[i].uname+'</td>'
					+'<td class="'+redClass+'">'+json[i].count+'/'+json[i].maxcount+'</td>'
					+'<td>'+groupNameAll+'</td>'
					+'<td><a href="javascript:;" '+'uid='+json[i].id+' class="">转接</a></td>'
				+'</tr>';

			//end
			//oDom += '<li class="col-sm-4"><span class="list-group-item"><img src="'+ imgUrl[json[i].status] +'" class="lineImg">'+ json[i].uname +'<span class="onLineNum"> ('+ json[i].count +')</span></span><a href="javascript:;" uid="'+ json[i].id +'" class="'+ sClass +'"><i class="fa fa-sign-out"></i>转接</a></li>';

			oType =
				'<table class="table">'
				+'<thead>'
				+'<tr>'
				+'<th>客户名称</th>'
				+'<th>接待状态</th>'
				+'<th>所属分组</th>'
				+'<th>操作</th>'
				+'</tr>'
				+'</thead>'
				+'<tbody class="changeTbody">'
				+oDom
				+'</tbody>'
				+'</table>';
		}
		$(".bootbox .listBox .list-group").append(oType);

		$(".bootbox .listBox .list-group a").click(function(){
			var oNow = $('.mainNav .leftScroll .active');      //当前对话用户的标签
			var oCheckId = $(this).attr("uid"),oMyId = myid,oCid = $(oNow).attr('cid'),
				oUserId = $(oNow).attr('uid'),oUserName = $(oNow).attr('name');
			var SendIdUrl;
				if($(oNow).attr("addCallYes") == "yes")
				{
					SendIdUrl = apihost+"admin/transfer.action?cid="+ oCid +"&joinUid="+ oCheckId +"&userId="+ oUserId +"&userName=" + oUserName;
				}
				else
				{
					SendIdUrl = apihost+"admin/transfer.action?cid="+ oCid +"&joinUid="+ oCheckId +"&userId="+ oUserId +"&userName=" + oUserName +"&tel=" + $(oNow).attr('called');
				}

			$.post(SendIdUrl,{uid:oMyId},function(data){
				if(data.status == 1 || data.status == 2)
				{
					bootbox.hideAll();
					$("#user_"+ oUserId).remove();
    				$("#chat_"+ oUserId).remove();
				}
			},"JSONP")
		});
	},"JSONP");
}


function getchatList(){
	$.ajax({
		type:"post",
		cache:false,
		url:getchaturl,
		data:{
		 uid:myid,
	   },
		dataType:"JSONP",
		success:function(data){
			var userList = data.userList;
			var waitSize = data.waitSize;

			for(var i=0;i<userList.length;i++){
				var user = userList[i];
				user.type="102";
				user.utype="1";
				msgListen(user);
                //for(var item in user){
                //    console.log(item+":"+user[item]);
                //}

			}
			var data;
			data.type = "110";
			data.count=waitSize;
			msgListen(data);
            //isUsers();
		}
	});

}
window.getchatList = getchatList;

//拉黑
function goBlack(isHistory)
{
	var noUser = false;
	var oMsg = "<div class='offDyy'>确定要拉黑这个用户吗？</div>";
	if($('.mainNav .leftScroll .active').length == 0)
	{
		noUser = true;
		oMsg = "请选择一个用户";
        //console.log('nouser');
	}
	bootbox.dialog({
        message: oMsg,
        title: "拉黑",
        buttons: {
          danger: {
            label: "取消",
            className: "btn-danger",
            callback: function() {
            }
          },
          success: {
            label: "确定",
            className: "btn-success",
            callback: function() {
            	if(noUser)
            	{
            		return;
            	}
              var oNow = $('.mainNav .leftScroll .active');      //当前对话用户的标签
              var oCid = $(oNow).attr('cid'),oUserId = $(oNow).attr('uid');
              var goBlUrl = apihost+"admin/add_blacklist.action?receiver=" + oUserId;
              $.post(goBlUrl,{sender:myid},function(data){
              	if(data.status == 1)
              	{

              		var ochat;
              		if(isHistory){
              	       ochat=$("#hchat");
              		}else{

              			$("#user_"+ oUserId).remove();
        				$("#chat_"+ oUserId).remove();
        				return;
              		}


            	  ochat.find(".addButton .delblack").removeClass("hide");
            	  ochat.find(".addButton .addblack").addClass("hide");
	              var dt = new Date().format('hh:mm:ss');

              		var oMsgDom = '<div class="systeamTextBox"><p class="systeamText">用户已被客服加入黑名单 '+ dt +'</p></div>';
              		var ochat=$(".chat:visible");
              		ochat.find(".scrollBox").append(oMsgDom);
        			setScroll(ochat);

              	}
              },"JSONP")
            }
          }
        }
      });
    //点击空白处关闭弹窗
    tapCloseWindow();
}

//从黑名单中移除
function removeBlack(isHistory)
{
	var oMsg =  "<div class='offDyy'>确定要从黑名单中移出这个用户吗？</div>";
	bootbox.dialog({
        message: oMsg,
        title: "解除拉黑",
        buttons: {
          danger: {
            label: "取消",
            className: "btn-danger",
            callback: function() {
            }
          },
          success: {
            label: "确定",
            className: "btn-success",
            callback: function() {
        	  var oNow = $('.mainNav .leftScroll .active');      //当前对话用户的标签
              var oUserId = $(oNow).attr('uid');
              var goBlUrl = apihost+"admin/delete_blacklist.action?receiver=" + oUserId;
              $.post(goBlUrl,{sender:myid},function(data){
              	if(data.status == 1)
              	{
            		var ochat;
              		if(isHistory){
              	       ochat=$("#hchat");

              		}
        			ochat.find(".addButton .delblack").addClass("hide");
        			ochat.find(".addButton .addblack").removeClass("hide");

              		var dt = new Date().format('hh:mm:ss');

              		var oMsgDom = '<div class="systeamTextBox"><p class="systeamText">用户已被客服移除黑名单 '+ dt +'</p></div>';
              		var ochat=$(".chat:visible");
              		ochat.find(".scrollBox").append(oMsgDom);
        			setScroll(ochat);
					//重新load黑名单列表   yyy

              	}
              },"JSONP")
            }
          }
        }
      });
    //点击空白处关闭弹窗
    tapCloseWindow();
}

function addStarMark(isHistory){
  var oNow = $('.mainNav .leftScroll .active');      //当前对话用户的标签
  var oCid = $(oNow).attr('cid'),oUserId = $(oNow).attr('uid');
  var goBlUrl = apihost+"admin/add_marklist.action?receiver=" + oUserId;
  $.post(goBlUrl,{sender:myid},function(data){
    if(data.status == 1)
    {
      var ochat;
      if(isHistory){
           ochat=$("#hchat");
      }else{
         ochat=$("#chat_"+oUserId);
      }
    ochat.find(".addButton .addstar").addClass("hide");
      ochat.find(".addButton .deldestar").removeClass("hide");
      var dt = new Date().format('hh:mm:ss');

      var oMsgDom = '<div class="systeamTextBox"><p class="systeamText">用户已被客服添加星标 '+ dt +'</p></div>';
      var ochat=$(".chat:visible");
      ochat.find(".scrollBox").append(oMsgDom);
      setScroll(ochat);
    }
  },"JSONP")
	// bootbox.dialog({
  //       message: "<div class='offDyy'>确定要标记这个用户吗？</div>",
  //       title: "添加星标",
  //       buttons: {
  //         danger: {
  //           label: "取消",
  //           className: "btn-danger",
  //           callback: function() {
  //           }
  //         },
  //         success: {
  //           label: "确定",
  //           className: "btn-success",
  //           callback: function() {
  //
  //           }
  //         }
  //       }
  //     });
}
function removeStarMark(isHistory){
	var oMsg = "<div class='offDyy'>确定要取消标记这个用户吗？</div>";
	bootbox.dialog({
        message: oMsg,
        title: "去除星标",
        buttons: {
          danger: {
            label: "取消",
            className: "btn-danger",
            callback: function() {
            }
          },
          success: {
            label: "确定",
            className: "btn-success",
            callback: function() {
        	  var oNow = $('.mainNav .leftScroll .active');      //当前对话用户的标签
              var oUserId = $(oNow).attr('uid');

              //(sender,receiver) sender:客服id，receiver：用户id
              var goBlUrl = apihost +"admin/delete_marklist.action?receiver=" + oUserId;
              $.post(goBlUrl,{sender:myid},function(data){
              	if(data.status == 1)
              	{
              		var ochat;
              		if(isHistory){
              	       ochat=$("#hchat");
              		}else{
              		   ochat=$("#chat_"+oUserId);
              		}
              		ochat.find(".addButton .addstar").removeClass("hide");
              		ochat.find(".addButton .deldestar").addClass("hide");
		            var dt = new Date().format('hh:mm:ss');

              		var oMsgDom = '<div class="systeamTextBox"><p class="systeamText">用户已被客服去除星标 '+ dt +'</p></div>';
              		var ochat=$(".chat:visible");
              		ochat.find(".scrollBox").append(oMsgDom);
        			setScroll(ochat);
              	}
              },"JSONP")
            }
          }
        }
      });
    //点击空白处关闭弹窗
    tapCloseWindow();

}

//点击空白关闭弹窗
function tapCloseWindow(){
    $('.bootbox').on('click',function(event){
        if ($(event.target).hasClass('bootbox modal fade in')) $('.bootbox-close-button').click();
    });
}

//转接
function goZhuan()
{
	var msg = $('.dialogBox').html();
	bootbox.dialog({
        message:msg,
        size:"large",
        title: "转接给新的客服"
      });
		getPeopleList();//获取客服列表
    //点击空白处关闭弹窗
    tapCloseWindow();
}

//获取用户信息
function getUserMsg() {
	var oNow = $('.mainNav .leftScroll .active'),      //当前对话用户的标签
	    oUserId = $(oNow).attr('uid'),
  	  oUserCid = $(oNow).attr('cid'),
      sender = getQueryStr("id");

	// var getSurl = apihost+"admin/get_userinfo.action?sender=" + sender + "&uid=" + oUserId+"&callback=?";
  var getSurl = apihost+"admin/get_userinfo.action";
	// $.getJSON(getSurl,function(data){
  $.post(getSurl,{
    sender: sender,
    uid: oUserId,
    // callback: '?'
  },function(data){
		var ochat=$(".chat:visible");
		if(data.data.ismark){
      		ochat.find(".addButton .addstar").addClass("hide");
      		ochat.find(".addButton .deldestar").removeClass("hide");
		}else{
			ochat.find(".addButton .addstar").removeClass("hide");
      		ochat.find(".addButton .deldestar").addClass("hide");

		}
		if(data.data.isblack){
			ochat.find(".addButton .addblack").addClass("hide");

			ochat.find(".addButton .delblack").removeClass("hide");
		}else{
			ochat.find(".addButton .delblack").addClass("hide");
			ochat.find(".addButton .addblack").removeClass("hide");
		}
		var oArr = $('.rightBox #profileuser .userInp');

      //tet_data
      //data.data['sourceUrl']='http://www.baidu.com/asdfasdf/asdf/asdf/adsf/adf/adsf/asdf/asdf/asdf';
      //data.data['weibo'] = 'weibo';
      //data.data['wechat'] = 'wechat';
      //data.data['nikename']='nikename';
      //data.data['age']='1';
      //data.data['gender']=0;
		for(var str in data.data)
		{
           // console.log(data.data[str]+":"+str);
            if(!data.data[str]){
				data.data[str] = '';
			}
		}
        for(var el in data.data){
           var that =  $('.rightBox #profileuser .userInp[otype="'+el+'"]')[0];
            if(that){
                switch(that.tagName.toLowerCase()){
                    case 'a':
                        data.data[el] = decodeURIComponent(data.data[el]);
                        that.href= data.data[el];
                        if(data.data[el].length>35)that.text = data.data[el].toString().substr(0,35)+"...";
                        else that.text =  data.data[el];
                        break;
                    case 'p':
                        that.innerHTML = data.data[el];
                    //case 'span':
                    //    that.text(data.data[el]);
                    //    break;
                    //
                    case 'input':case 'textarea':
                        that.value = data.data[el];
                        break;
                    case'select':
                        that.value = data.data[el];
                        break;
                }
            }

        }
        //访客来源页
        //oArr[0].text = data.data.sourceUrl;
        ////浏览器
        //oArr[1].text = data.data.browser;
        ////系统
        //oArr[2].text = data.data.os;
        ////昵称
        //oArr[3].value = data.data.nikename ;
        ////用户名
        //oArr[4].value = data.data.uname;
        ////年龄
        //oArr[5].value = data.data.age;
        ////性别
        //oArr[6].value = data.data.gender;
        ////電話
        //oArr[7].value = data.data.tel ;
        ////邮箱
        //oArr[7].value = data.data.email ;
        ////QQ
        //oArr[9].value = data.data.qq ;
        ////微信
        //oArr[10].value = data.data.wechat ;
        ////微博
        //oArr[11].value = data.data.weibo ;
        ////备注
        //oArr[12].value = data.data.remark;
        //访客来源url
       // oSource.attr('href',data.data.sourceUrl).text(data.data.sourceUrl);
        //oArr[]
		//oArr[0].value = data.data.uname;
		//oArr[1].value = data.data.remark ;
		//oArr[2].value = data.data.email ;
		//oArr[3].value = data.data.qq ;
		//oArr[4].value = data.data.tel ;
		//oArr[5].value = data.data.os;
		//oArr[6].value = data.data.browser;
	},'json');
	loadClientSystem(oUserId);
}

//获取用户系统列表 Iframe 使用
function loadClientSystem(userId){
	var getClientSystemListUrl = apihost+"admin/getIframe.action";//?uid='"+ myid+"'&userId='"+userId+"'";
	$.ajax({
		type:"post",
		cache:false,
		url:getClientSystemListUrl,
		data:{
		 uid:myid,
		 userId:userId

	   },
		dataType:"JSONP",
		success:function(data){
            //data = [{'机器人':'http://baidu.com'}];
            //data = [{'机器人':'http://baidu.com'},{'qq':'http://www.qq.com'}];
			if(data.length<1)
			{
				 $("#clientSystems").addClass("hide");
				 return;
			}else if(data.length == 1){
                $("#clientSystems").removeClass("hide");
                $('#dropdownMenu2').attr('href','#clientSystem');
                for(var i=0;i<data.length;i++){
                    for(var tmp in data[i]){
                        $("#clientSysIframe").height($(".rightBox .tab-content").height());
                        $("#clientSysIframe").width($(".rightBox .tab-content").width());
                        $('#dropdownMenu2').attr('addrurl',data[i][tmp]).attr('data-toggle','tab');
                        $('#dropdownMenu2').on('click',function(){
                            $("#clientSysIframe").attr("src", $('#dropdownMenu2').attr('addrurl')).ready();
                        })
                    }
                }

            }else{

                var parentDom = $('#clientSystems a');
               var nodeDom ='<ul class="dropdown-menu dropdown-menu-right ifList" aria-labelledby="dropdownMenu2">';

                for(var i = 0 ; i < data.length ; i++)
                {
                    for(var key  in data[i]){
                        if(key.indexOf("blank") > 0)
                        {
                            nodeDom +='<li class="menuListLi"><a href="'+ data[i][key] +'" target="_blank">'+key+'</a></li>';
                        }
                        else
                        {
                            nodeDom +='<li class="menuListLi"><a href="#clientSystem" data-toggle="tab" addrurl="'+ data[i][key]+'" onclick="showClientSys(this)">'+key+'</a></li>';
                        }
                    }
                }
                nodeDom+='</ul>';
                parentDom.after(nodeDom);
                //var nodeDom=$("#clientSystems").find("ul.dropdown-menu");
                //nodeDom.html('<ul class="dropdown-menu dropdown-menu-right ifList" aria-labelledby="dropdownMenu2">');
                //
                //for(var i = 0 ; i < data.length ; i++)
                //{
                //    for(var key  in data[i]){
                //        if(key.indexOf("blank") > 0)
                //        {
                //            var dom='<li class=""><a href="'+ data[i][key] +'" target="_blank">'+key+'</a></li>';
                //        }
                //        else
                //        {
                //            var dom='<li class=""><a href="#clientSystem" data-toggle="tab" addrurl="'+ data[i][key]+'" onclick="showClientSys(this)">'+key+'</a></li>';
                //        }
                //
                //        nodeDom.append(dom);
                //    }
                //}
                //nodeDom.append('</ul>');
                if(mainJson.showClientSys)
                {
                    for(var key  in data[mainJson.showClientSys - 1])
                    {
                        $("#clientSysIframe").attr("src",data[mainJson.showClientSys - 1][key]);
                    }
                }
                else
                {
                    //判断工单列表中是否有数据
                    $("#clientSystems").removeClass("hide");
                }
            }

		}
	});
	//$("#goProfileuser").click();
}

function showClientSys(obj){
	mainJson.showClientSys = $(obj).parent().index() + 1;
	$("#clientSysIframe").height($(".rightBox .tab-content").height());
	$("#clientSysIframe").width($(".rightBox .tab-content").width());
	  $("#clientSysIframe").attr("src", $(obj).attr('addrurl')).ready();

}

function setHisGet(obj,uid,usource)
{
	var oParent = $(obj).parent(".scrollBoxParent");
	if(!mainJson.hisMouse)
	{
		mainJson.hisMouse = {};
	}
	if(!mainJson.hisMouse["his"+uid])
	{
		mainJson.hisMouse["his"+uid] = {};
		mainJson.hisMouse["his"+uid].mouseUp = 0;
	}
	/*if(mainJson.hisMouse && mainJson.hisMouse["his"+uid].hisEnd)
	{
		return
	}*/
	setMousewheel(obj,function(top){
	if(top)			//下滚false
	{
		if($(oParent).scrollTop() == 0)
		{
			mainJson.hisMouse["his"+uid].mouseUp += 1;
			if(mainJson.hisMouse["his"+uid].mouseUp == 1)
			{
				var oStr = '<div class="systeamTextBox systeamHis"><p class="systeamText">正在加载...</p></div>';
				$(obj).children().first().before(oStr);
				disjson(obj,uid,$(obj).attr("sName"),$("#chat_"+uid),Number($(obj).attr("pageNow"))+1,usource);
			}
		}
	}
})
function setMousewheel(obj,wheelFn)
{
	if(window.navigator.userAgent.indexOf('Firefox')!=-1)
	{
		obj.addEventListener('DOMMouseScroll',fn,false);
	}
	else
	{
		obj.onmousewheel=fn;
	};
	function fn(ev)
	{
		var oEvent=ev||event;
		var top=oEvent.wheelDelta?oEvent.wheelDelta<0:oEvent.detail>0;
		wheelFn&&wheelFn(!top);
		//ev&&ev.preventDefault();
		//return false;
	};
};
}

//获取历史记录
function disjson(oId,uId,sName,oChat,pageNow,usource) {
  var source = usource ,
      time = Date.now() ,
      oUrl ,
      pageNow = pageNow || 1 ,
	    pageSize = pageSize || 20;

  window.Global.times = window.Global.times || {};

	if(!mainJson.hisDate["his"+uId]) mainJson.hisDate["his"+uId] = [];

  if (pageNow > 1) time = window.Global.times[uId];
	$(oId).attr("pageNow",pageNow);
	$(oId).attr("sName",sName);
	sName = "<span class='nameColor'>" + sName + "</span>";
	oUrl = apihost+"admin/get_chatdetail.action?t=" + time + "&uid=" + uId + "&pid=" + pid + "&pageNow=" + pageNow + "&pageSize=" + pageSize + "&callback=?";
	$.getJSON(oUrl,function(json){
      // 初始化图片标记值 每次断开重连重置
      Global.map = Global.map || {};
      Global.map[json.uid] = Global.map[json.uid] || {};
      Global.map[json.uid].count = 0;

      if (json.data.length) window.Global.times[uId] = json.data[0].content[0].t;

			if (json.data.length === 0)
			{
				if(mainJson.hisMouse)
				{
					mainJson.hisMouse["his" + uId].hisEnd = true;
					$(oId).find(".systeamHis").remove();//删除正在加载
					var oStr = '<div class="systeamTextBox systeamHis"><p class="systeamText">没有更多记录</p></div>';
					$(oId).children().first().before(oStr);
					return
				}
			}
			for(var i = json.data.length-1;i >=0 ;i--)
			{
                //console.log(json.data[i]);
					var oDom = '';
					var oTestDate = false;
					for(var jsonD = 0 ; jsonD < mainJson.hisDate["his"+uId].length ;jsonD++)
					{
						if(mainJson.hisDate["his"+uId][jsonD] == json.data[i].date)
						{
							oTestDate = true;
						}
					}
					if(oTestDate)//如果之前有
					{
						$(oId).find(".dayHisDate"+json.data[i].date).remove();
					}
          oDom = '<div class="day_divider dayHisDate'+ json.data[i].date +'" ><hr><div class="day_divider_label">'+ json.data[i].date +'</div></div>';
					// oDom = '<div class="day_divider dayHisDate'+ json.data[i].date +'" ><hr><div class="day_divider_label">'+ json.data[i].date +'</div></div>';
					mainJson.hisDate["his"+uId].push(json.data[i].date);
				var oMsg = '';
				for(var j = 0;j < json.data[i].content.length; j++)
				{
					var oJson = json.data[i].content[j];
					var actionStr = '',faceUrl,
						// oTime = oJson.ts.split(" ")[1].substring(0,5),oName;
            oTime = oJson.ts.split(" ")[1].substring(0, 8),oName;
					if(oJson.senderType == 0)
					{
						oName = oJson.senderName;
                        //TODO:测试数据 判断是否有自定义的用户头像
                       // oJson.senderFace = "http://img.sobot.com/chatres/common/face/appType.png";
                        faceUrl = oJson.senderFace ? decodeURIComponent( oJson.senderFace):ZC_Extend.member.userFace[source];
					}
					if(oJson.senderType == 1)
					{
						oName = "机器人";
						faceUrl = apihost+"chatres/common/face/robot.png"
					}
					if(oJson.senderType == 2)
					{
						oName = oJson.senderName;
						faceUrl = oJson.senderFace
					}
					oJson.receiverName = "<span class='nameColor'>"+ oJson.receiverName +"</span>";
					// oJson.senderName = "<span class='nameColor'>"+ oJson.senderName +"</span>";
          oJson.senderName = "<span>"+ oJson.senderName +"</span>";
					switch(oJson.action)
					{
						case 4:
						actionStr = '用户和机器人建立会话';
						break;

						case 5:
						actionStr = oJson.msg;
						break;

						case 6:
						actionStr = '用户转人工服务';
						break;

						case 7:
						actionStr = '用户排队';
						break;

						case 8:
						actionStr = '用户和客服'+ oJson.receiverName+'建立会话';
						break;

						case 9:
						actionStr = '用户与客服' + oJson.senderName + '的会话,被转接到客服' + oJson.receiverName;
						break;

						case 10:
							if(oJson.offlineType == 4)
							{
								actionStr = '用户会话超时，本次会话已经结束'
							}
							else if(oJson.offlineType == 5)
							{
								actionStr = '用户关闭了聊天页面，本次会话已经结束';
							}
							else if(oJson.offlineType == 3)
							{
								actionStr = '用户被客服' + oJson.receiverName + '加入黑名单,本次会话结束'
							}
							else if(oJson.offlineType == 2)
							{
								actionStr = '用户被客服' + oJson.receiverName + '移除,本次会话结束'
							}
							else if(oJson.offlineType == 1)
							{
								if(oJson.receiverName.indexOf("null")>=0){
									actionStr = '客服离线,本次会话结束';
								}
								else{
									actionStr = '客服' + oJson.receiverName + '离线,本次会话结束';
								}

							}
							else if(oJson.offlineType == 6)
							{
								actionStr = '用户打开新的聊天页面，本次会话已经结束';
							}
						break;

						case 11:
						//actionStr = '用户' + sName + '已被客服'+ oJson.senderName + '拉入黑名单';
							continue;
					     break;

						case 12:
						actionStr =  '用户已被客服'+ oJson.senderName +'取消拉黑';
						break;
						case 16:
							actionStr =  '用户已被客服'+ oJson.senderName +'添加星标';
							///oChat.find(".addButton .addstar").addClass("hide");
							///oChat.find(".addButton .deldestar").removeClass("hide");
							break;
						case 17:
							actionStr =  '用户已被客服'+ oJson.senderName +'取消星标';
							//oChat.find(".addButton .addstar").removeClass("hide");
		              		//oChat.find(".addButton .deldestar").addClass("hide");
							break;
						case 18:
							actionStr =  '用户向客服'+ oJson.receiverName +'申请语音通话';
							//oChat.find(".addButton .addstar").removeClass("hide");
		              		//oChat.find(".addButton .deldestar").addClass("hide");
							break;
						case 19:
							actionStr =  '客服'+ oJson.senderName +'给用户回拨语音通话';
							//oChat.find(".addButton .addstar").removeClass("hide");
		              		//oChat.find(".addButton .deldestar").addClass("hide");
							break;
						case 20:
							var oUrl20 = oJson.msg.substring(0,oJson.msg.indexOf(";"));
							var oTitle = oJson.msg.substring(oJson.msg.indexOf(";")+1,oJson.msg.length);
							actionStr = '用户访问了页面 <a href="'+ oUrl20 +'" target="_blank">'+ oTitle +'</a>';
						break;

						case 21:
							actionStr = '客服' + oJson.senderName + "主动邀请会话";
						break;

					}
                    actionStr = actionStr.replace(/&amp;/g,'&');
                    actionStr =   ZC_Extend.getUrlRegex(actionStr);
					if(oJson.action == 5)
					{

						if(oJson.senderType == 0){
							// 用户
							oMsg += '<div class="msg userCus">' + '<div class="msg_user fl"><img src="'+ faceUrl +'" class="msg_user_img" /></div>'+'<div class="msgContBox fl"><span class="msg_name">'+ oName + '</span><span class="msg_time" style="margin-left: 0px;">' + oName.substr(0, 8) + '</span>'+'<span class="msg_time">'+ oTime +'</span><div style="clear:both;"></div><div class="msgBg" style="display: inline-flex;float: left;margin: 0px;"><i class="angleLeft"></i><div class="msg_content" >' + actionStr +'</div></div></div>' + '</div>';
						}else if(oJson.senderType == 1){
							// 机器人
							// oMsg += '<div class="msg workOrderCus">' + '<div class="msg_user fr"><img src="'+ faceUrl +'" class="msg_user_img"></div>'+'<div class="msgContBox fr"><span class="msg_name">'+ oName + '</span><span class="msg_time">'+ oTime +'</span><div class="msgBg"><i class="angleRight"></i><div class="msg_content" >' + actionStr +'</div></div></div>' + '<div data-content="' + actionStr + '" class="msgReplyError msgReplyErrorDefault fr"></div>' + '</div>';
              oMsg += '<div class="msg workOrderCus">' + '<div class="msg_user fr"><img src="'+ faceUrl +'" class="msg_user_img"></div>'+'<div class="msgContBox fr"><span class="msg_name">'+ oName + '</span><span class="msg_time">' + oName.substr(0, 8) + '</span><span class="msg_time">'+ oTime +'</span><div style="clear:both;"></div><div class="msgBg" style="display: inline-flex;float: right;margin: 0px;"><i class="angleRight"></i><div class="msg_content" >' + actionStr +'</div></div></div>' + '</div>';
						}else {
							// 客服
							oMsg += '<div class="msg workOrderCus">' + '<div class="msg_user fr"><img src="'+ faceUrl +'" class="msg_user_img"></div>'+'<div class="msgContBox fr"><span class="msg_name">'+ oName + '</span><span class="msg_time">' + oName.substr(0, 8) + '</span><span class="msg_time">'+ oTime +'</span><div style="clear:both;"></div><div class="msgBg" style="display: inline-flex;float: right;margin: 0px;"><i class="angleRight"></i><div class="msg_content" >' + actionStr +'</div></div></div>' + '</div>';
						}
					}
					else								//dyy加判断取消‘用户会话超时，本次会话已经结束’
					{
						//oMsg += '<div class="msg">' + '<div class="msg_user"><img src="'+ faceUrl +'" class="msg_user_img"></div>'+'<div><span class="msg_name">'+ oName + '</span><span class="msg_time">'+ oTime +'</span><div class="msg_content systeamText" >' + actionStr +'</div></div>' + '</div>';
						oMsg += '<div class="systeamTextBox"><p class="systeamText">' + actionStr + ' ' + oTime + '</p></div>';
					}
				}

				oDom = oDom + oMsg;
				$(oId).find(".systeamHis").remove();//删除正在加载
				mainJson.hisMouse["his"+uId].mouseUp = 0;
				mainJson.hisMouse["his"+uId].oHeight = $(oId).outerHeight();
				if($(oId).children().length == 0)
				{
					$(oId).append(oDom);
				}
				else
				{
					$(oId).children().first().before(oDom);
				}
			}
			getOldMsg = true;
			setTimeout(function(){
				$(oId).parent(".scrollBoxParent").scrollTop($(oId).outerHeight() - mainJson.hisMouse["his"+uId].oHeight + 15);
			},200);
			//setScroll(oChat);
		});
}
/*//位置交换
function chngeUser(a,b)
{
	$(a).before($(b).clone());
	$(b).before($(a).clone());
	$(a).remove();
	$(b).remove();
}*/



function FsetCall(oUid,tel,uName)
{
	        var uid = oUid;
        	$("#user_" + uid + " .user").attr("called",tel);
        	var nowObj = $("#chat_"+ oUid).find(".uesrDivNow");
        	var oStr = "[通话请求] <span class='callTextName'>" + uName + "("+ tel + ")</span> " + new Date().format("hh:mm:ss");
        	$("#chat_"+ oUid).find(".uesrDivNow .callText").html(oStr);
        	var obj = $("#chat_"+ oUid + " .userTextNow");
        	nowObj.show();
        	if(obj[0].showed == true)
        	{
        		nowObj.css("top","-70px");
        	}
        	else
        	{
        		nowObj.css("top","-40px");
        	}
        	$user = $("#user_"+uid+" .user");
        	if(!$user.hasClass("active"))
        	{
        		var $count = $("#user_"+uid+" .msg-count");
	        	var count = $count.html();
	        	if(count == '')
	        	{
	        		$count.html("1");
	        	}
	        	else
	        	{
	        		var str = Number($count.html()) + 1 ;
	        		$count.html(str);
	        	}
        	}
}

$("#users")[0].addNum = 1;


function uploadImg(obj,oChat)
{
	obj.off("click");
	var uid = oChat.attr("uid");
    var cid = oChat.attr("cid");
    var source = oChat.attr("source");
    if($('#chat_input_'+ uid).attr("imgUpload") == "yes")//解决粘贴图片事件重复
	{
		return
	}

    Global.map = Global.map || {};
    Global.map[uid] = Global.map[uid] || {};

		var uploadOption = {
        action: apihost+"webchat/fileupload.action",
        name: "file",
        autoSubmit: true,
        data:{
          pid: pid,
          type: "msg",
          countTag: 0
        },
        responseType:"JSONP",
        contentType:"application/x-www-form-urlencoded; charset=utf-8",
        onChange: function (file, extension)
        {
        	if(source==0){
	        	if (!(extension && /^(jpg|JPG|png|PNG|gif|GIF|txt|TXT|DOC|doc|docx|DOCX|pdf|PDF|ppt|PPT|pptx|PPTX|xls|XLS|xlsx|XLSX|RAR|rar|zip|ZIP)$/.test(extension))) {
	        		 $.amaran({
	        	            content:{
	        	                message:'格式不支持!',
	        	                size:'请上传正确的文件格式',
	        	                file:'',
	        	                icon:'fa fa-times'
	        	            },
	        	            theme:'default error',
	        	            position:'bottom right',
	        	            inEffect:'slideRight',
	        	            outEffect:'slideBottom'
	        	       });
	                return false;
	            }
        	}else{
        		if (!(extension && /^(jpg|JPG|png|PNG|gif|GIF)$/.test(extension))) {
	        		 $.amaran({
	        	            content:{
	        	                message:'图片格式不支持!',
	        	                size:'请上传jpg/png/gif格式图片',
	        	                file:'',
	        	                icon:'fa fa-times'
	        	            },
	        	            theme:'default error',
	        	            position:'bottom right',
	        	            inEffect:'slideRight',
	        	            outEffect:'slideBottom'
	        	       });
	                return false;
	            }
        	}
        },
        onSubmit: function (file, extension, base64file){
          var fileTypeReg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;

          Global.uid = $("[class='user active']").attr('uid')
          Global.cid = $("[class='user active']").attr('cid');
          Global.usource = $("[class='user active']").attr('usource');

          Global.map[$("[class='user active']").attr('uid')].count = Global.map[$("[class='user active']").attr('uid')].count || 0;

          if (fileTypeReg.test(file)) Global.map[$("[class='user active']").attr('uid')].count++;
          uploadOption.data.source = Global.usource;
          uploadOption.data.countTag = Global.map[uid].count;

        	if(extension && /^(jpg|JPG|png|PNG|gif|GIF)$/.test(extension))
        	{
				//去除admin/
        		var con = '<img src="img/upImgLoad.png" class="webchat_img_upload upNowImg">';
        		showMsg(uid,myname,mylogo,con,null,null,base64file);
        	}
        	else
        	{
        		var oMsgDom = '<div class="systeamTextBox systeamNowText"><p class="systeamText">正在上传 '+ file +'</p></div>';
        		$("#chat_"+ uid).find(".scrollBox").append(oMsgDom);
        		$("#chat_"+uid).find('.scrollBoxParent').scrollTop(999999);
        	}
        },
        onComplete: function (file,response) {
          var countTag = 0,
              res,
              url,
              size;

    			if (typeof response == 'string') {
              res = JSON.parse(response);
              url = res.url;
    			    countTag = parseInt(res.countTag) - 1;
    			}else{
    				  url = response.url;
    			}

        	size = response.filesize;

        	if (size==false) {
        		 $.amaran({
     	            content:{
     	                message:'所传文件过大!',
     	                size:'',
     	                file:'',
     	                icon:'fa fa-times'
     	            },
     	            theme:'default error',
     	            position:'bottom right',
     	            inEffect:'slideRight',
     	            outEffect:'slideBottom'
     	       });
        		 return;
        	 }

        	 imgCallBack(uid, url, cid, countTag);
        }
      }

    	new AjaxUpload(obj, uploadOption);

	///粘贴发送
			$('#chat_input_'+ uid).pastableTextarea();
			$('#chat_input_'+ uid).on('pasteImage', function (ev, data){
					bootbox.dialog({
				        message:'<img src="'+ data.dataURL +'" style="display: block;margin: 20px auto;max-width: 750px;">',
				        size:"large",
				        title: "确定要发送这张图片吗？",
				        buttons: {
				        	no:{
				        		label: "取消",
            					className: "btn-danger",
					            callback: function () {

					            }
				        	},
				        	success: {
				        		label: "确定",
            					className: "btn-success",
					            callback: function () {
					            	paste_img(data.blob,uid,cid);
					            }
				        	}
				        }

				      });
					//paste_img(data.blob,cid);
				})/*.on('pasteText', function (ev, data){
					if(window.navigator.userAgent.toLowerCase().indexOf('firefox')!=-1){
						$('#chat_input_'+ uid).val($('#chat_input_'+ uid).val() + data.text);
					}
				});*/

				$('#chat_input_'+ uid).attr("imgUpload","yes");

}
function disLeave(oUidd, time)
{		var obj = $("#chat_"+ oUidd + " .userTextNow");
        	obj.hide();obj[0].showed = false;
        	$("#chat_"+ oUidd).find(".uesrDivNow").css("top","-40px");
		//showMsg(oUidd,"系统消息","chatres/common/face/robot.png","<div class='msg_content systeamText'>该用户已经是离线状态。</div>");
    var dt = '';
    // time 服务器传递的时间
    if (time) {
      dt = new Date(new Date().setTime(time)).format('hh:mm:ss');
    }
		var oMsgDom = '<div class="systeamTextBox"><p class="systeamText">该用户已经是离线状态。'+ dt +'</p></div>';
			$("#chat_"+ oUidd).find(".scrollBox").append(oMsgDom);
			setScroll($("#chat_"+ oUidd));

			if($('#users li').length == 0)
			{
				return;
			}

	    	 if($("#user_"+oUidd+" .user").hasClass("active"))    //当前用户下线了
    	    {
                //若离线就把该聊天窗口给置为disabled
                var $txtArea = $('#chat_input_'+oUidd);
				$txtArea.attr('disabled','true');
                $txtArea.attr('placeholder','访客已关闭会话');
                //TODO 若用户离线 则禁止点击表情和发送图片
                $('#maskFace,#maskPhoto').css('display','block');
    	    	$("#user_"+ oUidd).find(".uname").html($("#user_"+ oUidd).find(".uname").html() + "[离线]");
                $('#user_'+ oUidd).find('.fa.fa-laptop').css('background-color','#d8dbda');
    	    	$("#user_"+ oUidd).find(".user")[0].leaved = true;
/*    	    	var num = $("#user_"+oUidd+"").index();
    	    	if(num == 0)
    	    	{
    	    		if($('#users li').length == 1)
    	    		{
    	    			//var obj = $('#left-navigation #users').children().first().children('.user');
    	    			//showChat(obj);
    	    		}
    	    		else
    	    		{
    	    			showChat($("#user_"+oUidd+"").next().children('.user')[0]);
    	    			$('.rightBox #profileuser .userInp').attr("value","");
    	    		}
    	    	}
    	    	else
    	    	{
    	    		var obj = $('#left-navigation #users').children().first().children('.user');
    	    		showChat(obj[0]);
    	    	}*/

    	    }
    	    else
    	    {
    	    	changeUserLi($("#user_"+ oUidd),"leave",oUidd);
    	    }

/*        	if($("#users li").length == 0)
			{
				//$(".rightBox .nav li,.rightBox .tab-border .tab-pane").first().hide();
				$("#goMessage").click();
			}*/

}

function changeUserLi(obj,type,oUid)
{
	if(type == "leave") //下线
	{

		var newObj = $(obj).clone(true);
		if($("#offlineUser li").length == 0)
		{
			$("#offlineUser").append(newObj);
		}
		else
		{
			$("#offlineUser li:first-child").before(newObj)
		}
		$(obj).remove();
		$("#user_"+ oUid).find(".uname").html($("#user_"+ oUid).find(".uname").html().replace(/\[离线\]/g,"") + "[离线]");
		$("#user_"+ oUid).find(".user")[0].leaved = true;

        //若离线就把该聊天窗口给置为disabled
        var $txtArea = $('#chat_input_'+oUid);
        $txtArea.attr('disabled','true');
        $txtArea.attr('placeholder','访客已关闭会话');
        //TODO 若用户离线 则禁止点击表情和发送图片
        $('#maskFace,#maskPhoto').css('display','block');
	}
	else   //上线
	{

		var newObj2 = $(obj).clone(true);
		$(obj).remove();
		if($("#users li").length == 0)
		{
			$("#users").append(newObj2);


		}
		else
		{
			$("#users li:first-child").before(newObj2)
		}
		var str = $("#user_"+ oUid).find(".uname").html();
		str = str.replace(/\[离线\]/g,"");
		$("#user_"+ oUid).find(".uname").html(str);
		$("#user_"+ oUid).find(".user")[0].leaved = false;
        //$('#user_'+oUid).find('.lastMsg').html('aaa');

        //若由离线变为在线就把该聊天窗口给置为disabled=false
        var $txtArea = $('#chat_input_'+oUid);
        $txtArea.removeAttr('disabled');
        $txtArea.attr('placeholder','请输入...');
        //TODO 若用户上线 则取消禁止点击表情和发送图片
        $('#maskFace,#maskPhoto').css('display','none');

	}

}



function send(cid, content, sucessCallback, isRe, dom){
	$.ajax({
	        type : "post",
	        url : sendurl,
	        dataType : "JSONP",
	        data : {
		   		'uid':myid,
		   		'cid':cid,
	            'answer' : content,
	            'answerType':null,
		   		'docId':null,
	            'pid' : null,
	            'questionId' : null
	        },
          timeout: config.overTime,
          cache: false,
			    success : function (data){

    				// if(data.status==1){
    				// 	if(sucessCallback){
    				// 		sucessCallback()
    				// 	}
    				// }

            // review
            // if(data.status === 1 && sucessCallback) sucessCallback();
            // 模拟 发送状态: 失败
            // data.status = 0;

            if (isRe) {

              if (sucessCallback) sucessCallback(data.status);
            } else {

              if(data.status === 1) {

                if (sucessCallback) sucessCallback();
              } else {
                console.log('url => ' + sendurl , {
      		   		'uid':myid,
      		   		'cid':cid,
      	            'answer' : content,
      	            'answerType':null,
      		   		'docId':null,
      	            'pid' : null,
      	            'questionId' : null
      	        });
              }
            }

    	    },
          error: function(){

            // 只要有错误就请求
            if (arguments[0].error().statusText) sendError(content, isRe, dom);
          }
	});
}

function send1(cid,content,sucessCallback,answerType,docId,pid,questionId){
	$.ajax({
	        type : "post",
	        url : sendurl,
	        dataType : "JSONP",
	        data : {
	            'uid':myid,
		   		'cid':cid,
	            'answer' : content,
	            'answerType':answerType,
		   		'docId':docId,
	            'pid' : pid,
	            'questionId' : questionId
	        },
			success : function (data){
				if(data.status==1){
					if(sucessCallback){
						sucessCallback()
					}
				}
		    }
	});
}

function out(){
	$.ajax({
        type : "post",
        url : outurl,
        dataType : "JSONP",
        data : {
	   		'uid':myid
        },
        success : function (data){
			if(data.status=1){
//				offlineSuccess();
				window.onbeforeunload=null;
				document.write(" ");
				window.location.href = "http://www.sobot.com/console/login.jsp";
			}
        }
  	});
}


function leave(cid,userId){
	$.ajax({
        type : "post",
        url : leaveurl,
        dataType : "JSONP",
        data : {
	   		'uid':myid,
	   		'cid':cid,
	   		'userId':userId
        },
        success : function (data){
			if(data.status=1){
				$("#user_"+ userId +"").remove();
    			$("#chat_"+ userId +"").remove();
    			mainJson.hisMouse["his"+userId] = null;
				mainJson.hisDate["his"+userId] = null;
				//disLeave(cid);
                isUsers();
			}
        }
  	});
}


//判断当前是否有用户
function isUsers(){
    //console.log($('#users li').length );

    if($('#users li').length < 1 && $('#offlineUser li').length < 1){
        $('#chatonline').addClass('noOnline');
    }else{
        $('#chatonline').removeClass('noOnline');
    }
}
window.isUsers = isUsers;

function busy(){
	$.ajax({
        type : "post",
        url : busyurl,
        dataType : "JSONP",
        data : {
	   		'uid':myid
        },
        success : function (data){
			if(data.status=1){
				busySuccess();
			}
        }
  	});
}

function online(){
	$.ajax({
        type : "post",
        url : onlineurl,
        dataType : "JSONP",
        data : {
	   		'uid':myid
        },
        success : function (data){
			if(data.status=1){
				onlineSuccess();
			}
        }
  	});
}
//智能回复
$("#homeuser .homeUserBox .robotHide1 .quickSendBtn").click(function(){
	var oHtml = $("#homeuser .homeUserBox .robotAnswer a").html();
	if(oHtml == "")return;
	var ocid = $('#left-navigation .mainNav .leftScroll li .active').attr('cid');
	var oUid = $('#left-navigation .mainNav .leftScroll li .active').attr('uid');
	var answerType = $("#homeuser .homeUserBox .robotAnswer a").attr('answerType');
	var docId = $("#homeuser .homeUserBox .robotAnswer a").attr('docId');
	var pid = $("#homeuser .homeUserBox .robotAnswer a").attr('pid');
	var questionId = $("#homeuser .homeUserBox .robotAnswer a").attr('questionId');
	if(ocid)
	{
		send1(ocid,oHtml,null,answerType,docId,pid,questionId);
		showMsg(oUid,myname,mylogo,oHtml);
	}

})
$("#quickSerch").keyup(function(ev){
	if(this.value.length == 0)return;
	if(ev.keyCode == 13)
	{
		quickSearch(this.value);
		$("#homeuser .homeUserBox .robotHideBtn").hide();
	}
});
$("#quickSerchBtn").click(function(){
	if($("#quickSerch")[0].value.length == 0)return;
	quickSearch($("#quickSerch")[0].value);
	$("#homeuser .homeUserBox .robotHideBtn").hide();
});
function quickSearch(val)
{
	$(".robotHide1,.robotHide2").hide();
	$("#homeuser .homeUserBox .robotAnswer a")[0].innerHTML = '';
	$("#homeuser .homeUserBox .robotSugguestions ul")[0].innerHTML = '';
	var searchUrl = apihost+"admin/internalChat1.action";
	$.ajax({
		type:"post",
		url:searchUrl,
		dataType:"JSONP",
		data:{
			uid:myid,
			requestText:val
		},
		success:function(data){
				//yy
				disSearchWeb(data);
				//disSearch(data);
		}
	});
	function disSearch(data)
	{
		if(data.answer != "")
		{
			$("#homeuser .homeUserBox .robotAnswer a").html(data.answer);
			$(".robotHide1").show();
		}
		if(data.sugguestions == null)return;
		$(".robotHide2").show();
		for(var i = 0 ; i < data.sugguestions.length ;i++)
		{
			$("#homeuser .homeUserBox .robotSugguestions ul").append("<li list='"+ (i+1) +"'>"+ (i+1) +"." + data.sugguestions[i] +"</li>");
		}
	};
	function disSearchWeb(data)		//移动端；
	{
		if(data.answer != "")
		{
			if(data.pid==null){
				data.pid=0;
			}
			$("#homeuser .homeUserBox .robotAnswer a").html(data.answer);
			//dyy 存数据
			$("#homeuser .homeUserBox .robotAnswer a").attr('answerType',data.answerType);
			$("#homeuser .homeUserBox .robotAnswer a").attr('docId',data.docId);
			$("#homeuser .homeUserBox .robotAnswer a").attr('pid',data.pid);
			$("#homeuser .homeUserBox .robotAnswer a").attr('questionId',data.questionId);
			//dyy end
			//搜索结果 直接发送 按钮显示
			$(".robotHide1").show();
		}
		//yy如果没有 建议选项直接 return
		if(data.sugguestions == null)return;
		//yy如果有 显示
		$(".robotHide2").show();
		$("#homeuser .homeUserBox .robotSugguestions ul").html('');//yy
		for(var i = 0 ; i < data.sugguestions.length ;i++)
		{
			$("#homeuser .homeUserBox .robotSugguestions ul").append("<li list='"+ (i+1) +"'>"+ (i+1) +"." + data.sugguestions[i].question +"</li>");
		}
	};
};

$("#homeuser .homeUserBox .robotAnswer").on('click','a',function(ev){
	var ocid = $('#left-navigation .mainNav .leftScroll li .active').attr('cid');
	if(ocid)
	{
		var oHtml = $(this).html();
			oHtml = oHtml.replace(/<[^<>]+>/g,'');
		var oSobj = $('#chatlist .chat[cid="'+ ocid+'"] .botTextBox textarea');
			oSobj.attr("robot","robot");
		var oSatr = oSobj.val();
		oSobj.val(oSatr + ' ' + oHtml);
		oSobj.val(oSobj.val().replace("请输入..",""));
		oSobj.focusEnd();
	}
});   			//文本点击禁止
$("#homeuser .homeUserBox .robotHideBtn").on('click',function(){
	quickSearch($("#quickSerch")[0].value);	//dyy 区别web 还是pc
	$(this).hide();
})
$("#homeuser .homeUserBox .robotSugguestions").on('click','li',function(ev){
	quickSearch($(this).attr("list"));     //dyy 相关搜索点击
	setTimeout(function(){
		//返回按钮
		$("#homeuser .homeUserBox .robotHideBtn").show();
	},100);
});
//$("#homeuser .homeUserBox").height("100%");
//$("#homeuser .homeUserBox").niceScroll({cursorwidth:"10px",mousescrollstep:"100",scrollspeed:"200",horizrailenabled:false});

//$('#homeuser .homeUserBox').niceScroll({cursorwidth:"10px",mousescrollstep:"50px",scrollspeed:"100"});

//左侧列表事件

$("#users,#offlineUser").on("mouseover",".user",function(){
	$(this).children(".user-del").show();
});
$("#users,#offlineUser").on("mouseout",".user",function(){
	$(this).children(".user-del").hide();
});

//聊天记录事件

$("#main-content").on("click",".formUser",function(){
	var textstr=this.textContent;
	if($(this).find("img").length > 0&&textstr=="")
	{
		return;
	}
	if($(this).find("a").length > 0 && textstr.length>5 && $(this).find("img").length > 0){
		var str = textstr.substring(textstr.length-5,textstr.length);
		 if(str.indexOf("jpg")||str.indexOf("JPG")||str.indexOf("png")||str.indexOf("PNG")||str.indexOf("gif")||str.indexOf("GIF")||str.indexOf("txt")||str.indexOf("TXT")||str.indexOf("DOC")||str.indexOf("doc")||str.indexOf("docx")||str.indexOf("DOCX")||str.indexOf("pdf")||str.indexOf("PDF")||str.indexOf("ppt")||str.indexOf("PPT")||str.indexOf("pptx")||str.indexOf("PPTX")||str.indexOf("xls")||str.indexOf("XLS")||str.indexOf("xlsx")||str.indexOf("XLSX")||str.indexOf("RAR")||str.indexOf("rar")||str.indexOf("zip")||str.indexOf("ZIP")){
			return;
		 }
	}
	$("#quickSerch").val(textstr);
	quickSearch(textstr);
//	$("#quickSerch").val($(this).html());
//	quickSearch($(this).html());
	$("#gotoQuick").click();
})
///关闭页面
//var _t;
//window.onbeforeunload = function()
//{
//    //setTimeout(function(){_t = setTimeout(onunloadcancel, 0)}, 0);
//    return " ";
//}

/*
window.onunloadcancel = function()
{
    clearTimeout(_t);
    alert("取消离开");
}*/

//消息提醒
var oLdStr = document.title;
var windowSendMsg = false;
function disNewMsg(msg,oText,uid,sounds)
{
	if(windowSendMsg == false)return;
	var re = /<img.*?>/g;
	var reA = /<a.*?<\/a>/g;
	if(reA.test(oText))
	{
		oText = "[富文本]";
	}
	else
	{
		if(re.test(oText))
		{

            if(oText.indexOf('webchat_voice')==-1){
                oText= oText.replace(re,'[语音]');
            }else if(oText.indexOf("webchat_img_face") == -1)
			{
				oText = oText.replace(re,"[图片]");
			}

		}
	}
	showMsgNotification(msg, oText,uid);
    if(sounds&&sounds==1)
        $('#audio2')[0].play();
    else
	    $("#audio1")[0].play();
	document.title = msg;

	newMessageRemind.clear();
	newMessageRemind.show(msg);
	document.title = oLdStr;
}


var newMessageRemind={
	_step: 0,
    _timer: null,
	//显示新消息提示
	show:function(msg){
		if(windowSendMsg == false)return;
		//var temps = newMessageRemind._title.replace("【　　　】", "").replace("【新消息】", "");
		 newMessageRemind._timer = setTimeout(function() {
            newMessageRemind.show(msg);
            newMessageRemind._step++;
            if (newMessageRemind._step == 3) { newMessageRemind._step = 1 };
            if (newMessageRemind._step == 1) { document.title = oLdStr };
            if (newMessageRemind._step == 2) { document.title = msg };
        }, 800);
        return [newMessageRemind._timer, oLdStr];
	},
	//取消新消息提示
	clear: function(){
		clearTimeout(newMessageRemind._timer );
		document.title = oLdStr;
	}

};


window.onblur = function()
{
	windowSendMsg = true;
}

window.onfocus = function()
{
	windowSendMsg = false;
	newMessageRemind.clear();
	document.title = oLdStr;
	setTimeout(function(){
		document.title = oLdStr;
	},500)
}



////滚动条
//function setScroll(obj){
//	$(obj).find('.scrollBoxParent').niceScroll({cursorwidth:"10px",mousescrollstep:"100",scrollspeed:"200"});
//	setScrollWidth(obj);
//	setTimeout(function(){
//		$(obj).find('.scrollBoxParent').scrollTop(99999);
//	},500)
//}
//
//function setScrollWidth(obj){
//	//alert($(obj).width());
//	//宽度直接100%
//	//$(obj).find('.scrollBoxParent').width($(obj).width()+'px');
//	//yy 设置 总高度－ 顶部52  －底部最小210
//	//yy 历史记录 高度只是减少52
//	if(obj.selector == "#hchat"){
//
//	}else{
//		$(obj).find('.scrollBoxParent').height(($(window).height() - 262)+'px');
//	}
//}


var MaxW = $(window).width()*0.9;
var MaxH = $(window).height()*0.9;
var mmm = false;

$("#chatlist").on("click",".webchat_img_upload",function(){
	//window.open(this.src)
	var oLeft,oTop;

	function getWH(a1,a2)
	{
		if(a1>MaxW){
			mmm = true;
			oLeft = MaxW/2;
			oTop = MaxH/2;
		}else{
			oLeft = a1 / 2;
		  	oTop = a2 / 2;
		  	mmm = false;
		}

	}
	getImgNaturalDimensions(this,getWH);
	var oDom = "<div class='webchat_imgBigBox'><img src='"+ this.src +"'' class='webchat_imgBig'></div>";
	$(document.body).append(oDom);
	var This = $(".webchat_imgBigBox .webchat_imgBig");
	if(mmm)
	{
		This.css({"width":MaxW +'px',"height":MaxH+'px' });
	}
	This.css({"margin-left":-oLeft+'px',"margin-top":-oTop+'px'});
	$(".webchat_imgBigBox").click(function(){
		$(".webchat_imgBigBox").remove();
	})
})

function getImgNaturalDimensions(img, callback) {
    var nWidth, nHeight
    if (img.naturalWidth) { // 现代浏览器
        nWidth = img.naturalWidth
        nHeight = img.naturalHeight
    } else { // IE6/7/8
        var imgae = new Image()
        image.src = img.src
        image.onload = function() {
            callback(image.width, image.height)
        }
    }
   callback(nWidth,nHeight);
}
//


function showMsgNotification(title, msg,uid){
var Notification = window.Notification || window.mozNotification || window.webkitNotification;

if (Notification && Notification.permission === "granted") {
	var instance = new Notification(
		title, {
		body: msg,
		icon: "assets/images/logo.png",
		tag: "1"
		}
	);

	instance.onclick = function () {
		window.focus();
		$("#user_"+ uid).find("a").click();
	};
	instance.onerror = function () {
	// Something to do
	};
	instance.onshow = function () {
	// Something to do

	setTimeout(function(){
		instance.close();
	},300000);
	};
	instance.onclose = function () {
	// Something to do
	};
}
else if (Notification && Notification.permission !== "denied") {
	Notification.requestPermission(function (status) {
	if (Notification.permission !== status) {
	Notification.permission = status;
	}
	// If the user said okay
	if (status === "granted") {
	var instance = new Notification(
	title, {
	body: msg,
	icon: "assets/images/logo.png",
	tag: "1"
	}
	);

	instance.onclick = function () {
		window.focus();
		$("#user_"+ uid).find("a").click();
	};
	instance.onerror = function () {
	// Something to do
	};
	instance.onshow = function () {
	// Something to do
	setTimeout(function(){
		instance.close();
	},300000);
	};
	instance.onclose = function () {
	// Something to do
	};

	}else {
	return false
	}
	});
}else{
	return false;
}

}

function setOtextCon(obj,cid)
{
	obj.pressd = 1;
	$(obj).keyup(function(){
				this.pressd += 1;
				if(this.pressd == 2)
				{
					var sendpressUrl = apihost+"admin/input.action";
						$.ajax({
					        type : "post",
					        url : sendpressUrl,
					        dataType : "JSONP",
					        data : {
						   		'uid':myid,
						   		'cid':cid
					        },
					        success : function (data){
					        	if(data.status == 1)
					        	{
					        		//this.pressd = 0;
					        	}
					        }
					  	});
				}
	})
}

//语音通话
$("#chatlist").on("click",".callBtn",function(){
	if(mainJson.callClicked)
	{
		bootbox.dialog({
        message: "请确认上一个通话已完成",
        title: "语音通话",
        buttons: {
          danger: {
            label: "取消",
            className: "btn-danger",
            callback: function() {
            	return
            }
          },
          success: {
            label: "确定",
            className: "btn-success",
            callback: function() {
            	callGo();
            }
          }
        }
      });
	}
	else
	{
		callGo();
	}

	function callGo()
	{
			var oNow = $('.mainNav .leftScroll .active');      //当前对话用户的标签
			var oUid = $(oNow).attr("uid");
			var oCid = $(oNow).attr("cid");
			$(".msgBox").attr("uid",oUid);
			var sNumber = $("#user_" + oUid + " .user").attr("called");
				$.ajax({
			        type : "post",
			        url : apihost+"admin/call.action",
			        dataType : "JSONP",
			        data : {
				   		'sender':myid,
				   		'cid':oCid,
			            'receiver' : oUid,
			            'called':sNumber
			        },
					success : function (data){
						if(data.status == 1)
						{
							var oStr = '<div class="systeamTextBox"><p class="systeamText">通话申请成功 '+ new Date().format('hh:mm:ss') +'</p></div>';
							var oNow = $('.mainNav .leftScroll .active');      //当前对话用户的标签
							var oUid = $(oNow).attr("uid");
							$("#chat_"+ oUid).find(".scrollBox").append(oStr);
							$(oNow).attr("addCallYes","yes");
							$(".msgBox .callmsgBox .userForm").html(oNow.attr("name"));
							$(".msgBox .callmsgBox .userNumber").html(sNumber);
							$(".msgBox").show();
							$("#chat_"+ oUid).find(".uesrDivNow").hide();
							mainJson.callClicked = true;
						}
						else if(data.status == 2)
						{
							$.amaran({
		     	            content:{
		     	                message:'请设置您的电话号码',
		     	                size:'',
		     	                file:'',
		     	                icon:'fa fa-times'
		     	            },
		     	            theme:'default error',
		     	            position:'bottom right',
		     	            inEffect:'slideRight',
		     	            outEffect:'slideBottom'
		     	       });
							$("#gotoSetYourInfo").click();
							setTimeout(function(){
								$("#toSetYourInfo").click();
								setTimeout(function(){
									$("#phone_num").focus();
								},200)
							},300)
						}
						else if(data.status == 3)
						{
							$.amaran({
			     	            content:{
			     	                message:'您的余额不足！',
			     	                size:'',
			     	                file:'',
			     	                icon:'fa fa-times'
			     	            },
			     	            theme:'default error',
			     	            position:'bottom right',
			     	            inEffect:'slideRight',
			     	            outEffect:'slideBottom'
			     	       });
						}
				    }
			});
	}
})

$(".callYes,.callEnd").on("click",function(){
	var uid = $(".msgBox").attr("uid");
	mainJson.callClicked = false;
	$(".msgBox").hide();
})

//主动会话
//主动邀请，创建弹出层模版
$("#openOtherUser,#waitNum").click(function(){
	//var oHtml = $(".callHtml").html();
	if(isInvite==0){
		var oHtml = '<div ria-hidden="true" data-backdrop="static" class="table-responsive ls-table reqTableBox"> <div class="reqMenuBox clear"> <div class="fl"> <button class="btn ls-red-btn">排队中 <span class="waitSize"></span></button> <button class="btn ls-light-green-btn hide">与机器人对话 <span class="robotSize"></span></button> <button id = "adminisinvite" class="btn ls-light-green-btn">浏览网站中 <span class="visitSize"></span></button> </div> <div class="fr"> <span class="reqRefNow">刷新于18:09</span> <a href="javascript:;" class="reaRefBtn"></a> </div> </div> <table class="table table-bottomless ls-animated-table"> <thead class="reqTableTh"> <tr> <th class="th2">客户名称</th><th class="thGroup th21">技能组</th><th class="reqTdTitle th3">最后访问页面</th> <th class="otherTime th4">转人工时间</th> <th class="th5">等待时长</th> <th class="hide th51">最后接待客服</th> <th class="th6">操作</th> </tr> </thead> <tbody class="reqDomBox"> <tr> <td class="reqTd2">Mark</td> <td class="reqTd3">Otto</td> <td>@mdo</td> <td>1</td> <td class="hide">1</td> <td><a href="javascript:;" class="reqBtns">邀请</a></td> </tr> </tbody> </table> <div class="reqBottom clear"> <div class="fl"> <p>显示 <span class="countPage">0</span>/<span class="allCountPage">0</span> 页 总共 <span class="countSize">0</span> 条</p> </div> <div class="fr"> <p> <a href="javascript:;" class="reqFirstBtn">首页 </a> <span class="allCountPageBox hide"> <a href="javascript:;" class="goCountPage">0</a> </span><a href="javascript:;" class="reaPrevBtn">上一页 </a> <a href="javascript:;" class="reaNextBtn">下一页 </a> <a href="javascript:;" class="reqLastBtn">末页 </a> <input type="text" class="reqGoText"> <a href="javascript:;" class="reqGoNumber">跳转</a> </p> </div> </div> </div>';
	}else{
		var oHtml = '<div class="table-responsive ls-table reqTableBox"> <div class="reqMenuBox clear"> <div class="fl"> <button class="btn ls-red-btn">排队中 <span class="waitSize"></span></button> <button class="btn ls-light-green-btn hide">与机器人对话 <span class="robotSize"></span></button> <button id = "adminisinvite" class="btn ls-light-green-btn hide">浏览网站中 <span class="visitSize"></span></button> </div> <div class="fr"> <span class="reqRefNow">刷新于18:09</span> <a href="javascript:;" class="reaRefBtn"></a> </div> </div> <table class="table table-bottomless ls-animated-table"> <thead class="reqTableTh"> <tr> <th class="th2">客户名称</th><th class="thGroup th21">技能组</th> <th class="reqTdTitle th3">最后访问页面</th> <th class="otherTime th4">转人工时间</th> <th class="th5">等待时长</th> <th class="hide th51">最后接待客服</th> <th class="th6">操作</th> </tr> </thead> <tbody class="reqDomBox"> <tr> <td class="reqTd2">Mark</td> <td class="reqTd3">Otto</td> <td>@mdo</td> <td>1</td> <td class="hide">1</td> <td><a href="javascript:;" class="reqBtns">邀请</a></td> </tr> </tbody> </table> <div class="reqBottom clear"> <div class="fl"> <p>显示 <span class="countPage">0</span>/<span class="allCountPage">0</span> 页 总共 <span class="countSize">0</span> 条</p> </div> <div class="fr"> <p> <a href="javascript:;" class="reqFirstBtn">首页 </a> <span class="allCountPageBox hide"> <a href="javascript:;" class="goCountPage">0</a> </span><a href="javascript:;" class="reaPrevBtn">上一页 </a> <a href="javascript:;" class="reaNextBtn">下一页 </a> <a href="javascript:;" class="reqLastBtn">末页 </a> <input type="text" class="reqGoText"> <a href="javascript:;" class="reqGoNumber">跳转</a> </p> </div> </div> </div>';
		//var oHtml =
		//'<div class="table-responsive ls-table reqTableBox">'
		//	+'<div class="reqMenuBox clear">'
		//		+'<div class="fl">'
		//			+'<button class="btn ls-red-btn">排队中</button>'
		//			+'<button class="btn ls-light-green-btn">与机器人对话</button>'
		//			+'<button class="btn ls-light-green-btn hide">浏览网站中</button>'
		//		+'</div>'
		//		+'<div class="fr"> <span class="reqRefNow">刷新于18:09</span> <a href="javascript:;" class="reaRefBtn">刷新</a> </div>'
		//		+'</div>'
		//	+'<table class="table table-bottomless ls-animated-table">'
		//		+'<thead class="reqTableTh">'
		//			+'<tr>'
		//				+'<th class="th2">客户名称</th>'
		//				+'<th class="th21 thGroup">技能组</th>'
		//				+'<th class="th3 reqTdTitle">最后访问页</th>'
		//				+'<th class="th4 otherTime">转人工时间</th>' //最后访问时间
		//				+'<th class="th5">等待时长</th>'    //1:停留时间
		//				+'<th class="th51 hide">最后接待客服</th>'
		//				+'<th class="th6">操作</th>'
		//			+'</tr>'
		//		+'</thead>'
		//		+'<tbody class="reqDomBox">'
		//			+'<tr>'
		//				+'<td>1</td>'
		//				+'<td class="reqTd2">Mark</td>'
		//				+'<td class="reqTd3">Otto</td>'
		//				+'<td>@mdo</td>'
		//				+'<td>1</td>'
		//				+'<td class="hide">1</td>'
		//				+'<td><a href="javascript:;" class="reqBtns">邀请</a></td>'
		//			+'</tr>'
		//		+'</tbody>'
		//	+'</table>'
		//	+'<div class="reqBottom clear">'
		//		+'<div class="fl">'
		//			+'<p>显示 <span class="countPage">1</span>/<span class="allCountPage">2</span> 页 总共 <span class="countSize">16</span> 条</p>'
		//		+'</div>'
		//		+'<div class="fr">'
		//			+'<p> <a href="javascript:;" class="reqFirstBtn">首页 </a> <span class="allCountPageBox"> <a href="javascript:;" class="goCountPage">1</a> </span> <a href="javascript:;" class="reaNextBtn">下一页 </a> <a href="javascript:;" class="reqLastBtn">末页 </a>'
		//			+'<input type="text" class="reqGoText"> <a href="javascript:;" class="reqGoNumber">跳转</a> </p>'
		//		+'</div>'
		//	+'</div>'
		//+'</div>'



	}
   var res = bootbox.dialog({
		message: oHtml,
		title: "邀请会话"
	});
   // console.log(res[0]);

    //点击空白处关闭弹窗
    tapCloseWindow();

	//yy
	//给弹出层 加各种事件
	disReq();
	//yy
	//读取table列表
	loadReqList(1,3,true);
  loadReqList(1,1,true,true);
})

//
function disReq()
{
			//事件
	$(".reqTableBox .reqBottom .reqFirstBtn").on("click",function(){//首页
		loadReqList(1,mainJson.reqTableNow);
	})
	$(".reqTableBox .reqBottom .reaPrevBtn").on("click",function(){//下一页
		var reqPage = Number(mainJson.reqTablePage)-1;
		if(reqPage <= 0)
		{
			reqPage = 1;
		}
		loadReqList(reqPage,mainJson.reqTableNow);
	})
	$(".reqTableBox .reqBottom .reaNextBtn").on("click",function(){//下一页
		var reqPage = Number(mainJson.reqTablePage)+1;
		if(reqPage >= mainJson.reqTableAllPage)
		{
			reqPage = mainJson.reqTableAllPage;
		}
		loadReqList(reqPage,mainJson.reqTableNow);
	})
	$(".reqTableBox .reqBottom .reqLastBtn").on("click",function(){//末页
		loadReqList(mainJson.reqTableAllPage,mainJson.reqTableNow);
	})
	$(".reqTableBox .reqBottom .reqGoNumber").on("click",function(){//跳转
		var oText = $(".reqTableBox .reqBottom .reqGoText").val();
		if(Number(oText) && oText <= mainJson.reqTableAllPage)
		{
			loadReqList(oText,mainJson.reqTableNow);
		}
		else
		{
			//错误提示
		}
	})
	$(".reqTableBox .reqMenuBox .reaRefBtn").on("click",function(){//刷新
		loadReqList(mainJson.reqTablePage,mainJson.reqTableNow);
	})
	$(".reqTableBox .reqBottom").on("click",".goCountPage",function(){//分页跳转
		loadReqList($(this).html(),mainJson.reqTableNow);
	});
	//yy
	//排队中 ／浏览网站中
	$(".reqTableBox .reqMenuBox button").on("click",function(){ //分类按钮
		$(".reqTableBox .reqMenuBox button").removeClass("ls-red-btn").addClass("ls-light-green-btn");
		$(this).removeClass("ls-light-green-btn").addClass("ls-red-btn");
		if($(this).index() == 0)
		{
			mainJson.reqTableNow = 3;
		}
		else if($(this).index() == 1)
		{
			mainJson.reqTableNow = 2;
		}
		else if($(this).index() == 2)
		{
			mainJson.reqTableNow = 1;
		}
		//yy page,sta
		loadReqList(1,mainJson.reqTableNow);

    // $('.visitSize').html(333);
	});
	//邀请按钮点击
	$(".reqTableBox .reqDomBox").on("click",".reqBtns",function(){
		var This = this;
		$.ajax({
	        type : "post",
	        url : apihost+"admin/invite.action",
	        dataType : "JSONP",
	        data : {
		   		'uid':myid,
		   		'userId':$(this).attr("reqlistid")
	        },
			success : function (data){
				if(data.status==1){
					$(This).parent("td").html('<span class="reqYesEnd">已邀请</span>');
				}
				else if(data.status == 0)
				{
					$(This).parent("td").html('<span class="reqYesEnd">已下线</span>');
				}
				else if(data.status == 2)
				{
					$(This).parent("td").html('<span class="reqYesEnd">已被其他客服邀请</span>');
				}
		    }
		});
	})
}


/**
 * summary: 读取排队用户数量
 * page: 页数
 * sta: 分类 1 浏览网页 / 3 客服
 * first: 是否有访客
 * isGetCount: 是否只设置count
 **/
function loadReqList(page,sta,first,isGetCount)
{
	//yy 默认传进来值1，3，true
	$(".reqTableBox .reqDomBox").html('');
	$.ajax({
    type : "post",
    // visit调queryVisitUser接口，排队调queryUser接口
    url : sta && sta === 1 ? apihost+"admin/queryVisitUser.action" : apihost+"admin/queryUser.action",
    dataType : "JSONP",
    data : {
   		'uid':myid,
   		'pageNow':page,
   		"status":sta
    },
	success : function (data){

    if (isGetCount) { // 点击邀请会话要同时显示排队数量和浏览网页数量
      $(".reqMenuBox .visitSize").html(data.visitSize);
    } else {
      if(first)  //默认如果没有人排队，看是否有访客
			{

        // $(".reqTableBox .reqMenuBox button").first().children('span').html(data.waitSize);
        // $(".reqTableBox .reqMenuBox button").last().children('span').html(data.visitSize);

				if(data.waitSize > 0)
				{
					$(".reqTableBox .reqMenuBox button").first().click();
					// return
				}
				/*	else if(data.robotSize > 0)
				{
					$($(".reqTableBox .reqMenuBox button")[1]).click();
					return
				}*/
				else if(data.visitSize > 0)
				{
					$(".reqTableBox .reqMenuBox button").last().click();
					// return
				}
			}
			var oSize = null;
			var hidTitle = false;
			if(sta == 1)
			{
				oSize = data.visitSize;
				//yy
				//客服名称
				$(".reqTableBox .reqTableTh .th2").html("客户名称");
				//技能组显示
				$(".reqTableBox .reqTableTh .th21").hide();
				//最后访问页
				$(".reqTableBox .reqTableTh .th3").show();
				//转人工时间
				$(".reqTableBox .reqTableTh .th4").html("最后访问时间");
				//等待时长
				$(".reqTableBox .reqTableTh .th5").html("停留时间");
				//最后接待客服 默认就是带hide样式的
				$(".reqTableBox .reqTableTh .th51").hide();
				//操作
				$(".reqTableBox .reqTableTh .th6").html("操作");
				//$(".reqTableBox .reqTdTitle").show();
				//$(".reqTableBox .thGroup").hide();
				//$(".reqTableBox .reqTableTh .otherTime").html("最后访问时间");
				//$(".reqTableBox .reqTableTh .th5").html("停留时间");
				$(".reqTableBox .reqTableTh")[0].className = "reqTableTh visitClass";
			}
			else if(sta == 2)
			{
				/*oSize = data.robotSize;
				hidTitle = true;
				$(".reqTableBox .reqTableTh .otherTime").html("建立会话时间");
				$(".reqTableBox .reqTableTh .th5").html("会话时长");
				$(".reqTableBox .reqTdTitle").hide();
				$(".reqTableBox .reqTableTh")[0].className = "reqTableTh robotClass";*/
			}
			else if(sta == 3)
			{
				oSize = data.waitSize;
				hidTitle = true;
				//yy
				//客服名称
				$(".reqTableBox .reqTableTh .th2").html("客户名称");
				//技能组显示
				$(".reqTableBox .reqTableTh .th21").show();
				//最后访问页
				$(".reqTableBox .reqTableTh .th3").hide();
				//转人工时间
				$(".reqTableBox .reqTableTh .th4").html("转人工时间");
				//等待时长
				$(".reqTableBox .reqTableTh .th5").html("等待时长");
				//最后接待客服 默认就是带hide样式的
				$(".reqTableBox .reqTableTh .th51").hide();
				//操作
				$(".reqTableBox .reqTableTh .th6").html("操作");
				//end
				//$(".reqTableBox .reqTdTitle").hide();
				//$(".reqTableBox .thGroup").show();
				//$(".reqTableBox .reqTableTh .otherTime").html("转人工时间");
				//$(".reqTableBox .reqTableTh .th5").html("等待时长");
				$(".reqTableBox .reqTableTh")[0].className = "reqTableTh waitClass";
			}

			$(".reqMenuBox .waitSize").html(data.waitSize);
			$(".reqMenuBox .visitSize").html(data.visitSize);
			/*$(".reqMenuBox .robotSize").html(data.robotSize);*/
			var oListLiDom = '';var oGoCountPageDom = '';
			/*var allCountPage = Math.ceil(Number(oSize)/10);*/
			mainJson.reqTableAllPage = data.countPage;
			mainJson.reqTablePage = page;
			$(".reqTableBox .reqBottom .countSize").html(oSize);
			$(".reqTableBox .reqMenuBox .reqRefNow").html("刷新于" + new Date().format('hh:mm:ss'));
		/*	for(var i = 1; i<= data.countPage ;i++)
			{
				if(!hidTitle)
				{
					oGoCountPageDom += '<a href="javascript:;" class="goCountPage">'+ i +'</a>';
				}
			}*/
			//yy
			//自带 hide 隐藏
			//$(".reqTableBox .reqBottom .allCountPageBox").html(oGoCountPageDom);
			for(var i = 0 ; i<= data.list.length ;i++)
			{
				if(data.list[i])
				{
					//yy
					//hidTitle 开关 /排队中 3 true ／浏览网页中 1 false
					if(hidTitle)
					{
						// 排队中
						// 客户名称
						var yyName = data.list[i].name?data.list[i].name:'';
						yyName = yyName.length>10?yyName.substring(0,9)+'...':yyName;
						// 技能组
						var yyGroup = data.list[i].groupName?data.list[i].groupName:'无技能组';
						yyGroup = yyGroup.length>10?yyGroup.substring(0,9)+'...':yyGroup;
						// 最后访问页面
						var yyPage = data.list[i].visitTitle?data.list[i].visitTitle:'';
						yyPage = yyPage.length>10?yyPage.substring(0,9)+'...':yyPage;
						// 转人工时间/最后访问时间1
						var yyLastTime = data.list[i].lastTime?data.list[i].lastTime:'';
						yyLastTime = yyLastTime.substring(11,19)
						// 等待时长/停留时间1
						var yyReTime = data.list[i].remainTime?data.list[i].remainTime:'';
						yyReTime = yyReTime.length>10?yyReTime.substring(0,9)+'...':yyReTime;
						// 操作
						var yyId = data.list[i].id?data.list[i].id:'';
						// 排队中
							oListLiDom += '<tr><td class="reqTd2 td2"><span class="reqTdSpan">'+ yyName +'</span><span class="reqTitleSpan">'+ yyName +'</span></td><td class="reqTdGroup td3">'+yyGroup+'</td><td class="reqTd3 td4">'+ yyLastTime +'</td><td class="td5">'+ yyReTime +'</td><td><a href="javascript:;" class="reqBtns" reqListId="'+ yyId +'">邀请</a></td></tr>';
					}
					else
					{
						// 浏览网站
						// 客户名称
						var yyName = data.list[i].name?data.list[i].name:'';
						yyName = yyName.length>10?yyName.substring(0,9)+'...':yyName;
						// 技能组
						var yyGroup = data.list[i].groupName?data.list[i].groupName:'无技能组';
						yyGroup = yyGroup.length>10?yyGroup.substring(0,9)+'...':yyGroup;
						// 最后访问页面
						var yyPage = data.list[i].visitTitle?data.list[i].visitTitle:'';
						yyPage = yyPage.length>10?yyPage.substring(0,9)+'...':yyPage;
						// 转人工时间/最后访问时间1
						var yyLastTime = data.list[i].lastTime?data.list[i].lastTime:'';
						yyLastTime = yyLastTime.substring(11,19)
						// 等待时长/停留时间1
						var yyReTime = data.list[i].remainTime?data.list[i].remainTime:'';
						yyReTime = yyReTime.length>10?yyReTime.substring(0,9)+'...':yyReTime;
						// 操作
						var yyId = data.list[i].id?data.list[i].id:'';


						oListLiDom += '<tr><td class="reqTd2 td2"><span class="reqTdSpan">'+ yyName +'</span><span class="reqTitleSpan">'+ yyName +'</span></td><td class="reqTdGroup td3">'+yyPage+'</td><td class="reqTd3 td4">'+ yyLastTime +'</td><td class="td5">'+ yyReTime +'</td><td><a href="javascript:;" class="reqBtns" reqListId="'+ yyId +'">邀请</a></td></tr>';

						//var sTitle="";
						//var sUrl="";
						//try {
						//	sTitle = data.list[i].visitTitle.substring(data.list[i].visitTitle.indexOf(";")+1,data.list[i].visitTitle.length);
						//	sUrl = data.list[i].visitTitle.substring(0,data.list[i].visitTitle.indexOf(";"));
						//} catch (e) {
						//};
						////yy
						//if(sTitle.length >=7){
						//	sTitle = sTitle.substring(0,6)+'...';
						//};
						//oListLiDom += '<tr><td class="reqTd2"> <span class="reqTdSpan">'+ data.list[i].name +'</span><span class="reqTitleSpan">'+ data.list[i].name +'</span></td><td class="reqTdGroup">'+data.list[i].groupName+'</td><td class="reqTd3"><a href="'+ sUrl +'" class="reqTdSpan" target="_blank">'+ sTitle + '</a><span class="reqTitleSpan">'+ sUrl +'</span>' +'</td><td>'+ data.list[i].lastTime.substring(11,19) +'</td><td>'+ data.list[i].remainTime +'</td><td><a href="javascript:;" class="reqBtns" reqListId="'+ data.list[i].id +'">邀请</a></td></tr>';
					}
				}
			}
			if(oSize != 0)
			{
				$(".reqTableBox .reqDomBox").html(oListLiDom);
				$(".reqTableBox .reqBottom .countPage").html(page);
				$(".reqTableBox .reqBottom .allCountPage").html(data.countPage);
			}
    	}
    }

	});
}
