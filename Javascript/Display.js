var Display =
{
            status_vol_timer : null,
            status_line_timer : null,
            
            statusVolSpan : null,
            statusLineSpan : null,
            
            status1_timer : null,
            status1Div : null,
            index : 1, 
            run: 0,
            totalTime : 0,
            time : 0,

};


Display.init = function()
{
    var success = true;
    this.status1Div = document.getElementById("status1");
    this.statusVolSpan = document.getElementById("status_vol_span");
    this.statusLineSpan = document.getElementById("status_line_span");

    if (!this.statusVolSpan&&!this.status1Div&&!this.statusLineSpan)
    {
        success = false;
    }
    
    return success;
};
  
/////////////////////// STATUS LINE///////////////////////////////////

Display.statusLine = function(param_string)
{   
	document.getElementById("statusline").style.display="block";
    widgetAPI.putInnerHTML(this.statusLineSpan, param_string);
	clearTimeout(this.status_line_timer);
	Display.statusLineTimer();
};
Display.statusLineTimer = function()
{
	this.status_timer=setTimeout("Display.hideStatusLine()",4000);
};

Display.hideStatusLine = function()
{
	document.getElementById("statusline").style.display="none";
};
/////////////////////// STATUS LINE ///////////////////////////////////

/////////////////////// STATUS VOLUME /////////////////////////////////
/*
Display.setVolume = function()
{
	var volume = Audio.getVolume();
	Display.status("<span>ГРОМКОСТЬ " + volume + "</span>");
};

Display.statusMute = function()
{   
	document.getElementById("statusvol").style.display="block";
    widgetAPI.putInnerHTML(this.statusVolSpan, "<span>ГРОМКОСТЬ ВЫКЛ</span>");
	clearTimeout(this.status_vol_timer);
};
Display.status = function(status)
{   
	document.getElementById("statusvol").style.display="block";
    widgetAPI.putInnerHTML(this.statusVolSpan, status);
	clearTimeout(this.status_vol_timer);
	Display.statusVolTimer();
};
Display.hideStatusVol = function()
{
	document.getElementById("statusvol").style.display="none";
};
Display.statusVolTimer = function()
{
	this.status_vol_timer=setTimeout("Display.hideStatusVol()",2000);
};
*/
/////////////////////// STATUS VOLUME /////////////////////////////////

Display.hidemenu = function()
{
	document.getElementById("main").style.display="none";
};

Display.showmenu = function()
{
	document.getElementById("main").style.display="block";
};


Display.hideplayer = function()
{
	document.getElementById("player").style.display="none";
	
	if(Player.state == Player.PLAYING)
	{
		
		document.getElementById("help_navi_l_player").style.display="none";
		document.getElementById("help_navi_player").style.display="block";
	}
};


Display.showplayer = function()
{
                    
                  
    if(Player.state == Player.PLAYING || Player.state == Player.PAUSA)
	{
		document.getElementById("help_navi_l_player").style.display="none";
		document.getElementById("help_navi_player").style.display="block";
		document.getElementById("infoMovi").style.display="block";
              }                  
     if(Player.state == Player.PAUSA)
	{
		document.getElementById("but_pause").style.display="none";
		document.getElementById("but_play").style.display="block";
		document.getElementById("statusbar").style.display="";
		                       
              }      
    if(Player.state == Player.PLAYING_LIVE)
	{
		document.getElementById("help_navi_l_player").style.display="block";
		document.getElementById("help_navi_player").style.display="none";
		document.getElementById("infoMovi").style.display="none";
		
	}
	clearTimeout(this.infobar_timer);
	document.getElementById("player").style.display="block";
       	
	if(Player.state != Player.PAUSA && Main.StreamMode != "http.mp3")
	     Display.infobarTimer();
	
};
	
Display.infobarTimer = function()
{
	this.infobar_timer=setTimeout("Display.hideplayer()",4000);
};




Display.status1 = function(status1)
{
	document.getElementById("statusbar1").style.display="block";
    widgetAPI.putInnerHTML(this.status1Div, status1);
	clearTimeout(this.status1_timer);
	Display.status1Timer();
};


Display.hidestatus1 = function()
{
	document.getElementById("statusbar1").style.display="none";
};



Display.status1Timer = function()
{
	this.status1_timer=setTimeout("Display.hidestatus1()",2000);
};

