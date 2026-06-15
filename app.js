(function () {
  const pagesEl = document.getElementById("pages");
  const pageListEl = document.getElementById("page-list");
  const pageCountEl = document.getElementById("page-count");
  const addPageButton = document.getElementById("add-page");
  const deletePageButton = document.getElementById("delete-page");
  const printButton = document.getElementById("print-pages");
  const batchPrintButton = document.getElementById("batch-print-pages");
  const appShellEl = document.querySelector(".app-shell");
  const libraryPanelEl = document.querySelector(".library-panel");
  const libraryToggleButton = document.getElementById("library-toggle");
  const appVersionEl = document.getElementById("app-version");
  const fileStatusEl = document.getElementById("file-status");
  const newFileButton = document.getElementById("new-file");
  const openFileButton = document.getElementById("open-file");
  const saveFileButton = document.getElementById("save-file");
  const saveAsFileButton = document.getElementById("save-as-file");
  const createVersionButton = document.getElementById("create-version");
  const versionSelect = document.getElementById("version-select");
  const openProjectInput = document.getElementById("open-project-input");
  const libraryCountEl = document.getElementById("library-count");
  const libraryStatusEl = document.getElementById("library-status");
  const libraryPickFolderButton = document.getElementById("library-pick-folder");
  const libraryRefreshFolderButton = document.getElementById("library-refresh-folder");
  const libraryNewFolderButton = document.getElementById("library-new-folder");
  const librarySaveCurrentButton = document.getElementById("library-save-current");
  const feishuProxyUrlInput = document.getElementById("feishu-proxy-url");
  const feishuFolderLinkInput = document.getElementById("feishu-folder-link");
  const feishuConnectButton = document.getElementById("feishu-connect");
  const feishuRefreshButton = document.getElementById("feishu-refresh");
  const feishuNewFolderButton = document.getElementById("feishu-new-folder");
  const feishuDisconnectButton = document.getElementById("feishu-disconnect");
  const feishuPanel = document.getElementById("feishu-panel");
  const feishuPanelToggle = document.getElementById("feishu-panel-toggle");
  const feishuPanelBody = document.getElementById("feishu-panel-body");
  const libraryFolderListEl = document.getElementById("library-folder-list");
  const sopLibraryListEl = document.getElementById("sop-library-list");
  const bomPickFileButton = document.getElementById("bom-pick-file");
  const bomClosePreviewButton = document.getElementById("bom-close-preview");
  const bomFileInput = document.getElementById("bom-file-input");
  const bomHistoryListEl = document.getElementById("bom-history-list");
  const bomPreviewPanel = document.getElementById("bom-preview-panel");
  const bomPreviewTitle = document.getElementById("bom-preview-title");
  const bomPreviewMeta = document.getElementById("bom-preview-meta");
  const bomPreviewStatus = document.getElementById("bom-preview-status");
  const bomPreviewTable = document.getElementById("bom-preview-table");
  const bomPreviewCloseButton = document.getElementById("bom-preview-close");

  const APP_VERSION = "1.3.0";
  const SOP_SCHEMA_VERSION = 2;
  const SOP_FILE_TYPE = "sop-template-project";
  const LIBRARY_DB_NAME = "sop-template-library";
  const LIBRARY_DB_VERSION = 3;
  const DEFAULT_FOLDER_ID = "root";
  const ALL_FOLDER_ID = "all";
  const ROOT_DIRECTORY_SETTING_KEY = "rootDirectory";
  const LIBRARY_STORAGE_MODE_SETTING_KEY = "libraryStorageMode";
  const FEISHU_SETTING_KEY = "feishuLibrary";
  const FEISHU_PANEL_COLLAPSED_KEY = "sop-feishu-panel-collapsed";
  const STORAGE_MODE_LOCAL = "local";
  const STORAGE_MODE_FEISHU = "feishu";
  const BOM_HISTORY_LIMIT = 12;
  const displayableImageExtensions = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".bmp", ".ico"];
  const logoSourceExtensions = [".ai", ".eps", ".pdf"];
  const bomFileExtensions = [".xlsx", ".xls", ".csv", ".tsv", ".txt", ".json"];

  let nextPageId = 1;
  let currentPageId = null;
  let activeImageSlot = null;
  let activeMaterialNumberCell = null;
  let draggedPageId = null;
  let nextAnnotationLayerId = 1;
  let nextOverlayId = 1;
  let scrollTicking = false;
  let isApplyingProject = false;
  let pendingBatchPrintRestore = null;

  const projectState = {
    documentId: "",
    fileName: "未命名.sop.json",
    fileHandle: null,
    dirty: false,
    currentVersion: 0,
    lastVersion: 0,
    folderId: DEFAULT_FOLDER_ID,
    libraryFileId: "",
    libraryFileHandle: null,
    history: []
  };

  const libraryState = {
    db: null,
    ready: false,
    storageMode: STORAGE_MODE_LOCAL,
    rootHandle: null,
    rootName: "",
    folders: [],
    documents: [],
    boms: [],
    bomHistory: [],
    activeBom: null,
    activeFolderId: ALL_FOLDER_ID,
    collapsed: false,
    busy: false,
    feishu: {
      proxyUrl: "",
      folderInput: "",
      folderToken: "",
      connected: false
    }
  };

  const materialSearch = {
    popover: null,
    input: null,
    status: null,
    list: null
  };

  const editor = {
    isOpen: false,
    slot: null,
    ratio: 1,
    mode: "crop",
    selected: null,
    drag: null,
    overlay: null,
    title: null,
    viewport: null,
    stage: null,
    image: null,
    svg: null,
    textLayer: null,
    buttons: {}
  };

  const templateCells = [
    textCell(1, 1, 4, 1, "  产品名称/编号：", "header-cell left"),
    textCell(5, 1, 5, 1, "  工序：", "header-cell left"),
    textCell(10, 1, 4, 1, "  组装模块：", "header-cell left"),
    imageCell(14, 1, 3, 1, {
      logo: true,
      label: "插入logo",
      fit: "contain",
      accept: ".ai,.eps,.pdf,.png,.jpg,.jpeg,.svg,.webp,.gif,.bmp,.ico,image/*,application/pdf,application/postscript,application/illustrator"
    }),
    textCell(1, 2, 4, 1, "零件物料/治具", "section-title"),

    imageCell(5, 2, 3, 9),
    imageCell(8, 2, 3, 9),
    imageCell(11, 2, 3, 9),
    imageCell(14, 2, 3, 9),
    textCell(5, 11, 3, 2, "", "blank-cell left"),
    textCell(8, 11, 3, 2, "", "blank-cell left"),
    textCell(11, 11, 3, 2, "", "blank-cell left"),
    textCell(14, 11, 3, 2, "", "blank-cell left"),

    textCell(5, 13, 3, 1, "  特殊标注：", "note-cell left"),
    textCell(8, 13, 3, 1, "  特殊标注：", "note-cell left"),
    textCell(11, 13, 3, 1, "  特殊标注：", "note-cell left"),
    textCell(14, 13, 3, 1, " 特殊标注：", "note-cell left"),

    imageCell(5, 14, 3, 9),
    imageCell(8, 14, 3, 9),
    imageCell(11, 14, 3, 9),
    imageCell(14, 14, 3, 9),
    textCell(5, 23, 3, 2, "", "blank-cell left"),
    textCell(8, 23, 3, 2, "", "blank-cell left"),
    textCell(11, 23, 3, 2, "", "blank-cell left"),
    textCell(14, 23, 3, 2, "", "blank-cell left"),

    textCell(5, 25, 3, 1, "  特殊标注：", "note-cell left"),
    textCell(8, 25, 3, 1, "  特殊标注：", "note-cell left"),
    textCell(11, 25, 3, 1, "  特殊标注：", "note-cell left"),
    textCell(14, 25, 3, 1, " 特殊标注：", "note-cell left"),
    textCell(5, 26, 3, 1, "  标准工时：           人员：", "note-cell left"),
    textCell(8, 26, 9, 1, "特殊标注：关键动作 / 装配方向 / 扭矩/ 质量确认 / 安全注意事项(防静电) ", "note-cell left"),

    textCell(1, 27, 4, 1, "SOP编号：P7A0001   版本：A0   日期：20260531", "footer-cell left"),
    textCell(5, 27, 3, 1, "", "footer-cell center", { autoPage: true }),
    textCell(8, 27, 3, 1, "  编制：", "footer-cell left"),
    textCell(11, 27, 3, 1, "   审核：", "footer-cell left"),
    textCell(14, 27, 3, 1, "  批准：", "footer-cell left")
  ];

  const materialRows = [3, 6, 9, 12, 15, 18, 21, 24];
  materialRows.forEach((row, index) => {
    const number = String(index + 1).padStart(2, "0");
    templateCells.push(imageCell(1, row, 2, 3, {
      material: true,
      materialIndex: index,
      label: `${number}\n插入物料图片`
    }));
    templateCells.push(textCell(3, row, 2, 1, "物料名称：", "material-label left", {
      materialIndex: index,
      materialField: "name"
    }));
    templateCells.push(textCell(3, row + 1, 2, 1, "物料编号：", "material-label left", {
      materialIndex: index,
      materialField: "number"
    }));
    templateCells.push(textCell(3, row + 2, 2, 1, "规格数量：", "material-label left", {
      materialIndex: index,
      materialField: "spec"
    }));
  });

  addPageButton.addEventListener("click", () => addPage({ scrollIntoView: true }));
  deletePageButton.addEventListener("click", deleteCurrentPage);
  printButton.addEventListener("click", exportPdf);
  batchPrintButton.addEventListener("click", batchExportPdf);
  newFileButton.addEventListener("click", newProject);
  openFileButton.addEventListener("click", openProjectFile);
  saveFileButton.addEventListener("click", saveProject);
  saveAsFileButton.addEventListener("click", () => saveProjectAs());
  createVersionButton.addEventListener("click", () => {
    createVersionSnapshot("手动保存版本");
    markDirty();
    updateProjectUi();
  });
  versionSelect.addEventListener("dblclick", rollbackToSelectedVersion);
  openProjectInput.addEventListener("change", handleFallbackOpenFile);
  libraryToggleButton.addEventListener("click", () => setLibraryCollapsed(!libraryState.collapsed));
  libraryPickFolderButton.addEventListener("click", pickLibraryFolder);
  libraryRefreshFolderButton.addEventListener("click", () => refreshLibrary({ requestPermission: true }));
  libraryNewFolderButton.addEventListener("click", createLibraryFolder);
  librarySaveCurrentButton.addEventListener("click", () => saveCurrentProjectToLibrary({
    reason: "手动保存到SOP库",
    assignActiveFolder: true
  }));
  feishuConnectButton.addEventListener("click", connectFeishuLibrary);
  feishuRefreshButton.addEventListener("click", () => refreshFeishuLibrary({ manual: true }));
  feishuNewFolderButton.addEventListener("click", createFeishuFolder);
  feishuDisconnectButton.addEventListener("click", disconnectFeishuLibrary);
  feishuPanelToggle.addEventListener("click", () => {
    setFeishuPanelCollapsed(!feishuPanel.classList.contains("is-collapsed"), { persist: true });
  });
  bomPickFileButton.addEventListener("click", chooseBomFile);
  bomClosePreviewButton.addEventListener("click", closeBomPreview);
  bomPreviewCloseButton.addEventListener("click", closeBomPreview);
  bomFileInput.addEventListener("change", handleFallbackBomFile);
  document.addEventListener("input", handleDocumentInput);
  document.addEventListener("paste", handleDocumentPaste);
  document.addEventListener("dragenter", handleDocumentFileDragEnter, true);
  document.addEventListener("dragover", handleDocumentFileDragOver, true);
  document.addEventListener("dragleave", handleDocumentFileDragLeave, true);
  document.addEventListener("drop", handleDocumentFileDrop, true);
  document.addEventListener("dragend", clearAllImageSlotDragStates, true);
  document.addEventListener("keydown", handleDocumentKeyDown);
  document.addEventListener("focusin", handleMaterialFocus);
  document.addEventListener("click", handleMaterialDocumentClick);
  window.addEventListener("load", schedulePreviewScaleUpdate);
  window.addEventListener("afterprint", restorePendingBatchPrint);

  window.addEventListener("scroll", queueCurrentPageSync, { passive: true });
  window.addEventListener("resize", () => {
    schedulePreviewScaleUpdate();
    document.querySelectorAll(".image-cell[data-has-image='true']").forEach((slot) => {
      if (!isLogoSlot(slot) && slot.dataset.mediaKind === "image") {
        clampImage(slot);
      }
      renderSlotImage(slot);
    });
    if (editor.isOpen) {
      layoutEditorStage();
      renderEditor();
    }
    queueCurrentPageSync();
  });

  schedulePreviewScaleUpdate();
  buildImageEditor();
  buildMaterialSearch();
  initializeFeishuPanelCollapse();
  updateDependencyStatus();
  addPage();
  schedulePreviewScaleUpdate();
  initializeProjectState();
  initializeLibrary();
  if (new URLSearchParams(window.location.search).has("selftest")) {
    runSelfTest();
  }

  function textCell(col, row, colSpan, rowSpan, text, className, options = {}) {
    return {
      kind: "text",
      col,
      row,
      colSpan,
      rowSpan,
      text,
      className,
      autoPage: Boolean(options.autoPage),
      materialIndex: Number.isInteger(options.materialIndex) ? options.materialIndex : null,
      materialField: options.materialField || "",
      cellKey: options.cellKey || `c${col}r${row}`
    };
  }

  function imageCell(col, row, colSpan, rowSpan, options = {}) {
    return {
      kind: "image",
      col,
      row,
      colSpan,
      rowSpan,
      material: Boolean(options.material),
      materialIndex: Number.isInteger(options.materialIndex) ? options.materialIndex : null,
      logo: Boolean(options.logo),
      fit: options.fit || "cover",
      accept: options.accept || "image/*",
      label: options.label || "插入图片",
      cellKey: options.cellKey || `c${col}r${row}`
    };
  }

  function schedulePreviewScaleUpdate() {
    updatePreviewScale();
    window.requestAnimationFrame(updatePreviewScale);
    window.setTimeout(updatePreviewScale, 100);
    window.setTimeout(updatePreviewScale, 500);
  }

  function updateDependencyStatus() {
    document.body.dataset.xlsxReady = String(Boolean(window.XLSX));
    document.body.dataset.jszipReady = String(Boolean(window.JSZip));
  }

  function updatePreviewScale() {
    const workspace = document.querySelector(".workspace");
    if (!workspace) return;

    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);
    const workspaceStyles = getComputedStyle(workspace);
    const gridWidth = Number.parseFloat(rootStyles.getPropertyValue("--grid-width")) || 1340;
    const gridHeight = Number.parseFloat(rootStyles.getPropertyValue("--grid-height")) || 852;
    const paddingX = (Number.parseFloat(workspaceStyles.paddingLeft) || 0) + (Number.parseFloat(workspaceStyles.paddingRight) || 0);
    const paddingY = (Number.parseFloat(workspaceStyles.paddingTop) || 0) + (Number.parseFloat(workspaceStyles.paddingBottom) || 0);
    const availableWidth = Math.max(0, workspace.clientWidth - paddingX);
    const availableHeight = Math.max(0, workspace.clientHeight - paddingY);
    const fitScale = Math.min(availableWidth / gridWidth, availableHeight / gridHeight);
    const previewScale = clamp(Number.isFinite(fitScale) ? fitScale : 1, 1, 1.2);

    root.style.setProperty("--preview-scale", previewScale.toFixed(4));
    root.style.setProperty("--preview-page-width", `${roundCoordinate(gridWidth * previewScale)}px`);
    root.style.setProperty("--preview-page-height", `${roundCoordinate(gridHeight * previewScale)}px`);
  }

  function addPage(options = {}) {
    const page = buildPage(nextPageId++);
    pagesEl.appendChild(page);
    updatePageNumbers();
    setCurrentPage(page.dataset.pageId);
    markDirty();
    if (options.scrollIntoView) {
      page.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
    }
  }

  function buildPage(pageId) {
    const page = document.createElement("article");
    page.className = "sop-page";
    page.dataset.pageId = String(pageId);
    const scale = document.createElement("div");
    scale.className = "sop-scale";
    const sheet = document.createElement("div");
    sheet.className = "sop-sheet";

    templateCells
      .slice()
      .sort((a, b) => (a.row - b.row) || (a.col - b.col))
      .forEach((definition) => {
        const cell = definition.kind === "image" ? buildImageSlot(definition) : buildTextCell(definition);
        cell.style.gridColumn = `${definition.col} / span ${definition.colSpan}`;
        cell.style.gridRow = `${definition.row} / span ${definition.rowSpan}`;
        sheet.appendChild(cell);
      });

    scale.appendChild(sheet);
    page.appendChild(scale);
    return page;
  }

  function buildTextCell(definition) {
    const cell = document.createElement("div");
    cell.className = `sop-cell text-cell ${definition.className || ""}`.trim();
    cell.dataset.cellKey = definition.cellKey;
    if (definition.materialField) {
      cell.dataset.materialField = definition.materialField;
      cell.dataset.materialIndex = String(definition.materialIndex);
    }
    cell.textContent = definition.text;
    if (definition.autoPage) {
      cell.dataset.role = "page-number";
      cell.setAttribute("aria-live", "polite");
    } else {
      cell.contentEditable = "true";
      cell.spellcheck = false;
    }
    return cell;
  }

  function buildImageSlot(definition) {
    const slot = document.createElement("div");
    const slotTypeClass = definition.logo ? "logo-image" : definition.material ? "material-image" : "process-image";
    slot.className = `sop-cell image-cell ${slotTypeClass}`;
    slot.dataset.hasImage = "false";
    slot.dataset.fit = definition.fit;
    slot.dataset.mediaKind = "empty";
    slot.dataset.cellKey = definition.cellKey;
    if (definition.material) {
      slot.dataset.material = "true";
      slot.dataset.materialIndex = String(definition.materialIndex);
    }
    if (definition.logo) {
      slot.dataset.logo = "true";
    }
    slot.tabIndex = 0;

    const input = document.createElement("input");
    input.className = "file-input";
    input.type = "file";
    input.accept = definition.accept;

    const img = document.createElement("img");
    img.alt = "";
    img.draggable = false;

    const annotationLayer = buildAnnotationLayer("slot-annotation-layer");
    const textLayer = document.createElement("div");
    textLayer.className = "slot-text-layer";

    const sourcePreview = document.createElement("div");
    sourcePreview.className = "logo-source-preview";
    const sourceType = document.createElement("strong");
    sourceType.className = "logo-source-type";
    const sourceName = document.createElement("span");
    sourceName.className = "logo-source-name";
    sourcePreview.append(sourceType, sourceName);

    const empty = document.createElement("div");
    empty.className = "image-empty";
    const labelLines = definition.label.split("\n");
    if (labelLines.length > 1) {
      const strong = document.createElement("strong");
      strong.textContent = labelLines[0];
      const span = document.createElement("span");
      span.textContent = labelLines.slice(1).join("\n");
      empty.append(strong, span);
    } else {
      empty.textContent = definition.label;
    }

    const tools = document.createElement("div");
    tools.className = "slot-tools";
    const chooseButton = document.createElement("button");
    chooseButton.type = "button";
    chooseButton.dataset.action = "choose";
    chooseButton.textContent = "插入";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.dataset.action = "edit";
    editButton.textContent = "编辑";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "删除";
    tools.append(chooseButton, editButton, deleteButton);

    slot.append(input, img, sourcePreview, annotationLayer, textLayer, empty, tools);
    bindImageSlot(slot, input, img, chooseButton, editButton, deleteButton);
    return slot;
  }

  function buildAnnotationLayer(className) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const layerId = `annotation-arrow-${nextAnnotationLayerId++}`;
    svg.classList.add("annotation-layer", className);
    svg.dataset.arrowMarkerId = layerId;

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", layerId);
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "9");
    marker.setAttribute("refY", "5");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");
    const arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowHead.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    marker.appendChild(arrowHead);
    defs.appendChild(marker);
    svg.appendChild(defs);
    return svg;
  }

  function bindImageSlot(slot, input, img, chooseButton, editButton, deleteButton) {
    slot._imageState = createImageState();
    slot._annotationModels = [];
    slot._textModels = [];
    slot._sourceInfo = null;

    [chooseButton, editButton, deleteButton].forEach((button) => {
      button.addEventListener("pointerdown", (event) => event.stopPropagation());
    });

    chooseButton.addEventListener("click", () => input.click());
    editButton.addEventListener("click", () => openImageEditor(slot));
    deleteButton.addEventListener("click", () => deleteImage(slot));

    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;

      loadImageFile(slot, file);
      input.value = "";
    });

    img.addEventListener("load", () => {
      const state = slot._imageState;
      state.naturalWidth = img.naturalWidth;
      state.naturalHeight = img.naturalHeight;
      slot.dataset.hasImage = "true";
      slot.dataset.mediaKind = "image";

      requestAnimationFrame(() => {
        resetImageCover(slot);
        renderSlotOverlays(slot);
        if (editor.isOpen && editor.slot === slot) {
          layoutEditorStage();
          renderEditor();
        }
      });
    });

    slot.addEventListener("click", () => {
      activateImageSlot(slot);
    });

    slot.addEventListener("dblclick", (event) => {
      if (event.target.closest(".slot-tools")) return;
      if (slot.dataset.hasImage === "true") {
        openImageEditor(slot);
      }
    });

    slot.addEventListener("focus", () => activateImageSlot(slot));
  }

  function createImageState() {
    return {
      naturalWidth: 0,
      naturalHeight: 0,
      scale: 1,
      x: 0,
      y: 0,
      dragging: false,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      objectUrl: ""
    };
  }

  function buildImageEditor() {
    const overlay = document.createElement("section");
    overlay.className = "image-editor-overlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "图片编辑器");

    const panel = document.createElement("div");
    panel.className = "image-editor-panel";

    const header = document.createElement("header");
    header.className = "image-editor-header";
    const title = document.createElement("strong");
    title.textContent = "编辑图片";
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "image-editor-close";
    closeButton.textContent = "完成";
    closeButton.addEventListener("click", closeImageEditor);
    header.append(title, closeButton);

    const viewport = document.createElement("div");
    viewport.className = "image-editor-viewport";

    const stage = document.createElement("div");
    stage.className = "image-editor-stage";
    stage.tabIndex = 0;

    const image = document.createElement("img");
    image.className = "editor-image";
    image.alt = "";
    image.draggable = false;

    const svg = buildAnnotationLayer("editor-annotation-layer");
    const textLayer = document.createElement("div");
    textLayer.className = "editor-text-layer";

    stage.append(image, svg, textLayer);
    viewport.appendChild(stage);

    const toolbar = document.createElement("footer");
    toolbar.className = "image-editor-toolbar";
    editor.buttons.crop = buildEditorButton("crop", "剪裁拖动图片");
    editor.buttons.text = buildEditorButton("text", "添加文字");
    editor.buttons.circle = buildEditorButton("circle", "圆圈");
    editor.buttons.rect = buildEditorButton("rect", "矩形");
    editor.buttons.arrow = buildEditorButton("arrow", "箭头");
    editor.buttons.reset = buildEditorButton("reset", "图片复位");
    editor.buttons.delete = buildEditorButton("delete", "删除所选");
    editor.buttons.done = buildEditorButton("done", "完成");
    toolbar.append(
      editor.buttons.crop,
      editor.buttons.text,
      editor.buttons.circle,
      editor.buttons.rect,
      editor.buttons.arrow,
      editor.buttons.reset,
      editor.buttons.delete,
      editor.buttons.done
    );

    panel.append(header, viewport, toolbar);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    Object.entries(editor.buttons).forEach(([action, button]) => {
      button.addEventListener("click", () => handleEditorCommand(action));
    });

    stage.addEventListener("pointerdown", handleEditorStagePointerDown);
    stage.addEventListener("wheel", handleEditorWheel, { passive: false });
    window.addEventListener("pointermove", handleEditorPointerMove);
    window.addEventListener("pointerup", endEditorDrag);
    window.addEventListener("pointercancel", endEditorDrag);

    editor.overlay = overlay;
    editor.title = title;
    editor.viewport = viewport;
    editor.stage = stage;
    editor.image = image;
    editor.svg = svg;
    editor.textLayer = textLayer;
  }

  function buildEditorButton(action, text) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "editor-tool-button";
    button.dataset.editorAction = action;
    button.textContent = text;
    return button;
  }

  function buildMaterialSearch() {
    const popover = document.createElement("section");
    popover.className = "material-search-popover";
    popover.hidden = true;
    popover.setAttribute("aria-label", "物料编号搜索");

    const input = document.createElement("input");
    input.className = "material-search-input";
    input.type = "search";
    input.placeholder = "搜索或输入物料编号";
    input.autocomplete = "off";

    const status = document.createElement("div");
    status.className = "material-search-status";
    status.textContent = "请先导入 BOM 表";

    const list = document.createElement("div");
    list.className = "material-search-list";

    popover.append(input, status, list);
    document.body.appendChild(popover);

    input.addEventListener("input", () => {
      if (activeMaterialNumberCell) {
        setMaterialFieldValue(activeMaterialNumberCell, "number", input.value);
        markDirty();
        applyExactBomMatch(activeMaterialNumberCell);
      }
      renderMaterialSearchResults(input.value);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const first = getFilteredBomItems(input.value)[0];
        if (first && activeMaterialNumberCell) {
          applyBomItemToMaterial(activeMaterialNumberCell, first);
          hideMaterialSearch();
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        hideMaterialSearch();
      }
    });

    materialSearch.popover = popover;
    materialSearch.input = input;
    materialSearch.status = status;
    materialSearch.list = list;
  }

  function handleMaterialFocus(event) {
    const cell = getMaterialNumberCell(event.target);
    if (cell) {
      showMaterialSearch(cell);
    }
  }

  function handleMaterialDocumentClick(event) {
    const cell = getMaterialNumberCell(event.target);
    if (cell) {
      showMaterialSearch(cell);
      return;
    }
    if (materialSearch.popover && materialSearch.popover.contains(event.target)) return;
    hideMaterialSearch();
  }

  function getMaterialNumberCell(target) {
    const cell = target && target.closest ? target.closest(".text-cell[data-material-field='number']") : null;
    return cell && cell.isContentEditable ? cell : null;
  }

  function showMaterialSearch(cell) {
    activeMaterialNumberCell = cell;
    if (!materialSearch.popover) return;

    materialSearch.input.value = getMaterialFieldValue(cell, "number");
    renderMaterialSearchResults(materialSearch.input.value);
    materialSearch.popover.hidden = false;
    positionMaterialSearch(cell);
  }

  function hideMaterialSearch() {
    activeMaterialNumberCell = null;
    if (materialSearch.popover) {
      materialSearch.popover.hidden = true;
    }
  }

  function positionMaterialSearch(cell) {
    if (!materialSearch.popover || !cell) return;
    const rect = cell.getBoundingClientRect();
    const popoverWidth = Math.min(360, Math.max(260, window.innerWidth - 24));
    const left = rect.right + popoverWidth + 12 > window.innerWidth ?
      Math.max(12, window.innerWidth - popoverWidth - 12) :
      rect.right + 8;
    const top = Math.min(Math.max(12, rect.top), Math.max(12, window.innerHeight - 430));
    materialSearch.popover.style.left = `${roundCoordinate(left)}px`;
    materialSearch.popover.style.top = `${roundCoordinate(top)}px`;
  }

  function renderMaterialSearchResults(query) {
    if (!materialSearch.list || !materialSearch.status) return;
    materialSearch.list.replaceChildren();

    if (!libraryState.activeBom || !Array.isArray(libraryState.activeBom.items)) {
      materialSearch.status.textContent = "请先在右侧 SOP库 中选择或导入 BOM 表";
      return;
    }

    const items = getFilteredBomItems(query);
    materialSearch.status.textContent = `${libraryState.activeBom.name || "BOM"} · ${items.length} 个匹配`;
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "library-empty";
      empty.textContent = "没有匹配的物料编号";
      materialSearch.list.appendChild(empty);
      return;
    }

    items.slice(0, 80).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "material-search-option";
      const code = document.createElement("strong");
      code.textContent = item.code || "";
      const name = document.createElement("span");
      name.textContent = [item.name, item.spec].filter(Boolean).join(" · ") || "未命名物料";
      button.append(code, name);
      button.addEventListener("click", () => {
        if (activeMaterialNumberCell) {
          applyBomItemToMaterial(activeMaterialNumberCell, item);
        }
        hideMaterialSearch();
      });
      materialSearch.list.appendChild(button);
    });
  }

  function getFilteredBomItems(query) {
    const items = libraryState.activeBom && Array.isArray(libraryState.activeBom.items) ?
      libraryState.activeBom.items :
      [];
    const keyword = normalizeSearchText(query);
    if (!keyword) return items.slice(0, 80);
    return items.filter((item) => {
      return normalizeSearchText(`${item.code} ${item.name} ${item.spec}`).includes(keyword);
    });
  }

  function applyExactBomMatch(cell) {
    if (!libraryState.activeBom || !Array.isArray(libraryState.activeBom.items)) return;
    const code = normalizeSearchText(getMaterialFieldValue(cell, "number"));
    if (!code) return;
    const match = libraryState.activeBom.items.find((item) => normalizeSearchText(item.code) === code);
    if (match) {
      applyBomItemToMaterial(cell, match, { keepSearchOpen: true });
    }
  }

  function applyBomItemToMaterial(numberCell, item, options = {}) {
    const index = numberCell.dataset.materialIndex;
    const page = numberCell.closest(".sop-page");
    if (!page || index === undefined) return;

    const nameCell = page.querySelector(`.text-cell[data-material-index="${index}"][data-material-field="name"]`);
    const specCell = page.querySelector(`.text-cell[data-material-index="${index}"][data-material-field="spec"]`);
    const imageSlot = page.querySelector(`.image-cell[data-material-index="${index}"]`);

    setMaterialFieldValue(numberCell, "number", item.code || "");
    if (nameCell) setMaterialFieldValue(nameCell, "name", item.name || "");
    if (specCell && item.spec) setMaterialFieldValue(specCell, "spec", item.spec);
    if (imageSlot && item.imageSrc) {
      loadImageSource(imageSlot, item.imageSrc, { keepOverlays: false });
    }

    highlightBomPreviewRow(item);
    markDirty();
    if (!options.keepSearchOpen) {
      hideMaterialSearch();
    } else {
      renderMaterialSearchResults(getMaterialFieldValue(numberCell, "number"));
    }
  }

  function getMaterialFieldValue(cell, field) {
    const text = cell ? cell.textContent || "" : "";
    const prefix = getMaterialFieldPrefix(field);
    return text.startsWith(prefix) ? text.slice(prefix.length).trim() : text.trim();
  }

  function setMaterialFieldValue(cell, field, value) {
    if (!cell) return;
    cell.textContent = `${getMaterialFieldPrefix(field)}${String(value || "").trim()}`;
  }

  function getMaterialFieldPrefix(field) {
    if (field === "name") return "物料名称：";
    if (field === "number") return "物料编号：";
    if (field === "spec") return "规格数量：";
    return "";
  }

  function handleEditorCommand(action) {
    if (!editor.isOpen || !editor.slot) return;

    if (action === "crop") {
      setEditorMode("crop");
      return;
    }
    if (action === "text") {
      addEditorText();
      return;
    }
    if (["circle", "rect", "arrow"].includes(action)) {
      addEditorAnnotation(action);
      return;
    }
    if (action === "reset") {
      resetImageCover(editor.slot);
      renderSlotImage(editor.slot);
      renderEditorImage();
      return;
    }
    if (action === "delete") {
      deleteSelectedEditorItem();
      return;
    }
    if (action === "done") {
      closeImageEditor();
    }
  }

  function openImageEditor(slot) {
    if (slot.dataset.hasImage !== "true") return;
    if (slot.dataset.mediaKind === "source") {
      window.alert("当前 logo 源文件无法在浏览器里直接预览编辑，请使用 PNG、JPG、SVG 等图片格式进行图片内标注。");
      return;
    }

    const img = slot.querySelector("img");
    if (!img || !img.getAttribute("src")) return;

    activateImageSlot(slot);
    editor.isOpen = true;
    editor.slot = slot;
    editor.selected = null;
    editor.drag = null;
    editor.overlay.hidden = false;
    document.body.classList.add("editor-open");
    setEditorMode(isLogoSlot(slot) ? "select" : "crop");

    requestAnimationFrame(() => {
      layoutEditorStage();
      renderEditor();
      editor.stage.focus({ preventScroll: true });
    });
  }

  function closeImageEditor() {
    if (!editor.isOpen) return;
    editor.isOpen = false;
    editor.drag = null;
    editor.selected = null;
    editor.overlay.hidden = true;
    document.body.classList.remove("editor-open");
    editor.image.removeAttribute("src");
    clearSvgOverlay(editor.svg);
    editor.textLayer.replaceChildren();
    const slot = editor.slot;
    editor.slot = null;
    if (slot && document.contains(slot)) {
      activateImageSlot(slot);
    }
    markDirty();
  }

  function setEditorMode(mode) {
    if (mode === "crop" && editor.slot && isLogoSlot(editor.slot)) {
      editor.mode = "select";
    } else {
      editor.mode = mode;
    }
    updateEditorButtons();
  }

  function layoutEditorStage() {
    if (!editor.isOpen || !editor.slot) return;

    const slotWidth = Math.max(1, editor.slot.clientWidth);
    const slotHeight = Math.max(1, editor.slot.clientHeight);
    const viewportRect = editor.viewport.getBoundingClientRect();
    const maxWidth = Math.max(280, viewportRect.width - 28);
    const maxHeight = Math.max(220, viewportRect.height - 28);
    const ratio = Math.max(1, Math.min(maxWidth / slotWidth, maxHeight / slotHeight));

    editor.ratio = ratio;
    editor.stage.style.width = `${roundCoordinate(slotWidth * ratio)}px`;
    editor.stage.style.height = `${roundCoordinate(slotHeight * ratio)}px`;
  }

  function renderEditor() {
    if (!editor.isOpen || !editor.slot) return;
    renderEditorImage();
    renderEditorOverlays();
    updateEditorButtons();
  }

  function renderEditorImage() {
    if (!editor.isOpen || !editor.slot) return;

    const slot = editor.slot;
    const sourceImage = slot.querySelector("img");
    const state = slot._imageState;
    const ratio = editor.ratio;

    editor.image.src = sourceImage.getAttribute("src") || "";
    editor.stage.classList.toggle("logo-editor-stage", isLogoSlot(slot));

    if (isLogoSlot(slot)) {
      const inset = 6 * ratio;
      editor.image.style.left = `${inset}px`;
      editor.image.style.top = `${inset}px`;
      editor.image.style.width = `${Math.max(0, slot.clientWidth * ratio - inset * 2)}px`;
      editor.image.style.height = `${Math.max(0, slot.clientHeight * ratio - inset * 2)}px`;
      editor.image.style.objectFit = "contain";
      editor.image.style.transform = "none";
      return;
    }

    editor.image.style.left = "0";
    editor.image.style.top = "0";
    editor.image.style.width = `${state.naturalWidth}px`;
    editor.image.style.height = `${state.naturalHeight}px`;
    editor.image.style.objectFit = "fill";
    editor.image.style.transform = `translate(${state.x * ratio}px, ${state.y * ratio}px) scale(${state.scale * ratio})`;
  }

  function renderEditorOverlays() {
    renderEditorAnnotations();
    renderEditorTexts();
  }

  function renderEditorAnnotations() {
    if (!editor.isOpen || !editor.slot) return;

    const slot = editor.slot;
    const ratio = editor.ratio;
    const markerId = editor.svg.dataset.arrowMarkerId;
    clearSvgOverlay(editor.svg);

    slot._annotationModels.forEach((model) => {
      const shape = createAnnotationElement(model, ratio, markerId);
      shape.classList.add("editor-annotation-shape");
      shape.dataset.overlayId = model.id;
      if (editor.selected && editor.selected.kind === "annotation" && editor.selected.id === model.id) {
        shape.classList.add("is-selected");
      }
      shape.addEventListener("pointerdown", (event) => startAnnotationMove(event, model.id));
      editor.svg.appendChild(shape);
    });

    if (editor.selected && editor.selected.kind === "annotation") {
      const model = findOverlayModel(slot._annotationModels, editor.selected.id);
      if (model) {
        addEditorAnnotationHandles(model);
      }
    }
  }

  function renderEditorTexts() {
    if (!editor.isOpen || !editor.slot) return;

    const ratio = editor.ratio;
    editor.textLayer.replaceChildren();
    editor.slot._textModels.forEach((model) => {
      const box = document.createElement("div");
      box.className = "editor-text-box";
      box.dataset.overlayId = model.id;
      box.style.left = `${model.x * ratio}px`;
      box.style.top = `${model.y * ratio}px`;
      box.style.width = `${model.width * ratio}px`;
      box.style.height = `${model.height * ratio}px`;
      box.style.fontSize = `${getTextFontSize(model) * ratio}px`;
      box.style.padding = `${Math.max(2, 3 * ratio)}px ${Math.max(3, 5 * ratio)}px`;
      if (editor.selected && editor.selected.kind === "text" && editor.selected.id === model.id) {
        box.classList.add("is-selected");
      }
      box.addEventListener("pointerdown", (event) => {
        if (event.target === box) {
          startTextMove(event, model.id);
        }
      });

      const content = document.createElement("div");
      content.className = "editor-text-content";
      content.contentEditable = "true";
      content.spellcheck = false;
      content.textContent = model.text;
      content.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
        selectEditorItem("text", model.id);
      });
      content.addEventListener("input", () => {
        model.text = content.textContent || "";
        renderSlotOverlays(editor.slot);
      });

      const moveHandle = document.createElement("button");
      moveHandle.type = "button";
      moveHandle.className = "editor-text-move-handle";
      moveHandle.title = "移动文字";
      moveHandle.setAttribute("aria-label", "移动文字");
      moveHandle.addEventListener("pointerdown", (event) => startTextMove(event, model.id));

      const resizeHandle = document.createElement("button");
      resizeHandle.type = "button";
      resizeHandle.className = "editor-text-resize-handle";
      resizeHandle.title = "缩放文字框";
      resizeHandle.setAttribute("aria-label", "缩放文字框");
      resizeHandle.addEventListener("pointerdown", (event) => startTextResize(event, model.id));

      box.append(content, moveHandle, resizeHandle);
      editor.textLayer.appendChild(box);
    });
  }

  function syncEditorTextSelectionClasses() {
    if (!editor.textLayer) return;
    editor.textLayer.querySelectorAll(".editor-text-box").forEach((box) => {
      const isSelected = editor.selected &&
        editor.selected.kind === "text" &&
        box.dataset.overlayId === String(editor.selected.id);
      box.classList.toggle("is-selected", Boolean(isSelected));
    });
  }

  function clearSvgOverlay(svg) {
    Array.from(svg.children).forEach((child) => {
      if (child.tagName.toLowerCase() !== "defs") {
        child.remove();
      }
    });
  }

  function createAnnotationElement(model, ratio, markerId) {
    if (model.type === "circle") {
      return createSvgElement("circle", {
        cx: model.cx * ratio,
        cy: model.cy * ratio,
        r: model.r * ratio
      });
    }
    if (model.type === "rect") {
      return createSvgElement("rect", {
        x: model.x * ratio,
        y: model.y * ratio,
        width: model.width * ratio,
        height: model.height * ratio,
        rx: 2 * ratio,
        ry: 2 * ratio
      });
    }
    return createSvgElement("line", {
      x1: model.x1 * ratio,
      y1: model.y1 * ratio,
      x2: model.x2 * ratio,
      y2: model.y2 * ratio,
      "marker-end": `url(#${markerId})`
    });
  }

  function addEditorAnnotationHandles(model) {
    if (model.type === "circle") {
      addSvgHandle(model.id, "radius", model.cx + model.r, model.cy, "ew-resize");
      return;
    }
    if (model.type === "rect") {
      const left = model.x;
      const right = model.x + model.width;
      const top = model.y;
      const bottom = model.y + model.height;
      addSvgHandle(model.id, "nw", left, top, "nwse-resize");
      addSvgHandle(model.id, "ne", right, top, "nesw-resize");
      addSvgHandle(model.id, "sw", left, bottom, "nesw-resize");
      addSvgHandle(model.id, "se", right, bottom, "nwse-resize");
      return;
    }
    addSvgHandle(model.id, "start", model.x1, model.y1, "move");
    addSvgHandle(model.id, "end", model.x2, model.y2, "move");
  }

  function addSvgHandle(id, handle, x, y, cursor) {
    const circle = createSvgElement("circle", {
      cx: x * editor.ratio,
      cy: y * editor.ratio,
      r: 6
    });
    circle.classList.add("editor-resize-handle");
    circle.dataset.overlayId = id;
    circle.dataset.handle = handle;
    circle.style.cursor = cursor;
    circle.addEventListener("pointerdown", (event) => startAnnotationResize(event, id, handle));
    editor.svg.appendChild(circle);
  }

  function updateEditorButtons() {
    if (!editor.buttons.crop) return;
    const hasSlot = Boolean(editor.slot);
    const canCrop = hasSlot && !isLogoSlot(editor.slot);
    editor.buttons.crop.disabled = !canCrop;
    editor.buttons.reset.disabled = !canCrop;
    editor.buttons.delete.disabled = !editor.selected;

    Object.values(editor.buttons).forEach((button) => button.classList.remove("active"));
    if (editor.mode === "crop") {
      editor.buttons.crop.classList.add("active");
    }
    editor.stage.classList.toggle("is-crop-mode", editor.mode === "crop" && canCrop);
  }

  function handleEditorStagePointerDown(event) {
    if (!editor.isOpen || !editor.slot || event.button !== 0) return;
    if (event.target.closest(".editor-annotation-shape, .editor-resize-handle, .editor-text-box")) return;

    clearEditorSelection();
    if (editor.mode !== "crop" || isLogoSlot(editor.slot)) return;

    event.preventDefault();
    const state = editor.slot._imageState;
    editor.drag = {
      type: "image",
      startX: event.clientX,
      startY: event.clientY,
      originX: state.x,
      originY: state.y
    };
    editor.stage.classList.add("is-image-dragging");
    editor.stage.setPointerCapture(event.pointerId);
  }

  function handleEditorWheel(event) {
    if (!editor.isOpen || !editor.slot || editor.mode !== "crop" || isLogoSlot(editor.slot)) return;
    event.preventDefault();

    const slot = editor.slot;
    const state = slot._imageState;
    const rect = editor.stage.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / editor.ratio;
    const pointerY = (event.clientY - rect.top) / editor.ratio;
    const minScale = getCoverScale(slot);
    const maxScale = minScale * 8;
    const previousScale = state.scale;
    const zoom = Math.exp(-event.deltaY * 0.001);
    const nextScale = clamp(previousScale * zoom, minScale, maxScale);
    const ratio = nextScale / previousScale;

    state.scale = nextScale;
    state.x = pointerX - (pointerX - state.x) * ratio;
    state.y = pointerY - (pointerY - state.y) * ratio;
    clampImage(slot);
    renderSlotImage(slot);
    renderEditorImage();
  }

  function handleEditorPointerMove(event) {
    if (!editor.isOpen || !editor.slot || !editor.drag) return;

    const drag = editor.drag;
    const slot = editor.slot;
    const dx = (event.clientX - drag.startX) / editor.ratio;
    const dy = (event.clientY - drag.startY) / editor.ratio;

    if (drag.type === "image") {
      const state = slot._imageState;
      state.x = drag.originX + dx;
      state.y = drag.originY + dy;
      clampImage(slot);
      renderSlotImage(slot);
      renderEditorImage();
      return;
    }

    if (drag.type === "annotation-move") {
      const model = findOverlayModel(slot._annotationModels, drag.id);
      if (!model) return;
      moveAnnotationModel(slot, model, drag.origin, dx, dy);
      renderSlotOverlays(slot);
      renderEditorAnnotations();
      return;
    }

    if (drag.type === "annotation-resize") {
      const model = findOverlayModel(slot._annotationModels, drag.id);
      if (!model) return;
      resizeAnnotationModel(slot, model, drag.origin, editorPointToSlot(event), drag.handle);
      renderSlotOverlays(slot);
      renderEditorAnnotations();
      return;
    }

    if (drag.type === "text-move") {
      const model = findOverlayModel(slot._textModels, drag.id);
      if (!model) return;
      model.x = roundCoordinate(clamp(drag.origin.x + dx, 0, slot.clientWidth - drag.origin.width));
      model.y = roundCoordinate(clamp(drag.origin.y + dy, 0, slot.clientHeight - drag.origin.height));
      renderSlotOverlays(slot);
      renderEditorTexts();
      syncEditorTextSelectionClasses();
      return;
    }

    if (drag.type === "text-resize") {
      const model = findOverlayModel(slot._textModels, drag.id);
      if (!model) return;
      const pointer = editorPointToSlot(event);
      model.width = roundCoordinate(clamp(pointer.x - drag.origin.x, 28, slot.clientWidth - drag.origin.x));
      model.height = roundCoordinate(clamp(pointer.y - drag.origin.y, 18, slot.clientHeight - drag.origin.y));
      const widthScale = model.width / Math.max(1, drag.origin.width);
      const heightScale = model.height / Math.max(1, drag.origin.height);
      const fontScale = Math.min(widthScale, heightScale);
      const maxFontSize = Math.max(6, Math.min(72, model.height - 6));
      model.fontSize = roundCoordinate(clamp(getTextFontSize(drag.origin) * fontScale, 6, maxFontSize));
      renderSlotOverlays(slot);
      renderEditorTexts();
      syncEditorTextSelectionClasses();
    }
  }

  function endEditorDrag(event) {
    if (!editor.drag) return;
    markDirty();
    if (editor.stage && editor.stage.hasPointerCapture && editor.stage.hasPointerCapture(event.pointerId)) {
      editor.stage.releasePointerCapture(event.pointerId);
    }
    editor.drag = null;
    if (editor.stage) {
      editor.stage.classList.remove("is-image-dragging");
    }
  }

  function startAnnotationMove(event, id) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(editor.slot._annotationModels, id);
    if (!model) return;

    selectEditorItem("annotation", id);
    editor.drag = {
      type: "annotation-move",
      id,
      startX: event.clientX,
      startY: event.clientY,
      origin: cloneModel(model)
    };
  }

  function startAnnotationResize(event, id, handle) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(editor.slot._annotationModels, id);
    if (!model) return;

    selectEditorItem("annotation", id);
    editor.drag = {
      type: "annotation-resize",
      id,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      origin: cloneModel(model)
    };
  }

  function startTextMove(event, id) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(editor.slot._textModels, id);
    if (!model) return;

    selectEditorItem("text", id);
    editor.drag = {
      type: "text-move",
      id,
      startX: event.clientX,
      startY: event.clientY,
      origin: cloneModel(model)
    };
  }

  function startTextResize(event, id) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(editor.slot._textModels, id);
    if (!model) return;

    selectEditorItem("text", id);
    editor.drag = {
      type: "text-resize",
      id,
      startX: event.clientX,
      startY: event.clientY,
      origin: cloneModel(model)
    };
  }

  function editorPointToSlot(event) {
    const rect = editor.stage.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / editor.ratio, 0, editor.slot.clientWidth),
      y: clamp((event.clientY - rect.top) / editor.ratio, 0, editor.slot.clientHeight)
    };
  }

  function addEditorText() {
    const slot = editor.slot;
    const width = slot.clientWidth;
    const height = slot.clientHeight;
    const boxWidth = clamp(width * 0.36, 48, width - 12);
    const boxHeight = clamp(height * 0.16, 24, height - 12);
    const model = {
      id: newOverlayId(),
      type: "text",
      x: roundCoordinate((width - boxWidth) / 2),
      y: roundCoordinate((height - boxHeight) / 2),
      width: roundCoordinate(boxWidth),
      height: roundCoordinate(boxHeight),
      text: "文字",
      fontSize: 14
    };

    slot._textModels.push(model);
    markDirty();
    setEditorMode("select");
    editor.selected = { kind: "text", id: model.id };
    renderSlotOverlays(slot);
    renderEditorOverlays();
    updateEditorButtons();

    const textBox = editor.textLayer.querySelector(`.editor-text-box[data-overlay-id="${model.id}"] .editor-text-content`);
    if (textBox) {
      textBox.focus({ preventScroll: true });
      selectTextContent(textBox);
    }
  }

  function addEditorAnnotation(type) {
    const slot = editor.slot;
    const width = slot.clientWidth;
    const height = slot.clientHeight;
    let model;

    if (type === "circle") {
      const radius = clamp(Math.min(width, height) * 0.2, 12, Math.min(width, height) / 2 - 4);
      model = {
        id: newOverlayId(),
        type,
        cx: roundCoordinate(width / 2),
        cy: roundCoordinate(height / 2),
        r: roundCoordinate(radius)
      };
    } else if (type === "rect") {
      const rectWidth = clamp(width * 0.46, 36, width - 12);
      const rectHeight = clamp(height * 0.3, 24, height - 12);
      model = {
        id: newOverlayId(),
        type,
        x: roundCoordinate((width - rectWidth) / 2),
        y: roundCoordinate((height - rectHeight) / 2),
        width: roundCoordinate(rectWidth),
        height: roundCoordinate(rectHeight)
      };
    } else {
      model = {
        id: newOverlayId(),
        type: "arrow",
        x1: roundCoordinate(width * 0.25),
        y1: roundCoordinate(height * 0.65),
        x2: roundCoordinate(width * 0.75),
        y2: roundCoordinate(height * 0.35)
      };
    }

    slot._annotationModels.push(model);
    markDirty();
    setEditorMode("select");
    selectEditorItem("annotation", model.id);
    renderSlotOverlays(slot);
    renderEditorAnnotations();
  }

  function selectEditorItem(kind, id) {
    editor.selected = { kind, id };
    renderEditorAnnotations();
    syncEditorTextSelectionClasses();
    updateEditorButtons();
  }

  function clearEditorSelection() {
    if (!editor.selected) return;
    editor.selected = null;
    renderEditorAnnotations();
    syncEditorTextSelectionClasses();
    updateEditorButtons();
  }

  function deleteSelectedEditorItem() {
    if (!editor.slot || !editor.selected) return;

    if (editor.selected.kind === "annotation") {
      editor.slot._annotationModels = editor.slot._annotationModels.filter((model) => model.id !== editor.selected.id);
    } else if (editor.selected.kind === "text") {
      editor.slot._textModels = editor.slot._textModels.filter((model) => model.id !== editor.selected.id);
    }

    editor.selected = null;
    markDirty();
    renderSlotOverlays(editor.slot);
    renderEditorOverlays();
    updateEditorButtons();
  }

  function moveAnnotationModel(slot, model, origin, dx, dy) {
    const width = slot.clientWidth;
    const height = slot.clientHeight;

    if (model.type === "circle") {
      model.cx = roundCoordinate(clamp(origin.cx + dx, origin.r, width - origin.r));
      model.cy = roundCoordinate(clamp(origin.cy + dy, origin.r, height - origin.r));
      return;
    }

    if (model.type === "rect") {
      model.x = roundCoordinate(clamp(origin.x + dx, 0, width - origin.width));
      model.y = roundCoordinate(clamp(origin.y + dy, 0, height - origin.height));
      return;
    }

    const minX = Math.min(origin.x1, origin.x2);
    const maxX = Math.max(origin.x1, origin.x2);
    const minY = Math.min(origin.y1, origin.y2);
    const maxY = Math.max(origin.y1, origin.y2);
    const clampedDx = clamp(dx, -minX, width - maxX);
    const clampedDy = clamp(dy, -minY, height - maxY);
    model.x1 = roundCoordinate(origin.x1 + clampedDx);
    model.y1 = roundCoordinate(origin.y1 + clampedDy);
    model.x2 = roundCoordinate(origin.x2 + clampedDx);
    model.y2 = roundCoordinate(origin.y2 + clampedDy);
  }

  function resizeAnnotationModel(slot, model, origin, pointer, handle) {
    const width = slot.clientWidth;
    const height = slot.clientHeight;

    if (model.type === "circle") {
      const distance = Math.hypot(pointer.x - origin.cx, pointer.y - origin.cy);
      const maxRadius = Math.max(8, Math.min(origin.cx, width - origin.cx, origin.cy, height - origin.cy));
      model.r = roundCoordinate(clamp(distance, 8, maxRadius));
      return;
    }

    if (model.type === "rect") {
      const minWidth = 18;
      const minHeight = 18;
      const right = origin.x + origin.width;
      const bottom = origin.y + origin.height;

      if (handle.includes("e")) {
        model.width = roundCoordinate(clamp(pointer.x - origin.x, minWidth, width - origin.x));
      }
      if (handle.includes("s")) {
        model.height = roundCoordinate(clamp(pointer.y - origin.y, minHeight, height - origin.y));
      }
      if (handle.includes("w")) {
        model.x = roundCoordinate(clamp(pointer.x, 0, right - minWidth));
        model.width = roundCoordinate(right - model.x);
      }
      if (handle.includes("n")) {
        model.y = roundCoordinate(clamp(pointer.y, 0, bottom - minHeight));
        model.height = roundCoordinate(bottom - model.y);
      }
      return;
    }

    if (handle === "start") {
      model.x1 = roundCoordinate(pointer.x);
      model.y1 = roundCoordinate(pointer.y);
    } else {
      model.x2 = roundCoordinate(pointer.x);
      model.y2 = roundCoordinate(pointer.y);
    }
  }

  function renderSlotOverlays(slot) {
    const layer = slot.querySelector(".slot-annotation-layer");
    const textLayer = slot.querySelector(".slot-text-layer");
    if (!layer || !textLayer) return;

    clearSvgOverlay(layer);
    const markerId = layer.dataset.arrowMarkerId;
    slot._annotationModels.forEach((model) => {
      const shape = createAnnotationElement(model, 1, markerId);
      shape.classList.add("annotation-shape");
      shape.dataset.overlayId = model.id;
      layer.appendChild(shape);
    });

    textLayer.replaceChildren();
    slot._textModels.forEach((model) => {
      const box = document.createElement("div");
      box.className = "slot-text-box";
      box.dataset.overlayId = model.id;
      box.textContent = model.text;
      box.style.left = `${model.x}px`;
      box.style.top = `${model.y}px`;
      box.style.width = `${model.width}px`;
      box.style.height = `${model.height}px`;
      box.style.fontSize = `${getTextFontSize(model)}px`;
      textLayer.appendChild(box);
    });
  }

  function clearSlotOverlays(slot) {
    slot._annotationModels = [];
    slot._textModels = [];
    renderSlotOverlays(slot);
    if (editor.slot === slot) {
      editor.selected = null;
      renderEditorOverlays();
    }
  }

  function loadImageFile(slot, file) {
    if (!file) return;
    const extension = getFileExtension(file.name);
    const isImage = file.type.startsWith("image/") || isDisplayableImageExtension(extension);
    if (!isImage) {
      if (isLogoSlot(slot) && isLogoSourceExtension(extension)) {
        loadLogoSourceFile(slot, file, extension);
      }
      return;
    }

    clearObjectUrl(slot);
    clearSlotOverlays(slot);
    slot._sourceInfo = null;
    const img = slot.querySelector("img");
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      slot.dataset.mediaKind = "image";
      img.src = String(reader.result);
      markDirty();
    });
    reader.readAsDataURL(file);
  }

  function loadImageSource(slot, src, options = {}) {
    if (!slot || !src) return;
    clearObjectUrl(slot);
    if (!options.keepOverlays) {
      clearSlotOverlays(slot);
    }
    slot._sourceInfo = null;
    const img = slot.querySelector("img");
    if (!img) return;
    slot.dataset.mediaKind = "image";
    img.src = String(src);
    markDirty();
  }

  function loadLogoSourceFile(slot, file, extension) {
    clearObjectUrl(slot);
    resetSlotMedia(slot);

    slot._imageState.objectUrl = URL.createObjectURL(file);
    slot._sourceInfo = {
      type: extension.replace(".", "").toUpperCase() || "AI",
      name: file.name || "logo source file"
    };
    const sourceType = slot.querySelector(".logo-source-type");
    const sourceName = slot.querySelector(".logo-source-name");
    sourceType.textContent = slot._sourceInfo.type;
    sourceName.textContent = slot._sourceInfo.name;
    slot.dataset.hasImage = "true";
    slot.dataset.mediaKind = "source";
    markDirty();
    activateImageSlot(slot);
  }

  function deleteImage(slot, options = {}) {
    if (editor.isOpen && editor.slot === slot) {
      closeImageEditor();
    }
    clearObjectUrl(slot);
    resetSlotMedia(slot);
    if (options.keepFocus !== false) {
      activateImageSlot(slot);
    }
    markDirty();
  }

  function resetSlotMedia(slot) {
    const img = slot.querySelector("img");
    const sourceType = slot.querySelector(".logo-source-type");
    const sourceName = slot.querySelector(".logo-source-name");

    clearSlotOverlays(slot);
    if (img) {
      img.removeAttribute("src");
      img.style.removeProperty("left");
      img.style.removeProperty("top");
      img.style.removeProperty("width");
      img.style.removeProperty("height");
      img.style.removeProperty("object-fit");
      img.style.removeProperty("transform");
    }
    if (sourceType) sourceType.textContent = "";
    if (sourceName) sourceName.textContent = "";

    Object.assign(slot._imageState, createImageState());
    slot._sourceInfo = null;
    slot.dataset.hasImage = "false";
    slot.dataset.mediaKind = "empty";
  }

  function clearObjectUrl(slot) {
    const state = slot._imageState;
    if (state && state.objectUrl) {
      URL.revokeObjectURL(state.objectUrl);
      state.objectUrl = "";
    }
  }

  function resetImageCover(slot) {
    if (slot.dataset.hasImage !== "true" || slot.dataset.mediaKind !== "image") return;

    if (isLogoSlot(slot)) {
      renderSlotImage(slot);
      if (editor.slot === slot) {
        renderEditorImage();
      }
      return;
    }

    const state = slot._imageState;
    state.scale = getCoverScale(slot);
    const scaledWidth = state.naturalWidth * state.scale;
    const scaledHeight = state.naturalHeight * state.scale;
    state.x = (slot.clientWidth - scaledWidth) / 2;
    state.y = (slot.clientHeight - scaledHeight) / 2;
    clampImage(slot);
    renderSlotImage(slot);
    if (editor.slot === slot) {
      renderEditorImage();
    }
  }

  function renderSlotImage(slot) {
    const img = slot.querySelector("img");
    if (!img || slot.dataset.mediaKind !== "image") return;

    if (isLogoSlot(slot)) {
      img.style.left = "6px";
      img.style.top = "6px";
      img.style.width = "calc(100% - 12px)";
      img.style.height = "calc(100% - 12px)";
      img.style.objectFit = "contain";
      img.style.transform = "none";
      return;
    }

    const state = slot._imageState;
    img.style.left = "0";
    img.style.top = "0";
    img.style.width = `${state.naturalWidth}px`;
    img.style.height = `${state.naturalHeight}px`;
    img.style.objectFit = "fill";
    img.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
  }

  function getCoverScale(slot) {
    const state = slot._imageState;
    if (!state.naturalWidth || !state.naturalHeight) return 1;
    return Math.max(slot.clientWidth / state.naturalWidth, slot.clientHeight / state.naturalHeight);
  }

  function clampImage(slot) {
    const state = slot._imageState;
    if (!state.naturalWidth || !state.naturalHeight || isLogoSlot(slot)) return;

    const minScale = getCoverScale(slot);
    state.scale = Math.max(state.scale, minScale);

    const scaledWidth = state.naturalWidth * state.scale;
    const scaledHeight = state.naturalHeight * state.scale;

    if (scaledWidth <= slot.clientWidth) {
      state.x = (slot.clientWidth - scaledWidth) / 2;
    } else {
      state.x = clamp(state.x, slot.clientWidth - scaledWidth, 0);
    }

    if (scaledHeight <= slot.clientHeight) {
      state.y = (slot.clientHeight - scaledHeight) / 2;
    } else {
      state.y = clamp(state.y, slot.clientHeight - scaledHeight, 0);
    }
  }

  function handleDocumentFileDragEnter(event) {
    if (!isFileDragEvent(event)) return;
    event.preventDefault();

    const slot = getImageSlotFromElement(event.target);
    if (!slot) return;

    event.stopPropagation();
    slot._dragDepth = (slot._dragDepth || 0) + 1;
    slot.classList.add("is-drag-over");
  }

  function handleDocumentFileDragOver(event) {
    if (!isFileDragEvent(event)) return;
    event.preventDefault();

    const slot = getImageSlotFromElement(event.target);
    if (!slot) {
      if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
      return;
    }

    event.stopPropagation();
    event.dataTransfer.dropEffect = canDropImageSlotFile(slot, event.dataTransfer) ? "copy" : "none";
    slot.classList.add("is-drag-over");
  }

  function handleDocumentFileDragLeave(event) {
    if (!isFileDragEvent(event)) return;
    const slot = getImageSlotFromElement(event.target);
    if (!slot) return;

    event.preventDefault();
    event.stopPropagation();
    slot._dragDepth = Math.max(0, (slot._dragDepth || 0) - 1);
    if (!slot._dragDepth) {
      slot.classList.remove("is-drag-over");
    }
  }

  function handleDocumentFileDrop(event) {
    if (!isFileDragEvent(event)) return;
    event.preventDefault();

    const slot = getImageSlotFromElement(event.target);
    clearAllImageSlotDragStates();
    if (!slot) return;

    event.stopPropagation();
    const file = getFirstSupportedDroppedFile(slot, event.dataTransfer);
    if (!file) return;

    activateImageSlot(slot);
    loadImageFile(slot, file);
  }

  function isFileDragEvent(event) {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) return false;
    if (dataTransfer.files && dataTransfer.files.length) return true;

    const items = Array.from(dataTransfer.items || []);
    if (items.some((item) => item.kind === "file")) return true;

    const types = Array.from(dataTransfer.types || []).map((type) => String(type).toLowerCase());
    return types.includes("files") || types.includes("application/x-moz-file");
  }

  function canDropImageSlotFile(slot, dataTransfer) {
    const files = getDraggedFiles(dataTransfer);
    if (!files.length) return true;
    return files.some((file) => isSupportedImageSlotFile(slot, file));
  }

  function getFirstSupportedDroppedFile(slot, dataTransfer) {
    const files = getDraggedFiles(dataTransfer);
    return files.find((file) => isSupportedImageSlotFile(slot, file)) || null;
  }

  function getDraggedFiles(dataTransfer) {
    if (!dataTransfer) return [];
    const files = Array.from(dataTransfer.files || []).filter(Boolean);
    if (files.length) return files;

    return Array.from(dataTransfer.items || [])
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile && item.getAsFile())
      .filter(Boolean);
  }

  function isSupportedImageSlotFile(slot, file) {
    if (!file) return false;
    const extension = getFileExtension(file.name);
    const isImage = String(file.type || "").startsWith("image/") || isDisplayableImageExtension(extension);
    if (isImage) return true;
    return isLogoSlot(slot) && isLogoSourceExtension(extension);
  }

  function clearImageSlotDragState(slot) {
    if (!slot) return;
    slot._dragDepth = 0;
    slot.classList.remove("is-drag-over");
  }

  function clearAllImageSlotDragStates() {
    document.querySelectorAll(".image-cell.is-drag-over").forEach(clearImageSlotDragState);
  }

  function handleDocumentPaste(event) {
    const clipboard = event.clipboardData;
    if (!clipboard) return;

    const imageItem = Array.from(clipboard.items || []).find((item) => {
      return item.kind === "file" && item.type.startsWith("image/");
    });
    if (!imageItem) return;

    const slot = editor.isOpen ? editor.slot : getPasteTarget(event.target);
    if (!slot) return;

    const file = imageItem.getAsFile();
    if (!file) return;

    event.preventDefault();
    activateImageSlot(slot);
    loadImageFile(slot, file);
  }

  function handleDocumentKeyDown(event) {
    const activeElement = document.activeElement;
    const isTyping = activeElement &&
      (activeElement.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName));

    if (editor.isOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeImageEditor();
        return;
      }
      if (["Delete", "Backspace"].includes(event.key) && editor.selected && !isTyping) {
        event.preventDefault();
        deleteSelectedEditorItem();
      }
    }
  }

  function getPasteTarget(target) {
    const targetSlot = getImageSlotFromElement(target);
    if (targetSlot) return targetSlot;

    const activeElement = document.activeElement;
    if (activeElement && activeElement.isContentEditable) return null;
    if (activeElement && ["BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName)) return null;

    const focusedSlot = getImageSlotFromElement(activeElement);
    if (focusedSlot) return focusedSlot;

    if (activeImageSlot && document.contains(activeImageSlot)) {
      return activeImageSlot;
    }
    return null;
  }

  function getImageSlotFromElement(element) {
    if (!element || !element.closest) return null;
    return element.closest(".image-cell");
  }

  function activateImageSlot(slot) {
    activeImageSlot = slot;
    if (!editor.isOpen && document.activeElement !== slot) {
      slot.focus({ preventScroll: true });
    }
  }

  function initializeProjectState(fileName = "未命名.sop.json", fileHandle = null, options = {}) {
    projectState.documentId = options.documentId || createId("doc");
    projectState.fileName = fileName;
    projectState.fileHandle = fileHandle;
    projectState.dirty = false;
    projectState.currentVersion = 0;
    projectState.lastVersion = 0;
    projectState.folderId = options.folderId || DEFAULT_FOLDER_ID;
    projectState.libraryFileId = options.libraryFileId || "";
    projectState.libraryFileHandle = options.libraryFileHandle || null;
    projectState.history = [];
    createVersionSnapshot("初始版本", { keepClean: true });
    markClean();
  }

  function handleDocumentInput(event) {
    const editableCell = event.target.closest && event.target.closest(".sop-cell[contenteditable='true']");
    const editorText = event.target.closest && event.target.closest(".editor-text-content");
    if (editableCell || editorText) {
      markDirty();
    }
    if (editableCell && editableCell.dataset.materialField === "number") {
      activeMaterialNumberCell = editableCell;
      if (materialSearch.popover && !materialSearch.popover.hidden) {
        materialSearch.input.value = getMaterialFieldValue(editableCell, "number");
        positionMaterialSearch(editableCell);
        renderMaterialSearchResults(materialSearch.input.value);
      }
      applyExactBomMatch(editableCell);
    }
  }

  async function newProject() {
    const canSwitch = await prepareCurrentProjectForSwitch();
    if (!canSwitch) return;

    if (editor.isOpen) {
      closeImageEditor();
    }

    isApplyingProject = true;
    pagesEl.replaceChildren();
    resetRuntimeCounters();
    addPage();
    isApplyingProject = false;
    initializeProjectState("未命名.sop.json", null, { folderId: getLibraryFolderForNewSop() });
    await saveCurrentProjectToLibrary({ reason: "新建SOP", silent: true });
  }

  async function openProjectFile() {
    const canSwitch = await prepareCurrentProjectForSwitch();
    if (!canSwitch) return;

    if (window.showOpenFilePicker) {
      try {
        const [handle] = await window.showOpenFilePicker({
          multiple: false,
          types: [
            {
              description: "SOP项目文件",
              accept: {
                "application/json": [".json"]
              }
            }
          ]
        });
        if (!handle) return;
        const file = await handle.getFile();
        await loadProjectFromFile(file, handle);
      } catch (error) {
        if (error && error.name === "AbortError") return;
        showFileError("打开SOP失败", error);
      }
      return;
    }

    openProjectInput.click();
  }

  async function handleFallbackOpenFile() {
    const file = openProjectInput.files && openProjectInput.files[0];
    openProjectInput.value = "";
    if (!file) return;

    try {
      await loadProjectFromFile(file, null);
    } catch (error) {
      showFileError("打开SOP失败", error);
    }
  }

  async function loadProjectFromFile(file, fileHandle) {
    const rawText = await file.text();
    const project = JSON.parse(rawText);
    validateProjectFile(project);
    await applyProject(project, file.name || "未命名.sop.json", fileHandle);
    await saveCurrentProjectToLibrary({ reason: "导入到SOP库", silent: true, skipVersion: true });
  }

  async function saveProject() {
    try {
      ensureCurrentVersionSnapshot("保存SOP");
      if (isFeishuLibraryActive()) {
        await saveCurrentProjectToLibrary({ skipVersion: true });
        return;
      }
      const project = serializeProject({ includeHistory: true });
      if (projectState.fileHandle && projectState.fileHandle.createWritable) {
        await writeProjectToHandle(projectState.fileHandle, project);
        markClean();
        await saveCurrentProjectToLibrary({ silent: true, skipVersion: true });
        return;
      }
      await saveProjectAs({ skipSnapshot: true });
    } catch (error) {
      showFileError("保存SOP失败", error);
    }
  }

  async function saveProjectAs(options = {}) {
    try {
      if (!options.skipSnapshot) {
        ensureCurrentVersionSnapshot("另存为");
      }
      const project = serializeProject({ includeHistory: true });
      const suggestedName = normalizeProjectFileName(projectState.fileName);

      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName,
          types: [
            {
              description: "SOP项目文件",
              accept: {
                "application/json": [".json"]
              }
            }
          ]
        });
        await writeProjectToHandle(handle, project);
        projectState.fileHandle = handle;
        projectState.fileName = handle.name || suggestedName;
        markClean();
        await saveCurrentProjectToLibrary({ silent: true, skipVersion: true });
        return;
      }

      downloadProjectFile(project, suggestedName);
      markClean();
      await saveCurrentProjectToLibrary({ silent: true, skipVersion: true });
    } catch (error) {
      if (error && error.name === "AbortError") return;
      showFileError("另存为失败", error);
    }
  }

  async function writeProjectToHandle(handle, project) {
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(project, null, 2));
    await writable.close();
  }

  function downloadProjectFile(project, fileName) {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function ensureCurrentVersionSnapshot(reason) {
    if (projectState.dirty || !projectState.history.length) {
      createVersionSnapshot(reason);
    }
  }

  function createVersionSnapshot(reason, options = {}) {
    if (!projectState.documentId) return null;

    const nextVersion = projectState.lastVersion + 1;
    const snapshot = {
      id: createId("ver"),
      version: nextVersion,
      createdAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      schemaVersion: SOP_SCHEMA_VERSION,
      reason,
      pages: serializePages()
    };

    projectState.lastVersion = nextVersion;
    projectState.currentVersion = nextVersion;
    projectState.history.push(snapshot);
    if (options.keepClean) {
      projectState.dirty = false;
    }
    updateProjectUi();
    return snapshot;
  }

  async function rollbackToSelectedVersion() {
    const version = Number(versionSelect.value);
    const snapshot = projectState.history.find((item) => item.version === version);
    if (!snapshot) return;

    const message = `确定回滚到 V${snapshot.version}？当前状态会先自动保存成一个新版本，方便反悔。`;
    if (!window.confirm(message)) return;

    createVersionSnapshot(`回滚前备份，目标 V${snapshot.version}`);
    await applyPages(snapshot.pages);
    projectState.currentVersion = snapshot.version;
    projectState.dirty = true;
    updateProjectUi();
  }

  function serializeProject(options = {}) {
    return {
      fileType: SOP_FILE_TYPE,
      schemaVersion: SOP_SCHEMA_VERSION,
      appVersion: APP_VERSION,
      savedAt: new Date().toISOString(),
      document: {
        id: projectState.documentId,
        fileName: projectState.fileName,
        folderId: projectState.folderId || DEFAULT_FOLDER_ID,
        currentVersion: projectState.currentVersion,
        lastVersion: projectState.lastVersion
      },
      pages: serializePages(),
      history: options.includeHistory ? cloneHistory(projectState.history) : []
    };
  }

  function serializePages() {
    return getPages().map((page) => {
      return {
        pageNumber: Number(page.dataset.pageNumber) || 0,
        textCells: Array.from(page.querySelectorAll(".text-cell[contenteditable='true']")).map((cell) => {
          return {
            key: cell.dataset.cellKey || "",
            text: cell.textContent || ""
          };
        }),
        imageSlots: Array.from(page.querySelectorAll(".image-cell")).map(serializeImageSlot)
      };
    });
  }

  function serializeImageSlot(slot) {
    const img = slot.querySelector("img");
    const state = slot._imageState || createImageState();
    return {
      key: slot.dataset.cellKey || "",
      hasImage: slot.dataset.hasImage === "true",
      mediaKind: slot.dataset.mediaKind || "empty",
      fit: slot.dataset.fit || "cover",
      logo: isLogoSlot(slot),
      imageSrc: slot.dataset.mediaKind === "image" && img ? img.getAttribute("src") || "" : "",
      imageState: {
        naturalWidth: state.naturalWidth || 0,
        naturalHeight: state.naturalHeight || 0,
        scale: state.scale || 1,
        x: state.x || 0,
        y: state.y || 0
      },
      sourceInfo: slot._sourceInfo ? { ...slot._sourceInfo } : null,
      annotations: (slot._annotationModels || []).map(cloneModel),
      texts: (slot._textModels || []).map(cloneModel)
    };
  }

  async function applyProject(project, fileName, fileHandle) {
    if (editor.isOpen) {
      closeImageEditor();
    }

    await applyPages(project.pages || []);
    projectState.documentId = project.document && project.document.id ? project.document.id : createId("doc");
    projectState.fileName = fileName || (project.document && project.document.fileName) || "未命名.sop.json";
    projectState.fileHandle = fileHandle || null;
    projectState.folderId = project.document && project.document.folderId ? project.document.folderId : DEFAULT_FOLDER_ID;
    projectState.libraryFileId = "";
    projectState.libraryFileHandle = null;
    projectState.history = Array.isArray(project.history) ? cloneHistory(project.history) : [];
    projectState.lastVersion = Math.max(
      Number(project.document && project.document.lastVersion) || 0,
      ...projectState.history.map((item) => Number(item.version) || 0),
      0
    );
    projectState.currentVersion = Number(project.document && project.document.currentVersion) ||
      projectState.lastVersion ||
      0;

    if (!projectState.history.length) {
      createVersionSnapshot("导入版本", { keepClean: true });
    }
    markClean();
  }

  async function applyPages(pagesData) {
    isApplyingProject = true;
    try {
      pagesEl.replaceChildren();
      resetRuntimeCounters();

      const safePages = Array.isArray(pagesData) && pagesData.length ? pagesData : [{}];
      for (const pageData of safePages) {
        const page = buildPage(nextPageId++);
        pagesEl.appendChild(page);
        await applyPageData(page, pageData);
      }

      syncOverlayCounterFromPages();
      updatePageNumbers();
      const firstPage = getPages()[0];
      if (firstPage) {
        setCurrentPage(firstPage.dataset.pageId);
      }
    } finally {
      isApplyingProject = false;
    }
  }

  async function applyPageData(page, pageData) {
    const textByKey = new Map((pageData.textCells || []).map((cell) => [cell.key, cell]));
    const textCells = Array.from(page.querySelectorAll(".text-cell[contenteditable='true']"));
    textCells.forEach((cell, index) => {
      const savedCell = textByKey.get(cell.dataset.cellKey) || (pageData.textCells || [])[index];
      if (savedCell) {
        cell.textContent = savedCell.text || "";
      }
    });

    const imageByKey = new Map((pageData.imageSlots || []).map((slot) => [slot.key, slot]));
    const imageSlots = Array.from(page.querySelectorAll(".image-cell"));
    for (let index = 0; index < imageSlots.length; index += 1) {
      const slot = imageSlots[index];
      const savedSlot = imageByKey.get(slot.dataset.cellKey) || (pageData.imageSlots || [])[index];
      if (savedSlot) {
        await applyImageSlotData(slot, savedSlot);
      }
    }
  }

  async function applyImageSlotData(slot, savedSlot) {
    resetSlotMedia(slot);
    slot._annotationModels = (savedSlot.annotations || []).map(cloneModel);
    slot._textModels = (savedSlot.texts || []).map(cloneModel);

    if (savedSlot.mediaKind === "source" && savedSlot.sourceInfo) {
      slot._sourceInfo = { ...savedSlot.sourceInfo };
      const sourceType = slot.querySelector(".logo-source-type");
      const sourceName = slot.querySelector(".logo-source-name");
      if (sourceType) sourceType.textContent = slot._sourceInfo.type || "SOURCE";
      if (sourceName) sourceName.textContent = slot._sourceInfo.name || "logo source file";
      slot.dataset.hasImage = "true";
      slot.dataset.mediaKind = "source";
      renderSlotOverlays(slot);
      return;
    }

    if (!savedSlot.imageSrc) {
      renderSlotOverlays(slot);
      return;
    }

    const img = slot.querySelector("img");
    img.src = savedSlot.imageSrc;
    await waitImageReady(img);
    await nextFrame();
    await nextFrame();

    const savedState = savedSlot.imageState || {};
    Object.assign(slot._imageState, {
      naturalWidth: img.naturalWidth || savedState.naturalWidth || 0,
      naturalHeight: img.naturalHeight || savedState.naturalHeight || 0,
      scale: savedState.scale || 1,
      x: savedState.x || 0,
      y: savedState.y || 0,
      dragging: false,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      objectUrl: ""
    });
    slot.dataset.hasImage = "true";
    slot.dataset.mediaKind = "image";

    if (!savedSlot.imageState) {
      resetImageCover(slot);
    } else {
      clampImage(slot);
      renderSlotImage(slot);
    }
    renderSlotOverlays(slot);
  }

  function validateProjectFile(project) {
    if (!project || project.fileType !== SOP_FILE_TYPE) {
      throw new Error("这不是可编辑的 SOP 项目文件。请打开通过“保存SOP/另存为”导出的 .sop.json 文件。");
    }
    if (Number(project.schemaVersion) > SOP_SCHEMA_VERSION) {
      throw new Error("这个 SOP 文件来自更新版本的编辑器，当前版本无法安全打开。");
    }
    if (!Array.isArray(project.pages)) {
      throw new Error("SOP 文件缺少页面数据。");
    }
  }

  function waitImageReady(img) {
    if (img.complete && img.naturalWidth) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error("图片加载超时")), 5000);
      img.addEventListener("load", () => {
        window.clearTimeout(timer);
        resolve();
      }, { once: true });
      img.addEventListener("error", () => {
        window.clearTimeout(timer);
        reject(new Error("图片数据无法加载"));
      }, { once: true });
    });
  }

  function nextFrame() {
    return new Promise((resolve) => window.requestAnimationFrame(resolve));
  }

  function markDirty() {
    if (isApplyingProject || !projectState.documentId) return;
    projectState.dirty = true;
    updateProjectUi();
  }

  function markClean() {
    projectState.dirty = false;
    updateProjectUi();
  }

  function updateProjectUi() {
    appVersionEl.textContent = `应用版本 v${APP_VERSION}`;
    const dirtyLabel = projectState.dirty ? " · 未保存" : " · 已保存";
    fileStatusEl.textContent = `${projectState.fileName}\n文档版本 V${projectState.currentVersion}${dirtyLabel}`;

    versionSelect.replaceChildren();
    const history = projectState.history.slice().sort((a, b) => b.version - a.version);
    history.forEach((snapshot) => {
      const option = document.createElement("option");
      option.value = String(snapshot.version);
      option.textContent = `V${snapshot.version} · ${formatDateTime(snapshot.createdAt)} · ${snapshot.reason || "版本"}`;
      versionSelect.appendChild(option);
    });
    if (projectState.currentVersion) {
      versionSelect.value = String(projectState.currentVersion);
    }
    syncLibraryActiveState();
  }

  function confirmDiscardChanges() {
    if (!projectState.dirty) return true;
    return window.confirm("当前 SOP 有未保存修改，继续操作会丢失未保存内容。是否继续？");
  }

  function showFileError(title, error) {
    const message = error && error.message ? error.message : String(error || "未知错误");
    window.alert(`${title}：${message}`);
  }

  function normalizeProjectFileName(fileName) {
    const baseName = String(fileName || "未命名.sop.json").trim() || "未命名.sop.json";
    return baseName.endsWith(".sop.json") ? baseName : baseName.replace(/\.json$/i, "") + ".sop.json";
  }

  function cloneHistory(history) {
    return history.map((snapshot) => {
      return {
        id: snapshot.id || createId("ver"),
        version: Number(snapshot.version) || 0,
        createdAt: snapshot.createdAt || new Date().toISOString(),
        appVersion: snapshot.appVersion || APP_VERSION,
        schemaVersion: Number(snapshot.schemaVersion) || SOP_SCHEMA_VERSION,
        reason: snapshot.reason || "版本",
        pages: Array.isArray(snapshot.pages) ? structuredCloneSafe(snapshot.pages) : []
      };
    }).filter((snapshot) => snapshot.version > 0);
  }

  function structuredCloneSafe(value) {
    if (window.structuredClone) {
      return window.structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function createId(prefix) {
    if (window.crypto && window.crypto.randomUUID) {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function formatDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "未知时间";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  function resetRuntimeCounters() {
    nextPageId = 1;
    currentPageId = null;
    activeImageSlot = null;
    draggedPageId = null;
    nextAnnotationLayerId = 1;
    nextOverlayId = 1;
  }

  function syncOverlayCounterFromPages() {
    let maxOverlayId = 0;
    document.querySelectorAll(".image-cell").forEach((slot) => {
      [...(slot._annotationModels || []), ...(slot._textModels || [])].forEach((model) => {
        const match = String(model.id || "").match(/^overlay-(\d+)$/);
        if (match) {
          maxOverlayId = Math.max(maxOverlayId, Number(match[1]) || 0);
        }
      });
    });
    nextOverlayId = maxOverlayId + 1;
  }

  async function initializeLibrary() {
    if (!window.indexedDB) {
      libraryState.ready = false;
      libraryStatusEl.textContent = "当前浏览器不支持本地 SOP库索引，请使用 Chrome 或 Edge。";
      updateLibraryControls();
      renderLibrary();
      return;
    }

    try {
      libraryState.db = await openLibraryDb();
      libraryState.bomHistory = await loadBomHistory();
      const storedMode = await loadLibraryStorageMode();
      const storedFeishu = await loadStoredFeishuSettings();
      if (storedFeishu) {
        applyFeishuSettings(storedFeishu);
      }
      if (storedMode === STORAGE_MODE_FEISHU && isFeishuConfigured()) {
        libraryState.storageMode = STORAGE_MODE_FEISHU;
        await refreshFeishuLibrary({ silent: true });
        return;
      }

      const storedHandle = await loadStoredLibraryRoot();
      if (!storedHandle) {
        libraryStatusEl.textContent = "请选择一个电脑文件夹作为 SOP库。";
        updateLibraryControls();
        renderLibrary();
        return;
      }

      libraryState.rootHandle = storedHandle;
      libraryState.rootName = storedHandle.name || "SOP库";
      const hasPermission = await ensureLibraryPermission({ request: false });
      if (!hasPermission) {
        libraryState.ready = false;
        libraryStatusEl.textContent = `已记住文件夹“${libraryState.rootName}”，请点击“刷新文件夹”重新授权。`;
        updateLibraryControls();
        renderLibrary();
        return;
      }

      await refreshLibrary();
      libraryStatusEl.textContent = `已连接电脑文件夹：${libraryState.rootName}`;
    } catch (error) {
      libraryState.ready = false;
      libraryStatusEl.textContent = `文件夹库打开失败：${error.message || error}`;
      updateLibraryControls();
      renderLibrary();
    }
  }

  function openLibraryDb() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(LIBRARY_DB_NAME, LIBRARY_DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("folders")) {
          db.createObjectStore("folders", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("documents")) {
          const documents = db.createObjectStore("documents", { keyPath: "id" });
          documents.createIndex("folderId", "folderId", { unique: false });
          documents.createIndex("updatedAt", "updatedAt", { unique: false });
        }
        if (!db.objectStoreNames.contains("bomHistory")) {
          const bomHistory = db.createObjectStore("bomHistory", { keyPath: "id" });
          bomHistory.createIndex("loadedAt", "loadedAt", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB打开失败"));
    });
  }

  async function pickLibraryFolder() {
    if (!window.showDirectoryPicker) {
      window.alert("当前浏览器不支持选择电脑文件夹，请使用 Chrome 或 Edge。");
      return;
    }

    try {
      const handle = await window.showDirectoryPicker({
        id: "sop-library",
        mode: "readwrite"
      });
      libraryState.storageMode = STORAGE_MODE_LOCAL;
      libraryState.rootHandle = handle;
      libraryState.rootName = handle.name || "SOP库";
      await saveLibraryStorageMode(STORAGE_MODE_LOCAL);
      await saveStoredLibraryRoot(handle);
      await refreshLibrary({ requestPermission: true });
      libraryStatusEl.textContent = `已连接电脑文件夹：${libraryState.rootName}`;
    } catch (error) {
      if (error && error.name === "AbortError") return;
      libraryStatusEl.textContent = `选择文件夹失败：${error.message || error}`;
    }
  }

  async function refreshLibrary(options = {}) {
    if (isFeishuLibraryActive()) {
      await refreshFeishuLibrary(options);
      return;
    }

    if (!libraryState.rootHandle) {
      libraryState.ready = false;
      libraryStatusEl.textContent = "请先选择电脑文件夹。";
      updateLibraryControls();
      renderLibrary();
      return;
    }

    const hasPermission = await ensureLibraryPermission({ request: Boolean(options.requestPermission) });
    if (!hasPermission) {
      libraryState.ready = false;
      libraryStatusEl.textContent = "没有文件夹读写权限，请点击“刷新文件夹”重新授权。";
      updateLibraryControls();
      renderLibrary();
      return;
    }

    try {
      libraryState.ready = true;
      libraryState.rootName = libraryState.rootHandle.name || "SOP库";
      const scan = await scanLibraryDirectory();
      libraryState.folders = scan.folders;
      libraryState.documents = scan.documents;
      libraryState.boms = scan.boms;
      if (
        libraryState.activeFolderId !== ALL_FOLDER_ID &&
        !libraryState.folders.some((folder) => folder.id === libraryState.activeFolderId)
      ) {
        libraryState.activeFolderId = ALL_FOLDER_ID;
      }
      renderLibrary();
    } catch (error) {
      libraryState.ready = false;
      libraryStatusEl.textContent = `读取文件夹失败：${error.message || error}`;
      updateLibraryControls();
      renderLibrary();
    }
  }

  async function scanLibraryDirectory() {
    const folders = [
      {
        id: DEFAULT_FOLDER_ID,
        name: libraryState.rootName || "根目录",
        path: "",
        handle: libraryState.rootHandle,
        system: true
      }
    ];
    const documents = [];
    const boms = [];

    await scanLibraryFolder(libraryState.rootHandle, "", DEFAULT_FOLDER_ID, folders, documents, boms);

    folders.sort((a, b) => {
      if (a.id === DEFAULT_FOLDER_ID) return -1;
      if (b.id === DEFAULT_FOLDER_ID) return 1;
      return String(a.path || a.name).localeCompare(String(b.path || b.name), "zh-Hans-CN");
    });
    documents.sort((a, b) => {
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });
    boms.sort((a, b) => {
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });
    return { folders, documents, boms };
  }

  async function scanLibraryFolder(folderHandle, folderPath, folderId, folders, documents, boms) {
    const entries = [];
    for await (const [name, handle] of folderHandle.entries()) {
      entries.push([name, handle]);
    }
    entries.sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"));

    for (const [name, handle] of entries) {
      if (handle.kind === "directory") {
        const childPath = folderPath ? `${folderPath}/${name}` : name;
        const childFolder = {
          id: childPath,
          name,
          path: childPath,
          handle,
          system: false
        };
        folders.push(childFolder);
        await scanLibraryFolder(handle, childPath, childFolder.id, folders, documents, boms);
      } else if (handle.kind === "file" && isProjectFileName(name)) {
        const documentItem = await readLibraryDocument(handle, folderHandle, folderId, folderPath, name);
        if (documentItem) {
          documents.push(documentItem);
        }
      } else if (handle.kind === "file" && isBomFileName(name)) {
        boms.push(await readLibraryBom(handle, folderHandle, folderId, folderPath, name));
      }
    }
  }

  async function readLibraryBom(fileHandle, folderHandle, folderId, folderPath, fileName) {
    const file = await fileHandle.getFile();
    return {
      id: createLibraryFileId(folderId, fileName),
      name: fileName,
      folderId,
      folderPath,
      fileName,
      fileHandle,
      folderHandle,
      updatedAt: file.lastModified ? new Date(file.lastModified).toISOString() : "",
      source: "folder"
    };
  }

  async function readLibraryDocument(fileHandle, folderHandle, folderId, folderPath, fileName) {
    try {
      const file = await fileHandle.getFile();
      const text = await file.text();
      const project = JSON.parse(text);
      validateProjectFile(project);
      return {
        id: createLibraryFileId(folderId, fileName),
        documentId: project.document && project.document.id ? project.document.id : "",
        name: fileName,
        folderId,
        folderPath,
        fileName,
        fileHandle,
        folderHandle,
        currentVersion: Number(project.document && project.document.currentVersion) || 1,
        lastVersion: Number(project.document && project.document.lastVersion) || 1,
        pageCount: Array.isArray(project.pages) ? project.pages.length : 0,
        updatedAt: file.lastModified ? new Date(file.lastModified).toISOString() : project.savedAt || "",
        project
      };
    } catch (_) {
      return null;
    }
  }

  function renderLibrary() {
    updateLibraryControls();
    renderLibraryFolders();
    renderBomHistory();
    renderLibraryDocuments();
    syncLibraryActiveState();
  }

  function updateLibraryControls() {
    const supportsFolderAccess = Boolean(window.showDirectoryPicker && window.indexedDB);
    const feishuActive = isFeishuLibraryActive();
    const feishuConfigured = isFeishuConfigured();
    libraryPickFolderButton.disabled = !supportsFolderAccess || libraryState.busy;
    libraryRefreshFolderButton.disabled = feishuActive || !supportsFolderAccess || !libraryState.rootHandle || libraryState.busy;
    libraryNewFolderButton.disabled = feishuActive || !libraryState.ready || libraryState.busy;
    librarySaveCurrentButton.disabled = !libraryState.ready || libraryState.busy;
    feishuConnectButton.disabled = libraryState.busy;
    feishuRefreshButton.disabled = !feishuConfigured || libraryState.busy;
    feishuNewFolderButton.disabled = !feishuActive || !libraryState.ready || libraryState.busy;
    feishuDisconnectButton.disabled = !feishuActive || libraryState.busy;
    bomPickFileButton.disabled = !supportsFolderAccess && !window.FileReader;
    bomClosePreviewButton.disabled = !libraryState.activeBom && bomPreviewPanel.hidden;
    batchPrintButton.disabled = !libraryState.ready || libraryState.busy || !getVisibleLibraryDocuments().length;
  }

  function renderLibraryFolders() {
    libraryFolderListEl.replaceChildren();
    if (!hasLibraryConnection()) {
      const empty = document.createElement("div");
      empty.className = "library-empty";
      empty.textContent = "未连接电脑文件夹或飞书云盘";
      libraryFolderListEl.appendChild(empty);
      return;
    }

    const allButton = buildFolderButton({
      id: ALL_FOLDER_ID,
      name: "全部",
      count: libraryState.documents.length
    });
    libraryFolderListEl.appendChild(allButton);

    libraryState.folders.forEach((folder) => {
      const count = libraryState.documents.filter((documentItem) => {
        return (documentItem.folderId || DEFAULT_FOLDER_ID) === folder.id;
      }).length;
      libraryFolderListEl.appendChild(buildFolderButton({ ...folder, count }));
    });
  }

  function buildFolderButton(folder) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "folder-button";
    button.dataset.folderId = folder.id;
    button.classList.toggle("active", libraryState.activeFolderId === folder.id);

    const name = document.createElement("span");
    name.textContent = folder.name;
    const count = document.createElement("span");
    count.className = "folder-count";
    count.textContent = String(folder.count || 0);
    button.append(name, count);
    button.addEventListener("click", () => {
      libraryState.activeFolderId = folder.id;
      renderLibrary();
    });
    return button;
  }

  function renderBomHistory() {
    bomHistoryListEl.replaceChildren();
    const items = getVisibleBomItems();

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "library-empty";
      empty.textContent = "当前文件夹暂无 BOM 表，或点击“选择BOM表”导入。";
      bomHistoryListEl.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      bomHistoryListEl.appendChild(buildBomHistoryItem(item));
    });
  }

  function buildBomHistoryItem(item) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bom-history-item";
    button.classList.toggle("active", Boolean(libraryState.activeBom && libraryState.activeBom.id === item.id));
    button.dataset.bomId = item.id;

    const title = document.createElement("strong");
    title.textContent = removeBomExtension(item.name || item.fileName || "未命名BOM");
    const meta = document.createElement("span");
    const folder = item.folderId ? getLibraryFolder(item.folderId) : null;
    const source = item.source === "folder" && folder ? folder.name : "最近读取";
    meta.textContent = `${source} · ${formatDateTime(item.loadedAt || item.updatedAt)}`;
    button.append(title, meta);
    button.addEventListener("click", () => loadBomItem(item));
    return button;
  }

  function getVisibleBomItems() {
    const folderBoms = libraryState.activeFolderId === ALL_FOLDER_ID ?
      libraryState.boms :
      libraryState.boms.filter((item) => (item.folderId || DEFAULT_FOLDER_ID) === libraryState.activeFolderId);
    const seen = new Set();
    const items = [];

    folderBoms.forEach((item) => {
      seen.add(item.id);
      items.push(item);
    });
    libraryState.bomHistory.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        items.push(item);
      }
    });
    return items.slice(0, BOM_HISTORY_LIMIT);
  }

  function renderLibraryDocuments() {
    sopLibraryListEl.replaceChildren();
    const documents = getVisibleLibraryDocuments();
    libraryCountEl.textContent = String(documents.length);

    if (!hasLibraryConnection()) {
      const empty = document.createElement("div");
      empty.className = "library-empty";
      empty.textContent = "连接电脑文件夹或飞书云盘后，这里会显示其中的 .sop.json 文件。";
      sopLibraryListEl.appendChild(empty);
      return;
    }

    if (!documents.length) {
      const empty = document.createElement("div");
      empty.className = "library-empty";
      empty.textContent = "当前文件夹暂无 SOP 文件";
      sopLibraryListEl.appendChild(empty);
      return;
    }

    documents.forEach((documentItem) => {
      sopLibraryListEl.appendChild(buildLibraryDocumentItem(documentItem));
    });
  }

  function buildLibraryDocumentItem(documentItem) {
    const item = document.createElement("div");
    item.className = "library-document";
    item.dataset.fileId = documentItem.id;
    item.dataset.documentId = documentItem.documentId || "";

    const main = document.createElement("button");
    main.type = "button";
    main.className = "library-document-main";
    main.addEventListener("click", () => switchLibraryDocument(documentItem.id));

    const title = document.createElement("strong");
    title.textContent = removeProjectExtension(documentItem.name || "未命名");
    const meta = document.createElement("span");
    meta.className = "library-document-meta";
    const folder = getLibraryFolder(documentItem.folderId);
    meta.textContent = `${folder.name} · V${documentItem.currentVersion || 1} · ${formatDateTime(documentItem.updatedAt)}`;
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "library-document-actions";
    const renameButton = buildLibrarySmallButton("rename", "重命名");
    const deleteButton = buildLibrarySmallButton("delete", "删除");
    renameButton.addEventListener("click", () => renameLibraryDocument(documentItem.id));
    deleteButton.addEventListener("click", () => deleteLibraryDocument(documentItem.id));
    actions.append(renameButton, deleteButton);

    item.append(main, actions);
    return item;
  }

  function buildLibrarySmallButton(action, text) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.libraryAction = action;
    button.textContent = text;
    return button;
  }

  async function createLibraryFolder() {
    if (isFeishuLibraryActive()) {
      await createFeishuFolder();
      return;
    }
    if (!await ensureLibraryAccess(true)) return;

    const rawName = window.prompt("请输入文件夹名称", "新文件夹");
    if (rawName === null) return;
    const name = sanitizeLibraryName(rawName);
    if (!name) return;

    try {
      const parentFolder = getLibraryFolderForNewSop();
      const parentHandle = getLibraryFolderHandle(parentFolder);
      await parentHandle.getDirectoryHandle(name, { create: true });
      const parent = getLibraryFolder(parentFolder);
      libraryState.activeFolderId = parent.path ? `${parent.path}/${name}` : name;
      await refreshLibrary();
      libraryStatusEl.textContent = `已在电脑文件夹中新建：${name}`;
    } catch (error) {
      libraryStatusEl.textContent = `新建文件夹失败：${error.message || error}`;
    }
  }

  async function chooseBomFile() {
    try {
      if (window.showOpenFilePicker) {
        const [handle] = await window.showOpenFilePicker({
          multiple: false,
          types: [
            {
              description: "BOM表",
              accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                "application/vnd.ms-excel": [".xls"],
                "text/csv": [".csv", ".tsv", ".txt"],
                "application/json": [".json"]
              }
            }
          ]
        });
        if (!handle) return;
        const file = await handle.getFile();
        await loadBomFromFile(file, {
          id: createLibraryFileId("manual", handle.name || file.name),
          name: handle.name || file.name,
          fileName: handle.name || file.name,
          fileHandle: handle,
          source: "manual"
        });
        return;
      }
      bomFileInput.click();
    } catch (error) {
      if (error && error.name === "AbortError") return;
      libraryStatusEl.textContent = `读取BOM失败：${error.message || error}`;
    }
  }

  async function handleFallbackBomFile() {
    const file = bomFileInput.files && bomFileInput.files[0];
    bomFileInput.value = "";
    if (!file) return;

    try {
      await loadBomFromFile(file, {
        id: createLibraryFileId("upload", `${file.name}-${file.lastModified || Date.now()}`),
        name: file.name,
        fileName: file.name,
        source: "upload"
      });
    } catch (error) {
      libraryStatusEl.textContent = `读取BOM失败：${error.message || error}`;
    }
  }

  async function loadBomItem(item) {
    try {
      if (item.fileHandle) {
        const file = await item.fileHandle.getFile();
        await loadBomFromFile(file, item);
        return;
      }
      if (Array.isArray(item.items)) {
        activateBom({
          ...item,
          headers: item.headers || [],
          rows: item.rows || [],
          items: item.items || []
        });
        return;
      }
      libraryStatusEl.textContent = "这个BOM历史记录缺少文件权限，请重新选择BOM表。";
    } catch (error) {
      libraryStatusEl.textContent = `读取BOM失败：${error.message || error}`;
    }
  }

  async function loadBomFromFile(file, source = {}) {
    if (!isBomFileName(file.name)) {
      throw new Error("请选择 .xlsx、.xls、.csv、.tsv、.txt 或 .json 格式的 BOM 表。");
    }

    const parsed = await parseBomFile(file);
    const bom = {
      ...parsed,
      id: source.id || createLibraryFileId(source.folderId || "manual", source.fileName || file.name),
      name: source.name || file.name,
      fileName: source.fileName || file.name,
      fileHandle: source.fileHandle || null,
      folderId: source.folderId || "",
      folderPath: source.folderPath || "",
      updatedAt: source.updatedAt || (file.lastModified ? new Date(file.lastModified).toISOString() : ""),
      loadedAt: new Date().toISOString(),
      source: source.source || "manual"
    };

    await rememberBom(bom);
    activateBom(bom);
  }

  function activateBom(bom) {
    libraryState.activeBom = bom;
    openBomPreview(bom);
    renderBomHistory();
    if (activeMaterialNumberCell) {
      renderMaterialSearchResults(getMaterialFieldValue(activeMaterialNumberCell, "number"));
    }
    libraryStatusEl.textContent = `已读取BOM：${removeBomExtension(bom.name)}，${bom.items.length} 个物料`;
  }

  function openBomPreview(bom) {
    bomPreviewPanel.hidden = false;
    appShellEl.classList.add("bom-preview-open");
    setLibraryCollapsed(true);
    renderBomPreview(bom);
    updateLibraryControls();
    schedulePreviewScaleUpdate();
  }

  function closeBomPreview() {
    bomPreviewPanel.hidden = true;
    appShellEl.classList.remove("bom-preview-open");
    updateLibraryControls();
    schedulePreviewScaleUpdate();
  }

  function setLibraryCollapsed(collapsed) {
    libraryState.collapsed = Boolean(collapsed);
    appShellEl.classList.toggle("library-collapsed", libraryState.collapsed);
    libraryPanelEl.classList.toggle("is-collapsed", libraryState.collapsed);
    libraryToggleButton.textContent = libraryState.collapsed ? "‹" : "›";
    libraryToggleButton.setAttribute("aria-expanded", String(!libraryState.collapsed));
    libraryToggleButton.setAttribute("aria-label", libraryState.collapsed ? "展开SOP库" : "折叠SOP库");
    schedulePreviewScaleUpdate();
  }

  function initializeFeishuPanelCollapse() {
    let collapsed = true;
    try {
      const stored = window.localStorage.getItem(FEISHU_PANEL_COLLAPSED_KEY);
      if (stored === "false") {
        collapsed = false;
      }
    } catch (_) {
      collapsed = true;
    }
    setFeishuPanelCollapsed(collapsed);
  }

  function setFeishuPanelCollapsed(collapsed, options = {}) {
    const nextCollapsed = Boolean(collapsed);
    feishuPanel.classList.toggle("is-collapsed", nextCollapsed);
    feishuPanelBody.hidden = nextCollapsed;
    feishuPanelToggle.setAttribute("aria-expanded", String(!nextCollapsed));

    if (options.persist) {
      try {
        window.localStorage.setItem(FEISHU_PANEL_COLLAPSED_KEY, String(nextCollapsed));
      } catch (_) {
        // Ignore storage failures; the UI state still updates for this session.
      }
    }
  }

  function renderBomPreview(bom) {
    bomPreviewTitle.textContent = removeBomExtension(bom.name || "BOM表");
    bomPreviewMeta.textContent = `${bom.items.length} 个物料 · ${bom.headers.length || 0} 列`;
    bomPreviewStatus.textContent = bom.imageCount ?
      `已识别 ${bom.items.length} 个物料，包含 ${bom.imageCount} 张可填充图片。` :
      `已识别 ${bom.items.length} 个物料；如需自动填图，BOM中需包含图片链接、base64图片或xlsx内嵌图片。`;
    bomPreviewTable.replaceChildren();

    const headers = bom.headers && bom.headers.length ? bom.headers : ["物料编号", "物料名称", "规格数量", "图片"];
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header || "";
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    const rows = (bom.rows || []).slice(0, 500);
    rows.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.dataset.bomRow = String((bom.rowIndexes || [])[index] ?? index);
      headers.forEach((_, colIndex) => {
        const td = document.createElement("td");
        td.textContent = row[colIndex] || "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    bomPreviewTable.append(thead, tbody);
  }

  function highlightBomPreviewRow(item) {
    if (!item || bomPreviewPanel.hidden) return;
    bomPreviewTable.querySelectorAll("tr.is-match").forEach((row) => row.classList.remove("is-match"));
    const row = bomPreviewTable.querySelector(`tbody tr[data-bom-row="${item.rowIndex}"]`);
    if (row) {
      row.classList.add("is-match");
      row.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  async function rememberBom(bom) {
    const record = {
      id: bom.id,
      name: bom.name,
      fileName: bom.fileName,
      folderId: bom.folderId,
      folderPath: bom.folderPath,
      updatedAt: bom.updatedAt,
      loadedAt: bom.loadedAt,
      source: bom.source,
      fileHandle: bom.fileHandle || null,
      headers: bom.fileHandle ? [] : bom.headers,
      rows: bom.fileHandle ? [] : bom.rows,
      rowIndexes: bom.fileHandle ? [] : bom.rowIndexes,
      items: bom.fileHandle ? [] : bom.items,
      imageCount: bom.imageCount || 0
    };
    libraryState.bomHistory = [
      record,
      ...libraryState.bomHistory.filter((item) => item.id !== record.id)
    ].slice(0, BOM_HISTORY_LIMIT);

    if (libraryState.db) {
      await idbPut("bomHistory", record);
    }
  }

  async function loadBomHistory() {
    if (!libraryState.db) return [];
    try {
      const records = await idbGetAll("bomHistory");
      return records
        .sort((a, b) => new Date(b.loadedAt || 0).getTime() - new Date(a.loadedAt || 0).getTime())
        .slice(0, BOM_HISTORY_LIMIT);
    } catch (_) {
      return [];
    }
  }

  async function parseBomFile(file) {
    const extension = getFileExtension(file.name);
    if ([".csv", ".tsv", ".txt"].includes(extension)) {
      const text = await file.text();
      const rows = parseDelimitedText(text, extension === ".tsv" ? "\t" : detectDelimiter(text));
      return buildBomData(rows, file.name);
    }
    if (extension === ".json") {
      const data = JSON.parse(await file.text());
      return buildBomData(jsonToRows(data), file.name);
    }
    if ([".xlsx", ".xls"].includes(extension)) {
      if (!window.XLSX) {
        throw new Error("Excel解析库未加载，请确认网络可访问后刷新页面。");
      }
      const buffer = await file.arrayBuffer();
      const workbook = window.XLSX.read(buffer, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error("BOM表没有可读取的工作表。");
      }
      const sheet = workbook.Sheets[sheetName];
      const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
      const images = extension === ".xlsx" ? await extractXlsxImages(buffer, sheetName).catch(() => []) : [];
      return buildBomData(rows, file.name, images);
    }
    throw new Error("不支持的BOM格式。");
  }

  function buildBomData(rows, fileName, images = []) {
    const cleanRows = rows
      .map((row) => Array.from(row || []).map(cleanCellText))
      .filter((row) => row.some(Boolean));
    if (!cleanRows.length) {
      throw new Error("BOM表没有可读取的数据。");
    }

    const headerInfo = detectBomHeader(cleanRows);
    const headers = cleanRows[headerInfo.headerIndex] || [];
    const dataRows = cleanRows.slice(headerInfo.headerIndex + 1);
    const imageByRow = new Map(images.map((image) => [image.row, image.dataUrl]));
    const tableRows = [];
    const rowIndexes = [];
    const items = [];
    let imageCount = 0;

    dataRows.forEach((row, index) => {
      const sourceRowIndex = headerInfo.headerIndex + 1 + index;
      if (!row.some(Boolean)) return;
      const code = cleanCellText(row[headerInfo.codeCol]);
      if (!code || normalizeSearchText(code) === normalizeSearchText(headers[headerInfo.codeCol])) return;

      const imageSrc = normalizeBomImageSource(row[headerInfo.imageCol]) || imageByRow.get(sourceRowIndex) || "";
      if (imageSrc) imageCount += 1;
      const item = {
        id: `bom-${sourceRowIndex}-${code}`,
        code,
        name: cleanCellText(row[headerInfo.nameCol]),
        spec: cleanCellText(row[headerInfo.specCol]),
        imageSrc,
        rowIndex: sourceRowIndex,
        cells: row
      };
      tableRows.push(row);
      rowIndexes.push(sourceRowIndex);
      items.push(item);
    });

    if (!items.length) {
      throw new Error("没有识别到物料编号列，请检查BOM表头是否包含“物料编号/料号/编码”等字段。");
    }

    return {
      sourceName: fileName,
      headers,
      rows: tableRows,
      rowIndexes,
      items,
      imageCount,
      columnMap: headerInfo
    };
  }

  function detectBomHeader(rows) {
    let best = { headerIndex: 0, score: -1 };
    rows.slice(0, 20).forEach((row, index) => {
      const score = row.reduce((sum, cell) => sum + scoreBomHeaderCell(cell), 0);
      if (score > best.score) {
        best = { headerIndex: index, score };
      }
    });
    if (best.score < 3) {
      best.headerIndex = 0;
    }

    const headers = rows[best.headerIndex] || [];
    const codeCol = findBomColumn(headers, [
      /物料.*(编号|编码|代码)/,
      /料号/,
      /物料号/,
      /编码/,
      /编号/,
      /part.*(no|number)/i,
      /item.*(no|number)/i,
      /material.*(no|number|code)/i
    ], 0);
    const nameCol = findBomColumn(headers, [
      /物料.*名称/,
      /名称/,
      /品名/,
      /描述/,
      /物料描述/,
      /name/i,
      /description/i
    ], codeCol === 0 ? 1 : 0);
    const specCol = findBomColumn(headers, [
      /规格/,
      /型号/,
      /数量/,
      /规格数量/,
      /spec/i,
      /qty/i,
      /quantity/i
    ], -1);
    const imageCol = findBomColumn(headers, [
      /图片/,
      /图/,
      /照片/,
      /image/i,
      /photo/i,
      /picture/i,
      /url/i
    ], -1);

    return { headerIndex: best.headerIndex, codeCol, nameCol, specCol, imageCol };
  }

  function scoreBomHeaderCell(value) {
    const text = normalizeSearchText(value);
    if (!text) return 0;
    if (/物料.*(编号|编码|代码)|料号|物料号|part.*(no|number)|item.*(no|number)|material.*(no|number|code)/i.test(text)) return 3;
    if (/物料.*名称|名称|品名|描述|name|description/i.test(text)) return 2;
    if (/规格|型号|数量|spec|qty|quantity/i.test(text)) return 1;
    if (/图片|照片|image|photo|picture|url/i.test(text)) return 1;
    return 0;
  }

  function findBomColumn(headers, patterns, fallback) {
    const index = headers.findIndex((header) => {
      const raw = cleanCellText(header);
      const normalized = normalizeSearchText(raw);
      return patterns.some((pattern) => pattern.test(raw) || pattern.test(normalized));
    });
    return index >= 0 ? index : fallback;
  }

  function parseDelimitedText(text, delimiter) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === "\"") {
        if (inQuotes && next === "\"") {
          cell += "\"";
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
    row.push(cell);
    rows.push(row);
    return rows;
  }

  function detectDelimiter(text) {
    const firstLines = text.split(/\r?\n/).slice(0, 5).join("\n");
    const commaCount = (firstLines.match(/,/g) || []).length;
    const tabCount = (firstLines.match(/\t/g) || []).length;
    const semicolonCount = (firstLines.match(/;/g) || []).length;
    if (tabCount > commaCount && tabCount >= semicolonCount) return "\t";
    if (semicolonCount > commaCount) return ";";
    return ",";
  }

  function jsonToRows(data) {
    const source = Array.isArray(data) ? data : data.rows || data.items || data.data || [];
    if (!Array.isArray(source)) {
      throw new Error("JSON BOM 必须是数组，或包含 rows/items/data 数组。");
    }
    if (!source.length) return [];
    if (Array.isArray(source[0])) return source;
    const headers = Array.from(new Set(source.flatMap((item) => Object.keys(item || {}))));
    return [
      headers,
      ...source.map((item) => headers.map((header) => item && item[header] !== undefined ? item[header] : ""))
    ];
  }

  async function extractXlsxImages(buffer, sheetName) {
    if (!window.JSZip) return [];
    const zip = await window.JSZip.loadAsync(buffer);
    const workbookXml = await readZipText(zip, "xl/workbook.xml");
    const workbookRelsXml = await readZipText(zip, "xl/_rels/workbook.xml.rels");
    if (!workbookXml || !workbookRelsXml) return [];

    const workbookDoc = parseXml(workbookXml);
    const sheetNodes = getXmlElements(workbookDoc, "sheet");
    const sheetNode = sheetNodes.find((node) => node.getAttribute("name") === sheetName) || sheetNodes[0];
    if (!sheetNode) return [];
    const sheetRelId = sheetNode.getAttribute("r:id") || sheetNode.getAttribute("id");
    const workbookRels = parseXmlRelationships(workbookRelsXml);
    const sheetPath = resolveZipPath("xl", workbookRels.get(sheetRelId));
    if (!sheetPath) return [];

    const sheetRelsPath = getRelsPath(sheetPath);
    const sheetRelsXml = await readZipText(zip, sheetRelsPath);
    if (!sheetRelsXml) return [];
    const sheetRels = parseXmlRelationships(sheetRelsXml);
    const drawingTarget = Array.from(sheetRels.values()).find((target) => /drawings\/drawing\d+\.xml$/i.test(target));
    if (!drawingTarget) return [];
    const drawingPath = resolveZipPath(getZipDir(sheetPath), drawingTarget);
    const drawingXml = await readZipText(zip, drawingPath);
    const drawingRelsXml = await readZipText(zip, getRelsPath(drawingPath));
    if (!drawingXml || !drawingRelsXml) return [];

    const drawingDoc = parseXml(drawingXml);
    const drawingRels = parseXmlRelationships(drawingRelsXml);
    const anchors = [
      ...getXmlElements(drawingDoc, "twoCellAnchor"),
      ...getXmlElements(drawingDoc, "oneCellAnchor")
    ];
    const images = [];

    for (const anchor of anchors) {
      const from = getXmlElements(anchor, "from")[0];
      const row = Number(getXmlText(from, "row"));
      const col = Number(getXmlText(from, "col"));
      const blip = getXmlElements(anchor, "blip")[0];
      const relId = blip && (blip.getAttribute("r:embed") || blip.getAttribute("embed"));
      const mediaTarget = drawingRels.get(relId);
      const mediaPath = resolveZipPath(getZipDir(drawingPath), mediaTarget);
      const mediaFile = mediaPath ? zip.file(mediaPath) : null;
      if (!mediaFile || !Number.isFinite(row)) continue;
      const base64 = await mediaFile.async("base64");
      images.push({
        row,
        col: Number.isFinite(col) ? col : -1,
        dataUrl: `data:${getImageMimeType(mediaPath)};base64,${base64}`
      });
    }

    return images;
  }

  async function readZipText(zip, path) {
    const file = path ? zip.file(path.replace(/^\/+/, "")) : null;
    return file ? file.async("text") : "";
  }

  function parseXml(text) {
    return new DOMParser().parseFromString(text, "application/xml");
  }

  function parseXmlRelationships(text) {
    const doc = parseXml(text);
    const map = new Map();
    getXmlElements(doc, "Relationship").forEach((node) => {
      map.set(node.getAttribute("Id"), node.getAttribute("Target"));
    });
    return map;
  }

  function getXmlElements(root, localName) {
    if (!root) return [];
    return Array.from(root.getElementsByTagName("*")).filter((node) => node.localName === localName);
  }

  function getXmlText(root, localName) {
    const node = getXmlElements(root, localName)[0];
    return node ? node.textContent || "" : "";
  }

  function resolveZipPath(baseDir, target) {
    if (!target) return "";
    const parts = `${baseDir || ""}/${target}`.split("/");
    const resolved = [];
    parts.forEach((part) => {
      if (!part || part === ".") return;
      if (part === "..") {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    });
    return resolved.join("/");
  }

  function getZipDir(path) {
    const normalized = String(path || "").replace(/\\/g, "/");
    const index = normalized.lastIndexOf("/");
    return index >= 0 ? normalized.slice(0, index) : "";
  }

  function getRelsPath(path) {
    const dir = getZipDir(path);
    const name = String(path || "").slice(dir.length + 1);
    return `${dir}/_rels/${name}.rels`;
  }

  function getImageMimeType(path) {
    const extension = getFileExtension(path);
    if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
    if (extension === ".gif") return "image/gif";
    if (extension === ".webp") return "image/webp";
    if (extension === ".svg") return "image/svg+xml";
    return "image/png";
  }

  function normalizeBomImageSource(value) {
    const text = cleanCellText(value);
    if (!text) return "";
    if (/^data:image\//i.test(text)) return text;
    if (/^https?:\/\//i.test(text)) return text;
    if (/^\/\//.test(text)) return `https:${text}`;
    if (/^[A-Za-z0-9+/=\s]{120,}$/.test(text)) {
      return `data:image/png;base64,${text.replace(/\s+/g, "")}`;
    }
    return "";
  }

  async function runSelfTest() {
    try {
      const imageData = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      const csv = [
        "物料编号,物料名称,规格数量,图片",
        `MAT-001,测试物料,2PCS,"${imageData}"`
      ].join("\n");
      const file = new File([csv], "selftest-bom.csv", { type: "text/csv" });
      const parsed = await parseBomFile(file);
      const bom = {
        ...parsed,
        id: "selftest-bom",
        name: "selftest-bom.csv",
        fileName: "selftest-bom.csv",
        loadedAt: new Date().toISOString(),
        source: "selftest"
      };

      libraryState.activeBom = bom;
      openBomPreview(bom);
      const numberCell = document.querySelector(".text-cell[data-material-field='number'][data-material-index='0']");
      applyBomItemToMaterial(numberCell, bom.items[0]);
      const page = numberCell.closest(".sop-page");
      const nameCell = page.querySelector(".text-cell[data-material-field='name'][data-material-index='0']");
      const imageSlot = page.querySelector(".image-cell[data-material-index='0']");
      const img = imageSlot.querySelector("img");
      await waitImageReady(img);
      await nextFrame();

      const passed = getMaterialFieldValue(numberCell, "number") === "MAT-001" &&
        getMaterialFieldValue(nameCell, "name") === "测试物料" &&
        imageSlot.dataset.hasImage === "true" &&
        bomPreviewPanel.hidden === false &&
        appShellEl.classList.contains("bom-preview-open");
      document.body.dataset.selftest = passed ? "pass" : "fail";
      if (!passed) {
        document.body.dataset.selftestError = "BOM selftest assertions failed";
      }
    } catch (error) {
      document.body.dataset.selftest = "fail";
      document.body.dataset.selftestError = error && error.message ? error.message : String(error);
    }
  }

  async function saveCurrentProjectToLibrary(options = {}) {
    if (!projectState.documentId || libraryState.busy) return false;
    if (isFeishuLibraryActive()) {
      return saveCurrentProjectToFeishu(options);
    }
    if (!await ensureLibraryAccess(Boolean(options.requestPermission))) return false;

    libraryState.busy = true;
    try {
      if (!options.skipVersion) {
        ensureCurrentVersionSnapshot(options.reason || "保存到电脑文件夹");
      }
      if (options.assignActiveFolder && libraryState.activeFolderId !== ALL_FOLDER_ID) {
        projectState.folderId = libraryState.activeFolderId || DEFAULT_FOLDER_ID;
        projectState.libraryFileHandle = null;
        projectState.libraryFileId = "";
      }

      const folderId = normalizeLibraryFolderId(projectState.folderId);
      const folderHandle = getLibraryFolderHandle(folderId);
      let fileName = normalizeProjectFileName(projectState.fileName);
      let fileHandle = projectState.libraryFileHandle;

      if (!fileHandle) {
        fileName = await getAvailableProjectFileName(folderHandle, fileName);
        fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
      }

      projectState.folderId = folderId;
      projectState.fileName = fileName;
      projectState.libraryFileHandle = fileHandle;
      projectState.libraryFileId = createLibraryFileId(folderId, fileName);

      const project = serializeProject({ includeHistory: true });
      await writeProjectToHandle(fileHandle, project);
      markClean();
      await refreshLibrary();
      if (!options.silent) {
        libraryStatusEl.textContent = `已保存到电脑文件夹：${removeProjectExtension(fileName)}`;
      }
      return true;
    } catch (error) {
      libraryStatusEl.textContent = `保存到电脑文件夹失败：${error.message || error}`;
      return false;
    } finally {
      libraryState.busy = false;
    }
  }

  async function prepareCurrentProjectForSwitch() {
    if (hasLibraryConnection()) {
      return saveCurrentProjectToLibrary({
        reason: "切换前自动保存",
        silent: true,
        requestPermission: true
      });
    }
    return confirmDiscardChanges();
  }

  async function switchLibraryDocument(fileId) {
    if (!libraryState.ready || fileId === projectState.libraryFileId) return;

    const documentItem = libraryState.documents.find((item) => item.id === fileId);
    if (!documentItem) {
      libraryStatusEl.textContent = "找不到这个 SOP 文件";
      await refreshLibrary();
      return;
    }
    if (!documentItem.project && documentItem.source === STORAGE_MODE_FEISHU) {
      try {
        documentItem.project = await loadFeishuProject(documentItem);
      } catch (error) {
        libraryStatusEl.textContent = `读取飞书 SOP 失败：${error.message || error}`;
        return;
      }
    }
    if (!documentItem.project) {
      libraryStatusEl.textContent = "找不到这个 SOP 文件";
      await refreshLibrary();
      return;
    }

    const canSwitch = await prepareCurrentProjectForSwitch();
    if (!canSwitch) return;

    await applyProject(documentItem.project, documentItem.name, null);
    projectState.folderId = documentItem.folderId || DEFAULT_FOLDER_ID;
    projectState.libraryFileId = documentItem.id;
    projectState.libraryFileHandle = documentItem.source === STORAGE_MODE_FEISHU ? null : documentItem.fileHandle;
    markClean();
    libraryState.activeFolderId = documentItem.folderId || DEFAULT_FOLDER_ID;
    await refreshLibrary();
    libraryStatusEl.textContent = `已切换：${removeProjectExtension(documentItem.name)}`;
  }

  async function renameLibraryDocument(fileId) {
    if (isFeishuLibraryActive()) {
      await renameFeishuDocument(fileId);
      return;
    }
    if (!await ensureLibraryAccess(true)) return;
    const documentItem = libraryState.documents.find((item) => item.id === fileId);
    if (!documentItem) return;

    const rawName = window.prompt("请输入新的SOP名称", removeProjectExtension(documentItem.name || ""));
    if (rawName === null) return;
    let name = normalizeProjectFileName(sanitizeLibraryName(rawName));
    if (!name || name === documentItem.fileName) return;

    try {
      name = await getAvailableProjectFileName(documentItem.folderHandle, name);
      const project = structuredCloneSafe(documentItem.project);
      if (project.document) {
        project.document.fileName = name;
        project.document.folderId = documentItem.folderId || DEFAULT_FOLDER_ID;
      }
      const newHandle = await documentItem.folderHandle.getFileHandle(name, { create: true });
      await writeProjectToHandle(newHandle, project);
      await documentItem.folderHandle.removeEntry(documentItem.fileName);

      if (projectState.libraryFileId === fileId) {
        projectState.fileName = name;
        projectState.libraryFileHandle = newHandle;
        projectState.libraryFileId = createLibraryFileId(documentItem.folderId, name);
        updateProjectUi();
      }

      await refreshLibrary();
      libraryStatusEl.textContent = `已重命名：${removeProjectExtension(name)}`;
    } catch (error) {
      libraryStatusEl.textContent = `重命名失败：${error.message || error}`;
    }
  }

  async function deleteLibraryDocument(fileId) {
    if (isFeishuLibraryActive()) {
      await deleteFeishuDocument(fileId);
      return;
    }
    if (!await ensureLibraryAccess(true)) return;
    const documentItem = libraryState.documents.find((item) => item.id === fileId);
    if (!documentItem) return;

    const ok = window.confirm(`确定删除电脑文件夹里的“${documentItem.fileName}”？`);
    if (!ok) return;

    try {
      await documentItem.folderHandle.removeEntry(documentItem.fileName);
      if (projectState.libraryFileId === fileId) {
        isApplyingProject = true;
        pagesEl.replaceChildren();
        resetRuntimeCounters();
        addPage();
        isApplyingProject = false;
        initializeProjectState("未命名.sop.json", null, { folderId: getLibraryFolderForNewSop() });
      }
      await refreshLibrary();
      libraryStatusEl.textContent = "已删除电脑文件夹中的 SOP 文件";
    } catch (error) {
      libraryStatusEl.textContent = `删除失败：${error.message || error}`;
    }
  }

  function syncLibraryActiveState() {
    if (!sopLibraryListEl) return;
    sopLibraryListEl.querySelectorAll(".library-document").forEach((item) => {
      const matchesFile = item.dataset.fileId && item.dataset.fileId === projectState.libraryFileId;
      const matchesDocument = item.dataset.documentId && item.dataset.documentId === projectState.documentId;
      item.classList.toggle("active", Boolean(matchesFile || (!projectState.libraryFileId && matchesDocument)));
    });
  }

  function getVisibleLibraryDocuments() {
    if (libraryState.activeFolderId === ALL_FOLDER_ID) {
      return libraryState.documents;
    }
    return libraryState.documents.filter((documentItem) => {
      return (documentItem.folderId || DEFAULT_FOLDER_ID) === libraryState.activeFolderId;
    });
  }

  function getLibraryFolder(folderId) {
    return libraryState.folders.find((folder) => folder.id === folderId) ||
      libraryState.folders.find((folder) => folder.id === DEFAULT_FOLDER_ID) ||
      { id: DEFAULT_FOLDER_ID, name: libraryState.rootName || "根目录", path: "", handle: libraryState.rootHandle };
  }

  function getLibraryFolderHandle(folderId) {
    const folder = getLibraryFolder(folderId);
    return folder && folder.handle ? folder.handle : libraryState.rootHandle;
  }

  function getLibraryFolderForNewSop() {
    return libraryState.activeFolderId && libraryState.activeFolderId !== ALL_FOLDER_ID ?
      libraryState.activeFolderId :
      DEFAULT_FOLDER_ID;
  }

  function normalizeLibraryFolderId(folderId) {
    return libraryState.folders.some((folder) => folder.id === folderId) ? folderId : DEFAULT_FOLDER_ID;
  }

  async function ensureLibraryAccess(requestPermission) {
    if (isFeishuLibraryActive()) {
      if (!isFeishuConfigured()) {
        libraryStatusEl.textContent = "请先填写飞书中转服务地址和飞书文件夹链接。";
        return false;
      }
      if (!libraryState.ready && requestPermission) {
        await refreshFeishuLibrary({ manual: true });
      }
      return libraryState.ready;
    }

    if (!libraryState.rootHandle) {
      libraryStatusEl.textContent = "请先选择电脑文件夹。";
      return false;
    }
    const hasPermission = await ensureLibraryPermission({ request: requestPermission });
    libraryState.ready = hasPermission;
    updateLibraryControls();
    if (!hasPermission) {
      libraryStatusEl.textContent = "没有文件夹读写权限。";
    }
    return hasPermission;
  }

  async function ensureLibraryPermission(options = {}) {
    const handle = libraryState.rootHandle;
    if (!handle) return false;
    if (!handle.queryPermission || !handle.requestPermission) return true;

    let permission = await handle.queryPermission({ mode: "readwrite" });
    if (permission === "granted") return true;
    if (options.request) {
      permission = await handle.requestPermission({ mode: "readwrite" });
    }
    return permission === "granted";
  }

  async function loadStoredLibraryRoot() {
    if (!libraryState.db) return null;
    const record = await idbGet("settings", ROOT_DIRECTORY_SETTING_KEY);
    return record && record.handle ? record.handle : null;
  }

  async function saveStoredLibraryRoot(handle) {
    if (!libraryState.db) return;
    await idbPut("settings", {
      key: ROOT_DIRECTORY_SETTING_KEY,
      handle,
      name: handle.name || "SOP库",
      updatedAt: new Date().toISOString()
    });
  }

  async function loadLibraryStorageMode() {
    if (!libraryState.db) return STORAGE_MODE_LOCAL;
    const record = await idbGet("settings", LIBRARY_STORAGE_MODE_SETTING_KEY);
    return record && record.mode === STORAGE_MODE_FEISHU ? STORAGE_MODE_FEISHU : STORAGE_MODE_LOCAL;
  }

  async function saveLibraryStorageMode(mode) {
    if (!libraryState.db) return;
    await idbPut("settings", {
      key: LIBRARY_STORAGE_MODE_SETTING_KEY,
      mode,
      updatedAt: new Date().toISOString()
    });
  }

  async function loadStoredFeishuSettings() {
    if (!libraryState.db) return null;
    const record = await idbGet("settings", FEISHU_SETTING_KEY);
    return record && record.settings ? record.settings : null;
  }

  async function saveStoredFeishuSettings() {
    if (!libraryState.db) return;
    await idbPut("settings", {
      key: FEISHU_SETTING_KEY,
      settings: {
        proxyUrl: libraryState.feishu.proxyUrl,
        folderInput: libraryState.feishu.folderInput,
        folderToken: libraryState.feishu.folderToken
      },
      updatedAt: new Date().toISOString()
    });
  }

  function applyFeishuSettings(settings) {
    libraryState.feishu.proxyUrl = normalizeFeishuProxyUrl(settings.proxyUrl);
    libraryState.feishu.folderInput = String(settings.folderInput || "");
    libraryState.feishu.folderToken = settings.folderToken || extractFeishuFolderToken(settings.folderInput);
    feishuProxyUrlInput.value = libraryState.feishu.proxyUrl;
    feishuFolderLinkInput.value = libraryState.feishu.folderInput;
  }

  async function connectFeishuLibrary() {
    const proxyUrl = normalizeFeishuProxyUrl(feishuProxyUrlInput.value);
    const folderInput = String(feishuFolderLinkInput.value || "").trim();
    const folderToken = extractFeishuFolderToken(folderInput);

    if (!proxyUrl || !folderToken) {
      libraryStatusEl.textContent = "请填写飞书中转服务地址和飞书文件夹链接。";
      updateLibraryControls();
      return;
    }

    libraryState.storageMode = STORAGE_MODE_FEISHU;
    libraryState.rootName = "飞书云盘";
    libraryState.feishu.proxyUrl = proxyUrl;
    libraryState.feishu.folderInput = folderInput;
    libraryState.feishu.folderToken = folderToken;
    await saveLibraryStorageMode(STORAGE_MODE_FEISHU);
    await saveStoredFeishuSettings();
    await refreshFeishuLibrary({ manual: true });
  }

  async function disconnectFeishuLibrary() {
    libraryState.storageMode = STORAGE_MODE_LOCAL;
    libraryState.feishu.connected = false;
    libraryState.documents = [];
    libraryState.folders = [];
    libraryState.boms = [];
    libraryState.activeFolderId = ALL_FOLDER_ID;
    await saveLibraryStorageMode(STORAGE_MODE_LOCAL);

    if (libraryState.rootHandle) {
      await refreshLibrary({ requestPermission: false });
      libraryStatusEl.textContent = `已切回电脑文件夹：${libraryState.rootName}`;
      return;
    }

    libraryState.ready = false;
    libraryStatusEl.textContent = "已断开飞书云盘，请选择电脑文件夹或重新连接飞书。";
    updateLibraryControls();
    renderLibrary();
  }

  async function refreshFeishuLibrary(options = {}) {
    applyFeishuSettings({
      proxyUrl: feishuProxyUrlInput.value || libraryState.feishu.proxyUrl,
      folderInput: feishuFolderLinkInput.value || libraryState.feishu.folderInput,
      folderToken: extractFeishuFolderToken(feishuFolderLinkInput.value || libraryState.feishu.folderInput)
    });

    if (!isFeishuConfigured()) {
      libraryState.ready = false;
      libraryState.feishu.connected = false;
      if (!options.silent) {
        libraryStatusEl.textContent = "请先填写飞书中转服务地址和飞书文件夹链接。";
      }
      updateLibraryControls();
      renderLibrary();
      return;
    }

    libraryState.storageMode = STORAGE_MODE_FEISHU;
    libraryState.busy = true;
    updateLibraryControls();
    if (!options.silent) {
      libraryStatusEl.textContent = "正在读取飞书云盘 SOP库...";
    }

    try {
      await saveLibraryStorageMode(STORAGE_MODE_FEISHU);
      await saveStoredFeishuSettings();
      const payload = await feishuRequest(`/library?folderToken=${encodeURIComponent(libraryState.feishu.folderToken)}`);
      const normalized = normalizeFeishuLibraryPayload(payload);
      libraryState.ready = true;
      libraryState.feishu.connected = true;
      libraryState.rootName = normalized.rootName;
      libraryState.folders = normalized.folders;
      libraryState.documents = normalized.documents;
      libraryState.boms = normalized.boms;
      if (
        libraryState.activeFolderId !== ALL_FOLDER_ID &&
        !libraryState.folders.some((folder) => folder.id === libraryState.activeFolderId)
      ) {
        libraryState.activeFolderId = ALL_FOLDER_ID;
      }
      renderLibrary();
      if (!options.silent) {
        libraryStatusEl.textContent = `已连接飞书云盘：${libraryState.rootName}`;
      }
    } catch (error) {
      libraryState.ready = false;
      libraryState.feishu.connected = false;
      libraryStatusEl.textContent = error.loginUrl ?
        `飞书未授权，请先打开授权地址：${error.loginUrl}` :
        `飞书云盘读取失败：${error.message || error}`;
      updateLibraryControls();
      renderLibrary();
    } finally {
      libraryState.busy = false;
      updateLibraryControls();
    }
  }

  async function saveCurrentProjectToFeishu(options = {}) {
    if (!await ensureFeishuAccess(Boolean(options.requestPermission))) return false;

    libraryState.busy = true;
    updateLibraryControls();
    try {
      if (!options.skipVersion) {
        ensureCurrentVersionSnapshot(options.reason || "保存到飞书云盘");
      }
      if (options.assignActiveFolder && libraryState.activeFolderId !== ALL_FOLDER_ID) {
        projectState.folderId = libraryState.activeFolderId || DEFAULT_FOLDER_ID;
        projectState.libraryFileId = "";
        projectState.libraryFileHandle = null;
      }

      const folderId = normalizeLibraryFolderId(projectState.folderId);
      const folderCloudId = getFeishuFolderCloudId(folderId);
      const fileName = normalizeProjectFileName(projectState.fileName);
      const project = serializeProject({ includeHistory: true });
      const currentDocument = libraryState.documents.find((item) => item.id === projectState.libraryFileId);
      let savedItem;

      if (currentDocument && currentDocument.cloudId) {
        savedItem = await feishuRequest(`/files/${encodeURIComponent(currentDocument.cloudId)}`, {
          method: "PUT",
          body: {
            folderId: folderCloudId,
            fileName,
            project
          }
        });
      } else {
        savedItem = await feishuRequest("/files", {
          method: "POST",
          body: {
            folderId: folderCloudId,
            fileName,
            project
          }
        });
      }

      const documentItem = normalizeFeishuDocument(savedItem && (savedItem.document || savedItem.file || savedItem), folderId);
      projectState.folderId = documentItem.folderId || folderId;
      projectState.fileName = documentItem.fileName || fileName;
      projectState.libraryFileId = documentItem.id;
      projectState.libraryFileHandle = null;
      markClean();
      await refreshFeishuLibrary({ silent: true });
      if (!options.silent) {
        libraryStatusEl.textContent = `已保存到飞书云盘：${removeProjectExtension(projectState.fileName)}`;
      }
      return true;
    } catch (error) {
      libraryStatusEl.textContent = `保存到飞书云盘失败：${error.message || error}`;
      return false;
    } finally {
      libraryState.busy = false;
      updateLibraryControls();
    }
  }

  async function ensureFeishuAccess(requestRefresh) {
    if (!isFeishuConfigured()) {
      libraryStatusEl.textContent = "请先填写飞书中转服务地址和飞书文件夹链接。";
      return false;
    }
    if (!libraryState.ready && requestRefresh) {
      await refreshFeishuLibrary({ manual: true });
    }
    return libraryState.ready;
  }

  async function loadFeishuProject(documentItem) {
    if (documentItem.project) return documentItem.project;
    const cloudId = documentItem.cloudId || removeFeishuIdPrefix(documentItem.id);
    const payload = await feishuRequest(`/files/${encodeURIComponent(cloudId)}`);
    const project = payload && payload.project ? payload.project : payload;
    validateProjectFile(project);
    return project;
  }

  async function createFeishuFolder() {
    if (!await ensureFeishuAccess(true)) return;

    const rawName = window.prompt("请输入飞书文件夹名称", "新文件夹");
    if (rawName === null) return;
    const name = sanitizeLibraryName(rawName);
    if (!name) return;

    libraryState.busy = true;
    updateLibraryControls();
    try {
      const parentId = getLibraryFolderForNewSop();
      const parentCloudId = getFeishuFolderCloudId(parentId);
      const payload = await feishuRequest("/folders", {
        method: "POST",
        body: {
          parentId: parentCloudId,
          name
        }
      });
      const folder = normalizeFeishuFolder(payload && (payload.folder || payload), parentId);
      await refreshFeishuLibrary({ silent: true });
      libraryState.activeFolderId = folder.id || parentId;
      renderLibrary();
      libraryStatusEl.textContent = `已在飞书云盘中新建：${name}`;
    } catch (error) {
      libraryStatusEl.textContent = `新建飞书文件夹失败：${error.message || error}`;
    } finally {
      libraryState.busy = false;
      updateLibraryControls();
    }
  }

  async function renameFeishuDocument(fileId) {
    if (!await ensureFeishuAccess(true)) return;
    const documentItem = libraryState.documents.find((item) => item.id === fileId);
    if (!documentItem) return;

    const rawName = window.prompt("请输入新的SOP名称", removeProjectExtension(documentItem.name || ""));
    if (rawName === null) return;
    const name = normalizeProjectFileName(sanitizeLibraryName(rawName));
    if (!name || name === documentItem.fileName) return;

    libraryState.busy = true;
    updateLibraryControls();
    try {
      await feishuRequest(`/files/${encodeURIComponent(documentItem.cloudId)}`, {
        method: "PATCH",
        body: {
          fileName: name,
          folderId: getFeishuFolderCloudId(documentItem.folderId)
        }
      });
      if (projectState.libraryFileId === fileId) {
        projectState.fileName = name;
      }
      await refreshFeishuLibrary({ silent: true });
      libraryStatusEl.textContent = `已重命名飞书 SOP：${removeProjectExtension(name)}`;
    } catch (error) {
      libraryStatusEl.textContent = `飞书重命名失败：${error.message || error}`;
    } finally {
      libraryState.busy = false;
      updateLibraryControls();
    }
  }

  async function deleteFeishuDocument(fileId) {
    if (!await ensureFeishuAccess(true)) return;
    const documentItem = libraryState.documents.find((item) => item.id === fileId);
    if (!documentItem) return;

    const ok = window.confirm(`确定删除飞书云盘里的“${documentItem.fileName}”？`);
    if (!ok) return;

    libraryState.busy = true;
    updateLibraryControls();
    try {
      await feishuRequest(`/files/${encodeURIComponent(documentItem.cloudId)}`, { method: "DELETE" });
      if (projectState.libraryFileId === fileId) {
        isApplyingProject = true;
        pagesEl.replaceChildren();
        resetRuntimeCounters();
        addPage();
        isApplyingProject = false;
        initializeProjectState("未命名.sop.json", null, { folderId: getLibraryFolderForNewSop() });
      }
      await refreshFeishuLibrary({ silent: true });
      libraryStatusEl.textContent = "已删除飞书云盘中的 SOP 文件";
    } catch (error) {
      libraryStatusEl.textContent = `飞书删除失败：${error.message || error}`;
    } finally {
      libraryState.busy = false;
      updateLibraryControls();
    }
  }

  async function feishuRequest(path, options = {}) {
    const baseUrl = normalizeFeishuProxyUrl(libraryState.feishu.proxyUrl);
    const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const init = {
      method: options.method || "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    };

    if (options.body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, init);
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch (_) {
        payload = { message: text };
      }
    }

    if (!response.ok) {
      const message = payload && (payload.error || payload.message) ? payload.error || payload.message : response.statusText;
      const error = new Error(message || `HTTP ${response.status}`);
      if (payload && payload.loginUrl) {
        error.loginUrl = payload.loginUrl;
      }
      throw error;
    }
    return payload || {};
  }

  function normalizeFeishuLibraryPayload(payload) {
    const rootName = String(payload.rootName || payload.name || "飞书云盘");
    const folders = [
      {
        id: DEFAULT_FOLDER_ID,
        cloudId: payload.rootId || libraryState.feishu.folderToken,
        name: rootName,
        path: "",
        source: STORAGE_MODE_FEISHU,
        system: true
      }
    ];
    const seenFolders = new Set([DEFAULT_FOLDER_ID]);
    const rawFolders = Array.isArray(payload.folders) ? payload.folders : [];
    rawFolders.forEach((item) => {
      const folder = normalizeFeishuFolder(item, DEFAULT_FOLDER_ID);
      if (!seenFolders.has(folder.id)) {
        seenFolders.add(folder.id);
        folders.push(folder);
      }
    });

    const rawDocuments = Array.isArray(payload.documents) ? payload.documents :
      Array.isArray(payload.files) ? payload.files : [];
    const documents = rawDocuments
      .map((item) => normalizeFeishuDocument(item, DEFAULT_FOLDER_ID))
      .filter((item) => isProjectFileName(item.fileName));

    const rawBoms = Array.isArray(payload.boms) ? payload.boms : [];
    const boms = rawBoms.map((item) => ({
      id: createFeishuId(item.id || item.fileToken || item.token || item.fileName || item.name),
      cloudId: item.id || item.fileToken || item.token || "",
      name: item.name || item.fileName || "BOM",
      folderId: item.folderId ? createFeishuId(item.folderId) : DEFAULT_FOLDER_ID,
      folderPath: item.folderPath || "",
      fileName: item.fileName || item.name || "BOM",
      updatedAt: item.updatedAt || item.modifiedAt || "",
      source: STORAGE_MODE_FEISHU
    })).filter((item) => isBomFileName(item.fileName));

    folders.sort((a, b) => {
      if (a.id === DEFAULT_FOLDER_ID) return -1;
      if (b.id === DEFAULT_FOLDER_ID) return 1;
      return String(a.path || a.name).localeCompare(String(b.path || b.name), "zh-Hans-CN");
    });
    documents.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    return { rootName, folders, documents, boms };
  }

  function normalizeFeishuFolder(item, fallbackParentId) {
    const rawId = item && (item.id || item.folderId || item.folderToken || item.token);
    const id = rawId ? createFeishuId(rawId) : DEFAULT_FOLDER_ID;
    return {
      id,
      cloudId: rawId || "",
      parentId: item && item.parentId ? createFeishuId(item.parentId) : fallbackParentId,
      name: item && item.name ? item.name : "未命名文件夹",
      path: item && item.path ? item.path : "",
      source: STORAGE_MODE_FEISHU,
      system: false
    };
  }

  function normalizeFeishuDocument(item, fallbackFolderId) {
    const rawId = item && (item.id || item.fileId || item.fileToken || item.token);
    const fileName = normalizeProjectFileName(item && (item.fileName || item.name || projectState.fileName));
    const folderId = item && item.folderId ? createFeishuId(item.folderId) : fallbackFolderId;
    const project = item && item.project ? item.project : null;
    return {
      id: createFeishuId(rawId || `${folderId}::${fileName}`),
      cloudId: rawId || "",
      documentId: item && item.documentId ? item.documentId : project && project.document ? project.document.id : "",
      name: fileName,
      folderId,
      folderPath: item && item.folderPath ? item.folderPath : "",
      fileName,
      fileHandle: null,
      folderHandle: null,
      currentVersion: Number(item && item.currentVersion) || Number(project && project.document && project.document.currentVersion) || 1,
      lastVersion: Number(item && item.lastVersion) || Number(project && project.document && project.document.lastVersion) || 1,
      pageCount: Number(item && item.pageCount) || (project && Array.isArray(project.pages) ? project.pages.length : 0),
      updatedAt: item && (item.updatedAt || item.modifiedAt || item.savedAt) || project && project.savedAt || "",
      project,
      source: STORAGE_MODE_FEISHU
    };
  }

  function createFeishuId(value) {
    const id = String(value || "").trim();
    return id.startsWith("feishu::") ? id : `feishu::${id}`;
  }

  function removeFeishuIdPrefix(value) {
    return String(value || "").replace(/^feishu::/, "");
  }

  function normalizeFeishuProxyUrl(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function extractFeishuFolderToken(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw);
      const pathMatch = url.pathname.match(/\/drive\/folder\/([^/?#]+)/i);
      if (pathMatch) return decodeURIComponent(pathMatch[1]);
      const queryToken = url.searchParams.get("folder_token") || url.searchParams.get("token");
      if (queryToken) return queryToken;
    } catch (_) {
      // Plain folder tokens are accepted.
    }
    const match = raw.match(/(?:drive\/folder\/|folder_token=|token=)([A-Za-z0-9_-]+)/i);
    if (match) return match[1];
    return raw;
  }

  function isFeishuConfigured() {
    return Boolean(libraryState.feishu.proxyUrl && libraryState.feishu.folderToken);
  }

  function isFeishuLibraryActive() {
    return libraryState.storageMode === STORAGE_MODE_FEISHU;
  }

  function hasLibraryConnection() {
    return isFeishuLibraryActive() ? isFeishuConfigured() : Boolean(libraryState.rootHandle);
  }

  function getFeishuFolderCloudId(folderId) {
    const folder = getLibraryFolder(folderId);
    if (folder && folder.cloudId) return folder.cloudId;
    if (!folderId || folderId === DEFAULT_FOLDER_ID) return libraryState.feishu.folderToken;
    return removeFeishuIdPrefix(folderId);
  }

  async function getAvailableProjectFileName(folderHandle, preferredName) {
    const baseName = removeProjectExtension(preferredName) || "未命名";
    let candidate = normalizeProjectFileName(baseName);
    let counter = 2;
    while (await folderHasFile(folderHandle, candidate)) {
      candidate = normalizeProjectFileName(`${baseName}-${counter}`);
      counter += 1;
    }
    return candidate;
  }

  async function folderHasFile(folderHandle, fileName) {
    try {
      await folderHandle.getFileHandle(fileName);
      return true;
    } catch (error) {
      if (error && error.name === "NotFoundError") return false;
      throw error;
    }
  }

  function createLibraryFileId(folderId, fileName) {
    return `${folderId || DEFAULT_FOLDER_ID}::${fileName}`;
  }

  function isProjectFileName(fileName) {
    return /\.sop\.json$/i.test(String(fileName || ""));
  }

  function isBomFileName(fileName) {
    return bomFileExtensions.includes(getFileExtension(fileName));
  }

  function sanitizeLibraryName(value) {
    return String(value || "").trim().replace(/[\\/:*?"<>|]/g, "-").slice(0, 80);
  }

  function removeProjectExtension(fileName) {
    return String(fileName || "未命名").replace(/\.sop\.json$/i, "").replace(/\.json$/i, "");
  }

  function removeBomExtension(fileName) {
    return String(fileName || "未命名BOM").replace(/\.(xlsx|xls|csv|tsv|txt|json)$/i, "");
  }

  function idbGet(storeName, key) {
    return idbRequest(storeName, "readonly", (store) => store.get(key));
  }

  function idbGetAll(storeName) {
    return idbRequest(storeName, "readonly", (store) => store.getAll());
  }

  function idbPut(storeName, value) {
    return idbRequest(storeName, "readwrite", (store) => store.put(value));
  }

  function idbRequest(storeName, mode, operation) {
    return new Promise((resolve, reject) => {
      const transaction = libraryState.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = operation(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB操作失败"));
      transaction.onerror = () => reject(transaction.error || new Error("IndexedDB事务失败"));
    });
  }

  function exportPdf() {
    window.print();
  }

  async function batchExportPdf() {
    if (pendingBatchPrintRestore || libraryState.busy) return;

    if (!await ensureLibraryAccess(true)) return;

    const rawDocuments = getVisibleLibraryDocuments();
    const currentProject = serializeProject({ includeHistory: true });
    const documents = [];
    for (const documentItem of rawDocuments) {
      const shouldUseCurrentProject = isCurrentLibraryDocument(documentItem);
      let project = shouldUseCurrentProject ? currentProject : documentItem.project;
      if (!project && documentItem.source === STORAGE_MODE_FEISHU) {
        libraryStatusEl.textContent = `正在读取飞书 SOP：${removeProjectExtension(documentItem.name)}`;
        project = await loadFeishuProject(documentItem);
        documentItem.project = project;
      }
      if (project) {
        documents.push({
          ...documentItem,
          project
        });
      }
    }
    if (!documents.length) {
      libraryStatusEl.textContent = "当前筛选范围没有可批量导出的 SOP。";
      updateLibraryControls();
      return;
    }

    const restore = captureProjectForBatchPrint();
    const printDocuments = documents;
    const scopeName = getBatchPrintScopeName();
    const totalPages = printDocuments.reduce((sum, documentItem) => {
      return sum + getProjectPageCount(documentItem.project);
    }, 0);
    const ok = window.confirm(`将逐个导出“${scopeName}”中的 ${printDocuments.length} 个 SOP，共 ${totalPages} 页。\n每个 SOP 会单独打开一次 PDF 预览，不会合并成一个 PDF。`);
    if (!ok) return;

    pendingBatchPrintRestore = {
      ...restore,
      scopeName,
      queue: printDocuments,
      index: 0,
      documentCount: printDocuments.length,
      pageCount: totalPages,
      exportedCount: 0
    };
    libraryState.busy = true;
    updateLibraryControls();

    try {
      if (editor.isOpen) {
        closeImageEditor();
      }
      await printNextBatchDocument();
    } catch (error) {
      const pendingRestore = pendingBatchPrintRestore;
      pendingBatchPrintRestore = null;
      await restoreProjectFromBatchPrint(pendingRestore || restore);
      libraryState.busy = false;
      updateLibraryControls();
      showFileError("批量导出PDF失败", error);
    }
  }

  async function printNextBatchDocument() {
    const batch = pendingBatchPrintRestore;
    if (!batch) return;

    const documentItem = batch.queue[batch.index];
    if (!documentItem) {
      await restorePendingBatchPrint();
      return;
    }

    const documentName = removeProjectExtension(documentItem.name || `SOP-${batch.index + 1}`);
    const pageCount = getProjectPageCount(documentItem.project);
    libraryStatusEl.textContent = `正在导出第 ${batch.index + 1} / ${batch.documentCount} 个 SOP：${documentName}（${pageCount} 页）`;
    await renderBatchPrintDocuments(documentItem);
    document.title = documentName;

    window.setTimeout(() => {
      try {
        window.print();
      } catch (error) {
        handleBatchPrintError(error);
      }
    }, 120);
  }

  async function renderBatchPrintDocuments(documentItem) {
    isApplyingProject = true;
    try {
      pagesEl.replaceChildren();
      resetRuntimeCounters();

      const pagesData = Array.isArray(documentItem.project.pages) && documentItem.project.pages.length ?
        documentItem.project.pages :
        [{}];
      const pageTotal = pagesData.length;
      for (let index = 0; index < pagesData.length; index += 1) {
        const page = buildPage(nextPageId++);
        page.dataset.batchDocumentId = documentItem.documentId || "";
        page.dataset.batchFileName = documentItem.name || "";
        pagesEl.appendChild(page);
        await applyPageData(page, pagesData[index]);
        setPageNumberText(page, index + 1, pageTotal);
      }

      syncOverlayCounterFromPages();
      const firstPage = getPages()[0];
      if (firstPage) {
        currentPageId = firstPage.dataset.pageId;
      }
      pageListEl.replaceChildren();
      pageCountEl.textContent = `批量导出 ${pendingBatchPrintRestore.index + 1} / ${pendingBatchPrintRestore.documentCount}`;
      deletePageButton.disabled = true;
    } finally {
      isApplyingProject = false;
    }
  }

  function captureProjectForBatchPrint() {
    return {
      project: serializeProject({ includeHistory: true }),
      documentId: projectState.documentId,
      fileName: projectState.fileName,
      fileHandle: projectState.fileHandle,
      dirty: projectState.dirty,
      currentVersion: projectState.currentVersion,
      lastVersion: projectState.lastVersion,
      folderId: projectState.folderId,
      libraryFileId: projectState.libraryFileId,
      libraryFileHandle: projectState.libraryFileHandle,
      history: cloneHistory(projectState.history),
      pageTitle: document.title
    };
  }

  async function restorePendingBatchPrint() {
    if (!pendingBatchPrintRestore) return;

    const batch = pendingBatchPrintRestore;
    batch.exportedCount = (batch.exportedCount || 0) + 1;
    batch.index += 1;

    if (batch.index < batch.queue.length) {
      window.setTimeout(() => {
        printNextBatchDocument().catch((error) => handleBatchPrintError(error));
      }, 180);
      return;
    }

    pendingBatchPrintRestore = null;
    await restoreProjectFromBatchPrint(batch);
    libraryState.busy = false;
    updateLibraryControls();
    libraryStatusEl.textContent = `批量导出已结束：${batch.exportedCount || 0} 个 SOP，已逐个生成 PDF 预览。`;
  }

  async function restoreProjectFromBatchPrint(restore) {
    if (!restore) return;

    await applyPages(restore.project && restore.project.pages ? restore.project.pages : []);
    projectState.documentId = restore.documentId;
    projectState.fileName = restore.fileName;
    projectState.fileHandle = restore.fileHandle;
    projectState.dirty = Boolean(restore.dirty);
    projectState.currentVersion = restore.currentVersion;
    projectState.lastVersion = restore.lastVersion;
    projectState.folderId = restore.folderId || DEFAULT_FOLDER_ID;
    projectState.libraryFileId = restore.libraryFileId || "";
    projectState.libraryFileHandle = restore.libraryFileHandle || null;
    projectState.history = cloneHistory(restore.history || []);
    if (restore.pageTitle) {
      document.title = restore.pageTitle;
    }
    updateProjectUi();
  }

  async function handleBatchPrintError(error) {
    const restore = pendingBatchPrintRestore;
    pendingBatchPrintRestore = null;
    await restoreProjectFromBatchPrint(restore);
    libraryState.busy = false;
    updateLibraryControls();
    showFileError("批量导出PDF失败", error);
  }

  function isCurrentLibraryDocument(documentItem) {
    if (projectState.libraryFileId && documentItem.id === projectState.libraryFileId) return true;
    return Boolean(documentItem.documentId && documentItem.documentId === projectState.documentId);
  }

  function getProjectPageCount(project) {
    return Array.isArray(project && project.pages) && project.pages.length ? project.pages.length : 1;
  }

  function getBatchPrintScopeName() {
    if (libraryState.activeFolderId === ALL_FOLDER_ID) {
      return "全部 SOP";
    }
    const folder = getLibraryFolder(libraryState.activeFolderId);
    return folder && folder.name ? folder.name : "当前文件夹";
  }

  function setPageNumberText(page, pageNumber, total) {
    page.dataset.pageNumber = String(pageNumber);
    const pageNumberCell = page.querySelector("[data-role='page-number']");
    if (pageNumberCell) {
      pageNumberCell.textContent = `页码：${pageNumber} / ${total}`;
    }
  }

  function createSvgElement(tagName, attrs) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    Object.entries(attrs).forEach(([name, value]) => {
      element.setAttribute(name, String(typeof value === "number" ? roundCoordinate(value) : value));
    });
    return element;
  }

  function findOverlayModel(models, id) {
    return models.find((model) => model.id === String(id));
  }

  function cloneModel(model) {
    return { ...model };
  }

  function getTextFontSize(model) {
    const fontSize = Number(model && model.fontSize);
    return Number.isFinite(fontSize) && fontSize > 0 ? fontSize : 14;
  }

  function newOverlayId() {
    return `overlay-${nextOverlayId++}`;
  }

  function selectTextContent(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function getFileExtension(fileName) {
    const match = String(fileName || "").toLowerCase().match(/\.[^.]+$/);
    return match ? match[0] : "";
  }

  function cleanCellText(value) {
    if (value === null || value === undefined) return "";
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value).replace(/\u00a0/g, " ").trim();
  }

  function normalizeSearchText(value) {
    return cleanCellText(value)
      .toLowerCase()
      .replace(/[：:\s_\-\/\\|,，.。;；()（）\[\]【】]+/g, "");
  }

  function isDisplayableImageExtension(extension) {
    return displayableImageExtensions.includes(extension);
  }

  function isLogoSourceExtension(extension) {
    return logoSourceExtensions.includes(extension);
  }

  function isLogoSlot(slot) {
    return slot.dataset.logo === "true";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function roundCoordinate(value) {
    return Math.round(Number(value) * 100) / 100;
  }

  function deleteCurrentPage() {
    const pages = getPages();
    if (pages.length <= 1) return;

    const page = pages.find((item) => item.dataset.pageId === currentPageId) || pages[pages.length - 1];
    const index = pages.indexOf(page);
    if (editor.isOpen && editor.slot && page.contains(editor.slot)) {
      closeImageEditor();
    }
    if (activeImageSlot && page.contains(activeImageSlot)) {
      activeImageSlot = null;
    }
    page.remove();
    markDirty();
    updatePageNumbers();

    const remaining = getPages();
    const nextPage = remaining[Math.min(index, remaining.length - 1)];
    if (nextPage) {
      setCurrentPage(nextPage.dataset.pageId);
      nextPage.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
    }
  }

  function updatePageNumbers() {
    const pages = getPages();
    const total = pages.length;

    pages.forEach((page, index) => {
      page.dataset.pageNumber = String(index + 1);
      const pageNumber = page.querySelector("[data-role='page-number']");
      if (pageNumber) {
        pageNumber.textContent = `页码：${index + 1} / ${total}`;
      }
    });

    pageCountEl.textContent = `${currentPageIndex()} / ${total}`;
    deletePageButton.disabled = total <= 1;
    renderPageList();
  }

  function renderPageList() {
    const pages = getPages();
    pageListEl.replaceChildren();

    pages.forEach((page, index) => {
      const item = document.createElement("div");
      item.className = "page-list-item";
      item.dataset.pageId = page.dataset.pageId;
      item.draggable = true;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "page-list-button";
      button.textContent = `第 ${index + 1} 页`;
      button.dataset.pageId = page.dataset.pageId;
      if (page.dataset.pageId === currentPageId) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        setCurrentPage(page.dataset.pageId);
        page.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
      });

      item.addEventListener("dragstart", (event) => {
        draggedPageId = page.dataset.pageId;
        item.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", page.dataset.pageId);
      });
      item.addEventListener("dragover", (event) => {
        if (!draggedPageId || draggedPageId === page.dataset.pageId) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        item.classList.add("drag-over");
      });
      item.addEventListener("dragleave", () => {
        item.classList.remove("drag-over");
      });
      item.addEventListener("drop", (event) => {
        event.preventDefault();
        item.classList.remove("drag-over");
        const sourcePageId = event.dataTransfer.getData("text/plain") || draggedPageId;
        movePage(sourcePageId, page.dataset.pageId);
      });
      item.addEventListener("dragend", () => {
        draggedPageId = null;
        document.querySelectorAll(".page-list-item").forEach((listItem) => {
          listItem.classList.remove("is-dragging", "drag-over");
        });
      });

      item.append(button);
      pageListEl.appendChild(item);
    });
  }

  function movePage(sourcePageId, targetPageId) {
    if (!sourcePageId || !targetPageId || sourcePageId === targetPageId) return;

    const pages = getPages();
    const sourcePage = pages.find((page) => page.dataset.pageId === String(sourcePageId));
    const targetPage = pages.find((page) => page.dataset.pageId === String(targetPageId));
    if (!sourcePage || !targetPage) return;

    const sourceIndex = pages.indexOf(sourcePage);
    const targetIndex = pages.indexOf(targetPage);
    if (sourceIndex < targetIndex) {
      targetPage.after(sourcePage);
    } else {
      targetPage.before(sourcePage);
    }

    setCurrentPage(sourcePage.dataset.pageId);
    markDirty();
    updatePageNumbers();
    sourcePage.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
  }

  function queueCurrentPageSync() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollTicking = false;
      syncCurrentPageFromViewport();
    });
  }

  function syncCurrentPageFromViewport() {
    const pages = getPages();
    if (!pages.length) return;

    const viewportCenter = window.innerHeight / 2;
    let bestPage = pages[0];
    let bestDistance = Number.POSITIVE_INFINITY;

    pages.forEach((page) => {
      const rect = page.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - viewportCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPage = page;
      }
    });

    setCurrentPage(bestPage.dataset.pageId);
  }

  function setCurrentPage(pageId) {
    currentPageId = String(pageId);
    const total = getPages().length;
    pageCountEl.textContent = `${currentPageIndex()} / ${total}`;
    document.querySelectorAll(".page-list-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.pageId === currentPageId);
    });
  }

  function currentPageIndex() {
    const pages = getPages();
    const index = pages.findIndex((page) => page.dataset.pageId === currentPageId);
    return index >= 0 ? index + 1 : Math.min(1, pages.length);
  }

  function getPages() {
    return Array.from(pagesEl.querySelectorAll(".sop-page"));
  }
})();
