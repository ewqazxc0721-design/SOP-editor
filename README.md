# SOP 模板静态网页编辑器

这是一个纯静态 SOP 编辑网页，主要文件为：

- `index.html`
- `styles.css`
- `app.js`

部署到 GitHub Pages 后可直接通过浏览器访问。项目中的 SOP 文件库使用浏览器文件系统权限，首次使用时需要在页面右侧选择本地文件夹授权。

## GitHub Pages

如果仓库名是普通项目仓库，访问地址通常为：

```text
https://<owner>.github.io/<repo>/
```

如果仓库名是 `<owner>.github.io`，访问地址通常为：

```text
https://<owner>.github.io/
```

## Feishu Drive first version

The SOP library can be connected to a Feishu Drive folder through a proxy service. The static page does not store Feishu `app_secret`; OAuth, token refresh, and Feishu OpenAPI calls must be handled by the proxy service.

Expected proxy API:

- `GET /library?folderToken=xxx`: returns `{ rootName, rootId, folders, documents, boms }`
- `GET /files/:fileId`: returns a SOP JSON object, or `{ project }`
- `POST /files`: accepts `{ folderId, fileName, project }` to create a SOP
- `PUT /files/:fileId`: accepts `{ folderId, fileName, project }` to overwrite a SOP
- `PATCH /files/:fileId`: accepts `{ fileName }` to rename a SOP
- `DELETE /files/:fileId`: deletes a SOP
- `POST /folders`: accepts `{ parentId, name }` to create a folder

`documents` should contain `.sopzip` files for the new package storage format. The package contains `document.json`, `manifest.json`, `assets/`, and `thumbnails/`. If a document list item does not include `project`, the page will call `GET /files/:fileId` when opening or batch-exporting that SOP.
