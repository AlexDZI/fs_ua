var URLtoXML = {
	outTXT : "",// строка, куда соберем список
	fMode : false, // режим обмена данными (асинхронный=true синхронный=false)

	// По умолчанию основные параметры определяем для FS.UA
	prefixURL : "http://fs.ua/",

	nStart : 0, // начальный символ поиска в ответе нужных данных

	xmlHTTP : null,

	sName : new Array(), // имя файла
	UrlSt : new Array(), // адрес
	ImgDickr : new Array(), // картинка
	pName : new Array(),
	pDes : new Array(),
	qDes : new Array(),
	
	folders: new Array(),

	pUrlSt : new Array(),

	arrVideoExt : ["avi", "asf", "asx", "3gp","3g2", "3gp2", "3gpp", "flv", "mp4", "mp4v", "m4v", "m2v","m2ts", "m2t", "mp2v", "mov", "mpg", "mpe", "mpeg", "mkv","swf", "mts", "wm", "wmx", "wmv", "vob", "iso", "f4v", "ts", "flac", "mp3", "dts", "ac3"],
   
   //двумерный массив строк, которые нужно заменить в тексте - первый вариант на второй
   arrReplWordsDesc : [["h1>", "b>"], ["</*p>","<br>"], ["\\s*<br>\\s*<br>", "<br>"], ["</*p>","</*p>"]],
   arrReplWordsFrwd : [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ["'", "&apos;"], ["\"", "&quot;"]],
   //массив строк-масок регулярных выражений, подлежащих удалению из текста
   arrDelWords : ["<\\s*a[^<^>]*>", "<\\s*/\\s*a\\s*>", "<\\s*/*\\s*span[^>]*>", "<\\s*/*\\s*div[^>]*>", "<\\s*/*\\s*img[^>]*>", "<\\s*/*\\s*strong[^>]*>"],
   prefixTAG : "<a href='",
   endedTAG : "'>",

};




URLtoXML.deinit = function () {
	if (this.xmlHTTP ) {
		this.xmlHTTP.abort();
	}
};

