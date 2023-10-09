$(function(){
	$("#btnHelp").click(function(){
		$("#slide01").prop('checked', true);
		fn_layerPop($("#helpPopup"));
	});

	$("#btnPayOk").click(function(){
		fn_initStep1("ALL");
		fn_initStep2();
	});


	$("[name='topGroup']").click(function(){
        fn_moveTopPage();
	});
    
	$("#btnPrev").click(function(){
		fn_prevPage();
	});
	
	$("#btnNext").click(function(){
		fn_nextPage();
	});
	
	$(".step1 .selectbox .div_radio").change(function(){
		fn_setImg();
		fn_initStep1($(this).parent('.selectbox').attr('id'));
	});	

	$("#shape").change(function(){
		if("0" == $(this).val()){
			$("._divCircle").hide();
			$("#divCornerSize").hide();
			$("._divSquare").show();
			$("#diameter").val("");
		}else{
			$("._divSquare").hide();
			$("._divCircle").show();
			$("#height").val("");
			$("#width").val("");
			$('#position').val('').prop("selected",true);
			$('#size').val('').prop("selected",true);
		}
	});	
	
	$("#position").change(function(){
		if("" == $(this).val() || "0" == $(this).val()){
			$("#divCornerSize").hide();
			$('#size').val('').prop("selected",true);
		} else{
			$("#divCornerSize").show();
		}
	});
	
	$("#step1_4 input, #step1_4 select").change(function(){
		fn_calPrice();
	});

	$("#width, #height").keyup(function(){
		$(this).val(parseInt($(this).val().replace(/[^0-9]/g, "")));
		
		// 거울 : 가로 X 세로 : 2400 * 1200 / 1200 * 2400 , 최소값 : 100mm
		if(parseInt($('#width').val().replace(/[^0-9]/, '')) > 2400){
			fn_layerPop($("#alertPopup"), '선택하신 거울의 최대 가로 폭은 2400mm 를 초과하실 수 없습니다.');
			$('#width').val("2400");
		}
		
		if( parseInt($('#width').val().replace(/[^0-9]/, '')) > 1200
		 && parseInt($('#height').val().replace(/[^0-9]/, '')) > 1200){
			fn_layerPop($("#alertPopup"), '선택하신 거울의 최대 길이는 1200mm 를 초과하실 수 없습니다.');
			$('#height').val("1200");
		}
		
		if(parseInt($('#height').val().replace(/[^0-9]/, '')) > 2400){
			fn_layerPop($("#alertPopup"), '선택하신 거울의 최대 길이는 2400mm 를 초과하실 수 없습니다.');
			$('#height').val("2400");
		}
		fn_calPrice();
	});
	
	$('#diameter').keyup(function(){
		$(this).val(parseInt($(this).val().replace(/[^0-9]/g, "")));
		
		if(parseInt($('#diameter').val().replace(/[^0-9]/, '')) > 1500){
			fn_layerPop($("#alertPopup"), "선택하신 거울의 최대 지름은 1500mm 를 초과하실 수 없습니다.");
			$('#diameter').val("1500");
		}
		
		$("#width").val($(this).val());
		$("#height").val($(this).val());
		fn_calPrice();
	});
	
	$("#chkBasketAll").change(function(){
		if($(this).prop('checked')){
			$("#tbBasket input[type='checkbox']").prop('checked', true);
		}else{
			$("#tbBasket input[type='checkbox']").prop('checked', false);
		}
	});
	
	$("#btnDelteTr").click(function(){
		fn_deleteHtmlStep2();
	});

	$("#btnFullTxt").click(function(){
		if($("#individualTxt:visible").length > 0 ){
			$("#individualTxt").hide();
		}else{
			$("#individualTxt").show();
		}
	});

});

function fn_initStep1(step){
	if("ALL" == step){
		$("[name='glassTp1']").prop('checked', false);
	}
		
	if('ALL|step1_1'.indexOf(step) > 0){
		$("[name='glassTp2']").prop('checked', false);
	}
	
	if('ALL|step1_1|step1_2'.indexOf(step) > 0){
		$("#step1_3").html('');
	}
	
	if('ALL|step1_1|step1_2|step1_3'.indexOf(step) > 0){
		$("#shape").val('0');
		$("#height").val('');
		$("#width").val('');
		$("#diameter").val('');
		$("#quantity").val("1");
		$("[name='sheet'][value='0']").prop('checked', true);
		$("._divCircle").hide();
		$("._divSquare").show();
		$("#divCornerSize").hide();
		$('#position').val('').prop("selected",true);
		$('#size').val('').prop("selected",true);
		$("#iptPrice").val('0');
	}
}

