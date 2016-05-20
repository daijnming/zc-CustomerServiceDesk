/**
 *
 * @author daijm
 */
var weixinJson = require('./face/weixin.json');
var weixinSymbol = require('./face/weixinSymbol.json');
var unicode = require('./unicode.js');
var ZC_Face = {
    initConfig : function(options,callback) {//将表情集合预加载
        var _this = this;
        var o = options;
        var reg = require('./face/Reg.js');
        _this.emojiImagePath = require('./face/imagepath.json');
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
        _this.emojiTip = ["u1F60A","u1F60B","u1F60C","u1F60D","u1F60E","u1F60F","u1F61A","u1F61C","u1F61D","u1F61E","u1F61F","u1F62A","u1F62B","u1F62C","u1F62D","u1F62E","u1F600","u1F601","u1F602","u1F603","u1F605","u1F606","u1F607","u1F608","u1F609","u1F611","u1F612","u1F613","u1F614","u1F615","u1F616","u1F618","u1F621","u1F622","u1F623","u1F624","u1F628","u1F629","u1F630","u1F631","u1F632","u1F633","u1F634","u1F635","u1F636","u1F637","u1F648","u1F649","u1F680","u2B50","u23F0","u23F3","u26A1","u26BD","u26C4","u26C5","u261D","u263A","u270A","u270B","u270C","u270F","u2600","u2601","u2614","u2615","u2744","u1F3A4","u1F3B2","u1F3B5","u1F3C0","u1F3C2","u1F3E1","u1F004","u1F4A1","u1F4A2","u1F4A3","u1F4A4","u1F4A9","u1F4AA","u1F4B0","u1F4DA","u1F4DE","u1F4E2","u1F6AB","u1F6BF","u1F30F","u1F33B","u1F35A","u1F36B","u1F37B","u1F44A","u1F44C","u1F44D","u1F44E","u1F44F","u1F46A","u1F46B","u1F47B","u1F47C","u1F47D","u1F47F","u1F48A","u1F48B","u1F48D","u1F52B","u1F64A","u1F64F","u1F319","u1F332","u1F339","u1F349","u1F356","u1F366","u1F377","u1F381","u1F382","u1F384","u1F389","u1F393","u1F434","u1F436","u1F437","u1F451","u1F484","u1F494","u1F525","u1F556"];
        _this.emojiSymbolTip = ["😊","😋","😌","😍","😎","😏","😚","😜","😝","😞","😟","😪","😫","😬","😭","😮","😀","😁","😂","😃","😅","😆","😇","😈","😉","😑","😒","😓","😔","😕","😖","😘","😡","😢","😣","😤","😨","😩","😰","😱","😲","😳","😴","😵","😶","😷","🙈","🙉","🚀","⭐","⏰","⏳","⚡","⚽","⛄","⛅","☝","☺","✊","✋","✌","✏","☀","☁","☔","☕","❄","🎤","🎲","🎵","🏀","🏂","🏡","🀄","💡","💢","💣","💤","💩","💪","💰","📚","📞","📢","🚫","🚿","🌏","🌻","🍚","🍫","🍻","👊","👌","👍","👎","👏","👪","👫","👻","👼","👽","👿","💊","💋","💍","🔫","🙊","🙏","🌙","🌲","🌹","🍉","🍖","🍦","🍷","🎁","🎂","🎄","🎉","🎓","🐴","🐶","🐷","👑","💄","💔","🔥","🕖"];
        /* _this.emojiSymbolTip =
         * ['\u{1F60A}','\u{1F60B}','\u{1F60C}','\u{1F60D}','\u{1F60E}','\u{1F60F}','\u{1F61A}','\u{1F61C}','\u{1F61D}','\u{1F61E}','\u{1F61F}','\u{1F62A}','\u{1F62B}','\u{1F62C}','\u{1F62D}','\u{1F62E}','\u{1F600}','\u{1F601}','\u{1F602}','\u{1F603}','\u{1F605}','\u{1F606}','\u{1F607}','\u{1F608}','\u{1F609}','\u{1F611}','\u{1F612}','\u{1F613}','\u{1F614}','\u{1F615}','\u{1F616}','\u{1F618}','\u{1F621}','\u{1F622}','\u{1F623}','\u{1F624}','\u{1F628}','\u{1F629}','\u{1F630}','\u{1F631}','\u{1F632}','\u{1F633}','\u{1F634}','\u{1F635}','\u{1F636}','\u{1F637}','\u{1F648}','\u{1F649}','\u{1F680}','\u{2B50}','\u{23F0}','\u{23F3}','\u{26A1}','\u{26BD}','\u{26C4}','\u{26C5}','\u{261D}','\u{263A}','\u{270A}','\u{270B}','\u{270C}','\u{270F}','\u{2600}','\u{2601}','\u{2614}','\u{2615}','\u{2744}','\u{1F3A4}','\u{1F3B2}','\u{1F3B5}','\u{1F3C0}','\u{1F3C2}','\u{1F3E1}','\u{1F004}','\u{1F4A1}','\u{1F4A2}','\u{1F4A3}','\u{1F4A4}','\u{1F4A9}','\u{1F4AA}','\u{1F4B0}','\u{1F4DA}','\u{1F4DE}','\u{1F4E2}','\u{1F6AB}','\u{1F6BF}','\u{1F30F}','\u{1F33B}','\u{1F35A}','\u{1F36B}','\u{1F37B}','\u{1F44A}','\u{1F44C}','\u{1F44D}','\u{1F44E}','\u{1F44F}','\u{1F46A}','\u{1F46B}','\u{1F47B}','\u{1F47C}','\u{1F47D}','\u{1F47F}','\u{1F48A}','\u{1F48B}','\u{1F48D}','\u{1F52B}','\u{1F64A}','\u{1F64F}','\u{1F319}','\u{1F332}','\u{1F339}','\u{1F349}','\u{1F356}','\u{1F366}','\u{1F377}','\u{1F381}','\u{1F382}','\u{1F384}','\u{1F389}','\u{1F393}','\u{1F434}','\u{1F436}','\u{1F437}','\u{1F451}','\u{1F484}','\u{1F494}','\u{1F525}','\u{1F556}'];
         */
        _this.reg = /\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:<W>|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:<L>|\/:jump|\/:shake|\/:<O>|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>|\/微笑|\/撇嘴|\/色|\/发呆|\/得意|\/流泪|\/害羞|\/闭嘴|\/睡|\/大哭|\/尴尬|\/发怒|\/调皮|\/呲牙|\/惊讶|\/难过|\/酷|\/冷汗|\/衰|\/骷髅|\/敲打|\/再见|\/擦汗|\/抠鼻|\/鼓掌|\/糗大了|\/坏笑|\/左哼哼|\/右哼哼|\/哈欠|\/鄙视|\/委屈|\/快哭了|\/阴险|\/亲亲|\/吓|\/可怜|\/抓狂|\/吐|\/偷笑|\/愉快|\/白眼|\/傲慢|\/饥饿|\/困|\/惊恐|\/流汗|\/憨笑|\/悠闲|\/奋斗|\/咒骂|\/疑问|\/嘘|\/晕|\/疯了|\/篮球|\/乒乓|\/咖啡|\/饭|\/猪头|\/玫瑰|\/调谢|\/嘴唇|\/爱心|\/心碎|\/蛋糕|\/闪电|\/炸弹|\/刀|\/足球|\/瓢虫|\/便便|\/月亮|\/太阳|\/礼物|\/拥抱|\/菜刀|\/西瓜|\/啤酒|\/弱|\/握手|\/胜利|\/抱拳|\/勾引|\/拳头|\/差劲|\/爱你|\/NO|NO|\/OK|OK|\/爱情|\/飞吻|\/跳跳|\/强|\/发抖|\/怄火|\/转圈|\/磕头|\/回头|\/跳绳|\/投降|\/激动|\/乱舞|\/献吻|\/左太极|\/右太极|\[微笑\]|\[撇嘴\]|\[色\]|\[发呆\]|\[得意\]|\[流泪\]|\[害羞\]|\[闭嘴\]|\[睡\]|\[大哭\]|\[尴尬\]|\[发怒\]|\[调皮\]|\[呲牙\]|\[惊讶\]|\[难过\]|\[酷\]|\[冷汗\]|\[衰\]|\[骷髅\]|\[敲打\]|\[再见\]|\[擦汗\]|\[抠鼻\]|\[鼓掌\]|\[糗大了\]|\[坏笑\]|\[左哼哼\]|\[右哼哼\]|\[哈欠\]|\[鄙视\]|\[委屈\]|\[快哭了\]|\[阴险\]|\[亲亲\]|\[吓\]|\[可怜\]|\[抓狂\]|\[吐\]|\[偷笑\]|\[愉快\]|\[白眼\]|\[傲慢\]|\[饥饿\]|\[困\]|\[惊恐\]|\[流汗\]|\[憨笑\]|\[悠闲\]|\[奋斗\]|\[咒骂\]|\[疑问\]|\[嘘\]|\[晕\]|\[疯了\]|\[篮球\]|\[乒乓\]|\[咖啡\]|\[饭\]|\[猪头\]|\[玫瑰\]|\[调谢\]|\[嘴唇\]|\[爱心\]|\[心碎\]|\[蛋糕\]|\[闪电\]|\[炸弹\]|\[刀\]|\[足球\]|\[瓢虫\]|\[便便\]|\[月亮\]|\[太阳\]|\[礼物\]|\[拥抱\]|\[菜刀\]|\[西瓜\]|\[啤酒\]|\[弱\]|\[握手\]|\[胜利\]|\[抱拳\]|\[勾引\]|\[拳头\]|\[差劲\]|\[爱你\]|\[NO|NO\]|\[OK|OK\]|\[爱情\]|\[飞吻\]|\[跳跳\]|\[强\]|\[发抖\]|\[怄火\]|\[转圈\]|\[磕头\]|\[回头\]|\[跳绳\]|\[投降\]|\[激动\]|\[乱舞\]|\[献吻\]|\[左太极\]|\[右太极\]/g;
        _this.reg2 = /\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:<W>|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:<L>|\/:jump|\/:shake|\/:<O>|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>|\/微笑|\/撇嘴|\/色|\/发呆|\/得意|\/流泪|\/害羞|\/闭嘴|\/睡|\/大哭|\/尴尬|\/发怒|\/调皮|\/呲牙|\/惊讶|\/难过|\/酷|\/冷汗|\/衰|\/骷髅|\/敲打|\/再见|\/擦汗|\/抠鼻|\/鼓掌|\/糗大了|\/坏笑|\/左哼哼|\/右哼哼|\/哈欠|\/鄙视|\/委屈|\/快哭了|\/阴险|\/亲亲|\/吓|\/可怜|\/抓狂|\/吐|\/偷笑|\/愉快|\/白眼|\/傲慢|\/饥饿|\/困|\/惊恐|\/流汗|\/憨笑|\/悠闲|\/奋斗|\/咒骂|\/疑问|\/嘘|\/晕|\/疯了|\/篮球|\/乒乓|\/咖啡|\/饭|\/猪头|\/玫瑰|\/调谢|\/嘴唇|\/爱心|\/心碎|\/蛋糕|\/闪电|\/炸弹|\/刀|\/足球|\/瓢虫|\/便便|\/月亮|\/太阳|\/礼物|\/拥抱|\/菜刀|\/西瓜|\/啤酒|\/弱|\/握手|\/胜利|\/抱拳|\/勾引|\/拳头|\/差劲|\/爱你|\/NO|NO|\/OK|OK|\/爱情|\/飞吻|\/跳跳|\/强|\/发抖|\/怄火|\/转圈|\/磕头|\/回头|\/跳绳|\/投降|\/激动|\/乱舞|\/献吻|\/左太极|\/右太极|\[微笑\]|\[撇嘴\]|\[色\]|\[发呆\]|\[得意\]|\[流泪\]|\[害羞\]|\[闭嘴\]|\[睡\]|\[大哭\]|\[尴尬\]|\[发怒\]|\[调皮\]|\[呲牙\]|\[惊讶\]|\[难过\]|\[酷\]|\[冷汗\]|\[衰\]|\[骷髅\]|\[敲打\]|\[再见\]|\[擦汗\]|\[抠鼻\]|\[鼓掌\]|\[糗大了\]|\[坏笑\]|\[左哼哼\]|\[右哼哼\]|\[哈欠\]|\[鄙视\]|\[委屈\]|\[快哭了\]|\[阴险\]|\[亲亲\]|\[吓\]|\[可怜\]|\[抓狂\]|\[吐\]|\[偷笑\]|\[愉快\]|\[白眼\]|\[傲慢\]|\[饥饿\]|\[困\]|\[惊恐\]|\[流汗\]|\[憨笑\]|\[悠闲\]|\[奋斗\]|\[咒骂\]|\[疑问\]|\[嘘\]|\[晕\]|\[疯了\]|\[篮球\]|\[乒乓\]|\[咖啡\]|\[饭\]|\[猪头\]|\[玫瑰\]|\[调谢\]|\[嘴唇\]|\[爱心\]|\[心碎\]|\[蛋糕\]|\[闪电\]|\[炸弹\]|\[刀\]|\[足球\]|\[瓢虫\]|\[便便\]|\[月亮\]|\[太阳\]|\[礼物\]|\[拥抱\]|\[菜刀\]|\[西瓜\]|\[啤酒\]|\[弱\]|\[握手\]|\[胜利\]|\[抱拳\]|\[勾引\]|\[拳头\]|\[差劲\]|\[爱你\]|\[NO|NO\]|\[OK|OK\]|\[爱情\]|\[飞吻\]|\[跳跳\]|\[强\]|\[发抖\]|\[怄火\]|\[转圈\]|\[磕头\]|\[回头\]|\[跳绳\]|\[投降\]|\[激动\]|\[乱舞\]|\[献吻\]|\[左太极\]|\[右太极\]/;
        _this.emojiReg = reg.emojiReg;
        for(var a in _this.tip) {
            var img = new Image();
            img.src = _this.path + _this.tip[a] + '.gif';
        }
        //callback&&callback();
    },
    show : function() {
        var _this = this;
        var strFace = '';
        //var i=0;
        if($('#faceBox').length <= 0) {//集合如果不存在，则创建
            strFace = '<div id="faceBox" class="face">' + '<ul>';
            for(var a in _this.tip) {
                //i++
                strFace += '<li><img class="faceIco" src="' + _this.path + _this.tip[a] + '.gif" data-src="' + a + '" /></li>';
                //if( i % 14 == 0 ) strFace += '</tr><tr>';
            }
            strFace += '</ul></div>';
            $(_this.faceGroup).append(strFace);
        }
        _this.sendTotextArea(_this.saytext);

    },
    emojiShow : function() {
        var _this = this;
        var strFace = '';
        if($('#emojiBox').length <= 0) {//集合如果不存在，则创建
            strFace = '<div id="emojiBox" class="face">' + '<ul>';

            for(var i = 0;i <= _this.emojiTip.length - 1;i++) {

                strFace += '<li><img class="faceIco" src="' + _this.emojiPath + _this.emojiTip[i] + '.png" data-src="' + _this.emojiSymbolTip[i] + '" /></li>';
                //if( i % 15 == 14 ) strFace += '';
            }
            strFace += '</ul></div>';
            $(emojiGroup).append(strFace);

        }
        _this.isHidden();
        //判断两个表情集合是否是显示状态
        _this.emojiSendTotextArea(_this.saytext);
    },
    isHidden : function() {
        var _this = this;
        //console.log($(_this.Group).css("display"));
        //console.log($(_this.Group).css("display")=="block");

        if($(_this.Group).css("display") == "block") {
            $(_this.Group).css("display","none")
        } else {
            $(_this.Group).css("display","block")
        }

        $(_this.saytext).focus(function() {//当文本框获取焦点的时候隐藏表情集合
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
        var icoAry = str.match(_this.reg);
        //将匹配到的结果放到icoAry这个数组里面，来获取长度
        if(icoAry) {
            for(var i = 0;i < icoAry.length;i++) {
                var ico = _this.reg2.exec(str);
                var path= _this.tip2[ico[0]];
                //重新匹配到第一个符合条件的表情字符
                //console.log(ico[0]);

                str = str.replace(_this.reg2,'<img src="' + _this.path + path + '.gif" border="0" />',1);
            }
        }

        var arr = str.match(_this.emojiReg);
        for(var i = 0,
            len = arr.length;i < len;i++) {
            var ico = _this.emojiReg.exec(str);
            var path = _this.emojiImagePath[ico[0]];
            str = str.replace(ico[0],'<img src="' + _this.emojiPath + path + '" border="0" />',1);
        }
        console.log(str);
        return str;
    },
    hasEmotion : function(str) {//将文本框内的表情字符转化为表情
        //console.log(str);
        return this.reg.test(str) || this.emojiReg.test(str);
    },
    convertToEmoji : function(src) {
        var _this = this;
        if(_this.emojiReg.test(src)) {
             
        }
        return src;
    }
};

module.exports = ZC_Face;
