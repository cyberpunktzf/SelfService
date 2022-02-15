"""SelfService URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from . import index
from WebAPI.CallServer import DoMethod
from WebAPI.CallBusiness import CallPython
from WebAPI.CallBusiness import CallPythonService
from SelfServPy.Common.LogCtl import Log
from ServCall.KLEPay.pay import PayCallBack
from WebAPI.DownLoad import DownLoad
from WebAPI.DownLoad import FileList
from SelfServPy.CheckSingle import AutoRefund
urlpatterns = [
    url(r'^$', index.GoHome),   # 区分大小写, 
    url(r'^admin$', index.GoAdmin),   # 区分大小写,
    url(r'^DoMethod$',DoMethod), # 非业务相关
    #url(r'^CallLog$',SaveSYSLog), 
    url(r'^CallSelfServPY$',Log),
    #url(r'^CallSelfServDicData$',DicData.GetBaseConfig),
    #url(r'^QueryDicData$',DicData.QueryDicData),
    #url(r'^QueryLog$',Log.QueryLog),
    #url(r'^CallSelfServWechat$',pay.Pay_NATIVE),
    url(r'^CallHISWS$',CallPython), #业务相关
    url(r'^CallPythonService$',CallPythonService),
    url(r'^DHC/SelfPay/PayCallBack$',PayCallBack),
    url(r'^FileList$',FileList),
    url(r'^DownLoad$',DownLoad),
    url(r'^AutoRefund$',AutoRefund), #单边处理
    url(r'^test$',index.GoHome)
]
