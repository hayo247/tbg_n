
// 숫자 포맷
function format_num(num){
	return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

// 숫자 포맷
function removeFormat_num(num){
	return num.toString().replace(/\,/g, "");
}

// 자평 계산
function calJa (n){
	var cut = n%300;
	var ja = Math.floor(n/300) + 1;
	if ( cut == 0){
		ja = ja - 1;
	}
	
	return ja;
}

function fn_layerPop(el, txt, focusEl){
	$("#pLayerTxt").text(txt);
	$(el).show();
	
	$(el).find('button.btn_close').click(function(){
		$(el).hide();
		
		if($(focusEl)){$(focusEl).focus();}
		return false;
	});
}

function isMobile(){
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}