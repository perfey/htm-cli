# htm-cli

简单html页面开发初始化脚手架

## 安装

```shell
npm install -g htm-cli
```

## 配置

为了保证使用方便，需要全局安装node-sass
```shell
npm install -g node-sass
```

## 使用

### 新建项目

```shell
htm create
```
创建完毕项目后，进入项目跟目录`npm install`安装依赖，即可开始开发

## 开发项目

在项目内执行npm script即可

### sass编译

```shell
npm run sass
```
监控`scss`文件夹，编译到`css`文件夹

### 打包项目

```shell
npm run publish
```
合并雪碧图，图片base64 inline到css

## 说明

### 项目目录
雪碧图需要放在slice目录
需要inline到css的图片，在slice目录新建inline文件夹，把图片放进去即可
雪碧图可以区分合并，slice目录下新建文件夹可以合并为新的雪碧图

### 图片压缩
目前没有好用的图片压缩npm包，需要手动压缩，推荐 [tinypng] [optimizilla]  
合并完成的雪碧图，会在publish目录，压缩后放到`./generate_sprite/min`目录，再运行`npm run publish`即可，工具会自动替换publish目录的雪碧图  

[tinypng]: https://tinypng.com/
[optimizilla]:http://optimizilla.com/zh/
