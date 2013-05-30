var Search = {

};
var ime = ''; // обьект - виртуальная клав.
var rezylt = ''; // текст результат

Search.Input = function() {
	// строка информации
	//$('#svecKeyHelp_IIZH').sfKeyHelp({ 		'leftright' : 'Call the IME',		'Enter' : 'Input text',		'return' : 'Return'	});
	Display.help_line_3();
	// создаём виртуальную клав. привязанную к ID - "plainText"
	ime = new IMEShell("plainText", Search.imeReady, 'en');
};

// функции привязанные к вертуальной клав.
Search.imeReady = function(imeObject) {
	ime.setKeypadPos(550, 90); // положение
	ime.setEnterFunc(Search.onEnter); // событие на кнопку интер
	document.getElementById("plainText").focus(); // помещаем фокус на вод
													// текста
	ime.setOnCompleteFunc(Search.SearchOk); // отлавливаем текст
	ime.setKeyFunc(tvKey.KEY_RETURN, Search.textobjKeyFunc);// событие на кнопку
															// RETURN
};

Search.onEnter = function(string) {
	// document.getElementById('notifications').innerHTML = rezylt; // готовый
	// результат

	document.getElementById("anchor").focus(); // перемещаем фокус на элемент
												// "anchor"
	// перезапускаем парсинг с новой строкой поиска
	Main.search = true;
	Favorites.isVisible = false;
	Main.setResMore();
	
	widgetAPI.putInnerHTML(document.getElementById("janr"), 'Поиск: '+rezylt);
	Main.clearBlocks();
	
	URLtoXML.xmlHTTP = null;
	Main.sURL = Main.janrURL+"search.aspx?search=" + rezylt;
//	alert(Main.sURL);
	URLtoXML.Proceed(Main.sURL);

	document.getElementById("title").style.display = "block";
	document.getElementById("janr").style.display = "block";
	document.getElementById("plain").style.display = "none";
	document.getElementById("search").style.display = "none";
	document.getElementById("black").style.display = "none";
	//$('#svecKeyHelp_IIZH').sfKeyHelp({		'TOOLS' : 'Поиск',		'NUMBER' : 'Категория',		'UPDOWN' : 'Позиция',		'leftright' : 'Позиция',		'Enter' : 'Выбор',		'return' : 'Назад'	});
	Display.help_line_1();
};

Search.textobjKeyFunc = function(keyCode) {// возврат при нажатии кнопки RETURN
	document.getElementById("anchor").focus(); // перемещаем фокус на элемент
												// "anchor"

	document.getElementById("title").style.display = "block";
	document.getElementById("janr").style.display = "block";
	document.getElementById("plain").style.display = "none";
	document.getElementById("search").style.display = "none";
	document.getElementById("black").style.display = "none";
	/*$('#svecKeyHelp_IIZH').sfKeyHelp({
		'TOOLS' : 'Поиск',
		'NUMBER' : 'Категория',
		'UPDOWN' : 'Позиция',
		'leftright' : 'Позиция',
		'Enter' : 'Выбор',
	});
	*/
	Display.help_line_1();
};

Search.SearchOk = function(arg) { // отлавливаем текст и помещаем в переменную
	// document.getElementById('notifications').innerHTML = arg; // готовый
	// результат
	rezylt = arg;
};