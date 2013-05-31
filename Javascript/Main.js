var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();
var currentFSMode = 2; 
var maxFSMode = 3;
var currentStatusLineText="";

showHandler = function() {
// procedure OK
	// Стандартный индикатор громкости
	document.getElementById('pluginObjectNNavi').SetBannerState(1);
	pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
	pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
	pluginAPI.unregistKey(tvKey.KEY_MUTE);
	pluginAPI.setOffScreenSaver();
};
var Main = {
	version_vidget : "0.3.4",
	mode : 0, // состояние полноэкранного режима
	WINDOW : 0,
	FULLSCREEN : 1,

	sURL : "", // адрес страниы альбома
	index : 1, // номер активного канала
	smeh : 5, // смещение при перемещении верх-низ на странице
	page : 0, // номер строки с общими списками

	playlist : 0,
	sta : 0, // пауза или играть с начала

	janrURL : "http://fs.ua/video/films/",
	janrText : "Фильмы",
//	janrURL : "http://fs.ua/video/films/search.aspx?search=revenge",
	search : false, // search : false, search : true,
	resMore: false, // 15 рез. если true и 20 если false
	
	TVPlugin : 0,
	Audio : 0,
	audio_output_device : 0,
	hardware : 0,
	hardware_type : 0,
	serieC : false,
	serieE : false,
	serieB : false,
	serieText:"", // текстовая версия ТВ
	
	sort: 0,
	
/*	mute : 0,
    NMUTE : 0,
    YMUTE : 1
  */
};

var b = 1; // индекс активной строки
var c = 1; // индекс прошлой активной строки
var url = ""; // адрес стрима файла mp3

Main.onLoad = function() {
	window.onShow =  showHandler; // Стандартный индикатор Volume-OSD
/*	this.Audio = document.getElementById('pluginAudio');
	this.audio_output_device = this.Audio.GetOutputDevice();
*/	this.TVPlugin = document.getElementById("pluginTV");
	this.hardware_type = this.TVPlugin.GetProductType();
	this.hardware = this.TVPlugin.GetProductCode(1);
	this.hardware_char=this.hardware.substring(4,5);

	if (Player.init() && Audio.init() && Display.init()) {
		
		document.getElementById("main").style.display = "block";
		document.getElementById("anchor").focus(); // Помещение фокуса на элемент "anchor"
		widgetAPI.sendReadyEvent();// Сообщаем менеджеру приложений о готовности
		
		document.getElementById("playlist").style.display = "none";
		document.getElementById("plain").style.display = "none";
		document.getElementById("search").style.display = "none";
		document.getElementById("black").style.display = "none";
		widgetAPI.putInnerHTML(document.getElementById("vidget_ver"),"Model:"+this.hardware+"   Type:"+this.hardware_char+"   v."+Main.version_vidget);
		// адрес запроса
		if(this.search){
			this.sURL = this.janrURL;
		}else{
			this.sURL = this.janrURL + '?page=' + this.page + '&view=detailed&sort='+Main.getSortPar();
		}

		URLtoXML.Proceed(this.sURL);
		
		//Display.setTime(0); // выставляем 0:00:00/0:00:00
		//Display.setVolume( Audio.getVolume() ); // громкости
	//	$('#svecKeyHelp_IIZH').sfKeyHelp({'TOOLS' : 'Поиск','NUMBER' : 'Категория',	'UPDOWN' : 'Позиция','leftright' : 'Позиция','Enter' : 'Выбор',	'Exit' : 'Выход'});
		Display.help_line_1();
	
	}
};



