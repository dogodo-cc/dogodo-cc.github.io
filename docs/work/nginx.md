# nginx
## nginx启动

brew services start nginx  启动
brew services restart nginx  重启

sudo nginx -s reload
sudo nginx -s stop 快速停止
sudo nginx -s quit 正常停止

## 报错 Nginx: [emerg] bind() to failed (80: Address already in use)
查看谁占用了 80 端口： lsof -i:80
杀掉对应的程序，再重启 nginx 即可

## 报错502 
可以查看当前nginx 有哪些端口在启动,进程
```bash
ps -ef | grep nginx
```

关闭这些端口重新启动nginx (关闭 6345) -9 是kill的参数，强制关闭
```bash
sudo kill -9 6345
```


## 正向代理 
代理的是客户端，服务器不知道是谁来请求 （翻墙就是例子）
A同学问马云借钱马云不借
A同学通过马云的情人向他借钱，马云借了。但是马云不知道钱是借给A同学。

我在国外搭建一个服务器，然后向他请求谷歌，他帮我请求，且把内容发给我。

## 反向代理
代理的是服务器，我们不知道是请求哪个服务，（nginx 就是例子）

我们打10086，它帮我自动安排接线员，我不知道谁为我服务。

反向代理隐藏了真实的服务端，当我们请求 www.baidu.com 的时候，就像拨打10086一样，背后可能有成千上万台服务器为我们服务，但具体是哪一台，你不知道，也不需要知道，你只需要知道反向代理服务器是谁就好了，www.baidu.com 就是我们的反向代理服务器
## 配置文件地址
nginx地址：
/usr/local/etc/nginx

在ngnix 的servers 文件夹，添加一个.conf 文件

```
upstream odyssey_servers {
    server 127.0.0.1:8081;
}

server {
    listen 80;
    server_name  page.dev.gaoding.com;

        location / {
            proxy_set_header    Host $host;
            proxy_set_header    X-Real-IP  $remote_addr;
            proxy_set_header    X-Forwarded-For $remote_addr;
            proxy_pass          http://odyssey_servers;
	}
}

```

## hosts 
host文件地址：
/private/etc 

## 解释
hosts文件是一个用于储存计算机网络中各节点信息的计算机文件。这个文件负责将主机名映射到相应的IP地址。hosts文件通常用于补充或取代网络中DNS的功能。和DNS不同的是，计算机的用户可以直接对hosts文件进行控制。

为了方便用户记忆，我们将IP变成一个个的域名来输入到浏览器进行访问。而这使得访问网站时要先将其域名解析成 IP。

DNS (Domain Name Server) 的作用就是进行 IP 解析，把域名对应到 IP。

Hosts 的请求级别比 DNS 高

如果我在 hosts 里配置：
127.0.0.2 www.baidu.com
在浏览器访问 www.baidu.com 就得不到内容。

## 报错

### ERR_CONTENT_LENGTH_MISMATCH
可以查看是否访问文件的权限问题
进入nginx 目录，执行ll，查看当前文件的用户和用户组信息
```
-rw-r--r--@ 1 alan  admin   2.7K  6  2 10:56 nginx.conf
-rw-r--r--@ 1 alan  admin   2.6K  6  1 20:51 nginx.conf.default
drwxr-xr-x  2 alan  admin    64B  6  2 10:10 proxy_temp
-rw-r--r--  1 alan  admin   636B  6  1 20:51 scgi_params
-rw-r--r--  1 alan  admin   636B  6  1 20:51 scgi_params.default
drwxr-xr-x  5 alan  admin   160B  6  2 10:42 servers
```

所以我的 当前用户:alan ; 用户组: admin

修改 nginx.conf 文件
user alan admin;

### nginx: [error] open() "/usr/local/var/run/nginx.pid" failed (2: No such file or directory)


没有nginx.pid 这个文件，每次当我们停止nginx时(nginx -s stop) ,nginx 会把 /usr/local/var/run/ 路径下名为nginx.pid 的文件删掉

可以直接启动nginx，重新生成nginx.pid就可以了：
