/**
 * 面板扩展表格 2.x
 * date:2020-01-05
 * License By CrazyYi.
 */

layui.define(['table', 'laytpl'], function (exports) {
    let $ = layui.jquery;
    let table = layui.table;
    let laytpl = layui.laytpl;

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

        // 【重要！！重要！！重要！！】
        // reqField：可以是对象，也可是数组。v2.0新增
        // 如果是对象，索引是url http 请求的参数名。值是行记录的参数字段名。
        reqField: undefined,

        // 【重要！！重要！！重要！！】
        rowData: undefined,     // 当前要操作行的所有记录，要和 reqField 字段配合使用，获取需要异步传递的参数，v2.0新增
        eventObj: undefined,    // 整张表格渲染的数据，v2.0新增，暂时没用

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

        // 【重要！！重要！！重要！！】
        // 这里是配置 展开/折叠 操作的属性，包括 事件，名称，icon 等
        layEvents: {
            expand: {func: 'closed', title: '', icon: 'layui-icon-triangle-d'}, // 展开事件
            closed: {func: 'expand', title: '', icon: 'layui-icon-triangle-r'}, // 折叠事件
        }, // 展开、折叠 配置

        logOn: false, // 是否开启 log 打印
    };

    /**
     * Sub Table 默认参数，这里所有的参数，都遵循着 layui table 的规定
     * reference: https://www.layui.com/doc/modules/table.html#options
     */
    let subDefaultOptions = {
        elem: undefined,
        url: undefined,
        method: undefined,
        where: undefined, // 要传递的数据
        even: false, // 隔行背景
        size: undefined, // 尺寸，sm=小尺寸，lg=大尺寸
        skin: undefined, // line =（行边框风格），row =（列边框风格），nob =（无边框风格）
        height: undefined,
        width: undefined,
        cols: undefined,
        parseData: function (res, curr, count) { },
        done: function (res, curr, count) { },
        totalRow: false,
        cellMinWidth: undefined,
    };

    /**
     * layerTable 类构造方法
     * @param options
     * @param event
     */
    let layerTable = function (options, event) {
        event ? options.layEvent = event : ''; // 采用这种方式也可以渲染
        this.options = $.extend(defaultOption, options);

        this.init();
    };

    /**
     * 初始化
     */
    layerTable.prototype.init = function () {
        // 初始化：main table
        this.mainTableInit(); // 当前主表

        // 初始化：where对象
        let options = this.options;
        let where = {};
        let regex = /^\d+$/; //判断字符串是否为数字
        for (let i in options.reqField) {
            let param = options.reqField[i];
            // 如果 索引i是数字
            if (regex.test(i)) {
                where[param] = options.rowData[param];
            } else {
                where[i] = options.rowData[param];
            }
        }
        this.options.where = where;

        this.printLog('options:', this.options);
        this.printLog('mainTable:', this.mainTable);

        // 开始执行
        $(this).attr('lay-event', 'closed1').html('<i class="layui-icon layui-icon-triangle-d"></i>折叠1');
        switch (this.options.layEvent) {
            case eventExpand:
                this.expand();
                break;
            case eventClosed:
                this.closed();
                break;
            default:
                this.printLog('layEvent error:', this.options.layEvent);
        }
    };

    /**
     * 新增一行，在行内新增一个表格
     * @returns {boolean}
     */
    layerTable.prototype.insertTable = function () {
        this.printLog('--- insert table');
        let options = this.options;
        let tr = options.jQueryTr;

        let mainTb = this.mainTable;
        let id = mainTb.iRow;

        let tableId = this.newTableId(id); // 新增表格的id
        let trId = this.newTrId(id);
        let _html = [
            '<tr class="table-item" id="' + trId + '">', // 新增一行，并给该行新增一个id属性
            '  <td colspan="' + mainTb.tdCount + '" style="padding: 6px 12px;">', // 合并整行所有单元格
            '    <table class="layui-table layui-hide" id="' + tableId + '"></table>', // 在单元格内新增一个表格
            '  </td>',
            '</tr>'
        ];
        tr.after(_html.join('\n'));  // 在当前行的后面，插入一行

        return true;
    };

    /**
     * 删除新增的表格（删除该表格所在的新行）
     * @returns {boolean}
     */
    layerTable.prototype.deleteTable = function () {
        this.printLog('--- delete table');
        let tr = this.options.jQueryTr;
        tr.next().remove();
        return true;
    };

    /**
     * 折叠（直接把这行删除即可）
     */
    layerTable.prototype.closed = function () {
        this.eventChange('closed');
        this.deleteTable();
    };

    /**
     * 详情（新增一行，并在行内创建一个新表格）
     */
    layerTable.prototype.expand = function () {
        this.eventChange('expand');
        this.insertTable();
        this.newTableRender();
    };

    /**
     * 改变 toolbar 或 templet 单元格的内容，样式等
     * @param action
     */
    layerTable.prototype.eventChange = function (action) {
        let options = this.options;
        if (!options.layEventOn) return; // 没有开启 lay-event 更新

        let jqThis = options.jQueryThis;
        let eventCfg = options.layEvents[action];
        let _html = '<i class="layui-icon currIcon"></i>currTitle';
        _html = _html.replace('currIcon', eventCfg.icon);
        _html = _html.replace('currTitle', eventCfg.title);
        jqThis.attr('lay-event', eventCfg.func).html(_html);
    };

    /**
     * 新增子表的重新渲染
     */
    layerTable.prototype.newTableRender = function () {
        this.printLog('--- table render');
        let options = this.options;

        let subOptions = {
            elem: '#' + this.newTableId(this.mainTable.iRow)
            , url: options.url
            , method: options.method
            , where: options.where // 要传递的数据
            , even: options.even // 隔行背景
            , size: options.size
            , height: options.height
            , width: options.width
            , cols: options.cols
            , parseData: function (res) {
                if (options.parseData) {
                    return options.parseData(res); // 类似 table 的parseData
                }
            }
            , done: function (res, curr, count) {
                let that = this.elem.next(); // 这个是获取到整个新建表格的上层元素

                if (options.renderHeader) {
                    options.renderHeader(that, res); // 设置表格头header样式
                }
                if (options.renderEvenRow) {
                    options.renderEvenRow(that, res); // 设置奇数行的底色
                }
                if (options.renderTable) {
                    options.renderTable(that, res, curr, count);
                }
            }
        };
        this.subOptions = $.extend(subDefaultOptions, subOptions);

        // 表格 渲染
        let subTable = table.render(this.subOptions);
    };

    /**
     * 新增行（用于显示详情）的id
     * @param id
     * @returns {string}
     */
    layerTable.prototype.newTrId = function (id) {
        return 'trSubInfo' + id;
    };

    /**
     * 新增表的id
     * @param id
     * @returns {string}
     */
    layerTable.prototype.newTableId = function (id) {
        return "tbSubInfo" + id;
    };

    /**
     * 初始化主表 main Table
     */
    layerTable.prototype.mainTableInit = function () {
        let options = this.options;
        let elem = options.mainElem;
        let elemId = (elem.substr(0, 1) === '#') ? elem.substr(1) : elem;
        let tb = document.getElementById(elemId);

        let iRow = this.currRow(); // 获取当前 id 对应的行

        let tr = options.jQueryTr; // $(this).parent('tr')
        let tdCount = tr.find('td').length;  // 每一行的单元格的数量（就是列的数量）

        // 保存 表相关参数
        this.mainTable = {
            table: tb,
            tdCount: tdCount,
            iRow: iRow
        };
    };

    /**
     * 获取当前 操作的行 在 tb 表中对应的行，下标从0开始计算
     * @returns {number}
     */
    layerTable.prototype.currRow = function () {
        let options = this.options;
        let tr = options.jQueryTr;
        let trIndex = tr.data('index');
        this.printLog('curr row:', trIndex);
        return trIndex;
    };

    /**
     * 打印Log
     * @param msg
     * @param data
     * @returns {boolean}
     */
    layerTable.prototype.printLog = function (msg, data) {
        if (!this.options.logOn) return false;
        if (data) {
            console.log('layerTable | ' + msg, data);
        } else {
            console.log('layerTable | ' + msg);
        }
        return true;
    };

    /**
     * 数据格式解析的回调函数，用于将返回的任意数据格式解析成 table 组件规定的数据格式
     * @param options
     * @param res
     * @returns {*}
     */
    let parseData = function (options, res) {
        return res;
    };

    /**
     * 设置奇数行的底色
     * @param options
     * @param that
     * @param res
     */
    let renderEvenRow = function (options, that, res) {
        if (options.even) {
            res.data.forEach(function (item, index) {
                if (index % 2 == 0) {
                    let tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']").css("background-color", options.evenColor);
                } else {
                    // let tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']").css("background-color", "#CCCCFF");
                }
            });
        }
    };

    /**
     * 设置表格头header样式
     * @param options
     * @param that
     * @param res
     */
    let renderHeader = function (options, that, res) {
        let thead = that.find(".layui-table-box thead tr");
        // thead.css("display", "none"); // 隐藏表头
        // that.find(".layui-table-box thead tr").css("display", "none"); // 隐藏表头
    };

    /**
     * done之后的回调，设置 表格
     * @param options
     * @param that
     * @param res
     */
    let renderTable = function (options, that, res) {
        // TODO ...
    };

    /**************************************************
     * 外部调用
     */

    /**
     * 供外部调用的成员
     *
     * @type {{render: (function(*=): layerTable)}}
     */
    let layerTB;
    layerTB = {
        render: function (options, event) {
            return new layerTable(options, event);
        },
        getOptions: function () {
            return this.options;
        }
    };

    exports('layerTable', layerTB);


});



