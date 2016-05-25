/**
 *
 * @author daijm
 */
var loadFile = require('./load.js')();
var weixinJson = require('./face/weixin.json');
var weixinSymbol = require('./face/weixinsymbol.json');
var unicode = require('./unicode.js');
var ZC_Face = {
    initConfig : function(options,callback) {//将表情集合预加载
        var _this = this;
        var o = options;
        var reg = require('./face/Reg.js');
        _this.emojiImagePath = require('./face/emojiImagePath.json');
        _this.saytext = o.saytext || "";
        _this.Group = o.Group || "";
        _this.faceGroup = o.faceGroup || "";
        _this.emojiGroup = o.emojiGroup || "";
        //_this.showId=o.showId||"";
        _this.emotion = o.emotion || "";
        _this.saytext = o.saytext || "";
        //_this.sub_btn=o.sub_btn||"";
        _this.path = o.path || "";
        _this.emojiPath = o.emojiPath || "";
        //show
        _this.tip = weixinJson;
        //analysis
        _this.tip2 = weixinSymbol;
        //emojishow
        _this.emojiTip =reg.emojiTip;
        _this.emojiSymbolTip = reg.emojiSymbolTip;
        
        _this.qqfaceReg = reg.qqfaceReg;
        _this.qqfaceReg2 =reg.qqfaceReg2;
        _this.emojiReg = reg.emojiReg;
        _this.emojiReg2 = reg.emojiReg2;
        for(var a in _this.tip) {
            var img = new Image();
            img.src = _this.path + _this.tip[a] + '.gif';
        }
        //callback&&callback();
    },
    show : function(global) {
        var _this = this;
        var faceGroup = _this.faceGroup;
        //集合如果不存在，则创建
        if($('#faceBox').length <= 0) {
            loadFile.load(global.baseUrl+'views/textarea/qqFace.html').then(function(value){
              var qqface_html = doT.template(value)({
                "tip" : _this.tip,
                "path" :_this.path
              });
            $(faceGroup).append(qqface_html);
            });
        }
        _this.sendTotextArea(_this.saytext);

    },
    emojiShow : function(global) {
        var _this = this;
        if($('#emojiBox').length <= 0) {//集合如果不存在，则创建

            loadFile.load(global.baseUrl+'views/textarea/emoji.html').then(function(value){
              var emoji_html = doT.template(value)({
                "emojiTip" : _this.emojiTip,
                "emojiSymbolTip" :_this.emojiSymbolTip,
                "emojiPath" :_this.emojiPath
              });
            $(emojiGroup).append(emoji_html);
            });
        }
        _this.Hidden();
        //判断两个表情集合是否是显示状态
        _this.emojiSendTotextArea(_this.saytext);
    },
    Hidden : function() {
        var _this = this;
        if($(_this.Group).css("display") == "block") {
            $(_this.Group).css("display","none")
        } else {
            $(_this.Group).css("display","block")
        }
        //当文本框获取焦点的时候隐藏表情集合
        $(_this.saytext).focus(function() {
            $(_this.Group).hide();
        });

    },
    sendTotextArea : function() {
        var _this = this;
        $(document.body).undelegate();
        $(document.body).delegate(".faceIco",'click', function(e) {
            var elm = e.currentTarget;
            var src = $(elm).attr("data-src");
            var currentSaytext = $(_this.saytext).val() + src;
            //将新表情追加到待发送框里
            //console.log($(tareId).val());
            //$("#saytext").val("");
            $(_this.saytext).val('');
            $(_this.saytext).val(currentSaytext);
            $(_this.Group).hide();
            //隐藏表情集合

            //cbk && cbk(src);
        });

    },
    emojiSendTotextArea : function() {
        var _this = this;
        $(document.body).undelegate();
        $(document.body).delegate(".faceIco",'click', function(e) {
            var elm = e.currentTarget;
            var src = $(elm).attr("data-src");
            var reg = /u([0-9A-Za-z]{5})/;

            var currentSaytext = $(_this.saytext).val() + src;
            //将新表情追加到待发送框里
            $(_this.saytext).val('');
            $(_this.saytext).val(currentSaytext);
            $(_this.Group).hide();
            //隐藏表情集合
            $(_this.saytext).focus();
            //
            //cbk && cbk(src);
        });

    },
    analysis : function(str) {//将文本框内的表情字符转化为表情
        var _this = this;
        //容错处理，防传null
        if(str){
            var icoAry = str.match(_this.qqfaceReg);
        }else{
            return false;
        }
    
        //将匹配到的结果放到icoAry这个数组里面，来获取长度
        if(icoAry) {
            for(var i = 0;i < icoAry.length;i++) {

                var ico = _this.qqfaceReg2.exec(str);
                var path= _this.tip2[ico[0]];
                //重新匹配到第一个符合条件的表情字符
                str = str.replace(_this.qqfaceReg2,'<img style="width:24px;height:24px;" src="' + _this.path + path + '.gif" border="0" />',1);
            }
        }

        var arr = str.match(_this.emojiReg);
         //console.log(arr);
        if(arr) { 
            for(var i = 0,
                len = arr.length;i < len;i++) {
                var ico = _this.emojiReg2.exec(str);
                var path = _this.emojiImagePath[ico[0]];
                //console.log(str);
                str = str.replace(ico[0],'<img  style="width:24px;height:24px;" src="' + _this.emojiPath + path + '" border="0" />',1);
                 //console.log(str);
            }
        }
        return str;
    },
    hasEmotion : function(str) {//将文本框内的表情字符转化为表情
        //console.log(str);
        return this.qqfaceReg.test(str) || this.emojiReg.test(str);
    }/*,
    convertToEmoji : function(src) {
        var _this = this;
        if(_this.emojiReg.test(src)) {

        }
        return src;
    }*/
};

module.exports = ZC_Face;
