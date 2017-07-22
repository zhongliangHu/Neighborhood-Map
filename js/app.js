var map;

//mvvm 中的model
var model = {
	inputval: ko.observable(),
	items: ko.observableArray(),
	infoWindow: undefined,
	tips: ko.observable(""),
}；
ko.applyBindings(model);

//加载超时检测
var mapTimeout = setTimeout(function(){
	model.tips("地图加载超时啦");
},6000);

//function init() baidu map api的回调函数，实现了app的初始化
function init(){
	window.clearTimeout(mapTimeout);
	map = new BMap.Map("map",{enableMapClick:false}); //创建Map实例
	initMarker(BMap.Marker.prototype);
	var geolocation = new BMap.Geoloction();
	geolocation.getCurrentPosition(function(r){
		if (this.getStatus() == BMap_STATUS_SUCCESS){
			map.panTo(r.point);
		}
		else {
			alert("定位失败："+ this.getStatus());
		}
		loadData(model.items);
	},{enableHighAccuracy:true});
	convert(new BMap.Point(120.1122183704376,30.284863403785405),function(data){
		map.centerAndZoom(data.pionts[0],17);//初始化地图，设置中心点坐标和地图级别
		map.setControl(new BMap.MapTypeControl()); //添加地图类型控件
		map.setCurrentCity("杭州"); //设置地图显示的城市 此项必须设置
		map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
	});
	model.infoWindow = new BMap.InfoWindow();
}

function convert(point,cb){
	var convertor=new BMap.Convertor();
	var pointArr=[];
	pointArr.push(point);
	convertor.translate(pointArr,3,5,cb);
}

//function initMarker() 在Google.maps.Marker类的基础上进行扩展 添加了Marker的放大缩小功能，infoWindow的弹出功能
// @param{*} proto

function initMarker(proto){
	proto.setLarge=function(){
		this.selected = true;
		window.setTimeout(function(){
			if(this.selected){
				this.getMap().panTo(this.position);
				this.showLabel();
				this.setAnimation(BMAP_ANIMATION_BOUNCE);
			}
		}.bind(this),200);
	}；
	proto.showLabel=function(){
		this.setTop(true);
		this.setLabel(new BMap.Label(this.title,{offset:new BMap.Size(20,-10)}));
	};
	proto.setNormal=function(){
		this.selected=false;
		this.setAnimation(null);
		this.setTop(false);
		this.getMap().removeOverlay(this.getLabel());
	};
	proto.openWindow=function(){
		model.infoWindow.setContent(this.stationInfo);
		this.openInfoWindow(model.infoWindow);
		this.windowOpen=true;
	};
	proto.toggleWindow = function(){
		if(window.clickDelay)
			return;
		window.clickDelay=true;
		window.setTimeout(function(){
			window.clickDelay=false;
			if(this.windowOpen){
				this.closeInfoWindow();
				return;
			}
			this.openWindow();
		}.bind(this),200);
	};
	proto.setWindowClose=function(){
		this.windowOpen=false;
	};
	
}

function toggleside(){
	$(".container").toggleClass)("side-hide");
}

//实现bus stop 信息的查询 完成Marker的初始化
//@param{*} items

function loadData(items){
	map.clearOverlays();
	items.removeAll();
	var options = {
		pageCapacity: 10,
		onSearchComplete:onSucess
	};
	var local = new BMap.LocalSearch(map,options);
	local.searchInBounds("公交站",map.getBounds());
	function onSucess(results){
		if(local.getStatus() == BMap_STATUS_SUCCESS){
			//判断状态是否正确
			setMarker(results);
			var nextPage = results.getPageIndex()+1;
			if(nextPage < results.getNumPages())
				local.gotoPage(nextPage);
		}
	}
	function setMarker(results){
		var curPosi;
		for (var i=0; i<results.getCurrentNumPois(); i++){
			// s.push(results.getPoi(i).title + ", " + results.getPoi(i).address); 
			curPosi = results.getPoi(i);
			
			var marker = new BMap.Marker(curPosi.point);
			marker.title = curPosi.title;
			marker.visible = true;
			marker.selected = false;
			marker.stationInfo = curPosi.address;
			marker.position = curPosi.point;
			marker.open = false;
			
			marker.addEventListener("click",marker.toggleWindow);
			marker.addEventListener("mouseover",marker.showLabel);
			marker.addEventListener("mouseout",marker.setNormal);
			marker.addEventListener("infoWindowclose",marker.setWindowClose);
			items.push(marker);
			map.addOverlay(marker);	
		}
		
	}
}

function showList(){
	$(".sidebar ul").addClass("show");
}
function hideList(){
	window.setTimeout(function(){
		$(".show").toggleClass("show");
	},100);
}
function inputChange(m){
	window.clearTimeout(window.keypressTimer);
	window.keypressTimer = window.setTimeout(function(){
		var value = m.inputval();
		var list = m.items().map(function(marker,index){
			if (marker.title.match(value) ){
				marker.visible = true;
				marker.show();
			}else{
				marker.visible = false;
				marker.hide();
			}
			return marker;	
		});
		m.items.removeAll();
		m.items(list);
	},500);
	return true;
}

// google map api 权限检测
function gm_authFailure(){
	model.tips("google map 无权访问");
}





