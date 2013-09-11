var FS_Genres = 
{

};

FS_Genres.GetGenreUrlForCategory = function(nCategory)
{
	var sResultGenreUrl = "";
	
	switch(nCategory)
	{
	case FS_Category.SOUND_TRACKS:
		
		alert("Genres for soundtracks doesn't exist."); 
		break;
		
	case FS_Category.FILMS:
		
		sResultGenreUrl = Main.prefixURL + "/video/films/group/film_genre/";
		break;
		
	case FS_Category.CARTOONS:
		
		sResultGenreUrl = Main.prefixURL + "/video/cartoons/group/cartoon_genre/";
		break;
		
	case FS_Category.CLIPS:
		
		sResultGenreUrl = Main.prefixURL + "/video/clips/group/music_genre/";
		break;
		
	case FS_Category.SOAP_OPERAS:
		
		sResultGenreUrl = Main.prefixURL + "/video/serials/group/genre/";
		break;
		
	case FS_Category.THE_ANIMATED_SERIES:
		
		sResultGenreUrl = Main.prefixURL + "/video/cartoonserials/group/genre/";
		break;
		
	case FS_Category.TV_SHOWS:
		
		sResultGenreUrl = Main.prefixURL + "/video/tvshow/group/tv_genre/";
		break;
		
	case FS_Category.COLLECTIONS:
		
		sResultGenreUrl = Main.prefixURL + "/audio/collections/group/music_genre/";
		break;
		
	case FS_Category.CONCERTS:
		
		sResultGenreUrl = Main.prefixURL + "/video/concerts/group/music_genre/";
		break;
		
	case FS_Category.ALBUMS:
		
		sResultGenreUrl = Main.prefixURL + "/audio/albums/group/music_genre/";
		break;
		     
		default:
			alert("Unknown category type");
			break;
	}
	
	return sResultGenreUrl;
};

FS_Genres.ClearMenuList = function()
{
	Main.handleActiv();
	for ( var h = 1; h <= 200; h++) 
	{
		widgetAPI.putInnerHTML(document.getElementById("str" + h), "");
	}
};

FS_Genres.HtmlGenresParser = function()
{
	var sOut;
	var index = 0;
	
	var obj = new Object();
	obj.names = new Array();
	obj.urls = new Array();
	obj.isFolders = new Array();
	obj.currIdx = 1;

	if (URLtoXML.xmlHTTP.status == 200)
	{
		sOut = URLtoXML.xmlHTTP.responseText;

		var arr = sOut.split('<ul class="b-list-links"');
		for (var i in arr) 
		{
			if(i > 0 && i < 5)
			{				
				var links = arr[i].split('<li >');
				var myRe;
				for (var j in links)
				{
					links[j] = URLtoXML.DelTrash(links[j]);

					myRe = new RegExp("\<a href=\"(.+)\"\>(.+)\<\/a\>","igm");
					if (name = myRe.exec(links[j]))
					{
						var goal = name.split(',');

						if(goal.length > 3)
						{
							var sStringForCut = new String(goal[0]);
							sStringForCut = sStringForCut.substring(0, sStringForCut.indexOf("</li>"));

							myRe = new RegExp("\<a href=\"(.+)\"\>(.+)\<\/a\>","igm");

							if (name = myRe.exec(sStringForCut))
							{
								goal = name.split(',');
							}
						}

						index++;

						obj.urls[obj.urls.length] = Main.prefixURL + goal[1];
						obj.names[obj.names.length] = goal[2];
						
						widgetAPI.putInnerHTML(document.getElementById("str" + index), goal[2]);
					}
				}
			}
		}

		if (obj.urls.length>0){
			URLtoXML.folders[URLtoXML.folders.length] = obj;
		}else{
			Main.playlist = 1;
		}
	}
};

FS_Genres.ShowGenresForCategory = function(nCategory)
{
	Main.hideLoading(1);
	FS_Genres.ClearMenuList();
	URLtoXML.SetHtmlParser(FS_Genres.HtmlGenresParser);
		
	document.getElementById("spisok").style.display = "none";
	document.getElementById("playlist").style.display = "block";
	document.getElementById("descript").style.display = "none";
		
	widgetAPI.putInnerHTML(document.getElementById("description"), "");	
	    
	if(Main.mnCurrentCategory == FS_Category.SOUND_TRACKS ||
	   Main.mnCurrentCategory == FS_Category.CONCERTS 	  ||
	   Main.mnCurrentCategory == FS_Category.COLLECTIONS  ||
	   Main.mnCurrentCategory == FS_Category.CLIPS        ||
	   Main.mnCurrentCategory == FS_Category.ALBUMS)
	{
		Main.mbInDevelopment = true;
		widgetAPI.putInnerHTML(document.getElementById("title"), '');
		widgetAPI.putInnerHTML(document.getElementById("str" + 1), "Раздел в разработке." +
				"<br><br>На текущий момент жанры не поддерживаются для:" +
				"<br>Саундтреков<br>Концертов<br>Сборников<br>Клипов<br>Альбомов" +
				"<br><br>Возвращайтесь позже.");
		URLtoXML.xmlHTTP = null;
		URLtoXML.mpHttpResponseParser = null;
	}
	else
	{
		URLtoXML.xmlHTTP = null;
		URLtoXML.Proceed(FS_Genres.GetGenreUrlForCategory(nCategory));
		
		widgetAPI.putInnerHTML(document.getElementById("title"), FS_CategoryWords[nCategory]);
	}

	Main.playlist = 1;
	Main.mbIsCategories = true;
	Display.help_line_for_genres_page();
};

FS_Genres.SelectGenre = function()
{
	var currIDX = URLtoXML.folders[URLtoXML.folders.length-1].currIdx-1;
	
	document.getElementById("spisok").style.display = "block";
	document.getElementById("playlist").style.display = "none";

	Main.handleActiv();
	for ( var h = 1; h <= 200; h++) 
	{
		widgetAPI.putInnerHTML(document.getElementById("str" + h), "");
	}

	Main.NewJanr(URLtoXML.folders[URLtoXML.folders.length-1].urls[currIDX], URLtoXML.folders[URLtoXML.folders.length-1].names[currIDX]);
	Main.mbIsCategories = false;	

	Main.playlist = 0;
	Display.help_line_1();
	
	if (URLtoXML.folders.length>0)
	{
		delete URLtoXML.folders[URLtoXML.folders.length-1];
		URLtoXML.folders.length--;
	}
};
