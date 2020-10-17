document.write('<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>');
document.write('<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script>');
document.write('<div id="region_teachablemachine" style="z-index:999"><video id="gamevideo_teachablemachine" width="320" height="240" style="position:absolute;visibility:hidden;" preload autoplay loop muted></video><img id="gameimg_teachablemachine" style="position:absolute;visibility:hidden;" crossorigin="anonymous"><canvas id="gamecanvas_teachablemachine"></canvas><br><select id="mirrorimage_teachablemachine" style="position:absolute;visibility:hidden;"><option value="1">Y</option><option value="0">N</option></select><select id="opacity_teachablemachine" style="position:absolute;visibility:hidden;"><option value="1">1</option><option value="0.9">0.9</option><option value="0.8">0.8</option><option value="0.7">0.7</option><option value="0.6">0.6</option><option value="0.5">0.5</option><option value="0.4">0.4</option><option value="0.3">0.3</option><option value="0.2">0.2</option><option value="0.1">0.1</option><option value="0">0</option></select><input type="text" id="modelPath_teachablemachine" value="" style="position:absolute;visibility:hidden;"><br><div id="gamediv_teachablemachine" style="color:red"></div></div>');
document.write('<div id="teachablemachineState" style="position:absolute;display:none;">1</div>');
document.write('<div id="sourceId_teachablemachine" style="position:absolute;display:none;"></div>');

window.onload = function () {
	var video = document.getElementById('gamevideo_teachablemachine');
	var canvas = document.getElementById('gamecanvas_teachablemachine');
	var context = canvas.getContext('2d');
	var mirrorimage = document.getElementById("mirrorimage_teachablemachine");
	var result = document.getElementById('gamediv_teachablemachine');
	var modelPath = document.getElementById('modelPath_teachablemachine');
	let Model;
	var sourceTimer;
	
	loadModel();
	async function loadModel() {
		if (modelPath.value=="") {
			result.innerHTML = "Please input model path.";
			return;
		}
		const URL = modelPath.value;
		const modelURL = URL + "model.json";
		const metadataURL = URL + "metadata.json";
		Model = await tmImage.load(modelURL, metadataURL);
		maxPredictions = Model.getTotalClasses();
		result.innerHTML = "";
		sourceTimer = setInterval(
			function(){
				var source = document.getElementById("sourceId_teachablemachine");
				if (source.innerHTML!="") {
					clearInterval(sourceTimer);
					setTimeout(function(){DetectVideo(document.getElementById(source.innerHTML))}, 3000);
				}				
			}
		, 100);	  
	}

	async function DetectVideo(obj) {
		obj.style.width = obj.width + 'px';
		obj.style.height = obj.height + 'px';		
		canvas.setAttribute("width", obj.width);
		canvas.setAttribute("height", obj.height);
		canvas.style.width = obj.width+"px";
		canvas.style.height = obj.height+"px";

		if (mirrorimage.value==1) {
			context.translate((canvas.width + obj.width) / 2, 0);
			context.scale(-1, 1);
			context.drawImage(obj, 0, 0, obj.width, obj.height);
			context.setTransform(1, 0, 0, 1, 0, 0);
		}
		else
			context.drawImage(obj, 0, 0, obj.width, obj.height);

		if (document.getElementById('teachablemachineState').innerHTML=="0") {
			result.innerHTML = "";
			setTimeout(function(){DetectVideo(obj);}, 250);
			return;
		}

		var data = "";
		const prediction = await Model.predict(canvas);
		if (maxPredictions>0) {
			for (let i = 0;i < maxPredictions;i++)
				data += prediction[i].className + "," + prediction[i].probability.toFixed(2) + "<br>";
			result.innerHTML = data;
			if (result.innerHTML!="")
				result.innerHTML = result.innerHTML.substr(0,result.innerHTML.length-4);
		}
		else
			result.innerHTML = "";

		setTimeout(function(){DetectVideo(obj);}, 250);
	}
}
