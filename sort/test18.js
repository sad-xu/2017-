var line=[];
var text=document.getElementById("text");
var put=document.getElementById("put");
var sh=document.getElementById("sh");  //图像区
//事件代理：添加点击事件
put.addEventListener("click",function (event){
	switch (event.target.id){
		case "left-in":
		line.unshift(text.value);
		show();
		break;

		case "right-in":
		line.push(text.value);
		show();
		break;

		case "left-out":
		line.shift(text.value);
		show();
		break;

		case "right-out":
		line.pop(text.value);
		show();
		break;

		case "random":
		roll();
		show();
		break;

		case "sort":
		mysort();
	}
});


//先清除所有节点，再根据新数组重新生成节点
function show(){	
	while (sh.hasChildNodes()){
		sh.removeChild(sh.firstChild);
	}

	for (var i = 0; i < line.length; i++) {
		var span=document.createElement("span");
		span.style.height=line[i]+"px";       //setAttribute设置不了
		sh.appendChild(span);	
	}
}


//随机生成30组数据
function roll(){
	line=[];
	for (var i = 0; i < 50; i++) {
		line[i]=Math.floor(Math.random()*350+1);
	}
}

//排序
function mysort(){
	var n=line.length;
	var i=0,j=1,k;
	setTimeout(function(){
		if (i<n-1) {
			if (j==n-1-i) {
				i++;
				j=0;
			}
			if (line[j]>line[j+1]) {
				k=line[j];
				line[j]=line[j+1];
				line[j+1]=k;	
			}
			j++;
			show();
			sh.childNodes[j].style.backgroundColor="blue";
			setTimeout(arguments.callee,50);
		}
		else{
			sh.childNodes[j].style.backgroundColor="red";
			alert("排序完成！")
		}
	},50);

}