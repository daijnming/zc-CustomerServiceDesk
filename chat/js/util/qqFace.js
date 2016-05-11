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
			_this.tip={"/::)":"weixiao","/::~":"shangxin","/::B":"meinv","/::|":"fadai","/:8-)":"mojing","/::<":"daku","/::$":"xiu","/::X":"ya","/::Z":"shui","/::'(":"ku","/::-|":"jiong","/::@":"nu","/::P":"tiaopi","/::D":"xiao","/::O":"jingya","/::(":"nanguo","/::+":"xuanku","/:–b":"lenghan","/::Q":"zhuakuang","/::T":"tu","/:,@P":"xiao","/:,@-D":"kuaile","/::d":"qi","/:,@o":"ao","/::g":"e","/:|-)":"lei","/::!":"jingkong","/::L":"han","/::>":"gaoxing","/::,@":"xian","/:,@f":"nuli","/::-S":"ma","/:?":"yiwen","/:,@x":"mimi","/:,@@":"luan","/::8":"feng","/:,@!":"ai","/:!!!":"gui","/:xx":"daji","/:bye":"bye","/:wipe":"wuyu","/:dig":"kou","/:handclap":"guzhang","/:&-(":"zaogao","/:B-)":"egao","/:<@":"zuohengheng","/:@>":"youhengheng","/::-O":"lei","/:>-|":"kan","/:P-(":"weiqu","/::'|":"nanguo","/:X-)":"huai","/::*":"qin","/:@x":"xia","/:8*":"kelian","/:pd":"dao","/:<W>":"shuiguo","/:beer":"jiu","/:basketb":"lanqiu","/:oo":"pingpang","/:coffee":"kafei","/:eat":"meishi","/:pig":"dongwu","/:rose":"xianhua","/:fade":"ku","/:showlove":"chun","/:heart":"ai","/:break":"fenshou","/:cake":"shengri","/:li":"dian","/:bome":"zhadan","/:kn":"bishou","/:footb":"zuqiu","/:ladybug":"chong","/:shit":"chou","/:moon":"yueliang","/:sun":"taiyang","/:gift":"liwu","/:hug":"huoban","/:strong":"zan","/:weak":"cha","/:share":"woshou","/:v":"you","/:@)":"gong","/:jj":"gou","/:@@":"ding","/:bad":"chajin","/:lvu":"aiqing","/:no":"bu","/:ok":"haode","/:love":"aiqing","/:<L>":"wen","/:jump":"tiao","/:shake":"pa","/:<O>":"jianjiao","/:circle":"quan","/:kotow":"bai","/:turn":"huitou","/:skip":"shangxiatiao","/:oY":"tianshi","/:#-0":"jidong","/:hiphot":"wu","/:kiss":"wen","/:<&":"yujia","/:&>":"taiji"};//show
			_this.tip2={"/::)":"weixiao","/微笑":"weixiao","/::~":"shangxin","/::B":"meinv","/::|":"fadai","/:8-)":"mojing","/::<":"daku","/::$":"xiu","/::X":"ya","/::Z":"shui","/::'(":"ku","/::-|":"jiong","/::@":"nu","/::P":"tiaopi","/::D":"xiao","/::O":"jingya","/::(":"nanguo","/::+":"xuanku","/:–b":"lenghan","/::Q":"zhuakuang","/::T":"tu","/:,@P":"xiao","/:,@-D":"kuaile","/::d":"qi","/:,@o":"ao","/::g":"e","/:|-)":"lei","/::!":"jingkong","/::L":"han","/::>":"gaoxing","/::,@":"xian","/:,@f":"nuli","/::-S":"ma","/:?":"yiwen","/:,@x":"mimi","/:,@@":"luan","/::8":"feng","/:,@!":"ai","/:!!!":"gui","/:xx":"daji","/:bye":"bye","/:wipe":"wuyu","/:dig":"kou","/:handclap":"guzhang","/:&-(":"zaogao","/:B-)":"egao","/:<@":"zuohengheng","/:@>":"youhengheng","/::-O":"lei","/:>-|":"kan","/:P-(":"weiqu","/::'|":"nanguo","/:X-)":"huai","/::*":"qin","/:@x":"xia","/:8*":"kelian","/:pd":"dao","/:<W>":"shuiguo","/:beer":"jiu","/:basketb":"lanqiu","/:oo":"pingpang","/:coffee":"kafei","/:eat":"meishi","/:pig":"dongwu","/:rose":"xianhua","/:fade":"ku","/:showlove":"chun","/:heart":"ai","/:break":"fenshou","/:cake":"shengri","/:li":"dian","/:bome":"zhadan","/:kn":"bishou","/:footb":"zuqiu","/:ladybug":"chong","/:shit":"chou","/:moon":"yueliang","/:sun":"taiyang","/:gift":"liwu","/:hug":"huoban","/:strong":"zan","/:weak":"cha","/:share":"woshou","/:v":"you","/:@)":"gong","/:jj":"gou","/:@@":"ding","/:bad":"chajin","/:lvu":"aiqing","/:no":"bu","/:ok":"haode","/:love":"aiqing","/:<L>":"wen","/:jump":"tiao","/:shake":"pa","/:<O>":"jianjiao","/:circle":"quan","/:kotow":"bai","/:turn":"huitou","/:skip":"shangxiatiao","/:oY":"tianshi","/:#-0":"jidong","/:hiphot":"wu","/:kiss":"wen","/:<&":"yujia","/:&>":"taiji"};//analysis
			_this.emojiTip=['1f600','1f601','1f602','1f603','1f604','1f605','1f606','1f607','1f608','1f609','1f610','1f611','1f612','1f613','1f614','1f615','1f616','1f617','1f618','1f619','1f620','1f621','1f622','1f623','1f624','1f625','1f626','1f627','1f628','1f629','1f630','1f631','1f632','1f633','1f634','1f635','1f636','1f637','1f42c','1f42d','1f42e','1f42d','1f42f','1f43a','1f43b','1f43c','1f44a','1f44b','1f44c','1f44d','1f44e','1f44f','1f47b','1f47d','1f47f','1f60a','1f60b','1f60c','1f60d','1f60e','1f60f','1f61a','1f61b','1f61c','1f61d','1f61e','1f61f','1f62a','1f62b','1f62c','1f62d','1f62e','1f62f','1f64f','1f345','1f370','1f414','1f424','1f426','1f427','1f428','1f430','1f431','1f433','1f434','1f435','1f436','1f437','1f438','1f439','1f440','1f446','1f447','1f448','1f449','1f450','1f466','1f467','1f491','1f680','1f681','1f685','2b55','26a0','263a','274c','2122','2600','2728','00a9','00ae','1f3c1','1f4ab','1f6b2','1f34e'];
		 
			_this.reg = /\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:<W>|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:<L>|\/:jump|\/:shake|\/:<O>|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>|\/微笑/g;
			_this.reg2 =  /\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:<W>|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:<L>|\/:jump|\/:shake|\/:<O>|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>|\/微笑/;
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
			console.log($(_this.Group).css("display"));
			console.log($(_this.Group).css("display")=="block");
			
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
				 
				//cbk && cbk(src);
			});
			
		},
		analysis:function(str){//将文本框内的表情字符转化为表情
			var _this=this;
			var icoAry=str.match(_this.reg);//将匹配到的结果放到icoAry这个数组里面，来获取长度
			
			if(icoAry){
				for(var i=0;i<icoAry.length;i++){
					var ico=_this.reg2.exec(str);//重新匹配到第一个符合条件的表情字符
					console.log(ico[0]);
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
