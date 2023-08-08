# service

聊天app后台服务，包含api服务、socket服务

## api服务

提供登录，联系人等基本数据接口服务

## socket服务

提供实时私聊，群聊，加群等服务

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm run start
```

## 功能

### 联系人

- [x] 联系人列表
- [x] 联系人项目发起聊天按钮
- [x] 陌生人列表
- [x] 添加陌生人
- [x] 发起群聊，并提醒群成员

### 会话页面

- [x] 左侧会话列表 - 个人
- [x] 左侧会话列表 - 群聊
- [x] 个人聊天页面及消息发送功能
- [x] 群聊面板
- [x] 群聊消息发送及接收

### 未来

- [ ] api和socket服务重构
- [ ] 删除联系人重构
- [ ] 删除聊天重构
- [ ] 群聊功能重构
- [ ] 添加@功能
- [ ] 发送包含表情的信息
- [ ] 发送文件
- [ ] ....
