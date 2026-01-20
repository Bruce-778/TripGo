## TripGo — 接送机预订平台
TripGo 是一个面向旅客的接送机预订平台，提供透明定价、多车型选择、便捷下单的接送服务。

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