function fn_initStep2(){
	$("#tbBasket").html('');
	$("#totCnt").text('0');
	$("#totPrice").text('0');
	$("#totOptCnt").text('0');
	$("._deliver").hide();
}

function fn_setImg(){
	var imgUrl = "";
    let subTxt = $(".step1 .selectbox:visible").attr('id');
	
    if("step1_1" == subTxt){
		imgUrl = "./img/tableGlass/" + $("[name='glassTp1']:checked").val() + ".png";
    } else if("step1_2" == subTxt){
		imgUrl = "./img/tableGlass/" + $("[name='glassTp2']:checked").val() + "/base.jpg";
    } else if("step1_3" == subTxt){
		if( $("[name='glassTp1']:checked").val() == "무광(사틴)유리" && $("[name='glassTp2']:checked").val() == "color"){
			imgUrl = "./img/tableGlass/" + $("[name='glassTp2']:checked").val() + "/product/matt_"+ $("[name='glassTp3']:checked").val() + ".jpg";
		}else{
			imgUrl = "./img/tableGlass/" + $("[name='glassTp2']:checked").val() + "/product/"+ $("[name='glassTp3']:checked").val() + ".png";
		}		
   } 
   
	if(imgUrl.indexOf('undefined') > 0 || imgUrl == ""){
	   imgUrl = "./img/logo_raon.png";
   }
	if("step1_4" != subTxt){
		$("#imgSample").attr('src', imgUrl);
	}
}

function fn_calPrice(){
	var item;
	var input_width = 0;
	var input_height = 0;
	var input_price = 0;
	var price = 0;
	var totalJa = 0;
	
	item = cost[$("[name='glassTp1']:checked").data('gid')];
	
	var gid = parseInt($("[name='glassTp2']:checked").data('gid'));
	
	if($("._divInvisible:visible").length > 0){
		gid += parseInt($("[name='sheet']:checked").val());
	}
	input_price = parseInt(item[gid].split("/")[$("#shape").val()]);
	
	
	if($('#width').val().replace(/[^0-9]/, '') != ''){
		input_width = parseInt($('#width').val());
	}
	
	if($('#height').val().replace(/[^0-9]/, '') != ''){
		input_height = parseInt($('#height').val());
	}
	
	totalJa = calJa(input_width) * calJa(input_height);
	
	price = input_price * totalJa * $("#quantity").val();
	
	if(totalJa == 1){
		price = price * 2;
	}
	
	if($('#divCornerSize').is(':visible')){
		price = price + parseInt($('#size').val() + "000");
	}

	// 100원 단위 반올림
	$("#iptPrice").val(format_num(Math.round(price/1000)*1000));
}

function fn_moveTopPage(){
    $("#ulTopGroup li").removeClass("selected");

    let selObj = $("[name='topGroup']:checked");

    selObj.parent('li').addClass('selected');

	if("step1" == selObj.val()){
		fn_initStep1('ALL');
        $(".step1 .selectbox").hide();
        $("#pStep1pgNo").text("1/4");
        $("#step1_1").show();
		fn_setImg();
	} else if("step3" == selObj.val()){   
		if($("#tbBasket tr").length == 0){
			fn_layerPop($("#alertPopup"), "장바구니에 제품이 없습니다.");
			$("[name='topGroup'][value='step1']").prop('checked', true);
			fn_moveTopPage();
			return;
		}
    }

    $(".center > div").hide();
    $("." + selObj.val()).show();

    fn_bottomBtnText();
}

function fn_prevPage(){
    let topTxt = $("[name='topGroup']:checked").val();

    if("step1" == topTxt){       
        let subTxt = $(".step1 .selectbox:visible").attr('id');
        let pgTxt = "";

        $(".step1 .selectbox:visible").hide();

        if("step1_2" == subTxt){
            pgTxt = "1/4";
            $("#step1_1").show();
        } else if("step1_3" == subTxt){
            pgTxt = "2/4";
            $("#step1_2").show();
        } else if("step1_4" == subTxt){
			if("basic" == $("[name='glassTp2']:checked").val()){
	            pgTxt = "2/4";
				$("#step1_2").show();
			}else{
	            pgTxt = "3/4";
				$("#step1_3").show();
			}
        }
		fn_setImg();
		fn_bottomBtnText()
        $("#pStep1pgNo").text(pgTxt);

    } else if("step2" == topTxt){
		$("[name='topGroup'][value='step1']").prop('checked', true);
		fn_initStep1('ALL');
		fn_moveTopPage();
    } else if("step3" == topTxt){    
		$("[name='topGroup'][value='step2']").prop('checked', true);
		fn_moveTopPage();
    }

}