Main.onUnload = function() {
	Player.deinit();
	URLtoXML.deinit();
};
Main.keyDown = function() {
	var keyCode = event.keyCode;
	switch (keyCode) {
	case tvKey.KEY_EXIT:
		//alert("KEY_EXIT");
		widgetAPI.blockNavigation(event); //отменяем заводскую реакцию на событие.
		
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN){
			Player.stopVideo();
			Main.setWindowMode();			
		}else{
			widgetAPI.sendReturnEvent();// <- выполняем выход из виджета ВОЗВРАТОМ в смартхаб - вместо закрытия смартхаба по widgetAPI.sendExitEvent();
		}
		
		break;
	case tvKey.KEY_TOOLS: // поиск
		if (this.playlist == 0){
			/// если мы 0-м уровне - поиск работает.
			document.getElementById("title").style.display = "none";
			document.getElementById("janr").style.display = "none";
			document.getElementById("search").style.display = "block";
			document.getElementById("plain").style.display = "block";
			document.getElementById("black").style.display = "block";
			Search.Input();
		};
//		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN){
//			pluginAPI.ShowTools(1);
//		}
		break;
		
	case tvKey.KEY_1:
//		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
//			Player.PercentJump(1);
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/video/films/", "Фильмы");
		break;
	case tvKey.KEY_2:
//		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
//			Player.PercentJump(2);
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/video/cartoons/", "Мультфильмы");
		break;
	case tvKey.KEY_3:
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/video/clips/", "Клипы");
		break;
	case tvKey.KEY_4:
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/video/serials/", "Сериалы");
		break;
	case tvKey.KEY_5:
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/video/cartoonserials/", "Мультсериалы");
		break;
	case tvKey.KEY_6:
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/video/tvshow/", "Телепередачи");
		break;
	case tvKey.KEY_7:
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/video/concerts/", "Концерты");
		break;
	case tvKey.KEY_8:
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/audio/collections/", "Сборники");
		break;
	case tvKey.KEY_9:
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/audio/albums/", "Альбомы");
		break;
	case tvKey.KEY_0:
		if (this.playlist == 0)
			Main.NewJanr("http://fs.ua/audio/soundtracks/", "Саундтреки");
		break;
	case tvKey.KEY_INFO:
		if (this.mode==this.FULLSCREEN){
			Display.showplayer();
			Display.statusLine (currentStatusLineText);
		}
		break;
		
	case tvKey.KEY_CHLIST:
		if (this.playlist == 0)
			Favorites.open();
		break;
		
	case tvKey.KEY_YELLOW:
		if (Favorites.isVisible){
			Favorites.del();
		}else{
			if (this.playlist>0)
				Favorites.add();
		}
		
		break;
		
	case tvKey.KEY_BLUE: // переключение типа полноэкранного режима (циклично от
		// 1 до 5, начальное значение 2)
		if (this.playlist == 0 && !this.search && !Favorites.isVisible)
			Main.sortSelectNext();
		break;
		
	case tvKey.KEY_ASPECT: // переключение типа полноэкранного режима (циклично от
		// 1 до maxFSMode , начальное значение 2)
		if (this.mode == this.WINDOW) { // не переключаем в свернутом режиме
			break;
		}
		else{
			currentFSMode = (currentFSMode < maxFSMode) ? currentFSMode + 1 : 1;
			Player.setScreenMode(currentFSMode);
//			Display.statusLine ("Режим "+currentFSMode);
			break;
		}

	case tvKey.KEY_STOP:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN){
			Player.stopVideo();
			Main.setWindowMode();
		}
		break;

	case tvKey.KEY_PAUSE:
		if (Player.getState() == Player.PLAYING)
			this.handlePauseKey();
		break;

	case tvKey.KEY_PLAY:
