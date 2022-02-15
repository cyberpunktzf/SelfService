## 简介

Layui的 面板扩展表格layerTable，支持异步加载(懒加载)，暂不支持手风琴方式。

演示地址：


## 更新日志

- 2020-01-03 (v2.0)
    - 重构了框架，支持 layui table 方法渲染的方式加载的表格中进行 折叠/展开新表格
    - 仅支持 layui table 【方法渲染】的表格
    - 支持 回调

- 2020-01-01 (v1.0)
    - 基于layui数据表格table模板实现 面板扩展结构
    - 仅支持 layui table 【自动渲染】的表格
    - 实现折叠/展开功能 
    - 支持懒加载(异步加载)，暂不支持数据渲染
    - 支持表头样式设置
    - 支持表格样式重定义 

## 导入模块

把`/2.x/layerTable`整个目录放在你的项目里面，正确配置模块路径即可使用：
```javascript
    // 引入方法
    layui.config({
        base: '/'
    }).extend({
        layerTable: 'layerTable/layerTable'
    }).use(['layerTable'], function () {
        var layerTable = layui.layerTable;
    });

```
如果不会引用先到layui官网查看模块规范介绍。

## 快速使用

- 定义一个 toolbar 脚本，供table col 调用
```html
<!-- 行内工具栏：展开/折叠 -->
<script type="text/html" id="barCollapse">
    <!-- 注意，这里的event = expand，icon也有单独定义 -->
    <a lay-event="expand"><i class="layui-icon layui-icon-triangle-r"></i></a> 
</script>

```

- 原始的主表，采用方法渲染：
```javascript
    // 初始化 table Options
    // 注意：toolbar 对应的是刚才定义的 barCollapse
    let tbOptions = {
        // table 其他参数
        cols: [[
            {type: 'numbers', title: 'ID', width: 50}, // 序号
            {title: '详情', field: '', width: 100, toolbar: '#barCollapse'}, // 展开/折叠 操作列
            // 其他cols
        ]],
    };


```

- 定义 原始主表 的tool 监听事件
```javascript
    //监听行工具事件
    table.on('tool(tableDemo)', function (obj) {
        let data = obj.data;
        // layerTable options 初始化
        // 注意：如果没有加main，默认都是指子表的参数
        // 因为需要传递包括 obj, $(this), $(this).parents('tr') 这些参数
        // 所以初始化需要在 table.on 中完成
        let layerTbOptions = {
            mainElem: '#mainTableName', // main table 容器，注意，是原始主表的容器
            url: 'testapi', // 子表API接口

            width: 1600,
            cols: [[
                {field: 'order_no', title: '流水号', width: 180},
                {field: 'carnum', title: '车牌', width: 100},
                {field: 'do_time', title: '活动时间', width: 150},
                {field: 'do_city', title: '活动城市', width: 100},
                {field: 'do_addr', title: '活动地点', width: 200},
                {field: 'create_datetime', title: '创建时间', width: 180},
            ]],  // 表头参数，二位数组。用法和layui table 一样

            // 【重要！！重要！！重要！！】
            rowData: obj.data, // 将当前的 行数据 传递
            eventObj: obj, // 将当前的 对象 传递

            // 【重要！！重要！！重要！！】
            // reqField：可以是对象，也可是数组。
            // 如果是对象，索引是url http 请求的参数名。值是行记录的参数字段名。
            reqField: ['carnum', 'do_time'], 

            // 【重要！！重要！！重要！！】以下两个参数也非常重要，一定都要传递进来
            jQueryThis: $(this),
            jQueryTr: $(this).parents('tr'),

            logOn: true, // 开启 log 打印，建议正式发布版本设置为false。默认=false
        };

        switch (obj.event) {
            // 如果当前是 展开 事件
            case 'expand':
                layerTbOptions.layEvent = '1'; // 注意：展开事件 = "1"（字符串）
                layui.use(['layerTable'], function () {
                    let layerTable = layui.layerTable;
                    layerTable.render(layerTbOptions); // 和table 一样的render 方法
                });
                break;

            // 如果当前是 折叠 事件
            case 'closed':
                layerTbOptions.layEvent = '2'; // 注意：折叠事件 = "2"（字符串）
                layui.use(['layerTable'], function () {
                    let layerTable = layui.layerTable;
                    layerTable.render(layerTbOptions); // 和table 一样的render 方法
                });
                break;


        }
    });

```
大功告成。