// обработка ссылки
URLtoXML.Proceed = function(sURL) {

	this.outTXT = "";// очищаем строку-приемник конечного плейлиста

	if (this.xmlHTTP == null) {// инициализируем связь с интернетом
		this.xmlHTTP = new XMLHttpRequest();

		this.xmlHTTP.url = sURL;

		// отсылаем пустой запрос и ловим страницу в строку
		this.xmlHTTP.open("GET", sURL, this.fMode); // ?асинхронно

		this.xmlHTTP.onreadystatechange = function() {
			if (URLtoXML.xmlHTTP.readyState == 4) {
				URLtoXML.outTXT = URLtoXML.ParseXMLData(); // генерим конечный плейлист на основании полученных данных
			}
		};

		this.xmlHTTP.setRequestHeader("User-Agent","Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
		this.xmlHTTP.send();
	}
};

// из полученного ответа вытаскиваем нужные данные
URLtoXML.ParseXMLData = function() {
	var sOut;
	var index = 0; // индекс масcива

	if (this.xmlHTTP.status == 200)// если ответ от сервера корректный
	{
		// сразу удаляем переводы строк для удобного поиска
		sOut = this.xmlHTTP.responseText;

		if (Main.playlist == 0) {
			if (Main.search){
				var arr = sOut.split('<td class="num">');
				for (var i in arr) {
					var myRe = /\<a href=\"(.*)\" class=\"title\"\>(.*)\<\/a\>/ig;
					if (name = myRe.exec(arr[i])){
						index++;
						this.UrlSt[index] = this.prefixURL + name[1] + '?ajax&folder=0';
						this.sName[index] = name[2];

						myRe = /\<a href=\".*\" title=\".*\"\>\<img src=\"(.*)\/5\/(.*)\" border=\"0\"\>\<\/a\>/ig;
						if (img = myRe.exec(arr[i])){
							this.ImgDickr[index] = img[1]+'/6/'+img[2];
						}else{
							this.ImgDickr[index] = '';
						}

						arr[i] = arr[i].replace(/\<br\s?\/\>(\s*)?\r?\n?/igm, '<br/>');
						myRe = /\<p class=\"text\"\>((.|\n)*)\<\/p\>\n/igm;
						if (desc = myRe.exec(arr[i])){
							desc[1] = URLtoXML.DelWords(desc[1]);
							desc[1] = URLtoXML.DelTrash(desc[1]);
							
							this.pDes[index] = desc[1];
						}else{
							this.pDes[index] = '';
						}
						
						
						widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index]);
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "<img class='blockImage' id='imgst" + index +  "';  src='" + this.ImgDickr[index] + "' />");
						document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF"; // активная строка
					}else{
						this.UrlSt[index] = '';
						this.sName[index] = '';
						this.pDes[index] = '';
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "");
					}
				}
			}else{
			
				var arr = sOut.split('<div class="b-poster-section-detail">');
				for (var i in arr) {
					var myRe = /\<a class=\"subject-link m-themed\" href=\"(.+)\"\>(.+)\<\/a\>/igm;
					if (name = myRe.exec(arr[i])){
						index++;
						this.UrlSt[index] = this.prefixURL + name[1] + '?ajax&folder=0';
						this.sName[index] = name[2];
						
						var descr = '';
						myRe = /\<p\>(.*)\<\/p\>/igm;
						if (vRol = myRe.exec(arr[i])){
							descr = URLtoXML.DelWords(vRol[1]);
							descr = URLtoXML.DelTrash(descr);
							descr = '<span class="vRol">'+descr+'</span><br>';
						}
						
						arr[i] = arr[i].replace(/\<br\s?\/\>(\s*)?\r?\n?/igm, '<br/>');
						myRe = /\<div class=\"main\"\>\n.*\n.*\<img src=\"(.+)\" .* width=.*\/\>\n.*\n.*\<div class=\"text\"\>((.|\n)*)\<\/div\>\n.*\<\/div\>\n\<\/div\>/igm;
						if (img = myRe.exec(arr[i])){
							this.ImgDickr[index] = img[1];
							descr += img[2];
						}else{
							this.ImgDickr[index] = '';
						}
						this.pDes[index] = descr;
						
						widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index]);
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "<img class='blockImage' id='imgst" + index +  "';  src='" + this.ImgDickr[index] + "' />");
						document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF"; // активная строка
					}else{
						this.UrlSt[index] = '';
						this.sName[index] = '';
						this.pDes[index] = '';
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "");
					}
				}
			}
		}else if (Main.playlist == 1) { 
			var obj = new Object();
			obj.names = new Array();
			obj.urls = new Array();
			obj.isFolders = new Array();
			obj.currIdx = 1;
			
			var arr = sOut.split('<li class="folder">');
			for (var i in arr) {
//				var myRe = /\<a .* name=\"fl\d+\" class=\"link-\w+\s?(\S*)?\s?title" rel="{parent_id: '?(\d+)'?}">(\n\s*)?(.+)\<\/a\>/igm;
				var myRe = /\<a .* name=\"fl\d+\" class=\"link-\w+\s?(\S*)?\s?title" rel="{parent_id: '?(\d+)'?}"(\sstyle=\".*\")?\>(\n\s*)?(.+)\<\/a\>/igm;
				if (id = myRe.exec(arr[i])){
				
//						id[1] - ikonka lang
//						id[2] - id
//						id[5] - Perevod name

//					myRe = /\<a href=\"\/(.*)\" class=\"folder-filelist\">.*\<\/a\>/igm;
//					var fl = myRe.exec(arr[i]);
//						fl[1] - file list url						
					
					myRe = /\<span class=\"material-size\"\>(.*)\<\/span\>\n.*\<span class=\"material-size\"\>(.*)\<\/span\>/igm;
					var ms = myRe.exec(arr[i]);
					if (!ms){
						myRe = /\<span class=\"material-size\"\>(.*)\<\/span\>/igm;
						ms = myRe.exec(arr[i]);
					}
					myRe = /\<span class=\"material-details\"\>(.*)\<\/span\>/igm;
					var md = myRe.exec(arr[i]);
					
					var name = '<div class="link-subtype';
					if (id[1]){ name+=' '+id[1]+'">'; }else{ name+='">'; }
					if (id[5]){ name+='<span class="voice">'+id[5]+'</span>'; }
//					if (id[1]){ name+='<span class="voice">'+id[5]+'</span>'; }
//					else{ name+=id[5]; } }
					name+='&nbsp;&nbsp;';
					if (ms){
						if(ms[2]){ 
							if(ms[1]){ name+=ms[1]; }
							name+='&nbsp;&nbsp;&nbsp;('+ms[2]; 
						}else{ name+='&nbsp;&nbsp;&nbsp;('+ms[1]; }
					}
					if(md[1]){ name+=' - '+md[1]; }
					name+=')</div>';
					
					var url;
/*					var isFolder = false;
					if (fl){ 
						url=this.prefixURL + fl[1];
					}else{ 
						url=this.xmlHTTP.url + '&folder='+id[2]; 
						isFolder = true;
					}
*/
					url=this.xmlHTTP.url + '&folder='+id[2]; 
					
					obj.names[obj.names.length] = name;
					obj.urls[obj.urls.length] = url;
//					obj.isFolders[obj.isFolders.length] = isFolder;
//					alert(isFolder+' - '+url);
										
					index++;
					widgetAPI.putInnerHTML(document.getElementById("str" + index), name);
				}
			}
			
			if (obj.urls.length>0){
				this.folders[this.folders.length] = obj;
			}else{
				Main.playlist = 2;
			}
		}
		
		if (Main.playlist == 2) {
			this.pName = [];
			this.pUrlSt = [];
			
//			myRe = /(.*\/(.*))\r\n/igm;
			myRe = /\<a id=\".*\" href=\"(.*\/(.*\.(.*)))\" class=\".*b-file-new__link-material-download.*\"\>\n/igm;
			while (sres = myRe.exec(sOut)) {
				if(this.arrVideoExt.indexOf(sres[3])>-1){
					index++;
					this.pName[index] = decodeURIComponent(sres[2].replace(/\+/g,  " "));
					this.pUrlSt[index] = sres[1];
					widgetAPI.putInnerHTML(document.getElementById("str" + index), this.pName[index]);
				}
			}
		}
	}

};

