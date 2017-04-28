//Function Environment Checker and Control Browser ( Chrome or Mozilla )
function environmentalDetectionCallback(result) {
	if (result.detectorResult.browser.name == 'Chrome' || result.detectorResult.browser.name == 'Mozilla') {
		('use strict');

		// Put variables in global scope to make them available to the browser console.
		var video = document.querySelector('video');
		var canvas = (window.canvas = document.querySelector('canvas'));
		canvas.width = 200;
		canvas.height = 200;
		var photo = document.getElementById('photo');
		var button = document.querySelector('button');
		var result = document.getElementById('reponse');
		//Event For Click Recognize Button
		button.onclick = function() {
			canvas.width = 200;
			canvas.height = 200;
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
			//Take image base64 for PutOject from S3
			var base64 = canvas.toDataURL('image/jpeg');
			//Facecount for Amazon Result
			var faceCount = 0;
			//Json Body for Post Amazon
			var jsondata = { photo: base64 };
			$.post('http://localhost:8081/addPhotoDetectFace', jsondata, function(res) {
				if (res != null) {
					console.log(res);
					faceCount = res.FaceDetails.length;
					document.getElementById('analyzis').innerHTML =
						'Analyzis result should show up here... <br>Faces :' + faceCount + '<br>';
					if (faceCount == 0)
						document.getElementById('analyzis').innerHTML += 'Cant Analyze because no face image';
					else {
						$.each(res.FaceDetails, function(i, item) {
							if (faceCount == 1) {
								document.getElementById('analyzis').innerHTML += 'Gender :' + item.Gender.Value;
								//this a draw rectangle
								var c = document.getElementById('myCanvas');
								var ctx = c.getContext('2d');
								ctx.lineWidth = '2';
								ctx.strokeStyle = 'red';
								ctx.rect(
									item.Landmarks[13].X * 130,
									item.Landmarks[13].Y * 130,
									item.Landmarks[13].X * 70 + item.Landmarks[13].Y * 70,
									item.Landmarks[18].X * 80 + item.Landmarks[18].Y * 80
								);
								ctx.stroke();

								//end of draw rectangle
							} else {
								document.getElementById('analyzis').innerHTML +=
									i + 1 + '.Person Gender :' + res.FaceDetails[i].Gender.Value + '<br>';
								//this a draw rectangle
								var c = document.getElementById('myCanvas');
								var ctx = c.getContext('2d');
								ctx.lineWidth = '2';
								ctx.strokeStyle = 'red';
								ctx.rect(
									res.FaceDetails[i].Landmarks[13].X * 130,
									res.FaceDetails[i].Landmarks[13].Y * 130,
									res.FaceDetails[i].Landmarks[13].X * 70 + res.FaceDetails[i].Landmarks[13].Y * 70,
									res.FaceDetails[i].Landmarks[18].X * 80 + res.FaceDetails[i].Landmarks[18].Y * 80
								);
								ctx.stroke();

								//end of draw rectangle
							}
						});
					}
				}
			});
		};
		//End Button Click
		//Settings For Stream on Website
		var constraints = {
			audio: false,
			video: true,
		};
		//Start a stream
		function handleSuccess(stream) {
			window.stream = stream;
			video.srcObject = stream;
		}
		//Give error for a not allow webcam
		function handleError(error) {
			alert('To continue exercise please refresh the page and allow your webcam!');
		}
		navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
	} else {
		//if browser not a chrome or mozilla give a error
		alert('Please use Firefox or Chrome and be equipped by a webcam!');
	}
}
//Finish a environmen checker function

var _RealeyesitEnvDetectParams = _RealeyesitEnvDetectParams || {};
_RealeyesitEnvDetectParams._callback = environmentalDetectionCallback;
(function() {
	var envDetect = document.createElement('script');
	envDetect.type = 'text/javascript';
	envDetect.async = true;
	envDetect.src =
		'https://codesdwncdn.realeyesit.com/environment-checker/release/2.2.1/Realeyesit.EnvironmentalDetectionAPI.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(envDetect, s);
})();
