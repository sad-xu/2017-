var btn=document.getElementById("buttons");
var main=document.getElementById("main");
var data=[],head,time;
var cont;
var input=document.getElementById("input");

//绑定点击事件
btn.addEventListener("click",function(event){
	switch (event.target.id){
		case "btn-1":
		clear();
		btn1(main);
		show();
		break;

		case "btn-3":
		clear();
		btn3(main);
		show();
		break;
	}
});

document.getElementById("search").onclick=function(){
	clear();
	search();
}
	


//选择标签名为div的子节点
function firstCh(node){
	var chs=node.childNodes;
	var a=[];
	if (chs.length==0) {
		return a;
	}
	for (var i = 0; i < chs.length; i++) {
		if (chs[i].nodeType==1 && chs[i].nodeName=="DIV") {
			a.push(chs[i]);
		}
	}
	return a;
}


//前序遍历
function btn1(node){
	var childs;
	if (node!=null) {
		childs=firstCh(node);
		data.push(node);		
		for (var i = 0; i < childs.length; i++) {
	  		btn1(childs[i]);
		}	
	}
}


//后序遍历
function btn3(node){
	var childs;
	if (node!=null) {		
		childs=firstCh(node);
		for (var i = 0; i < childs.length; i++) {
			btn3(childs[i]);
		}
		data.push(node);
	}
}

//show
function show(){
	head=data.shift();
	if (head) {
		head.style.backgroundColor="blue";
		time=setTimeout(function(){
			head.style.backgroundColor="white";
			show()
		},500);
	}
}

//show2
function show2(){
	head=data.shift();
	if (head) {
		if (data.length==0) {
			head.style.backgroundColor="red";	
			alert("找到了");
			return;
		}
		else {
			head.style.backgroundColor="blue";
		}
		time=setTimeout(function(){
			head.style.backgroundColor="white";
			show2()
		},500);	
	}
}

//clear
function clear(){
	if (head) {
			head.style.backgroundColor="white";
	}

	if (data.length) {		
		data=[];
		clearTimeout(time);
	}
}


//search 
function search(){
	cont=input.value;
	btn1(main);
	if (data.length==0) {
		alert("No Found");
	}
	data.forEach(function(item,index,array){
		if (item.firstElementChild.innerHTML==cont){
			data.splice(index+1,data.length-index);
			show2();
			return;
		}
	})	

}

//输入框焦点效果
input.addEventListener("focus",function(){
	if (this.value==this.defaultValue) {
		this.value="";
	}
},false);

input.addEventListener("blur",function(){
	if (this.value=="") {
		this.value=this.defaultValue;
	}
},false);

//box显示
var children=main.getElementsByTagName("DIV");
var x,y;
var box=document.getElementById("livebox");
var b_child=[1,2];        //[前一个点击的节点，当前节点]

for (var i = 0; i < children.length; i++) {
	children[i].addEventListener("click",function(event){
		x=event.clientX;
		y=event.clientY;
		box.style.left=(x-110)+"px";
		box.style.top=(y-55)+"px";
		box.style.display="block";

		b_child.push(this);
		b_child.shift();
		if (typeof(b_child[0])=="object") {
			b_child[0].style.backgroundColor="white";	
		}
		b_child[1].style.backgroundColor="yellow";
		event.stopPropagation();      //阻止冒泡 p357
	})
}


//节点删除
var del=document.getElementById("b-del");
del.addEventListener("click",function(){
	b_child[1].parentNode.removeChild(b_child[1]);
	box.style.display="none";
})

//节点添加
var add=document.getElementById("b-add");
var text=document.getElementById("b-text");
add.addEventListener("click",function(){
 	var name=text.value;
 	var newDiv=document.createElement("div");
 	var newSpan=document.createElement("span");
 	newSpan.innerHTML=name;
 	newDiv.appendChild(newSpan);

 	newDiv.addEventListener("click",function(event){
 		x=event.clientX;
		y=event.clientY;
		box.style.left=(x-110)+"px";
		box.style.top=(y-55)+"px";
		box.style.display="block";
 		b_child.push(this);
		b_child.shift();
		if (typeof(b_child[0])=="object") {
			b_child[0].style.backgroundColor="white";	
		}
		b_child[1].style.backgroundColor="yellow";
		event.stopPropagation();
 	})

 	b_child[1].appendChild(newDiv);
 	box.style.display="none";
})

text.addEventListener("focus",function(){
	if (this.value==this.defaultValue) {
		this.value="";
	}
},false);


main.addEventListener("click",function(){
	box.style.display="none";
},false);
