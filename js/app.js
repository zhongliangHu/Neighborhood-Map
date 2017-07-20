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

var icon，icon_large;