function fn_nextPage(){
    let topTxt = $("[name='topGroup']:checked").val();

    if("step1" == topTxt){   
        let subTxt = $(".step1 .selectbox:visible").attr('id');
        let pgTxt = "";

        $(".step1 .selectbox:visible").hide();

        if("step1_1" == subTxt){
            pgTxt = "2/4";
			if(undefined == $("[name='glassTp1']:checked").val()){
				fn_layerPop($("#alertPopup"), "값을 선택해주세요.");
				$("#" + subTxt).show();
				return;
			}

            $("#step1_2").show();
        } else if("step1_2" == subTxt){
			var selVal = $("[name='glassTp2']:checked").val();
			
			if(undefined == selVal){
				fn_layerPop($("#alertPopup"), "값을 선택해주세요.");
				$("#" + subTxt).show();
				return;
			}
			
            if("basic" == selVal){
                pgTxt = "3/3";
				$("._divInvisible").show();
                $("#step1_4").show();                
            }else{
                pgTxt = "3/4";
                $("#step1_3").show();
				fn_drawHtmlStep1_3(selVal);
            }
        } else if("step1_3" == subTxt){
            pgTxt = "4/4";
			if(undefined == $("[name='glassTp3']:checked").val()){
				fn_layerPop($("#alertPopup"), "값을 선택해주세요.");
				$("#" + subTxt).show();
				return;
			}
			$("._divInvisible").hide();
            $("#step1_4").show();
        } else if("step1_4" == subTxt){
			$("#step1_4").show();
			if("0" == $("#shape").val()){
				if("" == $("#width").val() || "0" == $("#width").val()){
					fn_layerPop($("#alertPopup"), "가로값을 입력해주세요.", $("#width"));
					return;
				}

				if("" == $("#height").val() || "0" == $("#height").val()){
					fn_layerPop($("#alertPopup"), "세로값을 입력해주세요.", $("#height"));
					return;
				}
			
				if("" == $("#position").val()){
					fn_layerPop($("#alertPopup"), "모서리가공위치를 선택해주세요.", $("#position"));
					return;
				}
			
				if("" == $("#size").val() && "0" != $("#position").val()){
					fn_layerPop($("#alertPopup"), "모서리가공크기를 선택해주세요.", $("#size"));
					return;
				}
			} else{
				if("" == $("#diameter").val() || "0" == $("#diameter").val()){
					fn_layerPop($("#alertPopup"), "지름값을 입력해주세요.", $("#diameter"));
					return;
				}
			}
			$(".step1 .selectbox:visible").hide();
            pgTxt = "1/4";
			fn_drawHtmlStep2();
            $("#step1_1").show();
			$("[name='topGroup'][value='step2']").prop('checked', true);
			fn_moveTopPage();
        }

		fn_setImg();
		fn_bottomBtnText();
        $("#pStep1pgNo").text(pgTxt);

    } else if("step2" == topTxt){
		if($("#tbBasket tr").length > 0){
			$("[name='topGroup'][value='step3']").prop('checked', true);
			fn_moveTopPage();
		}else{
			fn_layerPop($("#alertPopup"), "장바구니에 제품이 없습니다.");
		}
    } else if("step3" == topTxt){   
		if($('#name').val() == "" ){
			fn_layerPop($("#alertPopup"), '주문자 명을 입력해주세요.', $('#name'));
			return;
		}
		if($('#phonNum').val() == "" ){
			fn_layerPop($("#alertPopup"), '연락처를 입력해주세요.', $('#phonNum'));
			return;
		}
		if($('#email').val() == "" ){
			fn_layerPop($("#alertPopup"), '이메일을 입력해주세요.', $('#email'));
			return;
		}

		if($("#agree_privacy:checked").length == 0 ){
			fn_layerPop($("#alertPopup"), '개인정보 취급동의에 체크해주세요.', $("#agree_privacy"));
			return;
		}

		send_email();
    }
}

function fn_bottomBtnText(){
    let txt = $("[name='topGroup']:checked").val();

    $("#btnPrev").attr("disabled", false);
    if("step1" == txt){        
	    let subTxt = $(".step1 .selectbox:visible").attr('id');
        $("#btnPrev").text("이전");
        $("#btnNext").text("다음");
		
        if("step1_1" == subTxt){
            $("#btnPrev").attr("disabled", true);
        } else if("step1_4" == subTxt){
            $("#btnNext").text("장바구니추가");
        }
    } else if("step2" == txt){
        $("#btnPrev").text("제품추가");
        $("#btnNext").text("견적서발송");
    } else if("step3" == txt){
        $("#btnPrev").text("장바구니");
        $("#btnNext").text("견적서발송");        
    }
}

