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