//		alert(url);
		if (Player.getState() != Player.PLAYING && this.mode == this.FULLSCREEN){
			Main.handlePlayKey(url);
			this.sta = 1; // играть c начала
		}
		break;
	case tvKey.KEY_FF:
		if(Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipForwardVideo();
		}
		break;
	case tvKey.KEY_RW:
		if(Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipBackwardVideo();
		}
		break;

	case tvKey.KEY_RETURN:
	case tvKey.KEY_PANEL_RETURN:
		widgetAPI.blockNavigation(event); // блокируем по умолчанию RETURN 
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
		//если смотрим фильм - в любом раскладе играет или пауза - выходим. экономим на нажатии кнопки СТОП
		//зачем надо проверять режим проигрывания - на понял - по идее хватает проверки полноэкранности, но сделал  по аналогии 
		{
			Player.stopVideo();
			Main.setWindowMode();
			break;
		};////////

		if (URLtoXML.folders.length==0 && this.playlist==2) 
			this.playlist=1;
		
		
		if (URLtoXML.folders.length>0){
			delete URLtoXML.folders[URLtoXML.folders.length-1];
			URLtoXML.folders.length--;
		}

		if (URLtoXML.folders.length>0 && this.playlist==1){
			delete URLtoXML.folders[URLtoXML.folders.length-1];
			URLtoXML.folders.length--;
		}else if (URLtoXML.folders.length==0 && this.playlist<2){ 
			this.playlist=0;
		}else{ 
			this.playlist=1; 
		}

		if(this.playlist==0){
//			widgetAPI.blockNavigation(event); // блокируем по умолчанию RETURN
			document.getElementById("spisok").style.display = "block";
			document.getElementById("playlist").style.display = "none";
//			URLtoXML.Proceed(this.sURL);
			if (Favorites.isVisible){
				Display.help_line_4();
			}else{
				Display.help_line_1();
			}
		}else{
			if (Favorites.isVisible){
				Display.help_line_2_1();
			}else{
				Display.help_line_2();
			}
			
			Main.handleActiv();
			for ( var h = 1; h <= 200; h++) {
				widgetAPI.putInnerHTML(document.getElementById("str" + h), "");
			}
			
			URLtoXML.xmlHTTP = null;
			
			if (URLtoXML.folders.length==0){
//				this.sURL = URLtoXML.UrlSt[this.index]; // адрес страницы альбома
				URLtoXML.Proceed(URLtoXML.UrlSt[this.index]);
			}else{
				var currIDX = URLtoXML.folders[URLtoXML.folders.length-1].currIdx-1;
				URLtoXML.Proceed(URLtoXML.folders[URLtoXML.folders.length-1].urls[currIDX]);
			}
		}
		break;

	case tvKey.KEY_LEFT: // лево
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN)
		{
			Player.skipBackwardVideoFast();
			break;
		}
		else{
		if (this.playlist == 0 && this.index>0) {
			if (this.index == 1) {
				this.smeh = Main.NewString(0, -1) ? (this.resMore?19:14) : 0;
				this.index = 1;
				Main.ActivString(this.smeh);
			}
			else {
				Main.ActivString(-1);
				}
			}
			break;
		}

	case tvKey.KEY_RIGHT: // право
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipForwardVideoFast();
			break;
		}else{
			if (this.playlist == 0 && this.index<URLtoXML.ImgDickr.length) {
				if (this.index == (this.resMore?20:15)) {
					this.index = 1;
					Main.NewString(0, 1);
					Main.ActivString(0);
				}else if (this.index<URLtoXML.ImgDickr.length-1) {
					Main.ActivString(1);
				}
			}
			break;
		}

	case tvKey.KEY_UP:
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			break;
		}
		if (this.playlist == 0) {
			this.smeh = this.resMore?-7:-5;
			if (this.index>0 && this.index<=(this.resMore?7:5)) {
				Main.NewString(this.resMore?14:10, -1);
			}// переход поиска вверх
			Main.ActivString(this.smeh);// активная строка
		} else if (this.playlist == 1 || this.playlist == 2) {
			this.selectUpVideo();
			if (this.playlist == 1){
				URLtoXML.folders[URLtoXML.folders.length-1].currIdx = b;
			}
		}
		break;

	case tvKey.KEY_DOWN:
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			break;
		}
		if (this.playlist == 0) {
			this.smeh = this.resMore?7:5;
			if (this.index>(this.resMore?14:10) && this.index<=(this.resMore?20:15)) {
				Main.NewString((this.resMore?-14:-10), 1);// переход поиска вниз
			}

			if (this.index+this.smeh<URLtoXML.ImgDickr.length && this.index+this.smeh>0)
				Main.ActivString(this.smeh);// активная строка
		} else if (this.playlist == 1 || this.playlist == 2) {
			if (this.playlist == 1){
				if (b>=URLtoXML.folders[URLtoXML.folders.length-1].urls.length) break;
			}else{
				if (b>=URLtoXML.pUrlSt.length-1) break;
			}
			this.selectNextVideo();
			this.sta = 1; // играть c начала

			if (this.playlist == 1){
				URLtoXML.folders[URLtoXML.folders.length-1].currIdx = b;
			}
		}
		break;

	case tvKey.KEY_ENTER:
	case tvKey.KEY_PANEL_ENTER:

		if (this.playlist == 0) {
			this.playlist = 1;
			Main.handleActiv();
			for ( var h = 1; h <= 200; h++) {
				widgetAPI.putInnerHTML(document.getElementById("str" + h), "");
			}

			URLtoXML.xmlHTTP = null;
			URLtoXML.Proceed(URLtoXML.UrlSt[this.index]);
			document.getElementById("spisok").style.display = "none";
			document.getElementById("playlist").style.display = "block";
			document.getElementById("descript").style.display = "block";
			
			widgetAPI.putInnerHTML(document.getElementById("description"),
				"<img align='left' style='border-style: solid; border-width:1px; border-color:#3399FF; margin:6px 10px 8px 3px; max-width: 200px; max-height: 200px; border-radius:5px; box-shadow:0 0 13px black;' src='"
					+ URLtoXML.ImgDickr[this.index] + "'/>"
					+ URLtoXML.pDes[this.index]);
		}else if (this.playlist == 1) {
			Main.handleActiv();
			for ( var h = 1; h <= 200; h++) {
				widgetAPI.putInnerHTML(document.getElementById("str" + h), "");
			}
			
			URLtoXML.xmlHTTP = null;			
			var currIDX = URLtoXML.folders[URLtoXML.folders.length-1].currIdx-1;
			URLtoXML.Proceed(URLtoXML.folders[URLtoXML.folders.length-1].urls[currIDX]);
		}else if (this.playlist == 2) {
			this.sta = 1;
			url = URLtoXML.pUrlSt[b];
			Main.handlePlayKey(url);
		};