function fn_drawHtmlStep2(){
	var html = "";
	
	var productNm = $("[name='glassTp1']:checked").val() + "_";
	if("basic" == $("[name='glassTp2']:checked").val()){
		productNm += "투명";
	}else{
		productNm += $("[name='glassTp3']:checked").val();
		if("color" == $("[name='glassTp2']:checked").val()){
			productNm += "(#" + $("[name='glassTp3']:checked").next().text() + ")";
		}
	}
	
	var optionTxt = "";
	var optionTxt1 = "";
	var optionTxt2 = "";
	if($("[name='sheet']:checked").val() != 0){
		optionTxt1 = '비상방지안전시트 추가';
	}
	if("" != $("#position").val()){
		optionTxt2 += $("#position option:selected").text();
		
		if("" != $("#size").val()){
			optionTxt2 =  optionTxt2 + " > " + $("#size option:selected").text();
		}
	}
	
	"" == optionTxt1 ? optionTxt = optionTxt2 : optionTxt = optionTxt1 + "<br>" + optionTxt2;
	
	var deliver = "0";
	if(parseInt($("#width").val()) + parseInt($("#height").val()) > 2000){
		deliver = "1";
	}

	html = '<tr>';
	html += '	<input type="hidden" name="제품명" value="' +  productNm +'">';
	html += '	<input type="hidden" name="가로" value="' + $("#width").val() + '">';
	html += '	<input type="hidden" name="세로" value="' + $("#height").val() + '">';
	html += '	<input type="hidden" name="수량" value="' +  format_num($("#quantity").val()) + '">';
	html += '	<input type="hidden" name="제품모양" value="' + $("#shape option:selected").text() + '">';
	html += '	<input type="hidden" name="비상안전방지시트" value="' + optionTxt1 + '">';
	html += '	<input type="hidden" name="모서리" value="' + optionTxt2 + '">';
	html += '	<input type="hidden" name="금액" value="' + $("#iptPrice").val() + '">';
	html += '	<input type="hidden" name="배송비추가" value="' + deliver + '">';			
	
	if(isMobile()){
		html += '	<th class="check"><input type="checkbox"></th>';
		html += '	<th class="all">';
		html += '	  <div class="tb">';
		html += '		<span class="tb_title">제품명</span>';
		html += '	  	<span class="tb_value">' +  productNm +'<br>(' + $("#width").val() + ' x ' + $("#height").val() + ')</span>';
		html += '	  </div>';
		html += '	  <div class="tb">';
		html += '		<span class="tb_title">수량</span>';
		html += '	  	<span class="tb_value">' +  format_num($("#quantity").val()) + '</span>';
		html += '	  </div>';
		html += '	  <div class="tb">';
		html += '		<span class="tb_title">모서리</span>';
		html += '	  	<span class="tb_value">' + $("#shape option:selected").text() + '</span>';
		html += '	  </div>';
		
		if("" != optionTxt){
			html += '	  <div class="tb">';
			html += '		<span class="tb_title">옵션</span>';
			html += '	  	<span class="tb_value">' + optionTxt + '</span>';
			html += '	  </div>';
		}
		html += '	  <div class="tb">';
		html += '		<span class="tb_title">금액</span>';
		html += '	  	<span class="tb_value">' + $("#iptPrice").val() + '</span>';
		html += '	  </div>';
		html += '	</th>';
		
		
	} else{
		html += '	<th class="check"><input type="checkbox" onchange="fn_chkTableTr()"></th>';
		
		html += '	<th class="name">' +  productNm +'<br>(' + $("#width").val() + ' x ' + $("#height").val() + ')</th>';
		html += '	<th class="count">' +  format_num($("#quantity").val()) + '</th>';
		html += '	<th class="shape">' + $("#shape option:selected").text() + '</th>';
		

		html += '	<th class="option">' + optionTxt + '</th>';

		html += '	<th class="price">' + $("#iptPrice").val() + '</th>';
	}

	html += '</tr>';	
	
	$("#tbBasket").append(html);
	fn_showingStep2_totOpt();
}

