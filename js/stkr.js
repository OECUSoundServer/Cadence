$(function(){
	var body=$("body");
	var flag=true;
	
	$(document).on("mousemove",function(e){
		if(flag){
			var x=e.clientX;
			var y=e.clientY;

			var shine=$("<p>").attr("class","shine");
			shine.css({
				"top":y+"px",
				"left":x+"px"
			});
			body.prepend(shine);
			setTimeout(function(){
				shine.remove();
			},500);
			
			flag=false;
			
			setTimeout(function(){
				flag=true;
			},300);
		}
	});
});