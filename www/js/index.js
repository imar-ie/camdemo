//hold the file dir - is this needed ?
var fileDir;

//the image storage dir
var contentDir;

// target id
function id(element) {
	return document.getElementById(element);
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

	//get the os
	var devicePlatform = device.platform;

	//set the corntent dir per os
	if (devicePlatform == 'iOS') {
		contentDir = cordova.file.documentsDirectory;// + 'images/';
	}

	if (devicePlatform == 'Android') {
		contentDir = cordova.file.dataDirectory;//+ 'images/';
	}

}

function id(element) {
	return document.getElementById(element);
}

// take photo

function takePhoto() {

	navigator.camera.getPicture(onCamSuccess, onCamFail, {
		quality : 50,
		destinationType : Camera.DestinationType.FILE_URI,
		saveToPhotoAlbum : true
	});

}

function viewImages() {

	window.location = 'view.html';

}

function savePhoto() {

	var fileName = document.getElementById('name').value;

	if (fileName == '') {//no file name entered

		alert("Please enter a name for this image");

	} else {

		//move the image to the popper location
		var tmpFile = document.getElementById('tmpFile').value;

		moveToContentDir(tmpFile, fileName);
	}

}

function onCamSuccess(imageURI) {

	var image = document.getElementById('myImage');

	// set and show the preview image

	var previewSect = document.getElementById('previewSect');

	previewSect.style.display = 'block';

	var previewImage = document.getElementById('previewImage');

	// Show the captured photo.
	previewImage.src = imageURI;

	//save the tmp fileref

	var tmpFile = document.getElementById('tmpFile');

	tmpFile.value = imageURI;

}

function onCamFail(message) {
	alert('Failed because: ' + message);
}

function moveToContentDir(fileUri, fileName) {

	//alert(contentDir);
	window.resolveLocalFileSystemURL(fileUri, function(fileEntry) {

		// get the file extn
		fileExt = "." + fileUri.split('.').pop();

		//set the bnew/dest file name

		newFileName = fileName + fileExt;

		window.resolveLocalFileSystemURL(contentDir, function(dirEntry) {
			
			// move the file to a new directory and rename it
			fileEntry.moveTo(dirEntry, newFileName, onMoveSuccess, onMoveFail);

		}, onMoveFail);
	}, onMoveFail);
}

function onMoveFail(message) {
	alert('Move failed because: ' + JSON.stringify(message));
}

function onMoveSuccess(message) {
	//alert('move suck cess ' + message);

	var previewSect = document.getElementById('previewSect');

	//hide the preview section
	previewSect.style.display = 'none';

	// show sucess message
	alert("Image saved to project");

}

/*
 * view image page
 */

function loadImages() {

	window.resolveLocalFileSystemURL(contentDir, fsSuccess, fsFail);

	function fsSuccess(dirEntry) {
		console.log("fs success");

		// create reader
		var directoryReader = dirEntry.createReader();

		// Get a list of all the entries in the directory
		directoryReader.readEntries(readDirSuccess, readDirFail);

	}

	function fsFail() {
		console.log("fs fail");

	}

}

function readDirSuccess(entries) {

	var imageCont = document.getElementById('imageCont');

	// i would loop throught these and append to a dom element
	// with jquery you can use - http://api.jquery.com/append/

	var i;
	for ( i = 0; i < entries.length; i++) {
		
		if(entries[i].isFile){// chek if is file and not a dir
			
		console.log(entries[i].name);

		imageCont.innerHTML += '<img src="' + contentDir + entries[i].name + '" width=250/><br>';

		imageCont.innerHTML += entries[i].name + "<hr>";

		//$("#imageCont").append(entries[i].name);
		}
	
	}
}

function readDirFail(error) {
	alert("Failed to list directory contents: " + error.code);
}



