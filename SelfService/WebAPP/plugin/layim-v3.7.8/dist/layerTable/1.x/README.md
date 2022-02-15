## 简介

Layui的 面板扩展表格layerTable，支持异步加载(懒加载)，手风琴方式。

演示地址：


## 更新日志


- 2020-01-01 (v1.0)
    - 基于layui数据表格table模板实现 面板扩展结构
    - 实现折叠/展开功能 
    - 支持懒加载(异步加载)，暂不支持数据渲染
    - 支持表头样式设置
    - 支持表格样式重定义 


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



