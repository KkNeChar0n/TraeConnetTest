# Flask数组计算器部署指南

## 项目介绍
这是一个基于Flask的数组第二大/第二小数计算器应用，包含前端HTML、CSS和JavaScript，以及后端Flask API。

## 本地运行
1. 安装依赖：`pip install -r requirements.txt`
2. 运行应用：`python app.py`
3. 访问：http://localhost:5000

## 阿里云服务器部署

### 1. 服务器环境准备

**CentOS系统：**
```bash
# 更新系统
sudo yum update -y

# 安装必要软件
sudo yum install -y git python3 python3-pip python3-virtualenv
```

**Ubuntu系统：**
```bash
# 更新系统
sudo apt update -y
sudo apt upgrade -y

# 安装必要软件
sudo apt install -y git python3 python3-pip python3-venv
```

### 2. 项目文件部署

#### 方式一：使用Git（推荐）

如果遇到GitHub连接超时问题，可以尝试以下解决方法：

**解决Git连接超时问题：**

1. **检查网络连接和安全组**
   ```bash
   # 测试网络连接
   ping github.com
   # 测试端口连接
   telnet github.com 443
   ```

2. **修改DNS配置**
   ```bash
   # 编辑DNS配置文件
   sudo vi /etc/resolv.conf
   ```
   添加以下内容：
   ```
   nameserver 8.8.8.8
   nameserver 8.8.4.4
   ```

3. **使用SSH协议替代HTTPS**
   ```bash
   git clone git@github.com:KkNeChar0n/TraeConnetTest.git
   ```
   注意：需要在GitHub上配置SSH密钥

4. **使用GitHub镜像**
   ```bash
   git clone https://github.com.cnpmjs.org/KkNeChar0n/TraeConnetTest.git
   ```

#### 方式二：直接上传文件

如果Git方式仍然无法使用，可以通过SCP直接上传文件：

```bash
# 在本地执行，将项目文件上传到服务器
scp -r <本地项目目录> <用户名>@<服务器IP>:~/TraeConnetTest

# 登录服务器
ssh <用户名>@<服务器IP>

# 进入项目目录
cd ~/TraeConnetTest
```

### 3. 配置Python虚拟环境并安装依赖

```bash
# 创建虚拟环境
virtualenv venv

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 4. 运行应用

#### 开发环境运行
```bash
python app.py
```

#### 生产环境运行（使用Gunicorn）
```bash
gunicorn --workers 3 --bind 0.0.0.0:5000 app:app
```

### 5. 配置Nginx作为反向代理

```bash
# 安装Nginx
# CentOS:
sudo yum install -y nginx
# Ubuntu:
sudo apt install -y nginx

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 创建Nginx配置文件
sudo vi /etc/nginx/conf.d/flask_app.conf
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name <您的服务器IP或域名>;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 检查Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 6. 配置系统服务

```bash
# 创建系统服务文件
sudo vi /etc/systemd/system/flask_app.service
```

添加以下内容：
```ini
[Unit]
Description=Flask App Service
After=network.target

[Service]
User=<您的用户名>
WorkingDirectory=/home/<您的用户名>/TraeConnetTest
Environment="PATH=/home/<您的用户名>/TraeConnetTest/venv/bin"
ExecStart=/home/<您的用户名>/TraeConnetTest/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 app:app

[Install]
WantedBy=multi-user.target
```

```bash
# 启动并启用服务
sudo systemctl daemon-reload
sudo systemctl start flask_app
sudo systemctl enable flask_app
```

### 7. 配置阿里云安全组

在阿里云控制台中，为您的ECS实例配置安全组规则：

- 允许入方向TCP 22端口（SSH连接）
- 允许入方向TCP 80端口（HTTP访问）
- 允许入方向TCP 5000端口（可选，用于直接访问Flask应用）

### 8. 访问应用

完成以上配置后，您可以通过以下方式访问应用：
```
http://<您的服务器IP或域名>
```

## 常见问题解决

### Git连接超时
- 尝试使用镜像仓库：`https://github.com.cnpmjs.org/KkNeChar0n/TraeConnetTest.git`
- 使用SSH协议：`git@github.com:KkNeChar0n/TraeConnetTest.git`
- 检查阿里云安全组是否开放了443端口
- 修改DNS为Google DNS：8.8.8.8和8.8.4.4

### Flask应用无法访问
- 检查Flask应用是否正在运行：`ps aux | grep gunicorn`
- 检查Nginx配置是否正确：`sudo nginx -t`
- 检查阿里云安全组是否开放了80端口
- 查看应用日志：`sudo journalctl -u flask_app`

## 项目结构
```
TraeConnetTest/
├── app.py              # Flask应用主文件
├── requirements.txt    # 依赖声明文件
├── templates/          # HTML模板文件
│   └── index.html      # 主页面
└── static/             # 静态资源文件
    ├── style.css       # 样式文件
    └── script.js       # JavaScript文件
```