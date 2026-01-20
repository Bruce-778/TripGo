# TripGo (MVP) — 机场接送机预订平台

这是一个可运行的 **TripGo** MVP：用户可搜索/选择车型/下单，后台管理员可调价与改订单状态，并实现 **24 小时内订单为急单（不可自助取消）** 的规则。

## 技术栈
- Next.js (App Router) + TypeScript
- TailwindCSS
- Prisma + SQLite（本地零依赖，方便快速启动）

## 本地运行

### 1) 安装依赖
```bash
npm install
```

### 2) 初始化数据库（SQLite）
```bash
npx prisma generate
npx prisma db push
npx tsx scripts/seed.ts
```

### 3) 配置环境变量
复制 `env.example` 为 `.env`：
```bash
cp env.example .env
```

### 4) 启动开发服务器
```bash
npm run dev
```

打开：`http://localhost:3000`

## 账号与入口
- 用户端：首页 ` / `
- 我的订单：` /orders `
- 管理后台：` /admin `
  - 默认管理员口令在 `.env` 里：`ADMIN_TOKEN`

## 重要规则
- **急单**：如果 `pickupTime - now < 24小时`，订单 `isUrgent = true`，用户端 **不允许自助取消**。
- 非急单：允许在 `pickupTime` 之前取消（MVP 简化为：不做阶梯退款；你可扩展）。

## 下一步可扩展
- 接入 Stripe/PayPal 支付
- Google Places/Mapbox：地点搜索与地图选点
- 航班数据 API（自动补全到达时间、航站楼）
- 多语言（中文/日文/英文），多币种（JPY/CNY/USD）


