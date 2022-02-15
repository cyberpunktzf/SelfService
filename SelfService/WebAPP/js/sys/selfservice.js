layui.define(['layer', 'form',table], function(exports){
    var layer = layui.layer;
    var form = layui.form;
    var table = layui.table;

    layer.msg('Hello World'); 
    exports('selfservice', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
}); 