## 设置 新表格的样式
```javaScript
    let layerTbOption = {
        // 其他参数
        skin: undefined, // line =（行边框风格），row =（列边框风格），nob =（无边框风格）
        size: 'sm',  // 表格尺寸，默认=sm
        even: true,  // 是否开启隔行变色，默认=true
        evenColor: "#C8EFD4", // 隔行变色的底色，默认=#C8EFD4

        parseData: function (res) { return parseData(this, res); },
        renderHeader: function (that, res) { return renderHeader(this, that, res); }, // 完成后的回调，处理 header
        renderTable: function (that, res, curr, count) { return renderTable(this, that, res, curr, count); }, // 完成后的回调，处理 table
        renderEvenRow: function (that, res) { return renderEvenRow(this, that, res); }, // 完成后的回调，处理 table even row

    };
```
在这里，renderHeader，renderTable，renderEvenRow，even，evenColor，skin，size 等参数，都是可以用来设置新表格的样式


## 基础参数一览表

以下参数，如果没有前缀main，都是指针对 扩展面板中显示的新表格的参数

参数 | 类型 | 说明 | 示例值
:--- | :--- | :--- | :---
mainElem | String/DOM | 指定 main table 容器的选择器或 DOM | '#demo'
url | String | http API接口 | 'collapse.html'
cols | Array | 列配置，二位数组 | 和layui table一样
rowData | Array | 当前的 行数据 | obj.data
eventObj | Object | 当前的 对象 | obj
jQueryThis | DOM | 当前对象自己 | $(this)
jQueryTr | DOM | 当前对象的父级（即当前行DOM） | $(this).parents('tr')
reqField | Array|Object | http请求的参数。如果是对象，索引是url http，详见 reqField用法请求的参数名。值是行记录的参数字段名。 | [{}, {}, {}, {}, …]，和layui table一样
width | Number | 设定容器宽度，暂不支持 | 350
height | Number/String | 设定容器高度，暂不支持 | 300 
cellMinWidth | Number | 定义所有单元格的最小宽度，暂不支持 | 100
even | Boolean | 开启隔行背景| true/false，默认=true
evenColor | String | 设置隔行背景，even=true才有效 | 默认=#C8EFD4
size | String | 设定表格尺寸 | sm 小尺寸、lg 大尺寸，和layui table一样，默认=sm
parseData | Function | 数据返回后的处理 | 同layui table 的parseData 一样
renderHeader | Function | done完成后渲染新表的标题行 | 详见 自定义方法参数functions
renderEvenRow | Function | done完成后渲染奇偶行，even=true生效 | 详见 自定义方法参数functions
renderTable | Function | done完成后渲染新表 | 详见 自定义方法参数functions
layEventOn | Object | 是否开启 lay-event 触发事件 | 默认：开启
layEvent | String | 当前Event的取值 | 不支持自定义
layEvents | Object | Event 对应的配置 | 详见 事件参数一览表 layEvents
logOn | Boolean | 是否开启 log 打印 | 建议正式发布版本设置为false。默认=false


## 重点介绍下 reqField 的用法
```html
为了更好的说明，我假设当前操作行中，carname = '京AX123Y'（测试数据）
1、数组
比如 reqField: ['carname']，则子表 的http 请求中传递的where = {'carname':'京AX123Y'}。
2、对象
比如 reqField: {'req_name':'carname'}，则子表 的http 请求中传递的where = {'req_name':'京AX123Y'}。
```
能看明白两者的区别吗？


## 事件参数一览表 layEvents

- 该对象，一共就两个成员：expand（展开）、closed（折叠）。这两个成员的成员定义如下：
- 这里的code 和 next 就是状态码，支持自定义，但要保证 html中和js 都保持统一

