# bs-3d

##  结构
* page 放置页面HTML文件
* json 放置接口模拟数据
* js 放置JS数据
* css 放置CSS代码
* font 字体
testtesttest

## 接口默认规则
* 因未沟通接口形式，采用默认形式
* 默认接口返回形式：
	* 成功: errno:0
	* 失败: errno != 0，错误信息放置在errmsg字段中
	* 返回数据放在data字段中

## 模拟接口修改地方
* 采用模块化，每个页面引JS的入口处已列出所有的接口路径，及对应的类型，方便统一修改
* 如图：
* ![](http://ww1.sinaimg.cn/large/801b780ajw1f8fd64cw6dj215u0i0dis.jpg)
