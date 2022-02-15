# -*- coding: utf-8 -*-

from django.shortcuts import render
from SelfServPy.Common.LogCtl import SaveSYSLog
# from django.views.decorators import csrf
# 接收POST请求数据
def GoHome(request):
    try:
        return render(request, r"pages/main.html")
    except Exception as e:
        print("__GoHomeEx",str(e))

def GoAdmin(request):
    SaveSYSLog(request)
    return render(request, r"pages/admin/main.html")
def Test1(request):
    SaveSYSLog(request)
    return render(request, r"pages/admin/main.html")