参数 | 类型 | 说明 | 示例值
:--- | :--- | :--- | :---
func | String | 当前触发事件名称 | 'expand', 'closed',
title | String | 当前仅支持log中使用 | '展开'
icon | String | 折叠/展开对应的icon | 请参见layui iconfont

- 以下是layerTable.js 中的默认Options 配置
```JavaScript
    // 展开/折叠 状态码
    const eventExpand = '1'; // 展开
    const eventClosed = '2'; // 折叠

    /**
     * 默认参数，语法定义，参考了layui.table 的options 的方式
     * reference: https://www.layui.com/doc/modules/table.html#options
     */
    let defaultOption = {
        mainElem: undefined,   // main table 容器
        url: undefined,  // http API接口
        method: 'post', // http 请求的方法
        data: [],  // 数据
        cols: [],  // 列配置，二位数组

        where: undefined, // 异步加载数据的请求参数的名称，同时也是html 中action 方法中后面带的参数，注意要保持顺序一致

        reqField: undefined, // 异步请求需要传递的参数的字段名称，一维数组，v2.0新增
        rowData: undefined, // 当前要操作行的所有记录，要和 reqField 字段配合使用，获取需要异步传递的参数，v2.0新增
        eventObj: undefined, // 整张表格渲染的数据，v2.0新增，暂时没用
        keyField: undefined, // 整张表索引的名称，v2.0新增
        jQueryThis: undefined, // 一般用于layui.table中的on监听tool的时候，=$(this)，v2.0新增
        jQueryTr: undefined, // tr DOM，=$(this).parent('tr')，v2.0新增

        width: undefined,  // 容器宽度
        height: undefined,  // 容器高度
        cellMinWidth: 100,  // 单元格最小宽度
        totalRow: false, // 是否开启 合计
        skin: undefined, // line =（行边框风格），row =（列边框风格），nob =（无边框风格）
        size: 'sm',  // 表格尺寸，默认=sm
        even: true,  // 是否开启隔行变色，默认=true
        evenColor: "#C8EFD4", // 隔行变色的底色，默认=#C8EFD4

        parseData: function (res) { return parseData(this, res); },
        renderHeader: function (that, res) { return renderHeader(this, that, res); }, // 完成后的回调，处理 header
        renderTable: function (that, res, curr, count) { return renderTable(this, that, res, curr, count); }, // 完成后的回调，处理 table
        renderEvenRow: function (that, res) { return renderEvenRow(this, that, res); }, // 完成后的回调，处理 table even row

        layEventOn: true, // 是否开启 lay-event 触发事件，默认：开启
        layEvent: eventExpand, // 1=展开，2=折叠，支持任意格式
        layEvents: {
            expand: {func: 'closed', title: '', icon: 'layui-icon-triangle-d'}, // 展开事件
            closed: {func: 'expand', title: '', icon: 'layui-icon-triangle-r'}, // 折叠事件
        }, // 展开、折叠 配置

        logOn: false, // 是否开启 log 打印
    };
```

## 自定义方法参数一览表 functions

参数 | 类型 | 说明 | 示例值
:--- | :--- | :--- | :---
this | Object | 指原始表的Options配置 |
that | DOM | 新创建的表的上层目录，可以对此进行各类操作 | this.elem.next()，其中this 就是新表done回调中的this
res | Array | 新表done完成后返回的数据 | 参见layui table done
curr | Number | 当前页码 | 参见layui table done，仅限renderTable
count | Number | 当前页面数据长度 | 参见layui table done，仅限renderTable




## -------------------------------
## -------------------------------
## -------------------------------
## -------------------------------

- 以下是v1.0 的指导书

## 导入模块
把`/1.x/layerTable`整个目录放在你的项目里面，正确配置模块路径即可使用：
```javascript
    // 引入方法
    layui.config({
        base: '/'
    }).extend({
        layerTable: 'layerTable/layerTable'
    }).use(['layerTable'], function () {
        var layerTable = layui.layerTable;
    });

```
如果不会引用先到layui官网查看模块规范介绍。


## 快速使用