/*
		widgetAPI.putInnerHTML(document.getElementById("description"),
				"<img style='border-style: solid; border-width:10px; border-color:#3399FF; margin:10px; max-width: 200px; max-height: 200px;  border-radius:5px; box-shadow:0 0 13px black;' src='"
					+ URLtoXML.ImgDickr[this.index].replace("?100", "100")
					+ "max-width: 200px; max-height: 200px; ' align='left'"
					+ URLtoXML.pDes[this.index]);
*/
		if (Favorites.isVisible){
			Display.help_line_2_1();
		}else{
			Display.help_line_2();
		}
		
		break;
 
	
	default:
//		alert("Unhandled key");
		break;

	}
	if (URLtoXML.sName[this.index])
		if (URLtoXML.sName[this.index].length > 180) {
			widgetAPI.putInnerHTML(document.getElementById("title"), URLtoXML.sName[this.index].substr(0, 180) + "...");
		}// название в заголовок
		else {
			widgetAPI.putInnerHTML(document.getElementById("title"), URLtoXML.sName[this.index]);
		}
	Main.ListTop();
};
// перемещение поиска по страницам
Main.NewString = function(per, a) {
//	this.search = "?";
	this.smeh = per; // соответствие столбца
	this.page = this.page + a; // смещаем адрес поиска страницы
	if (this.page < 0) {// верхний предел
		this.page = 0;
		this.smeh = 0;
		return 0;
	} else if (Favorites.isVisible) {
		return Favorites.changePage();
	}else{
		URLtoXML.xmlHTTP = null;
		
		if (this.search){
			this.sURL += '&page=' + this.page;
		}else{
			this.sURL = this.janrURL + '?view=detailed&page=' + this.page + '&sort='+Main.getSortPar(); // жанр
		}
		// +
		// страница
		URLtoXML.Proceed(this.sURL);
		return 1;
	}
};
// активная строка
Main.ActivString = function(smeh) {
	this.smeh = smeh;
	if (document.getElementById("imgst" + this.index))
		document.getElementById("imgst" + this.index).style.borderColor = "#e9e9e9";
	this.index = this.index + this.smeh;
	if (document.getElementById("imgst" + this.index))
		document.getElementById("imgst" + this.index).style.borderColor = "#3399FF";
};

Main.ListTop = function() { // смещение списка по достижению пределов
	document.getElementById("list2").style.top = (-421 * Math.floor((b-1)/19))+"px";
};

Main.handlePauseKey = function() {
	switch (Player.getState()) {
	case Player.PLAYING:
		Player.pauseVideo();
		this.sta = 0; // пауза
		break;
	default:
		break;
	}
};

