var Favorites = {
	items: new Array(),
	isVisible: false,
	kolPages: 1,
};

Favorites.open = function() {
	Favorites.readAll();
	Main.clearBlocks();
	Main.page = 0;
	Display.help_line_4();
	this.isVisible = true;
	widgetAPI.putInnerHTML(document.getElementById("janr"), 'Избранное');
	Favorites.showItems();
};

Favorites.addLine = function() {
	var obj = new Object();
		
	obj.url = URLtoXML.UrlSt[Main.index];
	obj.name = URLtoXML.sName[Main.index];
	obj.img = URLtoXML.ImgDickr[Main.index];
//	obj.descr = URLtoXML.pDes[Main.index];
	
	var isAdd = true;
	for(var i=0; i<this.items.length && isAdd; i++)
		if (this.items[i].url==obj.url)
			isAdd = false;

	if (isAdd) this.items[this.items.length] = obj;
};

Favorites.writeAll = function() {
	var fileSystemObj = new FileSystem();
	if (!fileSystemObj.isValidCommonPath(curWidget.id)) fileSystemObj.createCommonDir(curWidget.id);
    var fileObj = fileSystemObj.openCommonFile(curWidget.id+'/fs_fav.data','w');
    if (fileObj)
    {
        var str = JSON.stringify(this.items);
		fileObj.writeAll(str);
        fileSystemObj.closeCommonFile(fileObj);
    }
};

Favorites.readAll = function() {	
	var fileSystemObj = new FileSystem();
	var fileObj = fileSystemObj.openCommonFile(curWidget.id+'/fs_fav.data','r');
	if (fileObj){
		var strResult = fileObj.readAll();
		if (strResult)
			this.items = JSON.parse(strResult);
		fileSystemObj.closeCommonFile(fileObj);
	}
	kolPages = Math.round(this.items/15);
};

Favorites.showItems = function() {
	if (this.items.length>0)
		for (var i=Main.page*15; i<this.items.length && i<(Main.page+1)*14+1; i++){
			
			if (this.items[i].descr){ delete this.items[i].descr; }
			
			URLtoXML.ImgDickr[i+1-Main.page*15] = this.items[i].img;
			URLtoXML.UrlSt[i+1-Main.page*15] = this.items[i].url;
			URLtoXML.sName[i+1-Main.page*15] = this.items[i].name;
			URLtoXML.pDes[i+1-Main.page*15] = '';
			
			if (URLtoXML.sName[Main.index]){
				widgetAPI.putInnerHTML(document.getElementById("title"), URLtoXML.sName[Main.index])
			}else{
				widgetAPI.putInnerHTML(document.getElementById("title"), '')
			}
			widgetAPI.putInnerHTML(document.getElementById("bloc" + (i+1-Main.page*15)), "<img class='blockImage' id='imgst" + (i+1-Main.page*15) +  "';  src='" + URLtoXML.ImgDickr[i+1-Main.page*15] + "' />");
			if (document.getElementById("imgst" + Main.index))
				document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF"; // активная строка
		}
};

Favorites.add  = function(){
	Favorites.readAll();
	Favorites.addLine();
	Favorites.writeAll();
	Display.statusLine("Добавленно в избранное");
};

Favorites.del = function(){
	Favorites.readAll();
	Favorites.delLine();
	Favorites.writeAll();
	Main.clearBlocks();
	Favorites.showItems();
	Display.statusLine("Удалено из избранного");
};

Favorites.delLine = function(){
/*	for(var i=0; i<this.items.length; i++)
		if (this.items[i].url==URLtoXML.UrlSt[]){
			this.items.splice(i, 1);
			break;
		}
*/
	this.items.splice(Main.index+Main.page*15-1, 1);
	if (this.items.length<=(Main.page*15) && Main.page>0) Main.page--;
};

Favorites.changePage = function() {
	var idx = Main.index;
	Main.clearBlocks();
	Main.index = idx;
	Favorites.showItems();
	if (this.items.length>(Main.page*15)){
		return 1;
	}else{
		if (Main.page>0) Main.page--;
		Favorites.showItems();
		return 0;
	}
}
