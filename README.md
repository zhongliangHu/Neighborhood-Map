## 街区地图项目

### Online Version: https://zhonglianghu.github.io/Neighborhood-Map/

### 使用指南

1. 下载该项目所有文件，双击index.html或者访问Online Version在线地址，即可打开基于谷歌地图的街区地区项目-浙江十大景点。
2. 该项目使用**Google Maps API**对浙江省的十大景点设置标记，单击标记即可在信息窗口中显示出该景点的天气状况。
3. 基于bootstrap框架在地图中心设置搜索输入框及十大景区地点列表视图，用于搜索及显示所有景区名称。
4. 利用**knockout框架**(MVVM模式)，对输入框、列表及操作事件进行绑定，避免了手动刷新。点击列表景区名称与单击该景区标记具同样的功能，搜索框输入景区名称后，可筛选出该景点在列表视图中显示。
5. 使用第三方API功能，即**百度地图车联网API**中的天气预报功能，使用ajax进行跨域传递数据，获取标记景点的天气状况，从而在信息窗口中显示。

----

### 项目使用资源链接
* [第三方API功能：百度地图车联网API(天气预报)](http://lbsyun.baidu.com/index.php?title=car/guide/introduction)
* [knockout文档资源](http://knockoutjs.com/documentation/introduction.html)
* [Google Maps JavaScript API 参考文档](https://developers.google.com/maps/documentation/javascript/reference)
* [Google Maps JavaScript API 指南参考](https://developers.google.com/maps/documentation/javascript/tutorial)

### 使用 Bootstrap 样式
这个项目基于 Twitter 旗下的 <a href="http://getbootstrap.com/">Bootstrap框架</a> 制作。

* <a href="http://getbootstrap.com/css/">Bootstrap CSS</a>
* <a href="http://v2.bootcss.com/base-css.html">Bootstrap 基本样式</a>
* <a href="http://getbootstrap.com/components/">Bootstrap组件</a>
