/*
 *V1  L
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

var tenCode=[];
var error_date=[];


//创建二维矩阵
function Mat(a,b){
	var mat=new Array(a);
	for (var i = 0; i < a; i++) {
		mat[i]=new Array(b);
	}
	return mat;
}

//数组覆盖 
function arrOver(A,B,p,q){
	for (var a = 0; a < B.length; a++) {
		if (B[a].length!=undefined) {   //B是二维矩阵
			for (var b = 0; b < B[0].length; b++) {
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



var timing_1=[1,0,1,0,1];
var timing_2=[[1],[0],[1],[0],[1]];


var wh_area_1=[0,0,0,0,0,0,0,0];
var wh_area_2=[[0],[0],[0],[0],[0],[0],[0],[0]];

//初始化模板
function init(){  
	data=Mat(21,21);
	mask=Mat(21,21);
	//position x3 
	arrOver(data,position,0,0);
	arrOver(data,position,14,0);
	arrOver(data,position,0,14);

	//timing
	arrOver(data,timing_1,6,8);
	arrOver(data,timing_2,8,6);

	//外围白圈
	arrOver(data,wh_area_1,7,0);
	arrOver(data,wh_area_1,7,13);
	arrOver(data,wh_area_1,13,0);
	arrOver(data,wh_area_2,0,7);
	arrOver(data,wh_area_2,0,13);
	arrOver(data,wh_area_2,13,7);	
}


/*Format Information  2+3+10
*01 101
*python:
*def _fmtEncode(fmt):
    '''Encode the 15-bit format code using BCH code.'''
    g = 0x537
    code = fmt << 10
    for i in range(4,-1,-1):
        if code & (1 << (i+10)):
            code ^= g << i
    return ((fmt << 10) ^ code) ^ 0b101010000010010
*
*得：25368
*110001100011000
*/
function draw_format(){
	var format="110001100011000";
	format=format.split("");
	for (var index = 0; index < format.length; index++) {
		format[index]=parseInt(format[index]);
	}	

	var format_1=format.slice(0,8).reverse();
	var format_2=format.slice(8).rowToCol();
	format_2.unshift([1]);
	var format_3=format.slice(0,8)
	format_3.splice(5,0,1);
	format_3=format_3.rowToCol();
	var format_4=format.slice(8)
	format_4.splice(1,0,1);
	format_4=format_4.reverse();

	arrOver(data,format_1,8,13);
	arrOver(data,format_2,13,8);
	arrOver(data,format_3,0,8);
	arrOver(data,format_4,8,0);	

	for (var i = 0; i < 21; i++) {  //令mask=模板
		for (var j = 0; j < 21; j++) {
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
	while (codeLen<19) {
		code=code+"11101100";
		codeLen++;
		if (codeLen<19) {
			code=code+"00010001";
			codeLen++;
		}
	}

	//二进制 -> 十进制
	for (var i = 0; i < 19; i++) {
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

	error_date=_rsEncode(tenCode,7);
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

//合并
function codePlace(){
	var allCode=[];
	for (var i = 0; i < tenCode.length; i++) {
		allCode.push(tenCode[i]);
	}
	for (var i = 0; i < error_date.length; i++) {
		allCode.push(error_date[i]);
	}
	return allCode;
}

//填码
function putCode(){
	var code=codePlace();
	var block;
	
	var blockCode=[]; 
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

	for (var j =10; j >0; j--) {
		if (j==3) {
			j=2.5;
		}
		if (flag==1) {
			for (var i = 20; i >=0 ; i--) {
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
			for (var i = 0; i <=20 ; i++) {
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
	var maskCode=Mat(21,21);
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
			context.fillRect(10*y,10*x,10,10)
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