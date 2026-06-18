# 写作指南

这个站点的写作目标是：只关心文字、图片、顺序和图注，不为单篇文章写 CSS。

## 手机共创写作

线上共创入口：

```txt
https://zhuch-520.github.io/write/
```

共创者需要先接受 GitHub collaborator 邀请。进入入口后，点 `用手机写新文章`，会打开 GitHub Issue Form。

手机投稿流程：

1. 登录 GitHub。
2. 填写标题、摘要、分类、标签和正文。
3. 在正文里直接上传图片，图片会按 Markdown 图片格式插入。
4. 发布状态选择 `发布` 或 `草稿`。
5. 提交后，GitHub Actions 会把投稿转换为 `src/content/posts/日期-issue-编号/index.mdx`。
6. 发布状态为 `发布` 时，网站会自动构建并上线。

只有仓库 owner、member 或 collaborator 的投稿会被自动发布。其他人即使打开投稿入口，也不会写入网站。

## 本地后台写作

Keystatic 后台目前用于本地写作：

启动本地预览：

```bash
npm run dev
```

打开写作后台：

```txt
http://127.0.0.1:4321/keystatic/
```

常用流程：

1. 进入 `文章`。
2. 新建文章，填写标题、日期、摘要、分类和标签。
3. 在正文编辑器里写文字、插入图片、调整段落顺序。
4. 文章默认是草稿；想公开时取消勾选 `草稿`。
5. 保存后回到网站预览文章效果。

正文图片会保存到：

```txt
public/media/posts/
```

## 字段说明

分类可选：

- `essay`：随笔
- `travel`：游记
- `notes`：短札
- `projects`：项目

`draft: true` 的文章不会出现在公开页面。后台里 `草稿` 勾选时就是这个状态。

封面图目前填写 URL。正文图片可以直接在编辑器里上传。

## 图文混排

编辑器自带图片插入，适合最常见的图文穿插。

需要更强的版式时，在正文编辑器里插入内容组件：

- `宽图`：一张大图加图注。
- `图文并排`：图片和一段观察左右并排，适合游记中的地点切换。
- `图片组`：多张小图组成一组。
- `引用`：一段醒目的中场停顿。
- `提示`：一块短备注。
- `路线`：游记开头的路线信息。

## 文件方式备用

如果以后想直接编辑文件，也可以在 `src/content/posts/` 下创建一个新文件夹：

```txt
src/content/posts/2026-06-18-kamakura/
  index.mdx
```

`index.mdx` 的开头：

```mdx
---
title: "文章标题"
date: 2026-06-18
description: "一句摘要。"
tags: ["游记", "影像"]
category: "travel"
cover: "https://example.com/cover.jpg"
draft: false
---
```

文件里可以直接使用图文组件，不需要额外 import：

```mdx
<WideImage src="https://example.com/photo.jpg" caption="一张宽图。" />

<ImageText src="https://example.com/street.jpg" side="right" caption="街角。">
这里写一段和图片并排的观察。
</ImageText>

<ImageGrid
  images={[
    { src: "https://example.com/a.jpg", caption: "细节一" },
    { src: "https://example.com/b.jpg", caption: "细节二" },
    { src: "https://example.com/c.jpg", caption: "细节三" },
  ]}
/>
```

## 发布

在本地 Keystatic 后台保存文章，只会写到本机文件，不会自动发布到外网。

在线上共创入口提交手机投稿时，GitHub Actions 会自动生成文章并发布。

构建检查：

```bash
npm run build
```

发布到 GitHub Pages 前，先做本地检查：

```bash
npm run check
```

然后把改动推送到 GitHub：

```bash
git add .
git commit -m "Update blog"
git push origin main
```

第一次发布前需要先按 `docs/deployment.md` 创建 `ZHUCH-520.github.io` 仓库，并把 GitHub Pages 的 Source 设置成 GitHub Actions。
