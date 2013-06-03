var ScreenWidth = 960;
var ScreenHeight = 540;

var VideoWidth = 0;
var VideoHeight = 0;
var VideoDuration = 0;
var modeName="";

var Player = {
	plugin : null,
	state : -1,
	stopCallback : null,

	STOPPED : 0,
	PLAYING : 1,
	PAUSED : 2,
	FORWARD : 3,
	REWIND : 4,
	duration : 0,
    current_time : 0,
};

Player.init = function() {
	var success = true;
	this.state = this.STOPPED;
	this.plugin = document.getElementById("pluginPlayer");

        if (!this.plugin )
        {
        	Player.setWindow();
            success = false;
        }


	this.plugin.OnCurrentPlayTime = 'Player.setCurTime';
	this.plugin.OnStreamInfoReady = 'Player.OnStreamInfoReady';
	this.plugin.OnBufferingStart = 'Player.onBufferingStart';
	this.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
	this.plugin.OnBufferingComplete = 'Player.onBufferingComplete';

	return success;
};
Player.onBufferingComplete = function() 
{
   alert("onBufferingComplete");
};   

Player.onBufferingProgress = function(percent)
{
	//Display.statusLine ("Buffering "+percent+"%");
	alert ("buffering progress = "+percent);
};
Player.onBufferingStart =function()
{
	alert ("buffering start");
};
Player.deinit = function()
{
	if (this.plugin)
		this.plugin.Stop();
//	if(this.mwPlugin != null)  this.mwPlugin.SetMediaSource(this.originalSource);
};


// переключение типа полноэкранного режима, значения от 1 до 3
Player.setScreenMode = function(modesize) {
	if (VideoWidth <= 0 || VideoHeight <= 0) {return -1;}

	var wCorr = VideoWidth < (VideoHeight * 4 / 3) ? VideoHeight * 4 / 3 : VideoWidth ;
	
	var crop = {
		x : 0,
		y : 0,
		w : VideoWidth ,
		h : VideoHeight
	};
	var disp = {
		x : 0,
		y : 0,
		w : ScreenWidth,
		h : ScreenHeight
	};
 
  //  var result = modesize;//((!modesize) ? 1 : modesize) + "";
   
	switch (modesize) {
	case 1:
		if ( VideoWidth/VideoHeight < 16/9 ) {
			modeName="FullScreen 4x3.";
			var h1 = wCorr * 9 / 16;
			crop = {
				x : 0,
				y : parseInt( (VideoHeight - h1) / 2),
				w : VideoWidth ,
				h : parseInt(h1)
			};
		} else {
			modeName="FullScreen 16x9.";
			var w1 = VideoHeight * 16 / 9;
			crop = {
				x : parseInt( (VideoWidth - w1) / 2),
				y : 0,
				w : parseInt(w1),
				h : VideoHeight
			};
		}
		break;
	case 2:
		if (VideoWidth/VideoHeight < 16/9 ) {
			modeName="Original 4x3.";
			var h1 = ScreenHeight;
			var w1 = h1 * wCorr / VideoHeight;
			var x = (ScreenWidth - w1) / 2;
			if (x < 0)
				x = 0;
			disp = {
				x : parseInt(x),
				y : 0,
				w : parseInt(w1),
				h : parseInt(h1)
			};
		} else {
			modeName="Original 16x9.";
			var w1 = ScreenWidth;
			var h1 = w1 * VideoHeight / VideoWidth;
			var y = (ScreenHeight - h1) / 2;
			if (y < 0)
				y = 0;
			disp = {
				x : 0,
				y : parseInt(y),
				w : parseInt(w1),
				h : parseInt(h1)
			};
		}
		;
		break;
	case 3:
		modeName="FullScreen 14x9.";
		crop = {
			x : 0,
			y : parseInt(0.0625 * VideoHeight),
			w : VideoWidth ,
			h : parseInt(0.875 * VideoHeight)
		};
		break;
		
/*	case "4":
		modeName="Mode-4 16x9 Zoom.";
		crop = {
			x: parseInt(0.0625* VideoWidth),
			y: parseInt(0.0625* VideoHeight),
			w: parseInt(0.875 * VideoWidth),
			h: parseInt(0.875 * VideoHeight),
		};
		break;
	case "5":
		modeName="Mode-5 Zoom.";
		crop = {
			x : 80,
			y : 80,
			w : VideoWidth  - 160,
			h : VideoHeight - 160
		};
		break;
		*/
	default:
		break;
}
	this.plugin.SetCropArea(crop.x, crop.y, crop.w, crop.h);
	this.plugin.SetDisplayArea(disp.x, disp.y, disp.w, disp.h);
	
	currentStatusLineText = modeName;//+" Video: "+VideoWidth+"x"+VideoHeight+"("+parseInt(1000*VideoWidth/VideoHeight)/1000 +") wCorr:"+wCorr +" ***** Dx:"+disp.x+" Dy:"+disp.y+" Dw:"+disp.w+" Dh:"+disp.h+ " ***** Cx:" + crop.x+ " Cy:" + crop.y+ " Cw:" + crop.w+ " Ch:" + crop.h+" modesize="+modesize;
	Display.statusLine (currentStatusLineText);

	if (this.state == this.PAUSED) {this.plugin.Pause();}
//	return result;
};