- 原始的主表的自动渲染：
```html
<!-- 这里是原始表格的具体内容，这部分的操作和处理，都和原来的layui table 一样，这里不重复 -->
<!-- 这里采用自动渲染的方式来加载 -->
<table id="demoTb1">
    <thead>
    <tr>
        <th>详情</th>
        <th>ID</th>
        <th>标题1</th>
        <th>标题2</th>
        <th>标题3</th>
    </tr>
    </thead>
    <tbody>
    {volist name="vo_list" id='vo' empty="暂时没有数据"}

    <!-- 注意：这里一定要给每一行增加一个id -->
    <tr id="tr{$vo.id}"> 
        <!-- 第一列是折叠/展开图标所在列 -->
        <td>
            <!-- 注意，这里的方法 collapse，很重要，后面都会判断这个方法名 -->
            <a onclick="collapse('{$vo.id}','1','{$vo.param1}','{$vo.param2}')" href="javascript:;">
                <i class="layui-icon layui-icon-triangle-r"></i>
            </a>
        </td>

        <td>{$vo.id??''}</td>
        <td>{$vo.field1??''}</td>
        <td>{$vo.field2??''}</td>
        <td>{$vo.field3??''}</td>
    </tr>
    {/volist}
    </tbody>
</table>
```

- 这里是指针对 扩展面板中新增表格的数据渲染

方案1：采用数据渲染（方法渲染）

```javascript

    let data = [{
            id: '1',
            field1: '1-1',
            field2: '1-2',
            field3: '1-3',
            field4: '2020/01/01 10:44:00'
        }, {
            id: '2',
            field1: '2-1',
            field2: '2-2',
            field3: '2-3',
            field4: '2020/01/01 10:44:00'
        }];

    /**
     * 折叠/展开面板方法，页面调用方法
     *
     * @param id
     * @param action
     * @param param1
     * @param do_time
     */
    function collapse(id, action, param1, param2) {
        let options = {
            mainElem: '#demoTb1', // main table 容器
            data: data, // 请求数据
            collapseName: 'collapse', // 页面使用的方法名，默认=collapse，注意这里要和html中的方法名一致
            actionCol: 0, // “展开/折叠”列在第 0 列，暂时不可定义，默认：0

            cols: [[
                {field: 'id', title: 'ID', minWidth: 50},
                {field: 'field1', title: '参数1'}, // 对应 param1 的字段
                {field: 'field2', title: '参数2'}, // 对应 param2 的字段
                {field: 'field3', title: '参数3'},
                {
                    field: 'field4',
                    title: '参数4',
                    minWidth: 300,
                    templet: '<div><span title="{{d.field4}}">{{d.field4}}</span></div>', // 鼠标悬停在上面有tips 提示
                },
                {field: 'create_datetime', title: '创建时间'},
            ]],  // 表头参数，二位数组，和 layui Table 的格式一样

            // url 中需要传递的参数，同时也是html 中action 方法中后面带的参数
            // 注意：这里需要把传递的参数，按照 html 中action 配置的顺序进行封装
            // 注意：本函数输入参数中，从第3个参数开始，都是要传递的参数，要按照顺序封装
            where: {'field1': param1, 'field2': param2},

            id: id,  // 主表中当前要操作的行记录的索引。很重要，所有的操作都需要涉及到这个id
            action: action, // 1=展开，2=折叠，字符串格式
            logOn: true, // 开启 log 打印，建议正式发布版本设置为false。默认=false
        };

        layui.use(['layerTable'], function () {
            let layerTable = layui.layerTable;
            layerTable.render(options);
        });
    }


```


