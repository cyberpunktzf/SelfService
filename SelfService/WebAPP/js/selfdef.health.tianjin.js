

$(function () {

})
function ChangePage(ctype){
    if(ctype == "add"){
        $('.content').attr('src','/WebAPP/themes/images/P2.png');
        $('#currentPage').text(2);
    }else{
        $('.content').attr('src','/WebAPP/themes/images/P1.png');
        $('#currentPage').text(1);
    }
}
