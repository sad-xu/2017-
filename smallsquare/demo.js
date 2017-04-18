
tableMaker(10,10);  //表格初始化  (行,列)

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
var cell=vw*4+1;

var line=10;   //行数
var row=10;		//列数

//表格制作
function tableMaker(li,ro){
	var body=document.getElementsByTagName("body")[0];
	var T=document.createElement("table");
	for (var i = 0; i < li+1; i++) {      //行
		var tr=document.createElement("tr");
		for (var j = 0; j < ro+1; j++) {   //列
			if (i==0) {
				var th=document.createElement("th");
				if (j>0) {
					th.innerHTML=j;		
				}
				tr.appendChild(th);
			} else {
				var th2=document.createElement("th");
				var td=document.createElement("td");
				if (i==5&&j==5) {
					td.setAttribute("ID","cube");  //方块位置初始化
				}
				if (j==0) {
					th2.innerHTML=i;
					tr.appendChild(th2);
				} else {
					tr.appendChild(td);
				}
			}
		}
		T.appendChild(tr);
	}
	body.insertBefore(T,body.firstChild);
}


//直走
function GO(){     
	var a=me.a%360;
	switch (true) {
		case a==0||a==-360:
			move("b1");				
			break;
		case a==90||a==-270:
			move("r0");
			break;
		case a==180||a==-180:
			move("b0");	
			break;
		case a==270||a==-90:
			move("r1");
			break;
	}
}

function move(xy){
	switch (xy){
		case "b1":
			me.y--;
			break;
		case "r0":
			me.x++;
			break;
		case "b0":
			me.y++;
			break;
		case "r1":
			me.x--;
			break;
	}
	if (check()==1){
		return;
	} else {
		switch (xy){
			case "b1":
				cube.style.bottom=where(cube.style.bottom,1);
				break;
			case "r0":
				cube.style.right=where(cube.style.right,0);
				break;
			case "b0":
				cube.style.bottom=where(cube.style.bottom,0);
				break;
			case "r1":
				cube.style.right=where(cube.style.right,1);
				break;
		}
	}
}

//确定下一位置的坐标
function where(who,a){
	var i=who.replace("px","");
	if (a==1) {
		return parseFloat(i)+cell+"px";
	}else if (a==0) {
		return parseFloat(i)-cell+"px";
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
			move("r1");	
			break;
		case "TRA TOP":
			move("b1");
			break;
		case "TRA RIG":
			move("r0");
			break;
		case "TRA BOT":
			move("b0");
			break;
		case "MOV LEF":  //方向转向屏幕左侧，并向屏幕的左侧移动一格
			for (var i = 0; i < 5; i++) {				
				aa=me.a%360;
				if (aa==270||aa==-90) {
					GO();
					return;
				}
				turnDir(-90);
			}
			break;
		case "MOV TOP":
			for (var i = 0; i < 5; i++) {					
				aa=me.a%360;
				if (aa==0||aa==-360) {
					GO();
					return;
				}
				turnDir(90);
			}
			break;
		case "MOV RIG":
			for (var i = 0; i < 5; i++) {					
				aa=me.a%360;
				if (aa==90||aa==-270) {
					GO();
					return;
				}
				turnDir(90);
			}
			break;
		case "MOV BOT":
			for (var i = 0; i < 5; i++) {			
				aa=me.a%360;
				if (aa==180||aa==-180) {
					GO();
					return;
				}
				turnDir(-90);
			}
			break;
	}	
},false);


//输入框 得焦失焦事件
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

//各种按钮 
document.getElementById("left").addEventListener("click",function(){
	order.value="TUN LEF";
	doing.click();
},false);
document.getElementById("right").addEventListener("click",function(){
	order.value="TUN RIG";
	doing.click();
},false);
document.getElementById("back").addEventListener("click",function(){
	order.value="TUN BAC";
	doing.click();
},false);
document.getElementById("GOO").addEventListener("click",function(){
	order.value="GO";
	doing.click();
},false);

//新增
document.getElementById("tralef").addEventListener("click",function(){
	order.value="TRA LEF";
	doing.click();
},false);
document.getElementById("tratop").addEventListener("click",function(){
	order.value="TRA TOP";
	doing.click();
},false);
document.getElementById("trarig").addEventListener("click",function(){
	order.value="TRA RIG";
	doing.click();
},false);
document.getElementById("trabot").addEventListener("click",function(){
	order.value="TRA BOT";
	doing.click();
},false);
document.getElementById("movlef").addEventListener("click",function(){
	order.value="MOV LEF";
	doing.click();
},false);
document.getElementById("movtop").addEventListener("click",function(){
	order.value="MOV TOP";
	doing.click();
},false);
document.getElementById("movrig").addEventListener("click",function(){
	order.value="MOV RIG";
	doing.click();
},false);
document.getElementById("movbot").addEventListener("click",function(){
	order.value="MOV BOT";
	doing.click();
},false);
