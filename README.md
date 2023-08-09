# K chat webapp

基于 vue + express + Socket.io + mongodb 开发的前后端分离实时聊天程序。

## 项目结构

PC 前端使用 vue3 + pinia + vue-router + unocss + socket.io-client + vite。

功能比较简单，包括：

- 登录、注册
- 联系人管理（添加）
- 群管理（选择联系人发起群聊）
- 聊天

后端使用 express + mongodb + mongoose + socket.io。

功能包括：

- 登录、注册：登录使用 JWT 进行权限验证
- 联系人管理
- 群操作管理
- 消息管理：接收、群发等

其中，发起群聊，消息发送等使用 socket 进行操作。

## 截图

- 登录界面

![登录界面](./screenshots/登录界面.jpg '登录界面')

- 注册界面

![注册界面](screenshots/注册界面.jpg '注册界面')

- 主界面

![主界面](screenshots/主界面.jpg '主界面')

- 联系人界面

![联系人界面](screenshots/联系人界面.jpg '联系人界面')

- 发起群聊

![发起群聊](screenshots/发起群聊.jpg '发起群聊')

- 聊天界面 1

![聊天界面1](screenshots/聊天界面1.jpg '聊天界面1')

- 聊天界面 2

![聊天界面2](screenshots/聊天界面2.jpg '聊天界面2')
