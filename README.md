# 我的课表

适配 iPhone 的课程表。根据提供的教务课表显示 2026–2027 第一学期第 1–18 周，包含课程、教室、普通及附属课堂，以及本地编辑与 JSON 备份。

## GitHub Pages

将本目录文件放在仓库根目录。进入 Settings → Pages，在 Build and deployment 下选择 Deploy from a branch，再选择 main 分支和 / (root)，保存即可。无需构建或 ChatGPT 登录。

在 iPhone Safari 打开 Pages 地址，通过分享菜单添加到主屏幕。浏览器修改保存于当前网站的本地存储，不会跨域或跨设备自动同步。从旧网站迁移修改时，请先在旧网站导出备份，再在新网站恢复备份。

## 课程数据

semester.js 定义开课周次和教室。第 1 周从 2026-08-31 开始，第 18 周至 2027-01-03。晚课为 18:30–20:05。临时调课需手动更新。

网站不使用外部字体、CDN 或 ChatGPT API。
