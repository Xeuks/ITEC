function changeActiveStyleSheet(title) {
	var currentStyle = $.cookie("currentStyle");
	
	if(currentStyle != title)
	{

		activateStyleSheet(title);
		$.cookie("currentStyle", title);
	}
}

function applyStartStyleSheet()
{
	console.log($.cookie("currentStyle"));
	activateStyleSheet($.cookie("currentStyle"));
}

function activateStyleSheet(title) {
	if(title == null)
		title = 'default';

	var i, a, main;
	linkElements = document.getElementsByTagName("link");
	for(i=0; i< linkElements.length ; i++) {
		if( linkElements[i].getAttribute("rel").indexOf("style") != -1 && linkElements[i].getAttribute("title")) {
			linkElements[i].disabled = (linkElements[i].getAttribute("title") != title); 
		}
	} 
}

function showStyleMenu() {
    document.getElementById("styleMenu").style.display = "block";
    document.getElementById("styleButton").style.display = "none";
}
function closeStyleMenu() {
    document.getElementById("styleMenu").style.display = "none";
    document.getElementById("styleButton").style.display = "block";
}
