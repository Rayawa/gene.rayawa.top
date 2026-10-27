# gene.rayawa.top

[English](README.md) | 简体中文

农杆菌介导植物转化过程的浏览器交互演示。

归档项目，保留用于参考。

## 项目概述

通过交互控件与动画展示植物基因转化实验的主要阶段，定位为教学演示。

## 技术栈与依赖

HTML、CSS、JavaScript。页面从 CDN 加载 DragDropTouch 以支持触摸拖拽，该脚本需要网络；可选用 Python 3 启动本地服务器。

## 文件结构

- `index.html` — 界面
- `script.js` — 交互和实验流程
- `style.css` — 布局与动画
- `favicon.ico` — 站点图标

## 快速上手

在仓库根目录启动静态服务器，以正确加载绝对路径资源：

```bash
python3 -m http.server 8000
```

打开 `http://localhost:8000/`。直接编辑 HTML 和静态资源，无需前端构建。