/*
// поиск значения на странице и вычленение его
URLtoXML.FindVal = function(sOut, nBeg, keyBVal, keyEVal) {
	var nEnd, sRes;

	sRes = sOut.toLowerCase();// приводим к нижнему регистру
	nBeg = sRes.indexOf(keyBVal.toLowerCase(), nBeg);// ищем первый ключ

	if (nBeg >= 0) {// если значение найдено

		nBeg = nBeg + keyBVal.length;// передвигаем начало поиска на след.
		// символ за первичным ключом
		// ищем вторичный ключ
		nEnd = sRes.indexOf(keyEVal.toLowerCase(), nBeg);
		this.nStart = nEnd + keyEVal.length;// если не нашли окончание значения
		// - становимся в конец строки +1
		// символ

		sRes = sOut.substring(nBeg, nEnd); // вычленяем значение
	} else {
		sRes = "";// не найден первичный ключ
		this.nStart = nBeg;// конец поиска - маска не найдена
	}
	return sRes;
};
*/
// удаление "мусора" из строки
URLtoXML.DelTrash = function(str) {
	// заменяем мусор на пробелы
	str = str.replace(new RegExp("&nbsp;", 'gim'), " ");
	str = str.replace(new RegExp("&mdash;", 'gim'), " ");
	str = str.replace(new RegExp("\t", 'gim'), " "); // табуляция
	str = str.replace(new RegExp("\n", 'gim'), " "); // конец строки
	str = str.replace(new RegExp("\r", 'gim'), " "); // перевод каретки

	// заменяем все "длинные" пробелы на один
	while (str.indexOf("  ") >= 0) {
		str = str.replace(new RegExp("  ", 'gim'), " ");
	}
	return URLtoXML.trim(str);
};

//удаление исключенных слов из результата
URLtoXML.DelWords = function(sVal){
var wrd, sRes;

    sRes = sVal;
    //удаляем из входной строки все встречающиеся в массиве исключений слова
    for (var i in this.arrDelWords){
       //слово из массива
       wrd = this.arrDelWords[i];
       sRes = sRes.replace(new RegExp(wrd, 'gim'), "");
    }
    
    //возвращаем результат
    return sRes;
};
/*
//замена слов в результате по массиву замен
URLtoXML.ReplWords = function(sVal, arrRepl){
var wrd, sRes;

    sRes = sVal;
    //идем по внешнему массиву и выдергиваем слова поиска
    for (var i in arrRepl){
       //искомое слово из массива - первый элемент массива
       wrd = arrRepl[i][0];
       //заменяем в выходной строке искомое слово на нужный вариант из справочника - второй элемент массива
       sRes = sRes.replace(new RegExp(wrd, 'gim'), arrRepl[i][1]);
    }
    
    //возвращаем результат
    return sRes;
};
*/
// удаляемa пробелы в конце и в начале
URLtoXML.trim = function(str) {
	while (str.charAt(str.length - 1) == " ") {
		str = str.substring(0, str.length - 1);
	}
	while (str.charAt(0) == " ") {
		str = str.substring(1);
	}
	return str;
};
