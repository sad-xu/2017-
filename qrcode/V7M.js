/*二维码生成
 *水平有限，仅 Version 7  M
*/
var input=document.getElementById("input");
var check=document.getElementById("check");
var drawing=document.getElementById("drawing");
var data=[];
var mask=[];

//纠错码部分
var _gfExp=new Array(512);
var _gfLog=new Array(256);
for (var i = 0; i < 512; i++) {
	_gfExp[i]=0;
}
for (var i = 0; i < 256; i++) {
	_gfLog[i]=0;
}
var _gfPrim=0x11d;
var _x=1;

//4组 数据+纠错码
var tenCode_1,tenCode_2,tenCode_3,tenCode_4;
var error_date_1,error_date_2,error_date_3,error_date_4;


//创建二维矩阵
function Mat(a,b){
	var mat=new Array(a);
	for (var i = 0; i < a; i++) {
		mat[i]=new Array(b);
	}
	return mat;
}


//模板数据
var position=[ 
		[1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,0,1],
		[1,0,1,1,1,0,1],
		[1,0,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,1,1],
	];

var alignment=[
		[1,1,1,1,1],
		[1,0,0,0,1],
		[1,0,1,0,1],
		[1,0,0,0,1],
		[1,1,1,1,1]
	];

var timing_1=[1,0,1,0,1,0,1,0,1,0,1,0];
var timing_2=[[1],[0],[1],[0],[1],[0],[1],[0],[1],[0],[1],[0]];
var timing_3=[0,1,0,1,0,1,0,1,0,1,0,1];
var timing_4=[[0],[1],[0],[1],[0],[1],[0],[1],[0],[1],[0],[1]];

var wh_area_1=[0,0,0,0,0,0,0,0];
var wh_area_2=[[0],[0],[0],[0],[0],[0],[0],[0]];


//数组覆盖 
function arrOver(A,B,p,q){
	for (var a = 0; a < B.length; a++) {
		if (B[a].length!=undefined) {   //B是二维矩阵
			for (var b = 0; b < B[a].length; b++) {
				A[p+a][q+b]=B[a][b];
			}
		} else {   //B是一维矩阵
			A[p][q+a]=B[a];
		}
	}
}

//行向量 -> 列向量  一维
Array.prototype.rowToCol=function(){
	var Row=this;
	var Col=new Array(Row.length);
	for (var r = 0; r < Row.length; r++) {
		Col[r]=[];
		Col[r][0]=Row[r];
	}
	return Col;
}

//初始化模板
function init(){  
	data=Mat(45,45);
	mask=Mat(45,45);
	//position x3 
	arrOver(data,position,0,0);
	arrOver(data,position,38,0);
	arrOver(data,position,0,38);
	//alignment x6
	arrOver(data,alignment,4,20);
	arrOver(data,alignment,20,4);
	arrOver(data,alignment,20,20);
	arrOver(data,alignment,20,36);
	arrOver(data,alignment,36,20);
	arrOver(data,alignment,36,36);
	//timing
	arrOver(data,timing_1,6,8);
	arrOver(data,timing_2,8,6);
	arrOver(data,timing_3,6,25);
	arrOver(data,timing_4,25,6);
	//外围白圈
	arrOver(data,wh_area_1,7,0);
	arrOver(data,wh_area_1,7,37);
	arrOver(data,wh_area_1,37,0);
	arrOver(data,wh_area_2,0,7);
	arrOver(data,wh_area_2,0,37);
	arrOver(data,wh_area_2,37,7);	
}



/*
 *Error Correction Level: L 01 ; M 00 ; Q 11 ; H 10
 *Mask:  000~111
 *10bits的纠错码需要(15,5)BCH编码，不会
 *用资料里的例子: 00101  即 M  xy%2+xy%3=0
 *
*/
function formatCode(){
	var info="001010011011100";
	var mas="101010000010010";
	var code=(parseInt(info,2)^parseInt(mas,2)).toString(2);
	code=code.split("");
	//数组中的字符串 -> number
	for (var index = 0; index < code.length; index++) {
		code[index]=parseInt(code[index]);
	}
	return code;
};

function draw_format(){	
	var format=formatCode();
	var format_1=format.slice(0,8).reverse();
	var format_2=format.slice(8).rowToCol();
	format_2.unshift([1]);
	var format_3=format.slice(0,8)
	format_3.splice(5,0,1);
	format_3=format_3.rowToCol();
	var format_4=format.slice(8)
	format_4.splice(1,0,1);
	format_4=format_4.reverse();

	arrOver(data,format_1,8,37);
	arrOver(data,format_2,37,8);
	arrOver(data,format_3,0,8);
	arrOver(data,format_4,8,0);
}


