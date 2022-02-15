/**
 * 面板扩展表格 1.x
 * date:2020-01-01   License By CrazyYi.
 */

layui.define(['table', 'laytpl'], function (exports) {
    let $ = layui.jquery;
    let table = layui.table;
    let laytpl = layui.laytpl;

    // 展开/折叠 状态码
    const actionExpand = '1'; // 展开
    const actionClosed = '2'; // 折叠

    // 默认参数
    let defaultOption = {
        mainElem: undefined,   // main table 容器
        url: undefined,  // http API接口
        method: 'post', // http 请求的方法
        data: [],  // 数据
        cols: [],  // 列配置，二位数组
        collapseName: 'collapse', // 页面使用的方法名，默认=collapse

        actionCol: 0,  // “展开/折叠”列在第 0 列，暂时不可定义，默认：0
        action: actionExpand, // 1=展开，2=折叠，字符串格式
        actions: {
            expand: {code: actionExpand, next: actionClosed, title: '展开', icon: 'layui-icon-triangle-d'},
            closed: {code: actionClosed, next: actionExpand, title: '折叠', icon: 'layui-icon-triangle-r'},
        }, // 展开、折叠 状态码

        where: undefined, // 异步加载数据的请求参数的名称，同时也是html 中action 方法中后面带的参数，注意要保持顺序一致
        param: undefined, // 注意：这里需要把传递的参数，按照 where 配置的顺序进行封装
        id: 0, // 主表中当前要操作的行记录的索引。很重要，所有的操作都需要涉及到这个id
        width: undefined,  // 容器宽度
        height: undefined,  // 容器高度
        // cellMinWidth: 100,  // 单元格最小宽度
        // skin: undefined,  // 表格风格
        size: 'sm',  // 表格尺寸，默认=sm
        even: true,  // 是否开启隔行变色，默认=true
        evenColor: "#C8EFD4", // 隔行变色的底色，默认=#C8EFD4

        renderHeader: function (that, res) {
            return renderHeader(this, that, res);
        }, // 完成后的回调，处理 header
        renderTable: function (that, res, curr, count) {
            return renderTable(this, that, res, curr, count);
        }, // 完成后的回调，处理 table
        renderEvenRow: function (that, res) {
            return renderEvenRow(this, that, res);
        }, // 完成后的回调，处理 table even row

        table: undefined, // 主表DOM

        logOn: false, // 是否开启 log 打印
    };

    /**
     * TreeTable类构造方法
     * @param options
     */
    let layerTable = function (options) {

        this.options = $.extend(defaultOption, options);

        this.init();
    };

    /**
     * 初始化
     */
    layerTable.prototype.init = function () {
        // 初始化：main table
        this.mainTableInit(); // 当前主表

        this.printLog('options:', this.options);
        this.printLog('mainTable:', this.mainTable);

        switch (this.options.action) {
            case actionExpand:
                this.expand();
                break;
            case actionClosed:
                this.closed();
                break;
            default:
                this.printLog('action error:', this.options.action);
        }
    };

    /**
     * 新增一行，在行内新增一个表格
     * @returns {boolean}
     */
    layerTable.prototype.insertTable = function () {
        let options = this.options;
        let tb = this.mainTable.table;
        let iRow = this.mainTable.iRow;
        let id = options.id;

        let count = tb.rows[iRow].cells.length;  // 获取行中单元格数量
        let newTr = tb.insertRow(iRow + 1); // 新增一行
        newTr.id = this.newTrElem(id); // 给 TR 增加一个 id 属性，便于后面通过该 id 查找到该行
        newTr.innerHTML = '<td colspan="' + count + '"></td>'; // 设置整行所有单元格合并，相当于就只有一个单元格

        let td = newTr.cells[0]; // 获取这个单元格（只有一个单元格）
        td.innerHTML = '<table class="layui-table layui-hide" id="' + this.newTableElem(id) + '"></table>'; // 在单元格内新增一个表格

        return true;
    };

    /**
     * 删除该表格（删除该行）
     * @returns {boolean}
     */
    layerTable.prototype.deleteTable = function () {
        let tb = this.mainTable.table;
        let iRow = this.mainTable.iRow;
        tb.deleteRow(iRow + 1);
        return true;
    };

    /**
     * 改变当前的按钮（折叠/展开）和 对应的 onclick
     * @param is_show
     */
    layerTable.prototype.changeAction = function (is_show) {
        let options = this.options;
        let tb = this.mainTable.table;
        let iRow = this.mainTable.iRow;

        let curTr = tb.rows[iRow]; // 定位到当前行
        let actionCell = curTr.cells[options.actionCol]; // 第一列是“展开/折叠”列
        let _param = ''; // 将 输入参数 转变成 html字符串
        for (let key in options.where) {
            if (!options.where.hasOwnProperty(key)) continue;
            _param = _param + ",'" + options.where[key] + "'";
        }

        let actionArr = is_show ? options.actions.expand : options.actions.closed;
        let layuiIcon = actionArr.icon;
        let newAction = actionArr.next;
        this.printLog(actionArr.title + '：iRow=', iRow);

        // 单元格要写入的html
        let _html = "<a onclick=\"collapse('idx','currAction'" + _param + ")\" href=\"javascript:;\">"
            + '<i class="layui-icon layuiIconTest"></i></a>';
        _html = _html.replace("idx", options.id);
        _html = _html.replace("collapse", options.collapseName);
        _html = _html.replace("currAction", newAction);
        _html = _html.replace("layuiIconTest", layuiIcon);
        this.printLog('当前链接=', _html);

        actionCell.innerHTML = _html;
    };

    /**
     * 折叠（直接把这行删除即可）
     */
    layerTable.prototype.closed = function () {
        this.deleteTable();
        this.changeAction(false);
    };

    /**
     * 详情（新增一行，并在行内创建一个新表格）
     */
    layerTable.prototype.expand = function () {
        this.insertTable();
        this.changeAction(true);
        this.newTableRender();
    };

    /**
     * 新增子表的重新渲染
     */
    layerTable.prototype.newTableRender = function () {
        let options = this.options;

        // 表格 渲染
        let car_table = table.render({
            elem: '#' + this.newTableElem(options.id)
            , url: options.url
            , method: options.method
            , where: options.where // 要传递的数据
            // , even: true // 隔行背景
            , size: options.size
            // , height: 100
            // , width: "1000"
            , cols: options.cols
            , parseData: function (res) {
            }
            , done: function (res, curr, count) {
                let that = this.elem.next(); // 这个是获取到整个新建表格的上层元素
                // this.printLog('new table:', that);
                // doneFunc(that, options, res, curr, count);

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

        });
    };

    /**
     * 主表中每一行记录的tr 对应的id
     * @param id
     * @returns {string}
     */
    layerTable.prototype.mainTrElem = function (id) {
        return 'tr' + id;
    };

    /**
     * 新增行（用于显示详情）的id
     * @param id
     * @returns {string}
     */
    layerTable.prototype.newTrElem = function (id) {
        return 'info' + id;
    };

    /**
     * 新增表的id
     * @param id
     * @returns {string}
     */
    layerTable.prototype.newTableElem = function (id) {
        return "tb_info" + id;
    };

    /**
     * 初始化主表 main Table
     */
    layerTable.prototype.mainTableInit = function () {
        let options = this.options;
        let elem = options.mainElem;
        let elemId = (elem.substr(0, 1) === '#') ? elem.substr(1) : elem;
        let tb = document.getElementById(elemId);

        let iRow = this.currRow(tb, options.id); // 获取当前 id 对应的行

        this.mainTable = {
            table: tb,
            id: options.id,
            iRow: iRow
        };
    };

    /**
     * 获取当前 id 在 tb 表中对应的行
     * @param tb
     * @param id
     * @returns {number}
     */
    layerTable.prototype.currRow = function (tb, id) {
        let rows_length = tb.rows.length;
        for (let r = 0; r < rows_length; r++) {
            if (tb.rows[r].id === this.mainTrElem(id)) {
                return (r);
            }
        }
    };

    layerTable.prototype.printLog = function (msg, data) {
        if (!this.options.logOn) return false;
        data = data ? data : null;
        console.log(msg, data);
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
        // that.find(".layui-table-box thead tr").css("display", "none");
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
        render: function (options) {
            return new layerTable(options);
        }
    };

    exports('layerTable', layerTB);


});