function fn_drawHtmlStep1_3(type){
	if("" == $("#step1_3").html()){
		var html = "";
		var arr;
		
		
		if("color" == type){
			arr = color[0];
		} else if("marble" == type){
			arr = marble;
		} else if("wood" == type){
			arr = wood;
		} else if("pattern" == type){
			arr = pattern;
		}
			
		for(var i=0; i < arr.length; i++){
			html += '<div class="div_img '+ type + '" onClick="fn_setImg(); fn_initStep1($(this).parent(\'.selectbox\').attr(\'id\'));">';
			html += '	<input type="hidden" name="name" value="' + arr[i] +'" />';
			html += '	<input class="nonDisplay" type="radio" id="step1_3_' + i +'" name="glassTp3" value="' + arr[i] +'"/>';
			if("color" == type){
				html += '	<label for="step1_3_' + i +'" style="background:#' + color[1][i] + '">' + color[1][i] +'</label>';
			}else{
				html += '	<label for="step1_3_' + i +'">' + arr[i] +'</label>';
				html += '	<img src="./img/tableGlass/'+ type + '/base/' + arr[i] +'.jpg">';
			}
			html += '</div>';
		}
		
		$("#step1_3").html(html);
	}
}

function fn_deleteHtmlStep2(){
	if($("#tbBasket tr input[type='checkbox']:checked").length > 0) {
		$("#tbBasket tr").each(function(){
			var chk = $(this).find("input[type='checkbox']");

			if($(chk).prop('checked')){
				$(this).remove();
			}
		});
		
		fn_showingStep2_totOpt();
	} else{
		fn_layerPop($("#alertPopup"), "삭제할 제품이 없습니다.");
	}
}

function fn_chkTableTr(){
	var cnt = 0;
	$("#tbBasket tr input[type='checkbox']").each(function(){
		if($(this).prop('checked')){
			cnt++;
		}
	});

	if(cnt == $("#tbBasket tr input[type='checkbox']").length){
		$("#chkBasketAll").prop('checked', true);
	}else{
		$("#chkBasketAll").prop('checked', false);
	}
}

function fn_showingStep2_totOpt(){
	var totCnt = 0;
	var totPrice = 0;
	var deliver = false;

	$("._deliver").hide();
	
	$("#tbBasket tr").each(function(n, el){
		totCnt = totCnt + parseInt(removeFormat_num($(el).find('[name="수량"]').val()));
		totPrice = totPrice + parseInt(removeFormat_num($(el).find('[name="금액"]').val()));
		if(!deliver){
			if($(el).find('[name="배송비추가"]').val() == "1"){
				$("._deliver").show();
				deliver = true;
			}
		}
	});

	$("#totOptCnt").text(format_num(totPrice/1000));	
	$("#totCnt").text(format_num(totCnt));
	$("#totPrice").text(format_num(totPrice));
}

// 이메일 보내기
function send_email(){	
	$('#price_total').val($('#totPrice').text());
	$('#price_count').val($('#totCnt').text());
	$('#price_option').val($('#totOptCnt').text());
	
	if($("#tbBasket tr input[name='배송비추가'][value='1']").length > 0){
		$('#deliver').val('추가');
	}else{
		$('#deliver').val('없음');
	}
	
	var cartTxt = "";
	
	$('#tbBasket tr').each(function(index){
		if(index != 0){
			cartTxt += "/"
		}
		cartTxt += $(this).find('input[name="제품명"]').val() + "|";
		cartTxt += $(this).find('input[name="제품모양"]').val() + "|" 
		cartTxt += $(this).find('input[name="가로"]').val() + "|" ;
		cartTxt += $(this).find('input[name="세로"]').val() + "|" ;
		cartTxt += $(this).find('input[name="수량"]').val() + "|" ;
		cartTxt += $(this).find('input[name="비상안전방지시트"]').val() + "|" ;
		cartTxt += $(this).find('input[name="모서리"]').val() + "|" ;
		cartTxt += $(this).find('input[name="금액"]').val();
	});
	
	
	$('#cart').text(cartTxt);

	
	var queryString = $("form[name=emailfrm]").serialize() ;
	
	
	fn_callBackSendEmail();
/*
	$.ajax({
		data : queryString,
		type : 'post',
		url : 'https://script.google.com/macros/s/AKfycbwDHCFHN3UPcvIhagit49PdCbLk-24sQUy8cXCbAJhZaa16LkuNTl_pErMi8hE9r5F5/exec',
		dataType : 'json',
		error: function(xhr, status, error){
			fn_layerPop($("#layer_alert"), error);
		},
		success : function(json){
			fn_layerPop($("#layer_alert"), "견적서가 발송되었습니다.");
			fn_callBackSendEmail();
		}
	});	*/
}

function fn_callBackSendEmail(){
	$("#payOpt").text($("#totOptCnt").text());
	fn_layerPop($("#payPopup"));
}