from tkinter import * 
import tkinter as tk
#import urllib2  #调用urllib2  
def search():   
    #url='http://www.baidu.com/s?wd=cloga' #把等号右边的网址赋值给url
    #html=urllib2.urlopen(url).read()   #html随意取名 等号后面的动作是打开源代码页面，并阅读
    #print(html) #打印
    pass
class Cat():
    def __init__(self, color, age):
        self.__color = color
        self.age = age
        self.speed = 20
class Mouse():
    def __init__(self, num):
        self.num = num
        self.speed = 10
class Room():
    def __init__(self, x, y):
        self.x = x
        self.y = y
def create_startbutton(mygui):
    btn1= Button()
    btn1['text']='开始'
    btn1.pack()
    btn2 = Button()
    btn2['text']='重置'

def create_iframe(mygui):
    canvas = tk.Canvas(mygui, bg='#c6c6c6', height=1000, width=1000)
    x0, y0, x1, y1 = 50, 50, 100, 100
    #两点确定一条直线。此处给的就是从坐标(50,50)到(80,80)画一条直线。
    line = canvas.create_oval(x0, y0, x1, y1,fill='red') 

    canvas.pack()
def create_menu(window):
    menubar = tk.Menu(window)
    #定义一个空菜单单元
    #filemenu = tk.Menu(menubar, tearoff=0)
    #将上面定义的空菜单命名为`File`，放在菜单栏中，就是装入那个容器中
    menubar.add_cascade(label='start', command=start)
    menubar.add_cascade(label='reset', command=reset)
    """#在File中加入New的小菜单，即我们平时看到的下拉菜单，每一个小菜单对应命令操作。
    #如果点击这些单元, 就会触发`do_job`的功能
    filemenu.add_command(label='start', command=start)
    filemenu.add_command(label='reset', command=reset)
    #添加一条分割线
    filemenu.add_separator()
    filemenu.add_command(label='Exit', command=window.quit)"""

    window.config(menu=menubar)
def start():
    pass
def reset():
    pass
Rooma = Room(1000,1000)
Cata = Cat('black','1')
Mousea = Mouse(10)

window = Tk(className="猫捉老鼠")
create_menu(window)
create_iframe(window)

window.geometry("1000x600")
window.mainloop()
