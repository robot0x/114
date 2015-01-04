$(document).ready(function() {
	if($(window).width()<364){
		$('.quicklink li h3').css('margin','0 0 .2em 0');
		$('.quicklink li p').css('width','5em')
	}
});

$('#search_input').focus(function() {
	$('.search-record').css('display','block');
	$('.screen').css('display','block');
	$(this).css('width','82%'); 
	if($(this).val().length){
		$('.cancel_btn').removeAttr('style');
 		$('#search_btn').css('display','block');
	}
	else{
		$('#search_btn').removeAttr('style');
		$('.cancel_btn').css('display','block');
	}
});
$('#search_input').blur(function() {
	$('.search-record').removeAttr('style');
	$('.screen').removeAttr('style');
	if(!$(this).val().length){
		$('.cancel_btn').removeAttr('style');
		$('#search_btn').removeAttr('style');
		$(this).removeAttr('style');
	}
});
$('#search_input').bind('input propertychange', function() {
	if($(this).val().length){
		$('.cancel_btn').removeAttr('style');
 		$('#search_btn').css('display','block');
	}
	else{
		$('#search_btn').removeAttr('style');
		$('.cancel_btn').css('display','block');
	}
});

$('.procity .listview .collapsed').click(function(event) {
	event.preventDefault();
	if($(this).hasClass('expand')){
		$(this).removeClass('expand');
		$(this).next('.collapsed-content').removeAttr('style');
	}
	else{
		$(this).addClass('expand');
		$(this).next('.collapsed-content').css('display','block');
	}
});
