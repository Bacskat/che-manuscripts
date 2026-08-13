# 切 · 格瓦拉 —— 手稿档案


## 项目简介 · About

本站以切·格瓦拉的手写稿为核心，呈现一个"具体的人"，致敬烂漫主义革命者。

This site centers on Che Guevara's handwritten manuscripts, using restrained visuals and smooth motion to present a concrete human being rather than a symbol.

## 预览 · Preview

### 在线预览 · Online Preview

[Preview the site online](https://bacskat.github.io/che-manuscripts/)


## 快速开始 · Getting Started

```bash
# 安装依赖 / Install dependencies
npm install

# 开发模式 / Development
npm run dev

# 生产构建 / Build for production
npm run build

# 本地预览构建结果 / Preview the build locally
npm run preview
```

## 项目结构 · Project Structure

```
.
├── index.html              # 页面结构 / Page structure
├── vite.config.ts          # Vite 配置（相对 base）/ Vite config (relative base)
├── package.json
├── tsconfig.json
├── public/
│   ├── che-img/            # 切·格瓦拉肖像 / Che portrait (svg / jpg)
│   ├── manuscripts-che/    # 手稿封面图 / Manuscript covers
│   ├── pdf/                # 手稿 PDF / Manuscript PDFs
│   └── favicon.webp
└── src/
    ├── main.ts             # 入口 / Entry
    ├── shared.ts           # 类型 + 工具 / Types + helpers
    ├── data.ts             # 内容数据（语录 / 手稿）/ Content data
    ├── reveal.ts           # 加载层揭示 / Loader reveal
    ├── quotes.ts           # 语录轮播 / Quote rotator
    ├── marquee.ts          # 手稿传送带 / Manuscript marquee
    ├── download.ts         # 下载 + 进度 / Download + progress
    ├── modal.ts            # 关于弹窗 / About modal
    └── style.css           # 样式 / Styles
```

## 功能特性 · Features

- **加载动画**：毛笔字「致敬」逐字浮现 + 红墨从左到右填充 + 进度条
- **随机方向揭示**：加载层朝随机方向被"抽屉式"拉出，网页从反方向连成一体滑入
- **随机语录**：随机展示切本人说过的话（中文 + 西班牙语原版），切换时带"字符解码"特效
- **手稿传送带**：封面无缝滚动，hover / 点击弹出「预览 / 下载」菜单
- **预览与下载**：下载带网页内实时进度条（大小 + 百分比）
- **关于弹窗**：版权声明 + GitHub 链接（版权年份自动更新）

- **Loading animation**: brush-style "致敬" char-by-char reveal + red-ink fill + progress bar
- **Random-direction reveal**: the loading layer is pulled out like a drawer in a random direction, the page slides in connected from the opposite side
- **Random quotes**: real Che quotes (Chinese + Spanish), switching with a "character-decode" effect
- **Manuscript marquee**: seamless scrolling covers with hover / tap "preview / download" menu
- **Preview & download**: in-page download progress bar (size + percentage)
- **About modal**: attribution + GitHub link (copyright year auto-updates)

## 技术栈 · Tech Stack

- [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)（原生，无框架 / vanilla, no framework）
- 原生 CSS + 少量 JavaScript / Native CSS + a bit of JavaScript
- Google Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) / [Ma Shan Zheng](https://fonts.google.com/specimen/Ma+Shan+Zheng)


## 版权声明 · License & Attribution

本站为向切·格瓦拉致敬而建。所用手稿图片及资料，版权归其原始权利人 / 收藏机构所有；本站仅作学习、研究与纪念之用，不用于任何商业用途。

This site is a tribute to Che Guevara. All manuscript images and materials belong to their original rights holders / institutions; this site is for study, research and remembrance only, not for commercial use.
