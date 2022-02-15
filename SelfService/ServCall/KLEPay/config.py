# WeChat Config 

def getConfig(code):
    return __WPC[code]
__WPC = {
    "org_code":"50821",#机构编码
    "appid": "1629983059933605",
    "APPSECRET": "A09462711DC94490AD803D7BC9983545", 
    #"mch_id": "1505709351",
    #"KEY": "050B9BA327459B307B034536A75054D4",
    #"GOODDESC": "DTSDSRMYY",
    "notify_url": "http://gateway.clear-sz.com/DHC/SelfPay/PayCallBack", # 需要配置外网回调地址
    #"sub_appid":"wxb10f6bff81487fed",
    #"sub_mch_id":"1587444001",
    #"trade_type":"NATIVE",
    "wxURl":"http://10.80.30.10:1111/",
    'tokenAdd':'sys-auth/channel/oauth/token',
    'payAdd':'/jdpay/core/nativepay',
    'queryAdd':'/jdpay/query/order',
    'closeAdd':'/jdpay/core/order/cancel',
    'cancelAdd':'/jdpay/core/order/close',
    'refundAdd':'/jdpay/core/refund',
    'refundQueryAdd':'/jdpay/query/refund'
    #"wxURl":"https://api.mch.weixin.qq.com/pay/unifiedorder" 
}