Display.setTotalTime = function(total) {this.totalTime = total;};
Display.setTime = function(time)
{
	var timePercent =(100 * time) / this.totalTime;
	var Barwidth = Math.floor(timePercent*6.4);
	var timeHTML = "";
	var timeHour = 0;
	var timeMinute = 0;
	var timeSecond = 0;
	var totalTimeHour = 0; 
	var totalTimeMinute = 0; 
	var totalTimeSecond = 0;
	document.getElementById("progressBar").style.width = Barwidth + "px";
	if(Player.state == Player.PLAYING || Player.state == Player.PAUSA )
	{
		totalTimeHour = Math.floor(this.totalTime/3600000);
		timeHour = Math.floor(time/3600000);
		totalTimeMinute = Math.floor((this.totalTime%3600000)/60000);
		timeMinute = Math.floor((time%3600000)/60000);
		totalTimeSecond = Math.floor((this.totalTime%60000)/1000);
		timeSecond = Math.floor((time%60000)/1000);
		timeHTML = timeHour + ":";
		if(timeMinute == 0)
			timeHTML += "00:";
		else if(timeMinute <10)
			timeHTML += "0" + timeMinute + ":";
		else
			timeHTML += timeMinute + ":";
		if(timeSecond == 0)
			timeHTML += "00/";
		else if(timeSecond <10)
			timeHTML += "0" + timeSecond + "/";
		else
			timeHTML += timeSecond + "/";

		timeHTML += totalTimeHour + ":";
		if(totalTimeMinute == 0)
			timeHTML += "00:";
		else if(totalTimeMinute <10)
			timeHTML += "0" + totalTimeMinute+":";
		else
			timeHTML += totalTimeMinute+":";
		if(totalTimeSecond == 0)
			timeHTML += "00";
		else if(totalTimeSecond <10)
			timeHTML += "0" + totalTimeSecond;
		else
			timeHTML += totalTimeSecond;
		
		if (totalTimeMinute != 0) {
			if (timeSecond >= totalTimeSecond && timeMinute >= totalTimeMinute
					&& timeHour >= totalTimeHour) {
				Player.stopVideo();
				timeHTML = "0:00:00 / 0:00:00";
				setTimeout("Display.Timeout()", 3000);

			}
		}
	}
	else {
		timeHTML = "0:00:00/0:00:00";	
	}
	
	document.getElementById("timeInfo").innerHTML=timeHTML;
};
Display.Timeout = function() {
	if (b<URLtoXML.pUrlSt.length-1){
		Main.selectNextVideo(); // переключение на след. трек
		url = URLtoXML.pUrlSt[b];
		Main.handlePlayKey(url); // играть
	}else{
		Player.stopVideo();
		Main.setWindowMode();
	}
};
//////////////////////////////////////////////////
//////////////// help_lines
Display.help_line_1 = function(){
	
	document.getElementById("help_line_2").style.display="none";
	document.getElementById("help_line_2_1").style.display="none";
	document.getElementById("help_line_3").style.display="none";
	document.getElementById("help_line_4").style.display="none";
	document.getElementById("help_line_5").style.display="none";
	document.getElementById("help_line_1").style.display="block";
};
Display.help_line_2 = function(){
	document.getElementById("help_line_1").style.display="none";
	document.getElementById("help_line_2_1").style.display="none";
	document.getElementById("help_line_3").style.display="none";
	document.getElementById("help_line_4").style.display="none";
	document.getElementById("help_line_5").style.display="none";
	document.getElementById("help_line_2").style.display="block";
};
Display.help_line_2_1 = function(){
	document.getElementById("help_line_1").style.display="none";
	document.getElementById("help_line_2").style.display="none";
	document.getElementById("help_line_3").style.display="none";
	document.getElementById("help_line_4").style.display="none";
	document.getElementById("help_line_5").style.display="none";
	document.getElementById("help_line_2_1").style.display="block";
};
Display.help_line_3 = function(){
	document.getElementById("help_line_1").style.display="none";
	document.getElementById("help_line_2").style.display="none";
	document.getElementById("help_line_2_1").style.display="none";
	document.getElementById("help_line_4").style.display="none";
	document.getElementById("help_line_5").style.display="none";
	document.getElementById("help_line_3").style.display="block";
};

Display.help_line_4 = function(){
	document.getElementById("help_line_1").style.display="none";
	document.getElementById("help_line_2").style.display="none";
	document.getElementById("help_line_2_1").style.display="none";
	document.getElementById("help_line_3").style.display="none";
	document.getElementById("help_line_5").style.display="none";
	document.getElementById("help_line_4").style.display="block";
};
Display.help_line_5 = function(){
	document.getElementById("help_line_1").style.display="none";
	document.getElementById("help_line_2").style.display="none";
	document.getElementById("help_line_2_1").style.display="none";
	document.getElementById("help_line_3").style.display="none";
	document.getElementById("help_line_4").style.display="none";
	document.getElementById("help_line_5").style.display="block";
};