Main.handleActiv = function() {
	document.getElementById("list2").style.top = "0px"; // переключение списка
	// на 0
	document.getElementById("str" + b).style.color = "#FFF"; // возвращение
	// цвета с
	// активного на
	// пасивный
	b = 1;
	c = 1;
	document.getElementById("str" + b).style.color = "#3399FF"; // активная
	// строка
};
Main.selectNextVideo = function() {
	if (b == 200) {
		b = 199;
	} // предел max
	b++;
	document.getElementById("str" + b).style.color = "#3399FF"; // активная
	// строка
	c = b - 1;
	document.getElementById("str" + c).style.color = "#FFF"; // возвращение
	// цвета с
	// активного на
	// пасивный
	this.sta = 1;// играть c начала
};
Main.selectUpVideo = function(){
	if (b == 1) {
		b = 2;
	} // предел min
	b = b - 1;
	document.getElementById("str" + b).style.color = "#3399FF"; // активная
	// строка
	c = b + 1;
	document.getElementById("str" + c).style.color = "#FFF"; // возвращение
	// цвета с
	// активного на
	// пасивный
	this.sta = 1;// играть c начала
};

Main.handlePlayKey = function(url)
{
	if (this.sta == 1) {
		Player.stopVideo();
		url = URLtoXML.pUrlSt[b];
		Player.playVideo(url);
	}
	switch (Player.getState()) {
	case Player.STOPPED:
		Player.playVideo(url);
		break;
	case Player.PAUSED:
		Player.resumeVideo();
		break;
	default:
		break;
	}
/*	
	widgetAPI.putInnerHTML(document.getElementById("description"),
		"<img style='border-style: solid; border-width:10px; border-color:#3399FF; margin:10px; max-width: 200px; max-height: 200px; border-radius:5px; box-shadow:0 0 13px black;' src='"
			+ URLtoXML.ImgDickr[this.index].replace("?100", "100")
			+ "max-width: 200px; max-height: 200px; ' align='left'"
			+ URLtoXML.pDes[this.index]
	);
*/
	widgetAPI.putInnerHTML(document.getElementById("play_name"),URLtoXML.pName[b]);
	Main.ListTop();// смещение списка по достижению пределов
};

// перемещение поиска по страницам
Main.NewJanr = function(janr, text) {
	this.search = false;
	Favorites.isVisible = false;
	
	Main.setResSimple();
	Main.clearBlocks();
	
	this.janrURL = janr;
	this.janrText = text;
	
	URLtoXML.xmlHTTP = null;
	this.sURL = janr + '?view=detailed&page=' + this.page + '&sort='+Main.getSortPar(); // жанр +
	// страница
	URLtoXML.Proceed(this.sURL);
	widgetAPI.putInnerHTML(document.getElementById("janr"), text+" <span style=\"color:#3399FF; font-size:15px;\">("+Main.getSortText()+")</span>");
	Display.help_line_1();
};

Main.setFullScreenMode = function() {
	if (this.mode != this.FULLSCREEN) {
		document.getElementById("main").style.display = "none";
//		Player.setFullscreen();
		this.mode = this.FULLSCREEN;
	}
};

Main.setWindowMode = function() {
	if (this.mode != this.WINDOW) {
		Display.hideplayer();
		Player.setWindow();
		document.getElementById("main").style.display = "block";
		this.mode = this.WINDOW;
	}
};

Main.toggleMode = function() {
	switch (this.mode) {
	case this.WINDOW:
		this.setFullScreenMode();
		break;

	case this.FULLSCREEN:
		this.setWindowMode();
		break;

	default:
		break;
	}
};

Main.setResSimple = function() {
	document.getElementById("spisok2").class = '';
	this.resMore = false;
};

Main.setResMore = function() {
	document.getElementById("spisok2").class = 'moreres';
	this.resMore = true;
};

Main.clearBlocks = function(){
	widgetAPI.putInnerHTML(document.getElementById("title"), '');
	for ( var h = 1; h <= 20; h++) {
		widgetAPI.putInnerHTML(document.getElementById("bloc" + h), "");
	}
	Main.index = 1;
	URLtoXML.ImgDickr = [];
	URLtoXML.UrlSt = [];
	URLtoXML.sName = [];
	URLtoXML.pDes = [];
};

Main.getSortPar = function(){
	var res = 'new';
	switch(this.sort){
		case 1: res = 'rating'; break;
		case 2: res = 'year'; break;
	}
	return res;
};

Main.getSortText = function(){
	var res = 'по дате';
	switch(this.sort){
		case 1: res = 'по рейтингу'; break;
		case 2: res = 'по году'; break;
	}
	return res;
};

Main.sortSelectNext = function(){
	if (this.sort<2){
		this.sort++;
	}else{
		this.sort=0;
	}
	Main.NewJanr(this.janrURL, this.janrText);
};