(function () {
  const pagesEl = document.getElementById("pages");
  const pageListEl = document.getElementById("page-list");
  const pageCountEl = document.getElementById("page-count");
  const addPageButton = document.getElementById("add-page");
  const deletePageButton = document.getElementById("delete-page");
  const printButton = document.getElementById("print-pages");
  const batchPrintButton = document.getElementById("batch-print-pages");
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
  const libraryFolderListEl = document.getElementById("library-folder-list");
  const sopLibraryListEl = document.getElementById("sop-library-list");

  const APP_VERSION = "1.1.0";
  const SOP_SCHEMA_VERSION = 2;
  const SOP_FILE_TYPE = "sop-template-project";
  const LIBRARY_DB_NAME = "sop-template-library";
  const LIBRARY_DB_VERSION = 2;
  const DEFAULT_FOLDER_ID = "root";
  const ALL_FOLDER_ID = "all";
  const ROOT_DIRECTORY_SETTING_KEY = "rootDirectory";
  const displayableImageExtensions = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".bmp", ".ico"];
  const logoSourceExtensions = [".ai", ".eps", ".pdf"];

  let nextPageId = 1;
  let currentPageId = null;
  let activeImageSlot = null;
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
    rootHandle: null,
    rootName: "",
    folders: [],
    documents: [],
    activeFolderId: ALL_FOLDER_ID,
    busy: false
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
    templateCells.push(imageCell(1, row, 2, 3, { material: true, label: `${number}\n插入物料图片` }));
    templateCells.push(textCell(3, row, 2, 1, "物料名称：", "material-label left"));
    templateCells.push(textCell(3, row + 1, 2, 1, "物料编号：", "material-label left"));
    templateCells.push(textCell(3, row + 2, 2, 1, "规格数量：", "material-label left"));
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
  libraryPickFolderButton.addEventListener("click", pickLibraryFolder);
  libraryRefreshFolderButton.addEventListener("click", () => refreshLibrary({ requestPermission: true }));
  libraryNewFolderButton.addEventListener("click", createLibraryFolder);
  librarySaveCurrentButton.addEventListener("click", () => saveCurrentProjectToLibrary({
    reason: "手动保存到SOP库",
    assignActiveFolder: true
  }));
  document.addEventListener("input", handleDocumentInput);
  document.addEventListener("paste", handleDocumentPaste);
  document.addEventListener("keydown", handleDocumentKeyDown);
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
  addPage();
  schedulePreviewScaleUpdate();
  initializeProjectState();
  initializeLibrary();

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
    if (!window.showDirectoryPicker || !window.indexedDB) {
      libraryState.ready = false;
      libraryStatusEl.textContent = "当前浏览器不支持直接授权电脑文件夹，请使用 Chrome 或 Edge。";
      updateLibraryControls();
      renderLibrary();
      return;
    }

    try {
      libraryState.db = await openLibraryDb();
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
      libraryState.rootHandle = handle;
      libraryState.rootName = handle.name || "SOP库";
      await saveStoredLibraryRoot(handle);
      await refreshLibrary({ requestPermission: true });
      libraryStatusEl.textContent = `已连接电脑文件夹：${libraryState.rootName}`;
    } catch (error) {
      if (error && error.name === "AbortError") return;
      libraryStatusEl.textContent = `选择文件夹失败：${error.message || error}`;
    }
  }

  async function refreshLibrary(options = {}) {
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

    await scanLibraryFolder(libraryState.rootHandle, "", DEFAULT_FOLDER_ID, folders, documents);

    folders.sort((a, b) => {
      if (a.id === DEFAULT_FOLDER_ID) return -1;
      if (b.id === DEFAULT_FOLDER_ID) return 1;
      return String(a.path || a.name).localeCompare(String(b.path || b.name), "zh-Hans-CN");
    });
    documents.sort((a, b) => {
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });
    return { folders, documents };
  }

  async function scanLibraryFolder(folderHandle, folderPath, folderId, folders, documents) {
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
        await scanLibraryFolder(handle, childPath, childFolder.id, folders, documents);
      } else if (handle.kind === "file" && isProjectFileName(name)) {
        const documentItem = await readLibraryDocument(handle, folderHandle, folderId, folderPath, name);
        if (documentItem) {
          documents.push(documentItem);
        }
      }
    }
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
    renderLibraryDocuments();
    syncLibraryActiveState();
  }

  function updateLibraryControls() {
    const supportsFolderAccess = Boolean(window.showDirectoryPicker && window.indexedDB);
    libraryPickFolderButton.disabled = !supportsFolderAccess;
    libraryRefreshFolderButton.disabled = !supportsFolderAccess || !libraryState.rootHandle;
    libraryNewFolderButton.disabled = !libraryState.ready;
    librarySaveCurrentButton.disabled = !libraryState.ready;
    batchPrintButton.disabled = !libraryState.ready || libraryState.busy || !getVisibleLibraryDocuments().length;
  }

  function renderLibraryFolders() {
    libraryFolderListEl.replaceChildren();
    if (!libraryState.rootHandle) {
      const empty = document.createElement("div");
      empty.className = "library-empty";
      empty.textContent = "未选择电脑文件夹";
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

  function renderLibraryDocuments() {
    sopLibraryListEl.replaceChildren();
    const documents = getVisibleLibraryDocuments();
    libraryCountEl.textContent = String(documents.length);

    if (!libraryState.rootHandle) {
      const empty = document.createElement("div");
      empty.className = "library-empty";
      empty.textContent = "选择电脑文件夹后，这里会显示其中的 .sop.json 文件。";
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

  async function saveCurrentProjectToLibrary(options = {}) {
    if (!projectState.documentId || libraryState.busy) return false;
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
    if (libraryState.rootHandle) {
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
    if (!documentItem || !documentItem.project) {
      libraryStatusEl.textContent = "找不到这个 SOP 文件";
      await refreshLibrary();
      return;
    }

    const canSwitch = await prepareCurrentProjectForSwitch();
    if (!canSwitch) return;

    await applyProject(documentItem.project, documentItem.name, null);
    projectState.folderId = documentItem.folderId || DEFAULT_FOLDER_ID;
    projectState.libraryFileId = documentItem.id;
    projectState.libraryFileHandle = documentItem.fileHandle;
    markClean();
    libraryState.activeFolderId = documentItem.folderId || DEFAULT_FOLDER_ID;
    await refreshLibrary();
    libraryStatusEl.textContent = `已切换：${removeProjectExtension(documentItem.name)}`;
  }

  async function renameLibraryDocument(fileId) {
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

  function sanitizeLibraryName(value) {
    return String(value || "").trim().replace(/[\\/:*?"<>|]/g, "-").slice(0, 80);
  }

  function removeProjectExtension(fileName) {
    return String(fileName || "未命名").replace(/\.sop\.json$/i, "").replace(/\.json$/i, "");
  }

  function idbGet(storeName, key) {
    return idbRequest(storeName, "readonly", (store) => store.get(key));
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

    const documents = getVisibleLibraryDocuments().filter((documentItem) => documentItem.project);
    if (!documents.length) {
      libraryStatusEl.textContent = "当前筛选范围没有可批量导出的 SOP。";
      updateLibraryControls();
      return;
    }

    const restore = captureProjectForBatchPrint();
    const currentProject = serializeProject({ includeHistory: true });
    const printDocuments = documents.map((documentItem) => {
      const shouldUseCurrentProject = isCurrentLibraryDocument(documentItem);
      return {
        ...documentItem,
        project: shouldUseCurrentProject ? currentProject : documentItem.project
      };
    });
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
