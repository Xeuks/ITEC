function loadSite(site){
	var siteToLoad = '404.html';
	var onLoad = function(){};
	switch(site)
	{
		case 'Canvas':
			siteToLoad = "Canvas.html"
			onLoad = function() {
				var FPS = 1000 / 60;
				$(document).ready(function(){
					var sim = new Simulation(new CanvasRenderer());
					sim.init();
					
					setInterval(function(){ sim.loop(); },FPS);
				});
			}
			break;
			
		case 'Ajax':
			siteToLoad = "Ajax.html"
			break;
			
		case 'Form':
			siteToLoad = "Form.html"
			break;
	}
	
	$( "#content" ).load( siteToLoad, onLoad);
}