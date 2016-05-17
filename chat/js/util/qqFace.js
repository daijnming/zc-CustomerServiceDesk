/**
 *
 * @author daijm
 */
	var ZC_Face = {
		initConfig:function(options,callback){//将表情集合预加载
			var _this=this;
			var o=options;
			_this.saytext=o.saytext||"";
			_this.Group=o.Group||"";
			_this.faceGroup=o.faceGroup||"";
			_this.emojiGroup=o.emojiGroup||"";
			//_this.showId=o.showId||"";
			_this.emotion=o.emotion||"";
			_this.saytext=o.saytext||"";
			//_this.sub_btn=o.sub_btn||"";
			_this.path=o.path||"";
			_this.emojiPath=o.emojiPath||"";
			_this.tip={"/微笑":"weixiao","/伤心":"shangxin","/美女":"meinv","/发呆":"fadai","/墨镜":"mojing","/大哭":"daku","/羞":"xiu","/哑":"ya","/睡":"shui","/哭":"ku","/囧":"jiong","/怒":"nu","/调皮":"tiaopi","/憨笑":"hanxiao","/惊讶":"jingya","/难过":"nanguo","/炫酷+":"xuanku","/冷汗":"lenghan","/抓狂":"zhuakuang","/吐":"tu","/笑":"xiao","/可爱":"keai","/白眼":"baiyan","/傲":"ao","/饿":"e","/累":"lei","/惊恐":"jingkong","/汗":"han","/闲":"xian","/努力":"nuli","/骂":"ma","/疑问":"yiwen","/秘密":"mimi","/乱":"luan","/疯":"feng","/鬼":"gui","/打击":"daji","/拜":"bye","/无语":"wuyu","/抠":"kou","/鼓掌":"guzhang","/糟糕":"zaogao","/恶搞":"egao","/左哼哼":"zuohengheng","/右哼哼":"youhengheng","/困":"kun","/鄙视":"kan","/委屈":"weiqu","/坏":"huai","/亲":"qin","/吓":"xia","/可怜":"kelian","/刀":"dao","/水果":"shuiguo","/酒":"jiu","/篮球":"lanqiu","/乒乓":"pingpang","/咖啡":"kafei","/美食":"meishi","/猪":"dongwu","/鲜花":"xianhua","/枯萎":"kuwei","/唇":"chun","/心":"xin","/分手":"fenshou","/生日":"shengri","/电":"dian","/炸弹":"zhadan","/匕首":"bishou","/足球":"zuqiu","/虫":"chong","/臭":"chou","/月亮":"yueliang","/太阳":"taiyang","/礼物":"liwu","/伙伴":"huoban","/赞":"zan","/茶":"cha","/握手":"woshou","/优":"you","/恭":"gong","/勾引":"gouyin","/拳头":"quantou","/差劲":"chajin","/爱情":"aiqing","/不":"bu","/好的":"haode","/吻":"wen","/跳":"tiao","/怕":"pa","/尖叫":"jianjiao","/转圈圈":"quan","/拜":"bai","/回头":"huitou","/上下跳":"shangxiatiao","/天使":"tianshi","/激动":"jidong","/无":"wu","/瑜伽":"yujia","/太极":"taiji"};//show
			_this.tip2={"/::)":"weixiao","/::~":"shangxin","/::B":"meinv","/::|":"fadai","/:8-)":"mojing","/::<":"daku","/::$":"xiu","/::X":"ya","/::Z":"shui","/::'(":"ku","/::-|":"jiong","/::@":"nu","/::P":"tiaopi","/::D":"daxiao","/::O":"jingya","/::(":"nanguo","/::+":"xuanku","/:–b":"lenghan","/::Q":"zhuakuang","/::T":"tu","/:,@P":"xiao","/:,@-D":"keai","/::d":"baiyan","/:,@o":"ao","/::g":"e","/:|-)":"lei","/::!":"jingkong","/::L":"han","/::>":"hanxiao","/::,@":"xian","/:,@f":"nuli","/::-S":"ma","/:?":"yiwen","/:,@x":"mimi","/:,@@":"luan","/::8":"feng","/:,@!":"ai","/:!!!":"gui","/:xx":"daji","/:bye":"bye","/:wipe":"wuyu","/:dig":"kou","/:handclap":"guzhang","/:&-(":"zaogao","/:B-)":"egao","/:<@":"zuohengheng","/:@>":"youhengheng","/::-O":"kun","/:>-|":"kan","/:P-(":"weiqu","/:X-)":"huai","/::*":"qin","/:@x":"xia","/:8*":"kelian","/:pd":"dao","/:<W>":"shuiguo","/:beer":"jiu","/:basketb":"lanqiu","/:oo":"pingpang","/:coffee":"kafei","/:eat":"meishi","/:pig":"dongwu","/:rose":"xianhua","/:showlove":"chun","/:heart":"xin","/:break":"fenshou","/:cake":"shengri","/:li":"dian","/:bome":"zhadan","/:kn":"bishou","/:footb":"zuqiu","/:ladybug":"chong","/:shit":"chou","/:moon":"yueliang","/:sun":"taiyang","/:gift":"liwu","/:hug":"huoban","/:strong":"zan","/:weak":"cha","/:share":"woshou","/:v":"you","/:@)":"gong","/:jj":"gouyin","/:@@":"quantou","/:bad":"chajin","/:lvu":"aiqing","/:no":"bu","/:ok":"haode","/:<L>":"wen","/:jump":"tiao","/:shake":"pa","/:<O>":"jianjiao","/:circle":"quan","/:kotow":"bai","/:turn":"huitou","/:skip":"shangxiatiao","/:oY":"tianshi","/:#-0":"jidong","/:hiphot":"wu","/:kiss":"chuanqing","/:<&":"yujia","/:&>":"taiji","/微笑":"weixiao","/伤心":"shangxin","/美女":"meinv","/发呆":"fadai","/墨镜":"mojing","/大哭":"daku","/羞":"xiu","/哑":"ya","/睡":"shui","/哭":"ku","/囧":"jiong","/怒":"nu","/调皮":"tiaopi","/憨笑":"hanxiao","/惊讶":"jingya","/难过":"nanguo","/炫酷+":"xuanku","/冷汗":"lenghan","/抓狂":"zhuakuang","/吐":"tu","/笑":"xiao","/可爱":"keai","/白眼":"baiyan","/傲":"ao","/饿":"e","/累":"lei","/惊恐":"jingkong","/汗":"han","/闲":"xian","/努力":"nuli","/骂":"ma","/疑问":"yiwen","/秘密":"mimi","/乱":"luan","/疯":"feng","/鬼":"gui","/打击":"daji","/拜":"bye","/无语":"wuyu","/抠":"kou","/鼓掌":"guzhang","/糟糕":"zaogao","/恶搞":"egao","/左哼哼":"zuohengheng","/右哼哼":"youhengheng","/困":"kun","/鄙视":"kan","/委屈":"weiqu","/坏":"huai","/亲":"qin","/吓":"xia","/可怜":"kelian","/刀":"dao","/水果":"shuiguo","/酒":"jiu","/篮球":"lanqiu","/乒乓":"pingpang","/咖啡":"kafei","/美食":"meishi","/猪":"dongwu","/鲜花":"xianhua","/枯萎":"kuwei","/唇":"chun","/心":"xin","/分手":"fenshou","/生日":"shengri","/电":"dian","/炸弹":"zhadan","/匕首":"bishou","/足球":"zuqiu","/虫":"chong","/臭":"chou","/月亮":"yueliang","/太阳":"taiyang","/礼物":"liwu","/伙伴":"huoban","/赞":"zan","/茶":"cha","/握手":"woshou","/优":"you","/恭":"gong","/勾引":"gouyin","/拳头":"quantou","/差劲":"chajin","/爱情":"aiqing","/不":"bu","/好的":"haode","/吻":"wen","/跳":"tiao","/怕":"pa","/尖叫":"jianjiao","/转圈圈":"quan","/拜":"bai","/回头":"huitou","/上下跳":"shangxiatiao","/天使":"tianshi","/激动":"jidong","/无":"wu","/瑜伽":"yujia","/太极":"taiji"};//analysis
			_this.emojiTip=['1f600','1f601','1f602','1f603','1f604','1f605','1f606','1f607','1f608','1f609','1f610','1f611','1f612','1f613','1f614','1f615','1f616','1f617','1f618','1f619','1f620','1f621','1f622','1f623','1f624','1f625','1f626','1f627','1f628','1f629','1f630','1f631','1f632','1f633','1f634','1f635','1f636','1f637','1f42c','1f42d','1f42e','1f42d','1f42f','1f43a','1f43b','1f43c','1f44a','1f44b','1f44c','1f44d','1f44e','1f44f','1f47b','1f47d','1f47f','1f60a','1f60b','1f60c','1f60d','1f60e','1f60f','1f61a','1f61b','1f61c','1f61d','1f61e','1f61f','1f62a','1f62b','1f62c','1f62d','1f62e','1f62f','1f64f','1f345','1f370','1f414','1f424','1f426','1f427','1f428','1f430','1f431','1f433','1f434','1f435','1f436','1f437','1f438','1f439','1f440','1f446','1f447','1f448','1f449','1f450','1f466','1f467','1f491','1f680','1f681','1f685','2b55','26a0','263a','274c','2122','2600','2728','00a9','00ae','1f3c1','1f4ab','1f6b2','1f34e'];
		 
			_this.reg =/\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:<W>|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:<L>|\/:jump|\/:shake|\/:<O>|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>|\/微笑|\/伤心|\/美女|\/发呆|\/墨镜|\/大哭|\/羞|\/哑|\/睡|\/哭|\/囧|\/怒|\/调皮|\/憨笑|\/惊讶|\/难过|\/炫酷|\/冷汗|\/抓狂|\/吐|\/笑|\/可爱|\/白眼|\/傲|\/饿|\/累|\/惊恐|\/汗|\/高兴|\/闲|\/努力|\/骂|\/疑问|\/秘密|\/乱|\/疯|\/鬼|\/打击|\/拜|\/无语|\/抠|\/鼓掌|\/糟糕|\/恶搞|\/左哼哼|\/右哼哼|\/困|\/鄙视|\/委屈|\/坏|\/亲|\/吓|\/可怜|\/刀|\/水果|\/酒|\/篮球|\/乒乓|\/咖啡|\/美食|\/猪|\/鲜花|\/枯萎|\/唇|\/心|\/分手|\/生日|\/电|\/炸弹:|\/匕首|\/足球|\/虫|\/臭|\/月亮|\/太阳|\/礼物|\/伙伴|\/赞|\/茶|\/握手|\/优|\/恭|\/勾引|\/拳头|\/差劲|\/爱情|\/不|\/好的|\/吻|\/跳|\/怕|\/尖叫|\/转圈圈|\/拜|\/回头|\/上下跳|\/天使|\/激动|\/无|\/传情|\/瑜伽|\/太极/g;;
			_this.reg2 =  /\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:<W>|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:<L>|\/:jump|\/:shake|\/:<O>|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>|\/微笑|\/伤心|\/美女|\/发呆|\/墨镜|\/大哭|\/羞|\/哑|\/睡|\/哭|\/囧|\/怒|\/调皮|\/憨笑|\/惊讶|\/难过|\/炫酷|\/冷汗|\/抓狂|\/吐|\/笑|\/可爱|\/白眼|\/傲|\/饿|\/累|\/惊恐|\/汗|\/高兴|\/闲|\/努力|\/骂|\/疑问|\/秘密|\/乱|\/疯|\/鬼|\/打击|\/拜|\/无语|\/抠|\/鼓掌|\/糟糕|\/恶搞|\/左哼哼|\/右哼哼|\/困|\/鄙视|\/委屈|\/坏|\/亲|\/吓|\/可怜|\/刀|\/水果|\/酒|\/篮球|\/乒乓|\/咖啡|\/美食|\/猪|\/鲜花|\/枯萎|\/唇|\/心|\/分手|\/生日|\/电|\/炸弹:|\/匕首|\/足球|\/虫|\/臭|\/月亮|\/太阳|\/礼物|\/伙伴|\/赞|\/茶|\/握手|\/优|\/恭|\/勾引|\/拳头|\/差劲|\/爱情|\/不|\/好的|\/吻|\/跳|\/怕|\/尖叫|\/转圈圈|\/拜|\/回头|\/上下跳|\/天使|\/激动|\/无|\/传情|\/瑜伽|\/太极/;
			_this.emojiReg=/(1f600|1f601|1f602|1f603|1f604|1f605|1f606|1f607|1f608|1f609|1f610|1f611|1f612|1f613|1f614|1f615|1f616|1f617|1f618|1f619|1f620|1f621|1f622|1f623|1f624|1f625|1f626|1f627|1f628|1f629|1f630|1f631|1f632|1f633|1f634|1f635|1f636|1f637|1f42c|1f42d|1f42e|1f42f|1f43a|1f43b|1f43c|1f44a|1f44b|1f44c|1f44d|1f44e|1f44f|1f47b|1f47d|1f47f|1f60a|1f60b|1f60c|1f60d|1f60e|1f60f|1f61a|1f61b|1f61c|1f61d|1f61e|1f61f|1f62a|1f62b|1f62c|1f62d|1f62e|1f62f|1f64f|1f345|1f370|1f414|1f424|1f426|1f427|1f428|1f430|1f431|1f433|1f434|1f435|1f436|1f437|1f438|1f439|1f440|1f446|1f447|1f448|1f449|1f450|1f466|1f467|1f491|1f680|1f681|1f685|2b55|26a0|263a|274c|2122|2600|2728|00a9|00ae|1f3c1|1f4ab|1f6b2|1f34e)/g;
			
			for(var a in _this.tip){
				var img = new Image();
				img.src=_this.path+_this.tip[a]+'.gif';
				//console.log(img.src)
			}
			 //callback&&callback();
		},
		show:function(){
			var _this=this;
			var strFace='';
			//var i=0;
			if($('#faceBox').length<=0){//集合如果不存在，则创建
				strFace = '<div id="faceBox" class="face">' +
							  '<ul>';
				for(var a in _this.tip){
					//i++
					strFace += '<li><img class="faceIco" src="'+_this.path+_this.tip[a]+'.gif" data-src="'+a+'" /></li>';
					//if( i % 14 == 0 ) strFace += '</tr><tr>';
				}
				strFace += '</ul></div>';
				$(_this.faceGroup).append(strFace); 
			}
			_this.sendTotextArea(_this.saytext);
			 
		},
		emojiShow:function(){
			var _this=this;
			var strFace='';
			if($('#emojiBox').length<=0){//集合如果不存在，则创建
				strFace = '<div id="emojiBox" class="face">' +
							  '<ul>';
			
				for(var i=0; i<=_this.emojiTip.length-1; i++){
					
					strFace += '<li><img class="faceIco" src="'+_this.emojiPath+_this.emojiTip[i]+'.png" data-src="'+_this.emojiTip[i]+'" /></li>';
					//if( i % 15 == 14 ) strFace += '';
				}
				strFace += '</ul></div>';
				$(emojiGroup).append(strFace);

			}
			_this.isHidden();//判断两个表情集合是否是显示状态
			_this.emojiSendTotextArea(_this.saytext);
		},
		isHidden:function(){
			var _this=this;
			//console.log($(_this.Group).css("display"));
			//console.log($(_this.Group).css("display")=="block");
			
			if($(_this.Group).css("display")=="block"){
				$(_this.Group).css("display","none")
			}else{
				$(_this.Group).css("display","block")
			}
			
			 
			$(_this.saytext).focus(function(){//当文本框获取焦点的时候隐藏表情集合
				$(_this.Group).hide(); 
			});

		},
		sendTotextArea:function(){
			var _this=this;
			$(document.body).undelegate();
			$(document.body).delegate(".faceIco",'click',function(e){
				var elm = e.currentTarget;
				var src = $(elm).attr("data-src");
				var currentSaytext=$(_this.saytext).val()+src;//将新表情追加到待发送框里
				//console.log($(tareId).val());
				//$("#saytext").val("");
				$(_this.saytext).val('');
				$(_this.saytext).val(currentSaytext);
				$(_this.Group).hide();//隐藏表情集合
				 
				//cbk && cbk(src);
			});
		
		},
		emojiSendTotextArea:function(){
			var _this=this;
			$(document.body).undelegate();
			$(document.body).delegate(".faceIco",'click',function(e){
				var elm = e.currentTarget;
				var src = $(elm).attr("data-src");
				var currentSaytext=$(_this.saytext).val()+src;//将新表情追加到待发送框里
				$(_this.saytext).val('');
				$(_this.saytext).val(currentSaytext);
				$(_this.Group).hide();//隐藏表情集合
				$(_this.saytext).focus();//
				//cbk && cbk(src);
			});
			
		},
		analysis:function(str){//将文本框内的表情字符转化为表情
			var _this=this;
			var icoAry=str.match(_this.reg);//将匹配到的结果放到icoAry这个数组里面，来获取长度
			 
			if(icoAry){
				for(var i=0;i<icoAry.length;i++){
					var ico=_this.reg2.exec(str);//重新匹配到第一个符合条件的表情字符
					//console.log(ico[0]);
					str = str.replace(_this.reg2,'<img src="'+_this.path+_this.tip2[ico[0]]+'.gif" border="0" />',1);
				}
			}
			str = str.replace(_this.emojiReg,'<img src="'+_this.emojiPath+'$1.png" border="0" />');
			return str
		},
		hasEmotion:function(str){//将文本框内的表情字符转化为表情
			//console.log(str);
			return this.reg.test(str) || this.emojiReg.test(str);
		}
	};

module.exports = ZC_Face;
