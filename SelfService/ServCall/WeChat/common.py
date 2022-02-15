import hashlib
import random
import string
import json
import ast
from SelfServPy.Common.LogCtl import SaveSYSLog
from ServCall.WeChat.config import getConfig

#构造微信支付入参
def buildWeChatParam( input , WeChatType):
    SaveSYSLog(input)
    rtn = ""
    if WeChatType =="NATIVE":
        rtn = __NATIVEParam(input)
    elif WeChatType =="SCAN":
        rtn = __ScanPayParam(input)
    else:
        rtn = __JSAPIParam(input)
    return rtn
#Native支付入参
def __NATIVEParam(inputObj):
    param = {
        'sub_appid': getConfig('sub_appid'),  # 公众账号ID
        'sub_mch_id': getConfig('sub_mch_id') ,  # 商户号:深圳市泽慧文化传播有限公司
        'mch_id' : getConfig('mch_id') ,
        'appid': getConfig('appid') ,  # 公众账号ID
        'trade_type': "NATIVE",  # 交易类
        'notify_url': getConfig('notify_url') ,  # 微信支付结果异步通知地址
        #'openid': '',  # trade_type为JSAPI时，openid为必填参数！此参数为微信用户在商户对应appid下的唯一标识, 统一支付接口中，缺少必填参数openid！
        'sign' : '',
        'nonce_str': __getRandomStr(32),  # 随机字符串
        'body': inputObj['body'],  # 商品描述
        'out_trade_no': inputObj['out_trade_no'] , # 商户订单号
        'spbill_create_ip': inputObj['spbill_create_ip'],  # 终端IP
        'total_fee': int(inputObj['total_fee'] * 100)  ,  # 标价金额
    }
    param = __getxml(param)
    return param
def __JSAPIParam(input):
    return input
def __ScanPayParam(inputObj):
    param = {
        'sub_appid': getConfig('sub_appid'),  # 公众账号ID
        'sub_mch_id': getConfig('sub_mch_id') ,  # 商户号:深圳市泽慧文化传播有限公司
        'mch_id' : getConfig('mch_id') ,
        'appid': getConfig('appid') ,  # 公众账号ID
        'trade_type': "NATIVE",  # 交易类
        'notify_url': getConfig('notify_url') ,  # 微信支付结果异步通知地址
        #'openid': '',  # trade_type为JSAPI时，openid为必填参数！此参数为微信用户在商户对应appid下的唯一标识, 统一支付接口中，缺少必填参数openid！
        'sign' : '',
        'nonce_str': __getRandomStr(32),  # 随机字符串
        'body': inputObj['body'],  # 商品描述
        'out_trade_no': inputObj['out_trade_no'] , # 商户订单号
        'spbill_create_ip': inputObj['spbill_create_ip'],  # 终端IP
        'total_fee': int(inputObj['total_fee'] * 100)  ,  # 标价金额
        'auth_code': inputObj['auth_code'] 
    }
    param = __getxml(param)
    return param
# 生成xml
def __getxml(kwargs):
    kwargs['sign'] = __getSign(kwargs)
    xml = ''
    for key, value in kwargs.items():
        xml += '<{0}>{1}</{0}>'.format(key, value)
    xml = '<xml>{0}</xml>'.format(xml)
    return xml
# 计算签名 
def __getSign(kwargs):
    keys, paras = sorted(kwargs), []
    paras = ['{}={}'.format(key, kwargs[key]) for key in keys if key != 'appkey' and key != 'sign']  # and kwargs[key] != '']
    stringA = '&'.join(paras)
 
    stringSignTemp = stringA + '&key=' + getConfig('KEY')
    print("sign")
    print(stringSignTemp)
    sign = __MD5(stringSignTemp).upper()
 
    return sign
# 获取MD5
def __MD5(str):
    md5 = hashlib.md5()
    md5.update(str.encode('utf-8'))
    return md5.hexdigest()

#获取随机字符串
def __getRandomStr(size):
    str = ''.join(random.sample(string.ascii_letters + string.digits, size))
    return str