Player.playVideo = function() // играть
{
	pluginAPI.unregistKey(tvKey.KEY_TOOLS);
	
	this.state = this.PLAYING;
	Main.setFullScreenMode();
	this.plugin.Play(url);
//	Display.showplayer();
	
//	Player.setFullscreen();
//	this.plugin.SetDisplayArea(0, 0, ScreenWidth, ScreenHeight);
//	Display.statusLine ( "VideoWidth: "+VideoWidth+" VideoHeight:"+VideoHeight);
};
Player.setWindow = function() // видео скрыто
{this.plugin.SetDisplayArea(0, 0, 0, 0); };

Player.setFullscreen = function() // полноэкранный режим
{this.plugin.SetDisplayArea(0, 0, ScreenWidth, ScreenHeight);};

Player.pauseVideo = function() // пауза
{
	this.state = this.PAUSED;
	this.plugin.Pause();
	Display.showplayer();
	document.getElementById("but_pause").style.display="block";
	document.getElementById("but_play").style.display="none";
};

Player.stopVideo = function() // стоп
{
	// Display.setTime(0);
	if (this.state != this.STOPPED) {
		pluginAPI.registKey(tvKey.KEY_TOOLS);
		
		this.plugin.Stop();
		this.state = this.STOPPED;
		if (this.stopCallback) {
			// this.stopCallback();
		}
//		Main.setWindowMode(); 
//		document.getElementById("main").style.display = "block";
//		Display.hideplayer();
	}
};

Player.resumeVideo = function() // стоп кадр
{
	this.state = this.PLAYING;
	this.plugin.Resume();
    Display.showplayer();
	document.getElementById("but_pause").style.display="none";
	document.getElementById("but_play").style.display="block";
};

Player.getState = function() // текущее состояние
{
	return this.state;
};

Player.skipForwardVideo = function() {

	this.skipState = this.FORWARD;
	this.plugin.JumpForward(30);
	Display.showplayer();
};

Player.skipForwardVideoFast = function() {

	this.skipState = this.FORWARD;
	this.plugin.JumpForward(120);
	Display.showplayer();
};

Player.skipBackwardVideo = function() {

	this.skipState = this.REWIND;
	this.plugin.JumpBackward(30);
	Display.showplayer();
};

Player.skipBackwardVideoFast = function() {

	this.skipState = this.REWIND;
	this.plugin.JumpBackward(120);
	Display.showplayer();
};

Player.PercentJump = function(percent) {
	this.statusmessage = percent*10 + "%";
	var jump_to_minutes = Math.round((VideoDuration*percent/10)/1000);
	if (jump_to_minutes > 0) this.plugin.JumpForward(jump_to_minutes); 
	if (jump_to_minutes < 0) this.plugin.JumpBackward(jump_to_minutes*-1);
	widgetAPI.putInnerHTML(Display.statusDiv,(this.statusmessage));
	Display.showplayer();
};

// функция таймера проигрывания трека, вызывается плагином:
// plugin.OnCurrentPlayTime
	Player.setCurTime = function(time) {
	Display.setTime(time);
};

// функция размера трека, вызывается плагином: plugin.OnStreamInfoReady
Player.OnStreamInfoReady = function() {
	alert("OnStreamInfoReady");
	VideoDuration = Player.plugin.GetDuration();
	VideoWidth = Player.plugin.GetVideoWidth();
	VideoHeight = Player.plugin.GetVideoHeight();
	Display.setTotalTime(VideoDuration);
	Player.setScreenMode (currentFSMode);
};