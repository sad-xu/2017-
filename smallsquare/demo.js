var order=document.getElementById("order");  //输入框
var doing=document.getElementById("doing");  //执行按钮
var cube=document.getElementById("cube");    //方块  
cube.style.right="0px";
cube.style.bottom="0px";
var me={
	x:5,
	y:5,
	a:0, //角度
};

var vw=window.innerWidth/100; 
var cell=vw*6.5+1;

order.addEventListener("focus",function(){
	if (this.value==this.defaultValue) {
		this.value="";
	}
},false);

order.addEventListener("blur",function(){
	if (this.value=="") {
		this.value=this.defaultValue;
	}
},false);


//直走
function GO(){     
	var a=me.a%360;
	switch (true) {
		case a==0||a==-360:
			me.y--;
			if (check()==1){
				return;
			} else {
				cube.style.bottom=where(cube.style.bottom,1);
			}				
			break;
		case a==90||a==-270:
			me.x++;
			if (check()==1){
				return;
			} else {
				cube.style.right=where(cube.style.right,0);
			}	
			break;
		case a==180||a==-180:
			me.y++;
			if (check()==1){
				return;
			} else {
				cube.style.bottom=where(cube.style.bottom,0);
			}	
			break;
		case a==270||a==-90:
			me.x--;
			if (check()==1){
				return;
			} else {
				cube.style.right=where(cube.style.right,1);
			}	
			break;
	}
}

function move(xy){
	//////
	if (check()==1){
		return;
	} else {
		cube.style.right=where(cube.style.right,1);
	}
}

//坐标确定
function where(who,a){
	var i=who.replace("px","");
	if (a==1) {
		return parseInt(i)+cell+"px";
	}else if (a==0) {
		return parseInt(i)-cell+"px";
	}	
}


//边界判断
function check(){    
	if (me.x<1) {
		me.x++;
		return 1;
	} else if (me.y<1){
		me.y++;
		return 1;
	} else if (me.x>10){
		me.x--;
		return 1;
	} else if (me.y>10){
		me.y--;
		return 1;
	}
}

//转向
function turnDir(dir){
	me.a=me.a+dir;
	cube.style.transform="rotate("+me.a+"deg)";
}

doing.addEventListener("click",function(){
	var speak=order.value;
	var aa;
	switch (speak) {
		case "TUN LEF":
			turnDir(-90);
			break;
		case "TUN RIG":
			turnDir(90);
			break;
		case "TUN BAC":
			turnDir(180);
			break;
		case "GO":
			GO();
			break;
		case "TRA LEF":
			me.x--;
			if (check()==1){
				return;
			} else {
				cube.style.right=where(cube.style.right,1);
			}	
			break;
		case "TRA TOP":
			me.y--;
			if (check()==1){
				return;
			} else {
				cube.style.bottom=where(cube.style.bottom,1);
			}	
			break;
		case "TRA RIG":
			me.x++;
			if (check()==1){
				return;
			} else {
				cube.style.right=where(cube.style.right,0);
			}	
			break;
		case "TRA BOT":
			me.y++;
			if (check()==1){
				return;
			} else {
				cube.style.bottom=where(cube.style.bottom,0);
			}	
			break;


		case "MOV LEF":  //方向转向屏幕左侧，并向屏幕的左侧移动一格
			for (var i = 0; i < 5; i++) {	
				turnDir(-90);
				aa=me.a%360;
				if (aa==270||aa==-90) {
					GO();
					return;
				}
			}
			break;

		case "MOV TOP":
			for (var i = 0; i < 5; i++) {	
				turnDir(90);
				aa=me.a%360;
				if (aa==0||aa==-360) {
					GO();
					return;
				}
			}
			break;

		case "MOV RIG":
			for (var i = 0; i < 5; i++) {	
				turnDir(90);
				aa=me.a%360;
				if (aa==90||aa==-270) {
					GO();
					return;
				}
			}
			break;

		case "MOV BOT":
			for (var i = 0; i < 5; i++) {	
				turnDir(-90);
				aa=me.a%360;
				if (aa==180||aa==-180) {
					GO();
					return;
				}
			}
			break;

			


	}	
},false);





document.getElementById("left").addEventListener("click",function(){
	order.value="TUN LEF";
	doing.click();
	console.log(me);
})
document.getElementById("right").addEventListener("click",function(){
	order.value="TUN RIG";
	doing.click();
	console.log(me);
})
document.getElementById("back").addEventListener("click",function(){
	order.value="TUN BAC";
	doing.click();
	console.log(me);
})
document.getElementById("GOO").addEventListener("click",function(){
	order.value="GO";
	doing.click();
	console.log(me);
})

//新增
document.getElementById("tralef").addEventListener("click",function(){
	order.value="TRA LEF";
	doing.click();
	console.log(me);
})
document.getElementById("tratop").addEventListener("click",function(){
	order.value="TRA TOP";
	doing.click();
	console.log(me);
})
document.getElementById("trarig").addEventListener("click",function(){
	order.value="TRA RIG";
	doing.click();
	console.log(me);
})
document.getElementById("trabot").addEventListener("click",function(){
	order.value="TRA BOT";
	doing.click();
	console.log(me);
})
document.getElementById("movlef").addEventListener("click",function(){
	order.value="MOV LEF";
	doing.click();
	console.log(me);
})
document.getElementById("movtop").addEventListener("click",function(){
	order.value="MOV TOP";
	doing.click();
	console.log(me);
})
document.getElementById("movrig").addEventListener("click",function(){
	order.value="MOV RIG";
	doing.click();
	console.log(me);
})
document.getElementById("movbot").addEventListener("click",function(){
	order.value="MOV BOT";
	doing.click();
	console.log(me);
})
