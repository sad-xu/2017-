
var tagBall=document.querySelectorAll(".tagBall")[0];
var title=document.getElementById("title");
var r=250;           	//半径

var angleX=0.0002;
var angleY=0.0002;
var tags=[];
var fontColor;
//原型模式
function Tag(ele,x,y,z){
	this.ele=ele;
	this.x=x;
	this.y=y;
	this.z=z;
}

Tag.prototype.move=function (){
		this.ele.style.opacity=this.z/r+1;
		this.ele.style.left=this.x+tagBall.offsetWidth/2- this.ele.offsetWidth/2+"px";
		this.ele.style.top=this.y+tagBall.offsetHeight/2- this.ele.offsetHeight/2+"px";
		this.ele.style.zIndex=parseInt(this.z/r*100);
}


Array.prototype.forEach=function(callback){
	for (let i = 0; i < this.length; i++) {
		callback.call(this[i]);
	}
}



//平均分配位置
function init(){	
	var tagsEle=document.querySelectorAll(".tag");
	var len=tagsEle.length;			
	
	for (let i = 0; i < len; i++) {
		var a=Math.acos((2*i+1)/len-1);
		var b=a*Math.sqrt(len*Math.PI);
		var x=r*Math.sin(a)*Math.cos(b);
		var y=r*Math.sin(a)*Math.sin(b);
		var z=r*Math.cos(a);
		tagsEle[i].style.color="rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
		var t=new Tag(tagsEle[i],x,y,z);
		tags.push(t);
		t.move();   //调整位置
	}
}



//旋转公式
function rotateX(){
	tags.forEach(function(){
		this.z=this.y*Math.sin(angleX)+this.z*Math.cos(angleX);
		this.y=this.y*Math.cos(angleX)-this.z*Math.sin(angleX);
	})
}

function rotateY(){
	tags.forEach(function(){
		this.x=this.z*Math.sin(angleY)+this.x*Math.cos(angleY);
		this.z=this.z*Math.cos(angleY)-this.x*Math.sin(angleY);
	})
}

//
function animate(){
	setInterval(function(){
		tags.forEach(function(){
			rotateX();
			rotateY();
			this.move();
		})
	},40);
}


 //判断 移动端 PC
var os = function() {  
     var ua = navigator.userAgent,  
     isWindowsPhone = /(?:Windows Phone)/.test(ua),  
     isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,   
     isAndroid = /(?:Android)/.test(ua),   
     isFireFox = /(?:Firefox)/.test(ua),   
     isChrome = /(?:Chrome|CriOS)/.test(ua),  
     isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),  
     isPhone = /(?:iPhone)/.test(ua) && !isTablet,  
     isPc = !isPhone && !isAndroid && !isSymbian;  
     return {  
          isTablet: isTablet,  
          isPhone: isPhone, 
          isAndroid : isAndroid,  
          isPc : isPc  
     };  
}();  



if (!os.isPc) {
	title.innerHTML="不建议在移动端打开此网页";
} else {
	title.innerHTML="脑内世界";
	tagBall.addEventListener("mousemove",function(e){
		angleX=-(e.clientX-this.offsetLeft-this.offsetWidth/2)*0.000005;
		angleY=-(e.clientY-this.offsetTop-this.offsetHeight/2)*0.000005;
	});


	//字体大小、颜色变化
	tagBall.addEventListener("mouseover",function(e){
		if (e.target.className=="tag") {
			e.target.style.fontSize="23px";
			fontColor=e.target.style.color;
			e.target.style.color="grey";
		}
	});

	tagBall.addEventListener("mouseout",function(e){
		angleX=angleX/2;
		angleY=angleY/2;

		if (e.target.className=="tag") {
			e.target.style.fontSize="18px";
			e.target.style.color=fontColor;
		}
	});

	init();
	animate();
}