方法2：请求网络数据、懒加载：
```javascript

    /**
     * 折叠/展开面板方法，页面调用方法
     *
     * @param id
     * @param action
     * @param param1
     * @param do_time
     */
    function collapse(id, action, param1, param2) {
        let options = {
            mainElem: '#demoTb1', // main table 容器
            url: '{:url("collapse")}', // 异步请求接口，这里显示的是TP5的url写法
            collapseName: 'collapse', // 页面使用的方法名，默认=collapse，注意这里要和html中的方法名一致
            actionCol: 0, // “展开/折叠”列在第 0 列，暂时不可定义，默认：0

            cols: [[
                {field: 'id', title: 'ID', minWidth: 50},
                {field: 'field1', title: '参数1'}, // 对应 param1 的字段
                {field: 'field2', title: '参数2'}, // 对应 param2 的字段
                {field: 'field3', title: '参数3'},
                {
                    field: 'field4',
                    title: '参数4',
                    minWidth: 300,
                    templet: '<div><span title="{{d.field4}}">{{d.field4}}</span></div>', // 鼠标悬停在上面有tips 提示
                },
                {field: 'create_datetime', title: '创建时间'},
            ]],  // 表头参数，二位数组，和 layui Table 的格式一样

            // url 中需要传递的参数，同时也是html 中action 方法中后面带的参数
            // 注意：这里需要把传递的参数，按照 html 中action 配置的顺序进行封装
            // 注意：本函数输入参数中，从第3个参数开始，都是要传递的参数，要按照顺序封装
            where: {'field1': param1, 'field2': param2},

            id: id,  // 主表中当前要操作的行记录的索引。很重要，所有的操作都需要涉及到这个id
            action: action, // 1=展开，2=折叠，字符串格式
            logOn: true, // 开启 log 打印，建议正式发布版本设置为false。默认=false
        };

        layui.use(['layerTable'], function () {
            let layerTable = layui.layerTable;
            layerTable.render(options);
        });
    }

```

> 用法大部分与数据表格table模块一致。


## 基础参数一览表

以下参数，如果没有前缀main，都是指针对 扩展面板中显示的新表格的参数

参数 | 类型 | 说明 | 示例值
:--- | :--- | :--- | :---
mainElem | String/DOM | 指定 main table 容器的选择器或 DOM | '#demo'
url | String | http API接口 | 'collapse.html'
cols | Array | 列配置，二位数组 | 和layui table一样
collapseName | String | 页面使用的方法名，默认=collapse | 'collapse'
actionCol | Number | “展开/折叠”列在第 0 列，暂时不可定义，默认：0 | 0
action | String | 1=展开，2=折叠，字符串格式，支持自定义 | 0，详见 操作状态参数actions
actions | Object | 展开、折叠 对象 | 详见 操作状态参数actions
data | Array | 直接赋值数据 | [{}, {}, {}, {}, …]，和layui table一样
width | Number | 设定容器宽度，暂不支持 | 350
height | Number/String | 设定容器高度，暂不支持 | 300 
cellMinWidth | Number | 定义所有单元格的最小宽度，暂不支持 | 100
even | Boolean | 开启隔行背景| true/false
evenColor | String | 设置隔行背景，even=true才有效 | 默认=#C8EFD4
size | String | 设定表格尺寸 | sm 小尺寸、lg 大尺寸，和layui table一样
renderHeader | Function | done完成后渲染表头 | 详见 自定义方法参数functions
renderEvenRow | Function | done完成后渲染奇偶行，even=true生效 | 详见 自定义方法参数functions
renderTable | Function | done完成后渲染新表 | 详见 自定义方法参数functions
table | Object | 主表DOM，和mainElem对应 | 不支持自定义
logOn | Boolean | 是否开启 log 打印 | 建议正式发布版本设置为false。默认=false


## 操作状态参数一览表 actions

- 该对象，一共就两个成员：expand（展开）、closed（折叠）。这两个成员的成员定义如下：
- 这里的code 和 next 就是状态码，支持自定义，但要保证 html中和js 都保持统一

参数 | 类型 | 说明 | 示例值
:--- | :--- | :--- | :---
code | String | 当前状态值 | '1'，默认：expand='1', closed='2'
next | String | 下一个状态值 | 同code
title | String | 当前支持log中使用 | '展开'
icon | String | 折叠/展开对应的icon | 请参见layui iconfont



## 自定义方法参数一览表 functions

参数 | 类型 | 说明 | 示例值
:--- | :--- | :--- | :---
that | DOM | 新创建的表的上层目录，可以对此进行各类操作 |
res | Array | 新表done完成后返回的数据 | 参见layui table done
curr | Number | 当前页码 | 参见layui table done
count | Number | 当前页面数据长度 | 参见layui table done



## 默认展开



## 实例方法


## 常见问题



## 效果展示



