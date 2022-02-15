# WeChat Config 

def getConfig(code):
    return __WPC[code]
__WPC = {
    'appid': 'wxbaaf639bf3cb8cd9',
    'APPSECRET': 'fdd177a7xxxxxxxxxxxxx856eeeb187c', # 何处需要?
    'mch_id': '1505709351',
    'KEY': '050B9BA327459B307B034536A75054D4',
    'GOODDESC': 'DTSDSRMYY',
    'notify_url': 'https://www.baidu.com', # 需要配置外网回调地址
    'sub_appid':'wxb10f6bff81487fed',
    'sub_mch_id':'1587444001',
    'trade_type':'NATIVE',
    'wxURl':'https://api.mch.weixin.qq.com/pay/micropay'
    #'wxURl':'https://api.mch.weixin.qq.com/pay/unifiedorder' 
    
}