# Logseq 图片自动压缩插件
> 粘贴图片到笔记时，自动转换为 WebP/AVIF 格式

A plugin that automatically converts images to webp/avif format to reduce image storage volume.

**📚 系列博客 / Blogs**

* [Logseq 插件开发实战一：初识插件机制并实现自动压缩粘贴的图片](https://blog.csdn.net/ssrc0604hx/article/details/148903071)
* [Logseq 插件开发实战二：国际化 I18N 与配置多语言](https://blog.csdn.net/ssrc0604hx/article/details/149090434)
* [Logseq 插件开发实战三：自定义斜线命令 SlashCommand](https://blog.csdn.net/ssrc0604hx/article/details/149090733)
* [Logseq 插件开发实战四：发布到官方插件市场](https://blog.csdn.net/ssrc0604hx/article/details/149090833)

**📽️ 演示 / How To Use**

![demo](docs/logseq-img-tiny.gif)

## 🛠️ 配置项 / CONFIGURABLE

- **启用压缩 / Enable Compression**
    * 勾选后自动将符合条件的图片进行压缩转换
    * Automatically compress and convert eligible images after selecting
- **图片大小阈值 / Image size threshold**
    - 仅当图片超过该值（单位字节）时才进行转换，默认是 100KB
    - Convert only when the image exceeds this value (in bytes), default is 100KB
- **转换格式 / Convert Format**
    - 图片自动转换为何种体积更小的格式（当前 logseq 暂不支持显示 avif 图片）
    - Which smaller format for automatic image conversion (currently logseq does not support displaying avif images)
- **图片质量 / Picture Quality**
    - 图片压缩时的质量（0-100），默认 80，推荐 60~90
    - Image compression quality (0-100), default 80, recommended 60-90
- **小图尺寸（宽度） / Small Image Size (width)**
    - 在数据块中以小图模式显示，单位px，设置为不大于0的数值将不生效
    - Display in small image mode in the data block, with units of px. Values set to no greater than 0 will not take effect
- **目录日期化 / Table of Contents Dateization**
    - 转换后的图片存放目录（assets/storages/image-tiny 目录下），可配置日期目录格式
    - The converted image is stored in the assets/storage/image tiny directory, and the date directory format can be configured

## 🌟 功能日志 / CHANGELOG

### v25.7.7
* 首个版本 🎉
* 支持转换为 webp/avif、配置存放目录
