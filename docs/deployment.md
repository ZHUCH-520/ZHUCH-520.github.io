# 发布指南

这个站点默认使用 GitHub Pages 发布。

## 第一次发布

目标公网地址：

```txt
https://zhuch-520.github.io/
```

你需要在 GitHub 上创建一个仓库：

```txt
ZHUCH-520.github.io
```

这个仓库名是 GitHub Pages 的特殊用户主页仓库。用这个名字时，Astro 不需要配置 `base`，站点会发布在根路径 `/`。

## GitHub 设置

进入 GitHub 仓库后：

1. 打开 `Settings`。
2. 进入 `Pages`。
3. 在 `Build and deployment` 里把 `Source` 设为 `GitHub Actions`。

项目已经包含自动发布工作流：

```txt
.github/workflows/deploy.yml
```

每次把 `main` 分支推送到 GitHub 后，GitHub Actions 会自动构建并发布网站。

## 本地写作

启动本地写作后台：

```bash
npm run dev
```

打开后台：

```txt
http://127.0.0.1:4321/keystatic/
```

保存文章只会写入本机文件，不会自动发布到外网。

## 发布更新

本地检查：

```bash
npm run check
```

推送到 GitHub：

```bash
git add .
git commit -m "Update blog"
git push origin main
```

推送后，GitHub 会自动发布。你可以在仓库的 `Actions` 标签页查看进度。

## 如果不是用户主页仓库

如果仓库名不是 `ZHUCH-520.github.io`，例如 `personal-blog`，公网地址会变成：

```txt
https://zhuch-520.github.io/personal-blog/
```

这种情况下需要在 `astro.config.mjs` 里额外设置：

```js
base: '/personal-blog',
```

当前项目按用户主页仓库配置，不需要这个设置。
