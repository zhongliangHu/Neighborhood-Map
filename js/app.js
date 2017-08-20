var map;
var markers = [];

//加载超时检测
var mapTimeout = setTimeout(function(){
	model.tips("地图加载超时,请使用谷歌地图");
},6000);

//设置位置locations[]
var locations = [
  { title: "杭州西湖",
    location: {lat: 30.2283669051, lng: 120.1347587344}
  },{
    title: "东阳横店影视城",
    location: {lat: 29.1633936915, lng: 120.3699124044}
  },{
    title: "温州雁荡山",
    location: {lat: 28.3893538678, lng: 121.0822165504}
  },{
    title: "宁波象山",
    location: {lat: 29.4823746484, lng: 121.8758660893}
  },{
    title: "兰溪诸葛八卦村",
    location: {lat: 29.2544497752, lng: 119.3019070207}
  },{
    title: "嘉兴乌镇",
    location: {lat: 30.7554558841, lng: 120.4926867879}
  },{
    title: "绍兴鲁迅故里",
    location: {lat: 29.9987480649, lng: 120.5919337356}
  },{
    title: "淳安千岛湖",
    location: {lat: 29.6018722016, lng: 119.0214595304}
  },{
    title: "湖州莫干山",
    location: {lat: 30.6125304250, lng: 119.8750885031}
  },{
    title: "舟山普陀",
    location: {lat: 29.9553159987, lng: 122.3092501811}
  }
];

//maps的初始化
function initMap() {
  //设置map地图样式
  map = new google.maps.Map(document.getElementById('map'), {
    //center: {lat: 30.245, lng: 120.162},
    //zoom: 17,
    streetViewControl: true,
    rotateControl: true,
    zoomControl: true,
    scaleControl: true,

    mapTypeControl: true,
    mapTypeControlOptions:{
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      //mapTypeIds: ["roadmap","terrain"]
    }
  });

  //creat markers
  var inFowindow= new google.maps.InfoWindow();

  locations.forEach(function(item,index,arr){
    var marker = new google.maps.Marker({
      position:item.location,
      map:map,
      title:item.title,
      animation:google.maps.Animation.DROP
    });
    markers.push(marker);

    marker.addListener("click",function(){
      bounce(this);
      showInfoWindow(this,inFowindow);
    });

  });

  //bounce animation
  function bounce(marker){
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function(){
      marker.setAnimation(null);   //2s后标记停止bounce
    },2000)
  };

  //构建 bounds 同时map会自动将视图范围包含所有markers
 function creatBounds(){
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].position);   //extends this bounds to cotain the given point(https://developers.google.com/maps/documentation/javascript/reference?csw=1#LatLngBounds)合并markers.position至bounds--{f{f,d},b{f,d}}
    };
    map.fitBounds(bounds);   //使地图viewport对所有bounds可见
    //console.log(bounds);
 };
 creatBounds();


  //对地图marker的infowindow加载百度地图天气API
 markers.forEach(function(item){
   var myurl = "https://api.map.baidu.com/telematics/v3/weather?location=" + item.position.lng() + "," + item.position.lat() + "&output=json&ak=5knAwtLP2VvgPv7hZMs9aQtn";
   $.ajax({
     url: myurl,
     dataType: 'jsonp',
   })
   .done(function(data){
     if(data['results']){
       var results = data['results'],
           current_weather = results[0]['weather_data'][0],
           imgURL = current_weather['dayPictureUrl'],
           weather = current_weather['weather'],
           temp = current_weather['temperature'];
       item.extra = '<ul style =  "list-style:none; color: green;">';
       item.extra += '<img src = " '+ imgURL +'"" alt="weatherImg"/>';
       item.extra += '<li>Temperature：'+ temp + '</li>';
       item.extra += '<li>Weather：'+ weather + '</li>';
       item.extra += '</ul>';
     }else {
       item.extra = '';
     }
   })
   .fail(function () {
     alert('天气预报加载失败，请检查网络连接');
   })
   .always(function () {
     console.log('complete');
   });
 });
  //地图marker的showinfowindow()函数
  function showInfoWindow(marker,infowindow) {
   if(infowindow.marker != marker) {
       infowindow.marker = marker;
    infowindow.setContent ('<h3>' + marker.title + '</h3>' + marker.extra);
    infowindow.open(map,marker);
   }
 }
};

//ViewModel
var filter = [];
var ViewModel = function () {
var self = this;
this.locationName=ko.observableArray(locations);
this.searchText=ko.observable("");
this.markerItem=ko.observableArray(markers);

this.search = function(value){
  self.locationName([]);
  for (var x in locations) {
  if (locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >=0){
       self.locationName.push(locations[x]);
       markers[x].setVisible(true);
  }else {
      markers[x].setVisible(false);
  };
  }
};

this.searchText.subscribe(self.search);   //searchText绑定search

self.select = function () {
     for (var i = 0; i < locations.length; i++) {
            filter.push(locations[i].title);
     }
     current = filter.indexOf(this.title);
    google.maps.event.trigger(markers[current],'click')
}
};
ko.applyBindings(new ViewModel());

//搜索栏右侧图标的点击事件 searchToggle()函数
function searchToggle(obj,evt){
  var container = $(obj).closest('.search-wrapper');
  var result_container = $(".result-container");
  if(!container.hasClass("active")){
    container.addClass("active");
    result_container.css({
      display: "block"
    });
    evt.preventDefault();
  }else if (container.hasClass("active") && $(obj).closest(".input-holder").length == 0) {
    container.removeClass("active");
    container.find(".search-input").val("");
    container.find(".result-container").fadeOut(600,function(){});
    result_container.css({
      display: 'none'
    });
  }
}
  //fadeOut()的回调函数
$(function (){
  $('#map').height($(document.body).height());
})