/*Version Information  6+12  版本号+纠错码
 *纠错码依然需要BCH编码
 *幸好书上有V7的例子
*/
function versionCode(){
	var code="000111110010010100";
	code=code.split("");
	for (var index = 0; index < code.length; index++) {
		code[index]=parseInt(code[index]);
	}
	return code;	
}

function draw_version(){
	var version=versionCode();
	var version_1=Mat(6,3);
	var version_2=Mat(3,6);

	for (var i = 0; i < 6; i++) {
		for (var j = 0; j < 3; j++) {
			version_1[i][j]=version[3*i+j]
		}
	}

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 6; j++) {
			version_2[i][j]=version[3*j+i]
		}
	}
	arrOver(data,version_1,0,34);
	arrOver(data,version_2,34,0);
	for (var i = 0; i < 45; i++) {
		for (var j = 0; j < 45; j++) {
			mask[i][j]=data[i][j];
		}
	}	
}

/*数据码和纠错码
 *
*/
function dataCode(d){
	var num=d.length.toString(2);  //二进制字符数
	while (num.length<8) {
		num="0"+num;
	} 

	var str=d.split("");
	var datacode="";  //字符编码  ISO/IEC 8859-1
	var codes="";
	for (var i = 0; i < str.length; i++) {
		datacode=str[i].charCodeAt().toString(2);
		while (datacode.length<8) {
			datacode="0"+datacode;  
		}
		codes=codes+datacode;
	}
	
	var code="0100"+num+codes+"0000";
	var codeLen=code.length/8;  //添加补齐码	
	while (codeLen<124) {
		code=code+"11101100";
		codeLen++;
		if (codeLen<124) {
			code=code+"00010001";
			codeLen++;
		}
	}

	//二进制 -> 十进制
	var tenCode=[];
	for (var i = 0; i < 124; i++) {
		tenCode[i]=parseInt(code.substr(i*8,8),2).toString(10);
		tenCode[i]=parseInt(tenCode[i],10);
	}

	//纠错码
	for (var i = 0; i < 255; i++) {
		_gfExp[i]=_x;
		_gfLog[_x]=i;
		_x=_gfpMul(_x,2);
	}
	for (var i = 255; i < 512; i++) {
		_gfExp[i]=_gfExp[i-255];
	}
	//V7 M (49,31,9)     (31+8)x4=196
	tenCode_1=tenCode.slice(0,31); 
	tenCode_2=tenCode.slice(31,62);
	tenCode_3=tenCode.slice(62,93);
	tenCode_4=tenCode.slice(93);
	error_date_1=_rsEncode(tenCode_1,18);
	error_date_2=_rsEncode(tenCode_2,18);
	error_date_3=_rsEncode(tenCode_3,18);
	error_date_4=_rsEncode(tenCode_4,18);
}


///////////////////纠错码算法///////////////////////////
////////////////改编自python版本////////////////////////
//////////https://zhuanlan.zhihu.com/p/21463650/////////
function _rsEncode(bitstring,nsym){
	var gen=_rsGenPoly(nsym);
	var res=new Array(bitstring.length+gen.length-1);
	for (var i = 0; i < res.length; i++) {
		res[i]=0;
	}
	for (var i = 0; i < bitstring.length; i++) {
		res[i]=bitstring[i];
	}

	for (var i = 0; i < bitstring.length; i++) {
		var coef=res[i];
		if (coef!=0) {
			for (var j = 1; j < gen.length; j++) {
				res[i+j] ^= _gfMul(gen[j],coef);
			}
		}
	}

	for (var i = 0; i < bitstring.length; i++) {
		res[i]=bitstring[i];
	}

	return res.slice(bitstring.length);
}

function _rsGenPoly(nsym){
	var g=[1];
	for (var i = 0; i < nsym; i++) {
		g=_gfPolyMul(g,[1,_gfPow(2,i)]);
	}
	return g;
}

function _gfPolyMul(p,q){
	var r=new Array(p.length+q.length-1);
	for (var i = 0; i < r.length; i++) {
		r[i]=0;
	}
	for (var j = 0; j < q.length; j++) {
		for (var i = 0; i < p.length; i++) {
			r[i+j] ^= _gfMul(p[i],q[j]);
		}
	}
	return r;
}

