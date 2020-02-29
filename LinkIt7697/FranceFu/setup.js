var en_path = "https://fustyles.github.io/webduino/LinkIt7697/FranceFu/en.js";  //載入自訂積木英文語系設定檔
var zhhant_path = "https://fustyles.github.io/webduino/LinkIt7697/FranceFu/zh-hant.js";  //載入自訂積木繁體語系設定檔(預設繁體語系)
var blocks_path = "https://fustyles.github.io/webduino/LinkIt7697/FranceFu/blocks.js";   //載入自訂積木定義檔
var javascript_path = "https://fustyles.github.io/webduino/LinkIt7697/FranceFu/javascript.js";   //載入自訂積木轉出程式碼檔
var toolbox_path = "https://fustyles.github.io/webduino/LinkIt7697/FranceFu/toolbox.xml";  //讀取自訂積木目錄檔
initial(en_path, zhhant_path, blocks_path, javascript_path, toolbox_path);  //新增自訂積木

function initial(en_path, zhhant_path, blocks_path, javascript_path, toolbox_path) {
	addScript(zhhant_path);
	addScript(blocks_path);
	addScript(javascript_path);

	if ((document.getElementById('select-lang-en').checked)) {
		addScript(en_path);
		var xml = $.ajax({url: toolbox_path, async: false}).responseXML;
		xmlValue = '<xml id="toolbox">' + new XMLSerializer().serializeToString(xml.firstChild) + xmlValue.replace('<xml id="toolbox">',"");
		xmlValue = xmlValue.replace('name="FRANCEFU"','name="FranceFu"');  //更新自訂積木目錄英文名稱

		xmlValue = xmlValue.replace('name="customcode"','name="Custom Code"');  //更新自訂積木目錄英文名稱
		xmlValue = xmlValue.replace('name="module"','name="Module"');  //更新自訂積木目錄英文名稱
	} else {
		var xml = $.ajax({url: toolbox_path, async: false}).responseXML;
		xmlValue = '<xml id="toolbox">' + new XMLSerializer().serializeToString(xml.firstChild) + xmlValue.replace('<xml id="toolbox">',"");
		xmlValue = xmlValue.replace('name="FRANCEFU"','name="法蘭斯"');  //更新自訂積木目錄繁體中文名稱。init.js檔另存檔成UTF-8格式，否則無法顯示繁體中文。

		xmlValue = xmlValue.replace('name="customcode"','name="自訂程式碼"');  //更新自訂積木子目錄繁體中文名稱。
		xmlValue = xmlValue.replace('name="module"','name="模組"');  //更新自訂積木子目錄繁體中文名稱。
	}

	document.getElementById('toolbox').xml = new DOMParser().parseFromString(xmlValue,"text/xml").firstChild;
}

function addScript(url) {
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = url;
	$("body").append(s);
}