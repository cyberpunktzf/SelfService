//重写alert
//a:title ,t:msg
const SSAlert = (AlertType, t, a, i) =>{
    return new Promise ((resovle,reject) => {
        try {
            __AddLoading();
            var PrintAllInfo = t;
            if(t != ""){
                t = t.substring(0,55);
            }
            var printFlag = "";
            if(a.split('|').length > 1){
                printFlag = a.split('|')[1];
                a = a.split('|')[0];
            }
            
            e = ""; //不用
            var n = "<div class='sys-win-row layui-row sys-win-title' >";
                n = n + '<div class="sys-win-title">' + a + "</div>";
            n = n + "</div>"
            n = n + "<div class='sys-win-row layui-row sys-win-msg' >"
                n = n + '<div class="sys-win-msg">' + t + "</div>";
            n = n + "</div>"
            n += '<div style="clear:both;"/>';
            var r = {};
            r[$.messager.defaults.ok] = function() {
                __RemoveLoading();
                o.window("close");
                if (i) {
                    i(parseInt($(this).attr('data')));
                    return false;
                }
            };
            var o = _27f(e, n, r);
            return o;
            function _27f(_280, _281, _282) {
                
                var win = $('<div class="messager-body"></div>').appendTo("body");
                win.append(_281);
                if (_282) {
                    if(AlertType=="confirm"){
                        var tb = $('<div class="messager-button sys-window-btn sys-confirm-btn" ></div>').appendTo(win);
                        for (var _283 in _282) {                 
                            $("<a data=1 ></a>").attr("href", "javascript:void(0)").text('是').css("width", 250).bind("click", eval(_282[_283])).appendTo(tb).linkbutton(); 
                            $("<a data=0 ></a>").attr("href", "javascript:void(0)").text('否').css("width", 250).bind("click", eval(_282[_283])).appendTo(tb).linkbutton();                          
                        }
                    }else{
                        var tb = $('<div class="messager-button sys-window-btn" ></div>').appendTo(win);
                        for (var _283 in _282) {                 
                            $("<a></a>").attr("href", "javascript:void(0)").text('确认').css("width", 250).bind("click", eval(_282[_283])).appendTo(tb).linkbutton();                             
                        }
                    } 
                    //按钮字体
                    win.on("keydown", function(e) {
                        if (tb.children().length > 1) {
                            if (e.which == 37) {
                                e.stopPropagation();
                                tb.children().removeClass("active").eq(0).addClass("active");
                            }
                            if (e.which == 39) {
                                tb.children().removeClass("active").eq(1).addClass("active");
                            }
                        }
                        if (e.which == 32 || e.which == 13) {
                            e.stopPropagation();
                            if (tb.children(".active").length > 0) {
                                tb.children(".active").trigger("click");
                            } else {
                                _282[$.messager.defaults.ok]();
                            }
                            return false;
                        }
                        if (_282[$.messager.defaults.cancel]) {
                            if (e.which == 27) {
                                e.stopPropagation();
                                _282[$.messager.defaults.cancel]();
                                return false;
                            }
                        }
                    });
                }
                win.window({
                    isTopZindex: true,
                    closable: false,
                    title: _280,
                    noheader: _280 ? false : true,
                    width: 747,
                    height: 370,
                    modal: false,
                    top:20,
                    collapsible: false,
                    minimizable: false,
                    maximizable: false,
                    resizable: false,
                    onClose: function() {
                        setTimeout(function() {
                            win.window("destroy");
                        }, 100);
                    }
                });
                win.window("window").addClass("messager-window");
                win.children("div.messager-button").children("a:first").focus();
                return win;
            } 
        } catch (error) {
        }finally{
            if (printFlag == "Y"){
                OSPPrintError(PrintAllInfo);
            }
            resovle();
        } 
    })
}
function OSPAlert(AlertType, t, a, i) { 
    try {
        __AddLoading();
        var PrintAllInfo = t;
        if(t != ""){
            t = t.substring(0,55);
        }
        var printFlag = "";
        if(a.split('|').length > 1){
            printFlag = a.split('|')[1];
            a = a.split('|')[0];
        }
        
        e = ""; //不用
        var n = "<div class='sys-win-row layui-row sys-win-title' >";
            n = n + '<div class="sys-win-title">' + a + "</div>";
        n = n + "</div>"
        n = n + "<div class='sys-win-row layui-row sys-win-msg' >"
            n = n + '<div class="sys-win-msg">' + t + "</div>";
        n = n + "</div>"
        n += '<div style="clear:both;"/>';
        var r = {};
        r[$.messager.defaults.ok] = function() {
            __RemoveLoading();
            o.window("close");
            if (i) {
                i(parseInt($(this).attr('data')));
                return false;
            }
        };
        var o = _27f(e, n, r);
        return o;
        function _27f(_280, _281, _282) {
            
            var win = $('<div class="messager-body"></div>').appendTo("body");
            win.append(_281);
            if (_282) {
                if(AlertType=="confirm"){
                    var tb = $('<div class="messager-button sys-window-btn sys-confirm-btn" ></div>').appendTo(win);
                    for (var _283 in _282) {                 
                        $("<a data=1 ></a>").attr("href", "javascript:void(0)").text('是').css("width", 250).bind("click", eval(_282[_283])).appendTo(tb).linkbutton(); 
                        $("<a data=0 ></a>").attr("href", "javascript:void(0)").text('否').css("width", 250).bind("click", eval(_282[_283])).appendTo(tb).linkbutton();                          
                    }
                }else{
                    var tb = $('<div class="messager-button sys-window-btn" ></div>').appendTo(win);
                    for (var _283 in _282) {                 
                        $("<a></a>").attr("href", "javascript:void(0)").text('确认').css("width", 250).bind("click", eval(_282[_283])).appendTo(tb).linkbutton();                             
                    }
                } 
                //按钮字体
                win.on("keydown", function(e) {
                    if (tb.children().length > 1) {
                        if (e.which == 37) {
                            e.stopPropagation();
                            tb.children().removeClass("active").eq(0).addClass("active");
                        }
                        if (e.which == 39) {
                            tb.children().removeClass("active").eq(1).addClass("active");
                        }
                    }
                    if (e.which == 32 || e.which == 13) {
                        e.stopPropagation();
                        if (tb.children(".active").length > 0) {
                            tb.children(".active").trigger("click");
                        } else {
                            _282[$.messager.defaults.ok]();
                        }
                        return false;
                    }
                    if (_282[$.messager.defaults.cancel]) {
                        if (e.which == 27) {
                            e.stopPropagation();
                            _282[$.messager.defaults.cancel]();
                            return false;
                        }
                    }
                });
            }
            win.window({
                isTopZindex: true,
                closable: false,
                title: _280,
                noheader: _280 ? false : true,
                width: 747,
                height: 370,
                modal: false,
                top:20,
                collapsible: false,
                minimizable: false,
                maximizable: false,
                resizable: false,
                onClose: function() {
                    setTimeout(function() {
                        win.window("destroy");
                    }, 100);
                }
            });
            win.window("window").addClass("messager-window");
            win.children("div.messager-button").children("a:first").focus();
            return win;
        } 
    } catch (error) {
    }finally{
        if (printFlag == "Y"){
            OSPPrintError(PrintAllInfo);
        }
    } 
}

function __AddLoading(title){
    var htmlStr = '\
    <div class="main-loading osp-zz" style="display: block">\
        <div class="main-loading-msg osp-zz">\
        </div>\
    </div>';
     $('body').prepend(htmlStr);
    
}

function __RemoveLoading() {
    $(".main-loading").css('display', 'none');
}