function _gfPow(x,pow){
	return _gfExp[(_gfLog[x]*pow)%255];
}

function _gfMul(x,y){
	if (x==0||y==0) {
		return 0;
	}
	return _gfExp[_gfLog[x]+_gfLog[y]];
	
}

function _gfpMul(x,y){
	var r=0;
	var prim=0x11d,field_charac_full=256,carryless=true;
	while(y){
		if (y&1) {
			if (carryless) {
				r=r^x;
			}else{
				r= r+x;
			}
		}
		y=y>>1;
		x=x<<1;
		if ((prim>0)&&(x&field_charac_full)) {
			x=x^prim;
		}
	}
	return r;
}
////////////////////////////////////////////////////

//穿插放置
function codePlace(){
	var allCode=[];
	for (var i = 0; i < tenCode_1.length; i++) {
		allCode.push(tenCode_1[i]);
		allCode.push(tenCode_2[i]);
		allCode.push(tenCode_3[i]);
		allCode.push(tenCode_4[i]);
	}
	for (var i = 0; i < error_date_1.length; i++) {
		allCode.push(error_date_1[i]);
		allCode.push(error_date_2[i]);
		allCode.push(error_date_3[i]);
		allCode.push(error_date_4[i]);
	}
	return allCode;
}


//填码
function putCode(){
	var code=codePlace();
	var block;
	
	var blockCode=[];  //1x1568
	var flag=1;  //上1  下0
	var len=0;

	for (var i = 0; i < code.length; i++) {
		block=code[i].toString(2);
		while(block.length<8){
			block="0"+block;
		}
		for (var j = 0; j < 8; j++) {
			blockCode[i*8+j]=parseInt(block[j]);	
		}
	}
	

	for (var j =22; j >0; j--) {
		if (j==3) {
			j=2.5;
		}
		if (flag==1) {
			for (var i = 44; i >=0 ; i--) {
				if (typeof(data[i][2*j])=="undefined") {
					data[i][2*j]=blockCode[len];
					len++;
				}
				if (typeof(data[i][2*j-1])=="undefined"){
					data[i][2*j-1]=blockCode[len];
					len++;
				}	
			}
			flag=0;
		}else if(flag==0){
			for (var i = 0; i <=44 ; i++) {
				if (typeof(data[i][2*j])=="undefined") {
					data[i][2*j]=blockCode[len];
					len++;
				}
				if (typeof(data[i][2*j-1])=="undefined"){
					data[i][2*j-1]=blockCode[len];
					len++;
				}	
			}	
			flag=1;
		}	
	}
}




//掩码
function Mask(){
	var maskCode=Mat(45,45);
	for (var i = 0; i < mask.length; i++) {
		for (var j = 0; j < mask[0].length; j++) {
			if ((i*j)%2+(i*j)%3==0) {
				maskCode[i][j]=1;
			} else {
				maskCode[i][j]=0;
			}
			if (mask[i][j]!=undefined) {
				maskCode[i][j]=0;
			}
		}
	}
	return maskCode;
}


//异或操作
function XOR(){
	var m=Mask();
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[0].length; j++) {		
			data[i][j]=data[i][j]^m[i][j];
		}
	}
}



//绘制
function Draw(d){
	if (drawing.getContext) {	
		function Pix(x,y){   //  1bit  = 5x5 px
			context.fillRect(5*y,5*x,5,5)
		}

		var context=drawing.getContext("2d");
		context.fillStyle="white";
		context.fillRect(0,0,225,225)
		for (var i = 0; i < d.length; i++) {
			var row=d[i];
			for (var j = 0; j < row.length; j++) {
				var col=row[j];
				if (col==1) {
					context.fillStyle="black";
					Pix(i,j);
				} else if (col==0) {
					context.fillStyle="white";
					Pix(i,j);
				} else  {
					context.fillStyle="red";
					Pix(i,j);
				}
			}
		}
	}
}


//添加事件
check.addEventListener("click",function(){
	var input_str=input.value;

	init();
	draw_format();
	draw_version();

	dataCode(input_str);  //数据码和纠错码	
	putCode(); 

	XOR();   //掩码操作
	Draw(data)
	
},false);



input.addEventListener("focus",function(){
	if (this.value==this.defaultValue) {
		this.value="";
	}
});

input.addEventListener("blur",function(){
	if (this.value=="") {
		this.value=this.defaultValue;
	}
})









