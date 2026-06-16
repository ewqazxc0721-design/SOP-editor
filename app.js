(function () {
  const pagesEl = document.getElementById("pages");
  const pageListEl = document.getElementById("page-list");
  const pageCountEl = document.getElementById("page-count");
  const addPageButton = document.getElementById("add-page");
  const deletePageButton = document.getElementById("delete-page");
  const printButton = document.getElementById("print-pages");
  const batchPrintButton = document.getElementById("batch-print-pages");
  const exportPptxButton = document.getElementById("export-pptx");
  const batchExportPptxButton = document.getElementById("batch-export-pptx");
  let addPageTemplateMenu = null;
  let addStepCardButton = null;
  let addStepCardMenu = null;
  let exportPanel = null;
  let exportPanelToggle = null;
  let exportPanelBody = null;
  const appShellEl = document.querySelector(".app-shell");
  const workspaceEl = document.querySelector(".workspace");
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
  let versionPanel = null;
  let versionPanelToggle = null;
  let versionPanelBody = null;
  const globalInfoInputs = Array.from(document.querySelectorAll("[data-global-info-key]"));
  const globalInfoReadButton = document.getElementById("global-info-read-current");
  const globalInfoSaveButton = document.getElementById("global-info-save");
  const globalInfoStatusEl = document.getElementById("global-info-status");
  const globalInfoPanel = document.getElementById("global-info-panel");
  const globalInfoLogoInput = document.getElementById("global-info-logo-input");
  const globalInfoLogoChooseButton = document.getElementById("global-info-logo-choose");
  const globalInfoLogoDeleteButton = document.getElementById("global-info-logo-delete");
  const globalInfoLogoPreview = document.getElementById("global-info-logo-preview");
  let globalInfoPanelToggle = null;
  let globalInfoPanelBody = null;
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
  let sopHistoryPanel = null;
  let sopHistoryPanelToggle = null;
  let sopHistoryPanelBody = null;
  const bomPickFileButton = document.getElementById("bom-pick-file");
  const bomClosePreviewButton = document.getElementById("bom-close-preview");
  const bomFileInput = document.getElementById("bom-file-input");
  const bomHistoryListEl = document.getElementById("bom-history-list");
  let bomPanel = null;
  let bomPanelToggle = null;
  let bomPanelBody = null;
  const bomPreviewPanel = document.getElementById("bom-preview-panel");
  const bomPreviewTitle = document.getElementById("bom-preview-title");
  const bomPreviewMeta = document.getElementById("bom-preview-meta");
  const bomPreviewStatus = document.getElementById("bom-preview-status");
  const bomPreviewTable = document.getElementById("bom-preview-table");
  const bomPreviewCloseButton = document.getElementById("bom-preview-close");
  const globalColorPresetList = document.getElementById("global-edit-color-presets");
  const globalFontSizeInput = document.getElementById("global-edit-font-size");
  const globalFontDecreaseButton = document.getElementById("global-edit-font-decrease");
  const globalFontIncreaseButton = document.getElementById("global-edit-font-increase");
  const globalEditButtons = {
    text: document.getElementById("global-edit-text"),
    bubble: document.getElementById("global-edit-bubble"),
    circle: document.getElementById("global-edit-circle"),
    rect: document.getElementById("global-edit-rect"),
    arrow: document.getElementById("global-edit-arrow"),
    delete: document.getElementById("global-edit-delete")
  };

  const APP_VERSION = "1.8.1";
  const SOP_SCHEMA_VERSION = 3;
  const SOP_PACKAGE_FILE_TYPE = "sop-template-package";
  const SOP_PACKAGE_VERSION = 1;
  const SOP_PACKAGE_DOCUMENT_PATH = "document.json";
  const SOP_PACKAGE_MANIFEST_PATH = "manifest.json";
  const SOP_PACKAGE_EXTENSION = ".sopzip";
  const LEGACY_PROJECT_EXTENSIONS = [".sop.json", ".json"];
  const MAX_IMAGE_ASSET_BYTES = 10 * 1024 * 1024;
  const ALLOWED_ASSET_IMAGE_MIMES = new Set(["image/png", "image/jpeg", "image/webp"]);
  const DEFAULT_OVERLAY_COLOR = "#ef1d1d";
  const PRESET_OVERLAY_COLORS = [
    { name: "红色", value: "#ef1d1d" },
    { name: "橙色", value: "#f97316" },
    { name: "黄色", value: "#eab308" },
    { name: "绿色", value: "#16a34a" },
    { name: "蓝色", value: "#2563eb" },
    { name: "紫色", value: "#9333ea" },
    { name: "黑色", value: "#111827" }
  ];
  const GLOBAL_TEXT_FONT_MIN = 8;
  const GLOBAL_TEXT_FONT_MAX = 96;
  const EMU_PER_MM = 36000;
  const PPT_SLIDE_WIDTH_MM = 297;
  const PPT_SLIDE_HEIGHT_MM = 210;
  const PPT_CONTENT_X_MM = 5;
  const PPT_CONTENT_WIDTH_MM = 287;
  const PPT_CONTENT_HEIGHT_MM = 182.48;
  const PPT_CONTENT_Y_MM = (PPT_SLIDE_HEIGHT_MM - PPT_CONTENT_HEIGHT_MM) / 2;
  const PPT_GRID_WIDTH = 1340;
  const PPT_GRID_HEIGHT = 852;
  const PPT_COL_FRACTIONS = [54, 54, 112, 112, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84];
  const PPT_ROW_FRACTIONS = [72, ...Array(26).fill(30)];
  const SOP_FILE_TYPE = "sop-template-project";
  const LIBRARY_DB_NAME = "sop-template-library";
  const LIBRARY_DB_VERSION = 4;
  const DEFAULT_FOLDER_ID = "root";
  const ALL_FOLDER_ID = "all";
  const ROOT_DIRECTORY_SETTING_KEY = "rootDirectory";
  const LIBRARY_STORAGE_MODE_SETTING_KEY = "libraryStorageMode";
  const FEISHU_SETTING_KEY = "feishuLibrary";
  const FEISHU_PANEL_COLLAPSED_KEY = "sop-feishu-panel-collapsed";
  const EXPORT_PANEL_COLLAPSED_KEY = "sop-export-panel-collapsed";
  const VERSION_PANEL_COLLAPSED_KEY = "sop-version-panel-collapsed";
  const BOM_PANEL_COLLAPSED_KEY = "sop-bom-panel-collapsed";
  const SOP_HISTORY_PANEL_COLLAPSED_KEY = "sop-history-panel-collapsed";
  const GLOBAL_INFO_PANEL_COLLAPSED_KEY = "sop-global-info-panel-collapsed";
  const FOLDER_TREE_EXPANDED_KEY = "sop-folder-tree-expanded";
  const STORAGE_MODE_LOCAL = "local";
  const STORAGE_MODE_FEISHU = "feishu";
  const BOM_HISTORY_LIMIT = 12;
  const GLOBAL_INFO_FIELDS = [
    { key: "productName", cellKey: "c1r1", fieldKey: "value" },
    { key: "sopNumber", cellKey: "c1r27", fieldKey: "sopNumber" },
    { key: "version", cellKey: "c1r27", fieldKey: "version" },
    { key: "date", cellKey: "c1r27", fieldKey: "date" },
    { key: "author", cellKey: "c8r27", fieldKey: "value" },
    { key: "reviewer", cellKey: "c11r27", fieldKey: "value" },
    { key: "approver", cellKey: "c14r27", fieldKey: "value" }
  ];
  const GLOBAL_INFO_LOGO_CELL_KEY = "c14r1";
  const displayableImageExtensions = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".bmp", ".ico"];
  const logoSourceExtensions = [".ai", ".eps", ".pdf"];
  const bomFileExtensions = [".xlsx", ".xls", ".csv", ".tsv", ".txt", ".json"];
  const STEP_CARD_DRAG_MIME = "application/x-sop-step-card";
  const MATERIAL_CARD_DRAG_MIME = "application/x-sop-material-card";
  const STEP_CARD_GROUPS = [
    { imageKey: "c5r2", descKey: "c5r11", noteKey: "c5r13" },
    { imageKey: "c8r2", descKey: "c8r11", noteKey: "c8r13" },
    { imageKey: "c11r2", descKey: "c11r11", noteKey: "c11r13" },
    { imageKey: "c14r2", descKey: "c14r11", noteKey: "c14r13" },
    { imageKey: "c5r14", descKey: "c5r23", noteKey: "c5r25" },
    { imageKey: "c8r14", descKey: "c8r23", noteKey: "c8r25" },
    { imageKey: "c11r14", descKey: "c11r23", noteKey: "c11r25" },
    { imageKey: "c14r14", descKey: "c14r23", noteKey: "c14r25" }
  ];
  const STEP_TEMPLATE_COUNTS = [4, 6, 8];
  const DEFAULT_STEP_TEMPLATE_COUNT = 8;
  const FREE_STEP_TEMPLATE_COUNT = 8;
  const FREE_STEP_CARD_SLOT_COUNT = 8;
  const FREE_STEP_CARD_SIZE_OPTIONS = [
    { size: "small", label: "小卡片", shortLabel: "小" },
    { size: "medium", label: "中卡片", shortLabel: "中" },
    { size: "large", label: "大卡片", shortLabel: "大" }
  ];
  const FREE_STEP_CARD_SIZE_SET = new Set(FREE_STEP_CARD_SIZE_OPTIONS.map((option) => option.size));
  const STEP_CARD_CELL_KEYS = new Set(STEP_CARD_GROUPS.flatMap((group) => [group.imageKey, group.descKey, group.noteKey]));
  const STEP_TEMPLATE_LAYOUTS = {
    4: {
      columns: [{ col: 5, span: 6 }, { col: 11, span: 6 }],
      rows: [
        { imageRow: 2, descRow: 11, noteRow: 13 },
        { imageRow: 14, descRow: 23, noteRow: 25 }
      ]
    },
    6: {
      columns: [{ col: 5, span: 4 }, { col: 9, span: 4 }, { col: 13, span: 4 }],
      rows: [
        { imageRow: 2, descRow: 11, noteRow: 13 },
        { imageRow: 14, descRow: 23, noteRow: 25 }
      ]
    },
    8: {
      columns: [{ col: 5, span: 3 }, { col: 8, span: 3 }, { col: 11, span: 3 }, { col: 14, span: 3 }],
      rows: [
        { imageRow: 2, descRow: 11, noteRow: 13 },
        { imageRow: 14, descRow: 23, noteRow: 25 }
      ]
    }
  };
  const MATERIAL_CARD_GROUPS = [3, 6, 9, 12, 15, 18, 21, 24].map((row) => ({
    imageKey: `c1r${row}`,
    nameKey: `c3r${row}`,
    numberKey: `c3r${row + 1}`,
    specKey: `c3r${row + 2}`
  }));

  let nextPageId = 1;
  let currentPageId = null;
  let activeImageSlot = null;
  let activeMaterialSearchCell = null;
  let draggedPageId = null;
  let draggedStepCard = null;
  let stepCardPointerDrag = null;
  let selectedStepCard = null;
  let stepCardClipboard = null;
  let draggedMaterialCard = null;
  let materialCardPointerDrag = null;
  let selectedMaterialCard = null;
  let materialCardClipboard = null;
  let nextAnnotationLayerId = 1;
  let nextOverlayId = 1;
  let scrollTicking = false;
  let isApplyingProject = false;
  let pendingBatchPrintRestore = null;
  let globalInfoLogoSlot = null;
  let globalInfoLogoPreviewUrl = "";

  const projectState = {
    documentId: "",
    fileName: "未命名.sopzip",
    fileHandle: null,
    dirty: false,
    currentVersion: 0,
    lastVersion: 0,
    folderId: DEFAULT_FOLDER_ID,
    libraryFileId: "",
    libraryFileHandle: null,
    globalInfo: {},
    assets: {},
    history: []
  };

  const assetRuntime = {
    dbPromise: null,
    blobs: new Map(),
    thumbnails: new Map(),
    objectUrls: new Map()
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
    expandedFolderIds: new Set([DEFAULT_FOLDER_ID]),
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

  const globalEditor = {
    mode: "select",
    color: DEFAULT_OVERLAY_COLOR,
    selected: null,
    drag: null
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
    color: DEFAULT_OVERLAY_COLOR,
    colorPresetList: null,
    fontSizeInput: null,
    fontDecreaseButton: null,
    fontIncreaseButton: null,
    buttons: {}
  };

  const templateCells = [
    textCell(1, 1, 4, 1, "  产品名称/编号：", "header-cell left", {
      fields: [{ key: "value", label: "  产品名称/编号：", grow: true, minChars: 8 }]
    }),
    textCell(5, 1, 5, 1, "  工序：", "header-cell left", {
      fields: [{ key: "value", label: "  工序：", grow: true, minChars: 8 }]
    }),
    textCell(10, 1, 4, 1, "  组装模块：", "header-cell left", {
      fields: [{ key: "value", label: "  组装模块：", grow: true, minChars: 8 }]
    }),
    imageCell(14, 1, 3, 1, {
      logo: true,
      label: "插入logo",
      fit: "contain",
      accept: ".ai,.eps,.pdf,.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp,application/pdf,application/postscript,application/illustrator"
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

    textCell(5, 13, 3, 1, "  特殊标注：", "note-cell special-note-card left", {
      fields: [{ key: "value", label: "  特殊标注：", grow: true, minChars: 6 }]
    }),
    textCell(8, 13, 3, 1, "  特殊标注：", "note-cell special-note-card left", {
      fields: [{ key: "value", label: "  特殊标注：", grow: true, minChars: 6 }]
    }),
    textCell(11, 13, 3, 1, "  特殊标注：", "note-cell special-note-card left", {
      fields: [{ key: "value", label: "  特殊标注：", grow: true, minChars: 6 }]
    }),
    textCell(14, 13, 3, 1, " 特殊标注：", "note-cell special-note-card left", {
      fields: [{ key: "value", label: " 特殊标注：", grow: true, minChars: 6 }]
    }),

    imageCell(5, 14, 3, 9),
    imageCell(8, 14, 3, 9),
    imageCell(11, 14, 3, 9),
    imageCell(14, 14, 3, 9),
    textCell(5, 23, 3, 2, "", "blank-cell left"),
    textCell(8, 23, 3, 2, "", "blank-cell left"),
    textCell(11, 23, 3, 2, "", "blank-cell left"),
    textCell(14, 23, 3, 2, "", "blank-cell left"),

    textCell(5, 25, 3, 1, "  特殊标注：", "note-cell special-note-card left", {
      fields: [{ key: "value", label: "  特殊标注：", grow: true, minChars: 6 }]
    }),
    textCell(8, 25, 3, 1, "  特殊标注：", "note-cell special-note-card left", {
      fields: [{ key: "value", label: "  特殊标注：", grow: true, minChars: 6 }]
    }),
    textCell(11, 25, 3, 1, "  特殊标注：", "note-cell special-note-card left", {
      fields: [{ key: "value", label: "  特殊标注：", grow: true, minChars: 6 }]
    }),
    textCell(14, 25, 3, 1, " 特殊标注：", "note-cell special-note-card left", {
      fields: [{ key: "value", label: " 特殊标注：", grow: true, minChars: 6 }]
    }),
    textCell(5, 26, 3, 1, "  标准工时：           人员：", "note-cell left", {
      fields: [
        { key: "standardTime", label: "  标准工时：", minChars: 6 },
        { key: "people", label: "人员：", minChars: 5 }
      ]
    }),
    textCell(8, 26, 9, 1, "特殊标注：关键动作 / 装配方向 / 扭矩/ 质量确认 / 安全注意事项(防静电) ", "note-cell left"),

    textCell(1, 27, 5, 1, "SOP编号：   版本：   日期：", "footer-cell left", {
      fields: [
        { key: "sopNumber", label: "SOP编号：", minChars: 10 },
        { key: "version", label: "版本：", minChars: 3 },
        { key: "date", label: "日期：", minChars: 6 }
      ]
    }),
    textCell(6, 27, 2, 1, "", "footer-cell center", { autoPage: true }),
    textCell(8, 27, 3, 1, "  编制：", "footer-cell left", {
      fields: [{ key: "value", label: "  编制：", grow: true, minChars: 6 }]
    }),
    textCell(11, 27, 3, 1, "   审核：", "footer-cell left", {
      fields: [{ key: "value", label: "   审核：", grow: true, minChars: 6 }]
    }),
    textCell(14, 27, 3, 1, "  批准：", "footer-cell left", {
      fields: [{ key: "value", label: "  批准：", grow: true, minChars: 6 }]
    })
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
      materialField: "name",
      fields: [{ key: "value", label: "物料名称：", grow: true, minChars: 6 }]
    }));
    templateCells.push(textCell(3, row + 1, 2, 1, "物料编号：", "material-label left", {
      materialIndex: index,
      materialField: "number",
      fields: [{ key: "value", label: "物料编号：", grow: true, minChars: 6 }]
    }));
    templateCells.push(textCell(3, row + 2, 2, 1, "规格数量：", "material-label left", {
      materialIndex: index,
      materialField: "spec",
      fields: [{ key: "value", label: "规格数量：", grow: true, minChars: 6 }]
    }));
  });

  buildExportCollapsePanel();
  buildVersionCollapsePanel();
  buildGlobalInfoCollapsePanel();
  buildBomCollapsePanel();
  buildSopHistoryCollapsePanel();
  buildAddPageTemplateMenu();
  buildAddStepCardMenu();

  addPageButton.addEventListener("click", () => addPage({ scrollIntoView: true, stepTemplateCount: DEFAULT_STEP_TEMPLATE_COUNT }));
  deletePageButton.addEventListener("click", deleteCurrentPage);
  printButton.addEventListener("click", exportPdf);
  batchPrintButton.addEventListener("click", batchExportPdf);
  exportPptxButton.addEventListener("click", exportPptx);
  batchExportPptxButton.addEventListener("click", batchExportPptx);
  if (exportPanelToggle) {
    exportPanelToggle.addEventListener("click", () => {
      setExportPanelCollapsed(!exportPanel.classList.contains("is-collapsed"), { persist: true });
    });
  }
  if (versionPanelToggle) {
    versionPanelToggle.addEventListener("click", () => {
      setVersionPanelCollapsed(!versionPanel.classList.contains("is-collapsed"), { persist: true });
    });
  }
  if (bomPanelToggle) {
    bomPanelToggle.addEventListener("click", () => {
      setBomPanelCollapsed(!bomPanel.classList.contains("is-collapsed"), { persist: true });
    });
  }
  if (globalInfoPanelToggle) {
    globalInfoPanelToggle.addEventListener("click", () => {
      setGlobalInfoPanelCollapsed(!globalInfoPanel.classList.contains("is-collapsed"), { persist: true });
    });
  }
  if (sopHistoryPanelToggle) {
    sopHistoryPanelToggle.addEventListener("click", () => {
      setSopHistoryPanelCollapsed(!sopHistoryPanel.classList.contains("is-collapsed"), { persist: true });
    });
  }
  newFileButton.addEventListener("click", newProject);
  openFileButton.addEventListener("click", openProjectFile);
  saveFileButton.addEventListener("click", saveProject);
  saveAsFileButton.addEventListener("click", () => saveProjectAs());
  createVersionButton.addEventListener("click", () => {
    createVersionSnapshot("手动保存版本");
    markDirty();
    updateProjectUi();
  });
  if (globalInfoReadButton) {
    globalInfoReadButton.addEventListener("click", readGlobalInfoFromCurrentPage);
  }
  if (globalInfoSaveButton) {
    globalInfoSaveButton.addEventListener("click", () => {
      saveAndApplyGlobalInfo().catch((error) => showFileError("同步全局信息失败", error));
    });
  }
  if (globalInfoLogoChooseButton && globalInfoLogoInput) {
    globalInfoLogoChooseButton.addEventListener("click", () => globalInfoLogoInput.click());
  }
  if (globalInfoLogoDeleteButton) {
    globalInfoLogoDeleteButton.addEventListener("click", () => {
      setGlobalInfoLogoSlot(null);
      if (globalInfoStatusEl) {
        globalInfoStatusEl.textContent = "Logo已清空，点击保存并同步";
      }
    });
  }
  if (globalInfoLogoInput) {
    globalInfoLogoInput.addEventListener("change", async () => {
      const file = globalInfoLogoInput.files && globalInfoLogoInput.files[0];
      globalInfoLogoInput.value = "";
      if (!file) return;
      try {
        await loadGlobalInfoLogoFile(file);
      } catch (error) {
        showFileError("插入全局Logo失败", error);
      }
    });
  }
  globalInfoInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (globalInfoStatusEl) {
        globalInfoStatusEl.textContent = "未同步，点击保存并同步";
      }
    });
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
  Object.entries(globalEditButtons).forEach(([action, button]) => {
    if (button) {
      button.addEventListener("click", () => handleGlobalEditCommand(action));
    }
  });
  if (globalColorPresetList) {
    buildColorPresetButtons(globalColorPresetList, (color) => handleGlobalColorChange(color));
  }
  if (globalFontSizeInput) {
    globalFontSizeInput.addEventListener("input", () => handleGlobalFontSizeChange(globalFontSizeInput.value));
    globalFontSizeInput.addEventListener("change", () => updateGlobalFontSizeControlFromSelection());
  }
  if (globalFontDecreaseButton) {
    globalFontDecreaseButton.addEventListener("click", () => adjustSelectedGlobalFontSize(-1));
  }
  if (globalFontIncreaseButton) {
    globalFontIncreaseButton.addEventListener("click", () => adjustSelectedGlobalFontSize(1));
  }
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
  document.addEventListener("pointerdown", handleGlobalBlankPointerDown);
  document.addEventListener("pointermove", handleStepCardPointerMove, true);
  document.addEventListener("pointerup", endStepCardPointerDrag, true);
  document.addEventListener("pointercancel", endStepCardPointerDrag, true);
  document.addEventListener("mousemove", handleStepCardPointerMove, true);
  document.addEventListener("mouseup", endStepCardPointerDrag, true);
  document.addEventListener("pointermove", handleMaterialCardPointerMove, true);
  document.addEventListener("pointerup", endMaterialCardPointerDrag, true);
  document.addEventListener("pointercancel", endMaterialCardPointerDrag, true);
  document.addEventListener("mousemove", handleMaterialCardPointerMove, true);
  document.addEventListener("mouseup", endMaterialCardPointerDrag, true);
  document.addEventListener("focusin", handleMaterialFocus);
  document.addEventListener("click", handleMaterialDocumentClick);
  window.addEventListener("pointermove", handleStepCardPointerMove);
  window.addEventListener("pointerup", endStepCardPointerDrag);
  window.addEventListener("pointercancel", endStepCardPointerDrag);
  window.addEventListener("mousemove", handleStepCardPointerMove);
  window.addEventListener("mouseup", endStepCardPointerDrag);
  window.addEventListener("pointermove", handleMaterialCardPointerMove);
  window.addEventListener("pointerup", endMaterialCardPointerDrag);
  window.addEventListener("pointercancel", endMaterialCardPointerDrag);
  window.addEventListener("mousemove", handleMaterialCardPointerMove);
  window.addEventListener("mouseup", endMaterialCardPointerDrag);
  window.addEventListener("pointermove", handleGlobalPointerMove);
  window.addEventListener("pointerup", endGlobalDrag);
  window.addEventListener("pointercancel", endGlobalDrag);
  window.addEventListener("load", schedulePreviewScaleUpdate);
  window.addEventListener("afterprint", restorePendingBatchPrint);

  window.addEventListener("scroll", queueCurrentPageSync, { passive: true });
  if (workspaceEl) {
    workspaceEl.addEventListener("scroll", queueCurrentPageSync, { passive: true });
  }
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
  initializeExportPanelCollapse();
  initializeVersionPanelCollapse();
  initializeGlobalInfoPanelCollapse();
  initializeBomPanelCollapse();
  initializeSopHistoryPanelCollapse();
  initializeFolderTreeExpandedState();
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
      editable: options.editable === undefined ? text === "" : Boolean(options.editable),
      fields: normalizeTextCellFields(options.fields),
      materialIndex: Number.isInteger(options.materialIndex) ? options.materialIndex : null,
      materialField: options.materialField || "",
      cellKey: options.cellKey || `c${col}r${row}`
    };
  }

  function normalizeTextCellFields(fields) {
    if (!Array.isArray(fields) || !fields.length) return [];
    return fields.map((field, index) => {
      return {
        key: field.key || `field${index + 1}`,
        label: field.label || "",
        value: field.value || "",
        grow: Boolean(field.grow),
        minChars: Number(field.minChars) || 0
      };
    });
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
      fit: options.fit || (options.material ? "contain" : "cover"),
      accept: options.accept || ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp",
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
    const page = buildPage(nextPageId++, {
      stepTemplateCount: options.stepTemplateCount,
      stepCards: options.stepCards
    });
    pagesEl.appendChild(page);
    if (hasGlobalInfoValues()) {
      applyGlobalInfoToPage(page).catch((error) => showFileError("应用全局信息失败", error));
    }
    updatePageNumbers();
    setCurrentPage(page.dataset.pageId);
    markDirty();
    if (options.scrollIntoView) {
      page.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
    }
  }

  function buildPage(pageId, options = {}) {
    const stepTemplateCount = normalizeStepTemplateCount(options.stepTemplateCount);
    const page = document.createElement("article");
    page.className = "sop-page";
    page.dataset.pageId = String(pageId);
    page.dataset.stepTemplateCount = String(stepTemplateCount);
    page._globalAnnotationModels = [];
    page._globalTextModels = [];
    if (isFreeStepTemplateCount(stepTemplateCount)) {
      page._stepCards = normalizeFreeStepCards(options.stepCards);
    }
    const scale = document.createElement("div");
    scale.className = "sop-scale";
    const sheet = document.createElement("div");
    sheet.className = "sop-sheet";

    getTemplateCells(stepTemplateCount)
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
    sheet.appendChild(buildGlobalOverlay(page));
    renderFreeStepCardCells(page);
    setupStepCards(page);
    setupMaterialCards(page);
    renderGlobalPageOverlays(page);
    return page;
  }

  function normalizeStepTemplateCount(value) {
    const count = Number(value);
    return STEP_TEMPLATE_COUNTS.includes(count) ? count : DEFAULT_STEP_TEMPLATE_COUNT;
  }

  function getPageStepTemplateCount(page) {
    return normalizeStepTemplateCount(page && page.dataset ? page.dataset.stepTemplateCount : DEFAULT_STEP_TEMPLATE_COUNT);
  }

  function getPageDataStepTemplateCount(pageData) {
    return normalizeStepTemplateCount(pageData && pageData.stepTemplateCount);
  }

  function isFreeStepTemplateCount(stepTemplateCount) {
    return normalizeStepTemplateCount(stepTemplateCount) === FREE_STEP_TEMPLATE_COUNT;
  }

  function isFreeStepPage(page) {
    return Boolean(page && isFreeStepTemplateCount(getPageStepTemplateCount(page)));
  }

  function getBaseTemplateCells() {
    return templateCells.filter((definition) => !STEP_CARD_CELL_KEYS.has(definition.cellKey));
  }

  function getTemplateCells(stepTemplateCount = DEFAULT_STEP_TEMPLATE_COUNT) {
    const count = normalizeStepTemplateCount(stepTemplateCount);
    if (isFreeStepTemplateCount(count)) {
      return getBaseTemplateCells();
    }
    return getBaseTemplateCells().concat(buildStepTemplateCells(count));
  }

  function buildStepTemplateCells(stepTemplateCount = DEFAULT_STEP_TEMPLATE_COUNT) {
    const cells = [];
    getStepCardGroupsForCount(stepTemplateCount).forEach((group) => {
      cells.push(imageCell(group.col, group.imageRow, group.colSpan, 9));
      cells.push(textCell(group.col, group.descRow, group.colSpan, 2, "", "blank-cell left"));
      cells.push(textCell(group.col, group.noteRow, group.colSpan, 1, "  特殊标注：", "note-cell special-note-card left", {
        fields: [{ key: "value", label: "  特殊标注：", grow: true, minChars: 6 }]
      }));
    });
    return cells;
  }

  function getStepCardGroups(page) {
    if (isFreeStepPage(page)) {
      return getFreeStepCardGroups(page);
    }
    return getStepCardGroupsForCount(getPageStepTemplateCount(page));
  }

  function getStepCardGroupsForCount(stepTemplateCount = DEFAULT_STEP_TEMPLATE_COUNT) {
    const count = normalizeStepTemplateCount(stepTemplateCount);
    const layout = STEP_TEMPLATE_LAYOUTS[count] || STEP_TEMPLATE_LAYOUTS[DEFAULT_STEP_TEMPLATE_COUNT];
    const groups = [];

    layout.rows.forEach((row) => {
      layout.columns.forEach((column) => {
        if (groups.length >= count) return;
        groups.push({
          imageKey: `c${column.col}r${row.imageRow}`,
          descKey: `c${column.col}r${row.descRow}`,
          noteKey: `c${column.col}r${row.noteRow}`,
          col: column.col,
          colSpan: column.span,
          imageRow: row.imageRow,
          descRow: row.descRow,
          noteRow: row.noteRow
        });
      });
    });
    return groups;
  }

  function normalizeFreeStepCardSize(size) {
    return FREE_STEP_CARD_SIZE_SET.has(size) ? size : "small";
  }

  function getFreeStepCardSizeLabel(size) {
    const option = FREE_STEP_CARD_SIZE_OPTIONS.find((item) => item.size === normalizeFreeStepCardSize(size));
    return option ? option.label : "小卡片";
  }

  function getFreeStepCardSpan(size) {
    const normalized = normalizeFreeStepCardSize(size);
    if (normalized === "large") return { cols: 2, rows: 2 };
    if (normalized === "medium") return { cols: 2, rows: 1 };
    return { cols: 1, rows: 1 };
  }

  function createFreeStepCard(size = "small", data = {}) {
    return {
      id: data.id || createId("step-card"),
      size: normalizeFreeStepCardSize(data.size || size),
      imageSlot: data.imageSlot ? structuredCloneSafe(data.imageSlot) : null,
      descCell: data.descCell ? structuredCloneSafe(data.descCell) : null,
      noteCell: data.noteCell ? structuredCloneSafe(data.noteCell) : null
    };
  }

  function normalizeFreeStepCards(cards) {
    const source = Array.isArray(cards) ?
      cards :
      Array.from({ length: FREE_STEP_CARD_SLOT_COUNT }, () => ({ size: "small" }));
    return source.map((card) => createFreeStepCard(card && card.size, card || {}));
  }

  function getFreeStepCards(page) {
    if (!page) return [];
    if (!Array.isArray(page._stepCards)) {
      page._stepCards = normalizeFreeStepCards([]);
    }
    return page._stepCards;
  }

  function getFreeStepSlot(slotIndex) {
    const colIndex = slotIndex % 4;
    const rowIndex = Math.floor(slotIndex / 4);
    return {
      slotIndex,
      colIndex,
      rowIndex,
      col: 5 + colIndex * 3,
      imageRow: rowIndex === 0 ? 2 : 14,
      descRow: rowIndex === 0 ? 11 : 23,
      noteRow: rowIndex === 0 ? 13 : 25
    };
  }

  function getFreeStepCardCellKey(cardId, role) {
    return `step-${cardId}-${role}`;
  }

  function getFreeStepOccupiedSlots(slotIndex, size) {
    const span = getFreeStepCardSpan(size);
    const slot = getFreeStepSlot(slotIndex);
    const slots = [];
    for (let rowOffset = 0; rowOffset < span.rows; rowOffset += 1) {
      for (let colOffset = 0; colOffset < span.cols; colOffset += 1) {
        slots.push((slot.rowIndex + rowOffset) * 4 + slot.colIndex + colOffset);
      }
    }
    return slots;
  }

  function canPlaceFreeStepCard(occupied, slotIndex, size) {
    const span = getFreeStepCardSpan(size);
    const slot = getFreeStepSlot(slotIndex);
    if (slot.colIndex + span.cols > 4 || slot.rowIndex + span.rows > 2) return false;
    return getFreeStepOccupiedSlots(slotIndex, size).every((index) => index >= 0 && index < FREE_STEP_CARD_SLOT_COUNT && !occupied[index]);
  }

  function buildFreeStepCardDefinitions(card, slotIndex) {
    const size = normalizeFreeStepCardSize(card && card.size);
    const span = getFreeStepCardSpan(size);
    const slot = getFreeStepSlot(slotIndex);
    const colSpan = span.cols * 3;
    const isLarge = size === "large";
    const imageRow = isLarge ? 2 : slot.imageRow;
    const imageRowSpan = isLarge ? 21 : 9;
    const descRow = isLarge ? 23 : slot.descRow;
    const noteRow = isLarge ? 25 : slot.noteRow;
    const cardId = card.id;

    return {
      image: imageCell(slot.col, imageRow, colSpan, imageRowSpan, {
        cellKey: getFreeStepCardCellKey(cardId, "image")
      }),
      desc: textCell(slot.col, descRow, colSpan, 2, "", "blank-cell left", {
        cellKey: getFreeStepCardCellKey(cardId, "desc")
      }),
      note: textCell(slot.col, noteRow, colSpan, 1, "  特殊标注：", "note-cell special-note-card left", {
        cellKey: getFreeStepCardCellKey(cardId, "note"),
        fields: [{ key: "value", label: "  特殊标注：", grow: true, minChars: 6 }]
      })
    };
  }

  function layoutFreeStepCards(cards) {
    const occupied = Array.from({ length: FREE_STEP_CARD_SLOT_COUNT }, () => false);
    const placements = [];
    for (const card of cards || []) {
      const size = normalizeFreeStepCardSize(card && card.size);
      let slotIndex = -1;
      for (let index = 0; index < FREE_STEP_CARD_SLOT_COUNT; index += 1) {
        if (canPlaceFreeStepCard(occupied, index, size)) {
          slotIndex = index;
          break;
        }
      }
      if (slotIndex < 0) {
        return { ok: false, placements, failedCard: card };
      }
      getFreeStepOccupiedSlots(slotIndex, size).forEach((index) => {
        occupied[index] = true;
      });
      placements.push({
        card,
        slotIndex,
        definitions: buildFreeStepCardDefinitions(card, slotIndex)
      });
    }
    return { ok: true, placements };
  }

  function getFreeStepCardGroups(page) {
    const layout = layoutFreeStepCards(getFreeStepCards(page));
    if (!layout.ok) return [];
    return layout.placements.map((placement) => {
      const definitions = placement.definitions;
      return {
        imageKey: definitions.image.cellKey,
        descKey: definitions.desc.cellKey,
        noteKey: definitions.note.cellKey,
        col: definitions.image.col,
        colSpan: definitions.image.colSpan,
        imageRow: definitions.image.row,
        descRow: definitions.desc.row,
        noteRow: definitions.note.row,
        cardId: placement.card.id,
        size: normalizeFreeStepCardSize(placement.card.size)
      };
    });
  }

  function renderFreeStepCardCells(page) {
    if (!isFreeStepPage(page)) return;
    const sheet = getGlobalSheet(page);
    if (!sheet) return;

    sheet.querySelectorAll(".free-step-card-cell").forEach((cell) => cell.remove());
    const layout = layoutFreeStepCards(getFreeStepCards(page));
    if (!layout.ok) {
      page.dataset.freeStepLayoutError = "true";
      return;
    }
    delete page.dataset.freeStepLayoutError;

    const overlay = getGlobalOverlay(page);
    const insertCell = (cell) => {
      if (overlay && overlay.parentNode === sheet) {
        sheet.insertBefore(cell, overlay);
      } else {
        sheet.appendChild(cell);
      }
    };

    layout.placements.forEach((placement, index) => {
      [
        { definition: placement.definitions.image, role: "image" },
        { definition: placement.definitions.desc, role: "desc" },
        { definition: placement.definitions.note, role: "note" }
      ].forEach(({ definition, role }) => {
        const cell = definition.kind === "image" ? buildImageSlot(definition) : buildTextCell(definition);
        cell.style.gridColumn = `${definition.col} / span ${definition.colSpan}`;
        cell.style.gridRow = `${definition.row} / span ${definition.rowSpan}`;
        cell.classList.add("free-step-card-cell");
        cell.dataset.freeStepCardId = placement.card.id;
        cell.dataset.stepCardIndex = String(index);
        cell.dataset.stepCardRole = role;
        cell.dataset.stepCardSize = normalizeFreeStepCardSize(placement.card.size);
        insertCell(cell);
      });
    });
  }

  function setupStepCards(page) {
    getStepCardGroups(page).forEach((group, index) => {
      const elements = getStepCardElements(page, index);
      [
        { element: elements.image, role: "image" },
        { element: elements.desc, role: "desc" },
        { element: elements.note, role: "note" }
      ].forEach(({ element, role }) => {
        if (!element) return;
        element.classList.add("step-card-cell", `step-card-${role}`);
        element.dataset.stepCardIndex = String(index);
        element.dataset.stepCardRole = role;
        element.addEventListener("pointerdown", (event) => {
          if (shouldIgnoreStepCardPointer(event)) return;
          selectStepCard(page, index);
        });
        element.addEventListener("dragover", (event) => handleStepCardDragOver(event, page, index));
        element.addEventListener("dragleave", () => setStepCardDragOver(page, index, false));
        element.addEventListener("drop", (event) => handleStepCardDrop(event, page, index));
      });
      if (elements.image) {
        addStepCardDragHandle(elements.image, page, index);
        if (isFreeStepPage(page)) {
          addFreeStepCardDeleteButton(elements.image, page, index);
        }
      }
    });
  }

  function getStepCardElements(page, index) {
    const group = getStepCardGroups(page)[index];
    if (!page || !group) {
      return { image: null, desc: null, note: null };
    }
    return {
      image: getPageCellByKey(page, group.imageKey),
      desc: getPageCellByKey(page, group.descKey),
      note: getPageCellByKey(page, group.noteKey)
    };
  }

  function getPageCellByKey(page, key) {
    if (!page || !key) return null;
    return page.querySelector(`.sop-cell[data-cell-key="${cssEscape(key)}"]`);
  }

  function addStepCardDragHandle(imageSlot, page, index) {
    if (imageSlot.querySelector(".step-card-drag-handle")) return;

    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "step-card-drag-handle";
    handle.draggable = true;
    handle.setAttribute("draggable", "true");
    handle.title = "拖动排序";
    handle.setAttribute("aria-label", "拖动步骤卡片排序");
    handle.innerHTML = `
      <svg class="step-card-drag-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"></path>
      </svg>
    `;
    handle.addEventListener("pointerdown", (event) => {
      startStepCardPointerDrag(event, page, index);
    });
    handle.addEventListener("mousedown", (event) => {
      startStepCardPointerDrag(event, page, index);
    });
    handle.addEventListener("dragstart", (event) => handleStepCardDragStart(event, page, index));
    handle.addEventListener("dragend", clearStepCardDragState);
    handle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (handle.dataset.suppressClick === "true") {
        handle.dataset.suppressClick = "false";
        return;
      }
      selectStepCard(page, index);
    });
    imageSlot.appendChild(handle);
  }

  function addFreeStepCardDeleteButton(imageSlot, page, index) {
    if (imageSlot.querySelector(".free-step-card-delete-button")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "free-step-card-delete-button";
    button.title = "删除步骤卡片";
    button.setAttribute("aria-label", "删除步骤卡片");
    button.innerHTML = `<span aria-hidden="true">×</span>`;
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await deleteFreeStepCard(page, index);
      } catch (error) {
        showFileError("删除步骤卡片失败", error);
      }
    });
    imageSlot.appendChild(button);
  }

  function shouldIgnoreStepCardPointer(event) {
    if (event.button !== 0) return true;
    return Boolean(event.target.closest("button, input, select, textarea, .slot-tools, .step-card-drag-handle"));
  }

  function selectStepCard(page, index) {
    if (!page || !getStepCardGroups(page)[index]) return;
    clearMaterialCardSelection();
    selectedStepCard = {
      pageId: page.dataset.pageId,
      index
    };
    renderStepCardSelection();
  }

  function clearStepCardSelection() {
    selectedStepCard = null;
    renderStepCardSelection();
  }

  function renderStepCardSelection() {
    document.querySelectorAll(".step-card-cell").forEach((cell) => {
      cell.classList.remove("is-step-card-selected");
    });
    if (!selectedStepCard) return;
    const page = getPageById(selectedStepCard.pageId);
    if (!page) return;
    setStepCardSelected(page, selectedStepCard.index, true);
  }

  function setStepCardSelected(page, index, selected) {
    Object.values(getStepCardElements(page, index)).forEach((element) => {
      if (element) {
        element.classList.toggle("is-step-card-selected", selected);
      }
    });
  }

  function setStepCardDragOver(page, index, active) {
    Object.values(getStepCardElements(page, index)).forEach((element) => {
      if (element) {
        element.classList.toggle("is-step-card-drag-over", active);
      }
    });
  }

  function clearStepCardDragState() {
    draggedStepCard = null;
    stepCardPointerDrag = null;
    document.querySelectorAll(".step-card-cell").forEach((cell) => {
      cell.classList.remove("is-step-card-dragging", "is-step-card-drag-over");
    });
  }

  function startStepCardPointerDrag(event, page, index) {
    if (event.button !== 0) return;
    if (stepCardPointerDrag) return;
    event.preventDefault();
    event.stopPropagation();
    selectStepCard(page, index);
    draggedStepCard = {
      pageId: page.dataset.pageId,
      index
    };
    stepCardPointerDrag = {
      pageId: page.dataset.pageId,
      index,
      targetIndex: index,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      handle: event.currentTarget
    };
    if (event.currentTarget.setPointerCapture && Number.isInteger(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function handleStepCardPointerMove(event) {
    const drag = stepCardPointerDrag;
    if (!drag) return;

    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!drag.dragging && distance < 5) return;

    event.preventDefault();
    drag.dragging = true;
    if (drag.handle) {
      drag.handle.dataset.suppressClick = "true";
    }
    const page = getPageById(drag.pageId);
    if (!page) {
      clearStepCardDragState();
      return;
    }

    Object.values(getStepCardElements(page, drag.index)).forEach((element) => {
      if (element) {
        element.classList.add("is-step-card-dragging");
      }
    });
    document.querySelectorAll(".step-card-cell.is-step-card-drag-over").forEach((cell) => {
      cell.classList.remove("is-step-card-drag-over");
    });

    const target = getStepCardTargetFromPoint(event.clientX, event.clientY);
    if (!target || target.page.dataset.pageId !== drag.pageId || target.index === drag.index) {
      drag.targetIndex = drag.index;
      return;
    }
    drag.targetIndex = target.index;
    setStepCardDragOver(target.page, target.index, true);
  }

  async function endStepCardPointerDrag(event) {
    const drag = stepCardPointerDrag;
    if (!drag) return;

    const target = getStepCardTargetFromPoint(event.clientX, event.clientY);
    const sourcePage = getPageById(drag.pageId);
    const targetIndex = target && target.page.dataset.pageId === drag.pageId ? target.index : drag.targetIndex;
    const shouldMove = drag.dragging &&
      sourcePage &&
      Number.isInteger(targetIndex) &&
      targetIndex !== drag.index;

    clearStepCardDragState();
    if (!shouldMove) return;

    try {
      await moveStepCardWithinPage(sourcePage, drag.index, targetIndex);
      window.setTimeout(() => {
        if (document.contains(sourcePage)) {
          selectStepCard(sourcePage, targetIndex);
        }
      }, 120);
    } catch (error) {
      showFileError("步骤卡片排序失败", error);
    }
  }

  function getStepCardTargetFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    const cell = element && element.closest ? element.closest(".step-card-cell") : null;
    if (!cell) return null;
    const page = cell.closest(".sop-page");
    const index = Number(cell.dataset.stepCardIndex);
    if (!page || !Number.isInteger(index)) return null;
    return { page, index };
  }

  function handleStepCardDragStart(event, page, index) {
    event.stopPropagation();
    selectStepCard(page, index);
    draggedStepCard = {
      pageId: page.dataset.pageId,
      index
    };
    Object.values(getStepCardElements(page, index)).forEach((element) => {
      if (element) {
        element.classList.add("is-step-card-dragging");
      }
    });
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(STEP_CARD_DRAG_MIME, JSON.stringify(draggedStepCard));
    event.dataTransfer.setData("text/plain", `step-card:${page.dataset.pageId}:${index}`);
  }

  function handleStepCardDragOver(event, page, index) {
    if (!isStepCardDragEvent(event)) return;
    event.preventDefault();
    event.stopPropagation();

    if (!draggedStepCard || draggedStepCard.pageId !== page.dataset.pageId) {
      event.dataTransfer.dropEffect = "none";
      return;
    }
    event.dataTransfer.dropEffect = draggedStepCard.index === index ? "none" : "move";
    if (draggedStepCard.index !== index) {
      setStepCardDragOver(page, index, true);
    }
  }

  async function handleStepCardDrop(event, page, index) {
    if (!isStepCardDragEvent(event)) return;
    event.preventDefault();
    event.stopPropagation();

    const source = getStepCardDragSource(event);
    clearStepCardDragState();
    if (!source || source.pageId !== page.dataset.pageId || source.index === index) return;
    await moveStepCardWithinPage(page, source.index, index);
  }

  function isStepCardDragEvent(event) {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) return false;
    const types = Array.from(dataTransfer.types || []).map((type) => String(type).toLowerCase());
    return Boolean(draggedStepCard) || types.includes(STEP_CARD_DRAG_MIME);
  }

  function getStepCardDragSource(event) {
    if (draggedStepCard) return draggedStepCard;
    const raw = event.dataTransfer && event.dataTransfer.getData(STEP_CARD_DRAG_MIME);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return {
        pageId: parsed.pageId,
        index: Number(parsed.index)
      };
    } catch {
      return null;
    }
  }

  async function moveStepCardWithinPage(page, sourceIndex, targetIndex) {
    if (!page || sourceIndex === targetIndex) return;
    const groups = getStepCardGroups(page);
    if (!groups[sourceIndex] || !groups[targetIndex]) return;
    if (editor.isOpen && editor.slot && page.contains(editor.slot)) {
      closeImageEditor();
    }

    if (isFreeStepPage(page)) {
      syncFreeStepCardsFromDom(page);
      const cards = getFreeStepCards(page);
      const [moved] = cards.splice(sourceIndex, 1);
      cards.splice(targetIndex, 0, moved);
      await applyFreeStepCardModels(page);
      activeImageSlot = null;
      selectStepCard(page, targetIndex);
      markDirty();
      return;
    }

    const cards = groups.map((_, index) => captureStepCardData(page, index));
    const [moved] = cards.splice(sourceIndex, 1);
    cards.splice(targetIndex, 0, moved);
    await applyStepCardSequence(page, cards);
    activeImageSlot = null;
    selectStepCard(page, targetIndex);
    markDirty();
  }

  async function applyStepCardSequence(page, cards) {
    const groups = getStepCardGroups(page);
    for (let index = 0; index < groups.length; index += 1) {
      await applyStepCardData(page, index, cards[index]);
    }
  }

  function captureStepCardData(page, index) {
    const elements = getStepCardElements(page, index);
    const data = {
      imageSlot: elements.image ? serializeImageSlot(elements.image) : null,
      descCell: elements.desc ? serializeTextCell(elements.desc) : null,
      noteCell: elements.note ? serializeTextCell(elements.note) : null
    };
    if (isFreeStepPage(page)) {
      data.size = normalizeFreeStepCardSize(getFreeStepCards(page)[index] && getFreeStepCards(page)[index].size);
    }
    return data;
  }

  function syncFreeStepCardsFromDom(page) {
    if (!isFreeStepPage(page)) return;
    page._stepCards = getFreeStepCards(page).map((card, index) => ({
      ...card,
      ...captureStepCardData(page, index)
    }));
  }

  async function applyFreeStepCardModels(page) {
    if (!isFreeStepPage(page)) return;
    renderFreeStepCardCells(page);
    setupStepCards(page);
    const cards = getFreeStepCards(page);
    for (let index = 0; index < cards.length; index += 1) {
      await applyStepCardData(page, index, cards[index]);
    }
    renderStepCardSelection();
  }

  async function deleteFreeStepCard(page, index) {
    if (!isFreeStepPage(page)) return false;
    const cards = getFreeStepCards(page);
    if (!cards[index]) return false;
    if (editor.isOpen && editor.slot && page.contains(editor.slot)) {
      closeImageEditor();
    }
    syncFreeStepCardsFromDom(page);
    getFreeStepCards(page).splice(index, 1);
    await applyFreeStepCardModels(page);
    activeImageSlot = null;
    const nextIndex = Math.min(index, getFreeStepCards(page).length - 1);
    if (nextIndex >= 0) {
      selectStepCard(page, nextIndex);
    } else {
      clearStepCardSelection();
    }
    markDirty();
    return true;
  }

  async function addFreeStepCardToCurrentPage(size) {
    const page = getCurrentPage();
    if (!isFreeStepPage(page)) return false;
    if (editor.isOpen && editor.slot && page.contains(editor.slot)) {
      closeImageEditor();
    }
    syncFreeStepCardsFromDom(page);
    const cards = getFreeStepCards(page);
    const nextCard = createFreeStepCard(size);
    const nextCards = cards.concat(nextCard);
    const layout = layoutFreeStepCards(nextCards);
    if (!layout.ok) {
      showFileError("添加步骤卡片失败", new Error("当前页面剩余槽位不足，不能再添加这个尺寸的卡片。"));
      return false;
    }
    page._stepCards = nextCards;
    await applyFreeStepCardModels(page);
    selectStepCard(page, nextCards.length - 1);
    markDirty();
    return true;
  }

  async function applyStepCardData(page, index, data) {
    const elements = getStepCardElements(page, index);
    if (!data || !elements.image || !elements.desc || !elements.note) return;

    await applyImageSlotData(elements.image, {
      ...(data.imageSlot || {}),
      key: elements.image.dataset.cellKey || "",
      fit: elements.image.dataset.fit || "contain",
      logo: false
    });
    applySavedTextCell(elements.desc, {
      ...(data.descCell || {}),
      key: elements.desc.dataset.cellKey || ""
    });
    applySavedTextCell(elements.note, {
      ...(data.noteCell || {}),
      key: elements.note.dataset.cellKey || ""
    });
  }

  function copySelectedStepCard() {
    const selected = getSelectedStepCard();
    if (!selected) return false;
    stepCardClipboard = cloneStepCardData(captureStepCardData(selected.page, selected.index), {
      regenerateIds: true
    });
    return true;
  }

  async function pasteStepCardToSelection() {
    const selected = getSelectedStepCard();
    if (!selected || !stepCardClipboard) return false;
    if (editor.isOpen && editor.slot && selected.page.contains(editor.slot)) {
      closeImageEditor();
    }

    if (isFreeStepPage(selected.page)) {
      syncFreeStepCardsFromDom(selected.page);
      const cards = getFreeStepCards(selected.page);
      const clonedData = cloneStepCardData(stepCardClipboard, { regenerateIds: true });
      const copiedCard = createFreeStepCard(clonedData.size || (cards[selected.index] && cards[selected.index].size) || "small", clonedData);
      const insertedCards = cards.slice();
      insertedCards.splice(selected.index + 1, 0, copiedCard);
      if (layoutFreeStepCards(insertedCards).ok) {
        selected.page._stepCards = insertedCards;
        await applyFreeStepCardModels(selected.page);
        selectStepCard(selected.page, selected.index + 1);
        markDirty();
        return true;
      }

      const replacementCards = cards.slice();
      const targetId = cards[selected.index] && cards[selected.index].id;
      replacementCards[selected.index] = createFreeStepCard(copiedCard.size, {
        ...copiedCard,
        id: targetId || copiedCard.id
      });
      if (layoutFreeStepCards(replacementCards).ok) {
        selected.page._stepCards = replacementCards;
        await applyFreeStepCardModels(selected.page);
        selectStepCard(selected.page, selected.index);
        markDirty();
        return true;
      }
    }

    await applyStepCardData(selected.page, selected.index, cloneStepCardData(stepCardClipboard, {
      regenerateIds: true
    }));
    selectStepCard(selected.page, selected.index);
    markDirty();
    return true;
  }

  function getSelectedStepCard() {
    if (!selectedStepCard) return null;
    const page = getPageById(selectedStepCard.pageId);
    if (!page || !getStepCardGroups(page)[selectedStepCard.index]) {
      clearStepCardSelection();
      return null;
    }
    return {
      page,
      index: selectedStepCard.index
    };
  }

  function cloneStepCardData(data, options = {}) {
    const clone = structuredCloneSafe(data || {});
    if (options.regenerateIds && clone.imageSlot) {
      ["annotations", "texts"].forEach((key) => {
        if (!Array.isArray(clone.imageSlot[key])) return;
        clone.imageSlot[key].forEach((model) => {
          model.id = newOverlayId();
        });
      });
    }
    return clone;
  }

  function setupMaterialCards(page) {
    MATERIAL_CARD_GROUPS.forEach((group, index) => {
      const elements = getMaterialCardElements(page, index);
      [
        { element: elements.image, role: "image" },
        { element: elements.name, role: "name" },
        { element: elements.number, role: "number" },
        { element: elements.spec, role: "spec" }
      ].forEach(({ element, role }) => {
        if (!element) return;
        element.classList.add("material-card-cell", `material-card-${role}`);
        element.dataset.materialCardIndex = String(index);
        element.dataset.materialCardRole = role;
        element.addEventListener("pointerdown", (event) => {
          if (shouldIgnoreMaterialCardPointer(event)) return;
          selectMaterialCard(page, index);
        });
        element.addEventListener("dragover", (event) => handleMaterialCardDragOver(event, page, index));
        element.addEventListener("dragleave", () => setMaterialCardDragOver(page, index, false));
        element.addEventListener("drop", (event) => handleMaterialCardDrop(event, page, index));
      });
      if (elements.image) {
        addMaterialCardDragHandle(elements.image, page, index);
      }
    });
  }

  function getMaterialCardElements(page, index) {
    const group = MATERIAL_CARD_GROUPS[index];
    if (!page || !group) {
      return { image: null, name: null, number: null, spec: null };
    }
    return {
      image: getPageCellByKey(page, group.imageKey),
      name: getPageCellByKey(page, group.nameKey),
      number: getPageCellByKey(page, group.numberKey),
      spec: getPageCellByKey(page, group.specKey)
    };
  }

  function addMaterialCardDragHandle(imageSlot, page, index) {
    if (imageSlot.querySelector(".material-card-drag-handle")) return;

    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "material-card-drag-handle";
    handle.draggable = true;
    handle.setAttribute("draggable", "true");
    handle.title = "拖动物料排序";
    handle.setAttribute("aria-label", "拖动物料卡片排序");
    handle.innerHTML = `
      <svg class="card-drag-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"></path>
      </svg>
    `;
    handle.addEventListener("pointerdown", (event) => {
      startMaterialCardPointerDrag(event, page, index);
    });
    handle.addEventListener("mousedown", (event) => {
      startMaterialCardPointerDrag(event, page, index);
    });
    handle.addEventListener("dragstart", (event) => handleMaterialCardDragStart(event, page, index));
    handle.addEventListener("dragend", clearMaterialCardDragState);
    handle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (handle.dataset.suppressClick === "true") {
        handle.dataset.suppressClick = "false";
        return;
      }
      selectMaterialCard(page, index);
    });
    imageSlot.appendChild(handle);
  }

  function shouldIgnoreMaterialCardPointer(event) {
    if (event.button !== 0) return true;
    return Boolean(event.target.closest("button, input, select, textarea, .slot-tools, .material-card-drag-handle"));
  }

  function selectMaterialCard(page, index) {
    if (!page || !MATERIAL_CARD_GROUPS[index]) return;
    clearStepCardSelection();
    selectedMaterialCard = {
      pageId: page.dataset.pageId,
      index
    };
    renderMaterialCardSelection();
  }

  function clearMaterialCardSelection() {
    selectedMaterialCard = null;
    renderMaterialCardSelection();
  }

  function renderMaterialCardSelection() {
    document.querySelectorAll(".material-card-cell").forEach((cell) => {
      cell.classList.remove("is-material-card-selected");
    });
    if (!selectedMaterialCard) return;
    const page = getPageById(selectedMaterialCard.pageId);
    if (!page) return;
    setMaterialCardSelected(page, selectedMaterialCard.index, true);
  }

  function setMaterialCardSelected(page, index, selected) {
    Object.values(getMaterialCardElements(page, index)).forEach((element) => {
      if (element) {
        element.classList.toggle("is-material-card-selected", selected);
      }
    });
  }

  function setMaterialCardDragOver(page, index, active) {
    Object.values(getMaterialCardElements(page, index)).forEach((element) => {
      if (element) {
        element.classList.toggle("is-material-card-drag-over", active);
      }
    });
  }

  function clearMaterialCardDragState() {
    draggedMaterialCard = null;
    materialCardPointerDrag = null;
    document.querySelectorAll(".material-card-cell").forEach((cell) => {
      cell.classList.remove("is-material-card-dragging", "is-material-card-drag-over");
    });
  }

  function startMaterialCardPointerDrag(event, page, index) {
    if (event.button !== 0) return;
    if (materialCardPointerDrag) return;
    event.preventDefault();
    event.stopPropagation();
    selectMaterialCard(page, index);
    draggedMaterialCard = {
      pageId: page.dataset.pageId,
      index
    };
    materialCardPointerDrag = {
      pageId: page.dataset.pageId,
      index,
      targetIndex: index,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      handle: event.currentTarget
    };
    if (event.currentTarget.setPointerCapture && Number.isInteger(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function handleMaterialCardPointerMove(event) {
    const drag = materialCardPointerDrag;
    if (!drag) return;

    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!drag.dragging && distance < 5) return;

    event.preventDefault();
    drag.dragging = true;
    if (drag.handle) {
      drag.handle.dataset.suppressClick = "true";
    }
    const page = getPageById(drag.pageId);
    if (!page) {
      clearMaterialCardDragState();
      return;
    }

    Object.values(getMaterialCardElements(page, drag.index)).forEach((element) => {
      if (element) {
        element.classList.add("is-material-card-dragging");
      }
    });
    document.querySelectorAll(".material-card-cell.is-material-card-drag-over").forEach((cell) => {
      cell.classList.remove("is-material-card-drag-over");
    });

    const target = getMaterialCardTargetFromPoint(event.clientX, event.clientY);
    if (!target || target.page.dataset.pageId !== drag.pageId || target.index === drag.index) {
      drag.targetIndex = drag.index;
      return;
    }
    drag.targetIndex = target.index;
    setMaterialCardDragOver(target.page, target.index, true);
  }

  async function endMaterialCardPointerDrag(event) {
    const drag = materialCardPointerDrag;
    if (!drag) return;

    const target = getMaterialCardTargetFromPoint(event.clientX, event.clientY);
    const sourcePage = getPageById(drag.pageId);
    const targetIndex = target && target.page.dataset.pageId === drag.pageId ? target.index : drag.targetIndex;
    const shouldMove = drag.dragging &&
      sourcePage &&
      Number.isInteger(targetIndex) &&
      targetIndex !== drag.index;

    clearMaterialCardDragState();
    if (!shouldMove) return;

    try {
      await moveMaterialCardWithinPage(sourcePage, drag.index, targetIndex);
      window.setTimeout(() => {
        if (document.contains(sourcePage)) {
          selectMaterialCard(sourcePage, targetIndex);
        }
      }, 120);
    } catch (error) {
      showFileError("物料卡片排序失败", error);
    }
  }

  function getMaterialCardTargetFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    const cell = element && element.closest ? element.closest(".material-card-cell") : null;
    if (!cell) return null;
    const page = cell.closest(".sop-page");
    const index = Number(cell.dataset.materialCardIndex);
    if (!page || !Number.isInteger(index)) return null;
    return { page, index };
  }

  function handleMaterialCardDragOver(event, page, index) {
    if (!isMaterialCardDragEvent(event)) return;
    event.preventDefault();
    event.stopPropagation();

    if (!draggedMaterialCard || draggedMaterialCard.pageId !== page.dataset.pageId) {
      event.dataTransfer.dropEffect = "none";
      return;
    }
    event.dataTransfer.dropEffect = draggedMaterialCard.index === index ? "none" : "move";
    if (draggedMaterialCard.index !== index) {
      setMaterialCardDragOver(page, index, true);
    }
  }

  function handleMaterialCardDragStart(event, page, index) {
    event.stopPropagation();
    event.currentTarget.dataset.suppressClick = "true";
    selectMaterialCard(page, index);
    draggedMaterialCard = {
      pageId: page.dataset.pageId,
      index
    };
    Object.values(getMaterialCardElements(page, index)).forEach((element) => {
      if (element) {
        element.classList.add("is-material-card-dragging");
      }
    });
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(MATERIAL_CARD_DRAG_MIME, JSON.stringify(draggedMaterialCard));
    event.dataTransfer.setData("text/plain", `material-card:${page.dataset.pageId}:${index}`);
  }

  async function handleMaterialCardDrop(event, page, index) {
    if (!isMaterialCardDragEvent(event)) return;
    event.preventDefault();
    event.stopPropagation();

    const source = getMaterialCardDragSource(event);
    clearMaterialCardDragState();
    if (!source || source.pageId !== page.dataset.pageId || source.index === index) return;
    await moveMaterialCardWithinPage(page, source.index, index);
  }

  function isMaterialCardDragEvent(event) {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) return false;
    const types = Array.from(dataTransfer.types || []).map((type) => String(type).toLowerCase());
    return Boolean(draggedMaterialCard) || types.includes(MATERIAL_CARD_DRAG_MIME);
  }

  function getMaterialCardDragSource(event) {
    if (draggedMaterialCard) return draggedMaterialCard;
    const raw = event.dataTransfer && event.dataTransfer.getData(MATERIAL_CARD_DRAG_MIME);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return {
        pageId: parsed.pageId,
        index: Number(parsed.index)
      };
    } catch {
      return null;
    }
  }

  async function moveMaterialCardWithinPage(page, sourceIndex, targetIndex) {
    if (!page || sourceIndex === targetIndex) return;
    if (!MATERIAL_CARD_GROUPS[sourceIndex] || !MATERIAL_CARD_GROUPS[targetIndex]) return;
    if (editor.isOpen && editor.slot && page.contains(editor.slot)) {
      closeImageEditor();
    }

    const cards = MATERIAL_CARD_GROUPS.map((_, index) => captureMaterialCardData(page, index));
    const [moved] = cards.splice(sourceIndex, 1);
    cards.splice(targetIndex, 0, moved);
    await applyMaterialCardSequence(page, cards);
    activeImageSlot = null;
    activeMaterialSearchCell = null;
    selectMaterialCard(page, targetIndex);
    markDirty();
  }

  async function applyMaterialCardSequence(page, cards) {
    for (let index = 0; index < MATERIAL_CARD_GROUPS.length; index += 1) {
      await applyMaterialCardData(page, index, cards[index]);
    }
  }

  function captureMaterialCardData(page, index) {
    const elements = getMaterialCardElements(page, index);
    return {
      imageSlot: elements.image ? serializeImageSlot(elements.image) : null,
      nameCell: elements.name ? serializeTextCell(elements.name) : null,
      numberCell: elements.number ? serializeTextCell(elements.number) : null,
      specCell: elements.spec ? serializeTextCell(elements.spec) : null
    };
  }

  async function applyMaterialCardData(page, index, data) {
    const elements = getMaterialCardElements(page, index);
    if (!data || !elements.image || !elements.name || !elements.number || !elements.spec) return;

    await applyImageSlotData(elements.image, {
      ...(data.imageSlot || {}),
      key: elements.image.dataset.cellKey || "",
      fit: elements.image.dataset.fit || "contain",
      logo: false
    });
    applySavedTextCell(elements.name, {
      ...(data.nameCell || {}),
      key: elements.name.dataset.cellKey || ""
    });
    applySavedTextCell(elements.number, {
      ...(data.numberCell || {}),
      key: elements.number.dataset.cellKey || ""
    });
    applySavedTextCell(elements.spec, {
      ...(data.specCell || {}),
      key: elements.spec.dataset.cellKey || ""
    });
  }

  function copySelectedMaterialCard() {
    const selected = getSelectedMaterialCard();
    if (!selected) return false;
    materialCardClipboard = cloneMaterialCardData(captureMaterialCardData(selected.page, selected.index), {
      regenerateIds: true
    });
    return true;
  }

  async function pasteMaterialCardToSelection() {
    const selected = getSelectedMaterialCard();
    if (!selected || !materialCardClipboard) return false;
    if (editor.isOpen && editor.slot && selected.page.contains(editor.slot)) {
      closeImageEditor();
    }
    await applyMaterialCardData(selected.page, selected.index, cloneMaterialCardData(materialCardClipboard, {
      regenerateIds: true
    }));
    activeMaterialSearchCell = null;
    selectMaterialCard(selected.page, selected.index);
    markDirty();
    return true;
  }

  function getSelectedMaterialCard() {
    if (!selectedMaterialCard) return null;
    const page = getPageById(selectedMaterialCard.pageId);
    if (!page || !MATERIAL_CARD_GROUPS[selectedMaterialCard.index]) {
      clearMaterialCardSelection();
      return null;
    }
    return {
      page,
      index: selectedMaterialCard.index
    };
  }

  function cloneMaterialCardData(data, options = {}) {
    const clone = structuredCloneSafe(data || {});
    if (options.regenerateIds && clone.imageSlot) {
      ["annotations", "texts"].forEach((key) => {
        if (!Array.isArray(clone.imageSlot[key])) return;
        clone.imageSlot[key].forEach((model) => {
          model.id = newOverlayId();
        });
      });
    }
    return clone;
  }

  function buildGlobalOverlay(page) {
    const overlay = document.createElement("div");
    overlay.className = "global-overlay";
    overlay.dataset.pageId = page.dataset.pageId;
    const svg = buildAnnotationLayer("global-annotation-layer");
    const textLayer = document.createElement("div");
    textLayer.className = "global-text-layer";
    overlay.append(svg, textLayer);
    overlay.addEventListener("pointerdown", (event) => handleGlobalOverlayPointerDown(event, page));
    return overlay;
  }

  function buildTextCell(definition) {
    const cell = document.createElement("div");
    cell.className = `sop-cell text-cell ${definition.className || ""}`.trim();
    cell.dataset.cellKey = definition.cellKey;
    if (definition.materialField) {
      cell.dataset.materialField = definition.materialField;
      cell.dataset.materialIndex = String(definition.materialIndex);
    }
    if (definition.autoPage) {
      cell.textContent = definition.text;
      cell.dataset.role = "page-number";
      cell.setAttribute("aria-live", "polite");
    } else if (definition.fields && definition.fields.length) {
      cell.dataset.editableCell = "true";
      cell.dataset.fieldMode = "fields";
      definition.fields.forEach((field, index) => {
        cell.appendChild(buildEditableTextField(field, index));
      });
    } else if (definition.editable) {
      cell.dataset.editableCell = "true";
      cell.textContent = definition.text;
      cell.contentEditable = "true";
      cell.spellcheck = false;
    } else {
      cell.textContent = definition.text;
    }
    return cell;
  }

  function buildEditableTextField(field, index) {
    const group = document.createElement("span");
    group.className = "editable-cell-field";
    group.dataset.fieldKey = field.key || `field${index + 1}`;
    if (field.grow) {
      group.dataset.grow = "true";
    }

    const label = document.createElement("span");
    label.className = "editable-cell-label";
    label.textContent = field.label || "";

    const value = document.createElement("span");
    value.className = "editable-cell-value";
    value.dataset.fieldKey = group.dataset.fieldKey;
    value.contentEditable = "true";
    value.spellcheck = false;
    value.textContent = field.value || "";
    if (field.minChars) {
      value.style.setProperty("--field-min-chars", String(field.minChars));
    }

    group.append(label, value);
    return group;
  }

  function isEditableTextCell(cell) {
    return Boolean(cell && cell.dataset && cell.dataset.editableCell === "true");
  }

  function getEditableTextCells(page) {
    return Array.from(page.querySelectorAll(".text-cell[data-editable-cell='true']"));
  }

  function getTextCellValueElement(cell, fieldKey = "") {
    if (!cell) return null;
    if (fieldKey) {
      return cell.querySelector(`.editable-cell-value[data-field-key="${cssEscape(fieldKey)}"]`);
    }
    return cell.querySelector(".editable-cell-value");
  }

  function emptyGlobalInfo() {
    const values = GLOBAL_INFO_FIELDS.reduce((result, field) => {
      result[field.key] = "";
      return result;
    }, {});
    values.logoSlot = null;
    return values;
  }

  function normalizeGlobalInfo(value) {
    const source = value && typeof value === "object" ? value : {};
    const normalized = emptyGlobalInfo();
    GLOBAL_INFO_FIELDS.forEach((field) => {
      normalized[field.key] = String(source[field.key] || "");
    });
    normalized.logoSlot = normalizeGlobalLogoSlot(source.logoSlot);
    return normalized;
  }

  function hasGlobalInfoValues(info = projectState.globalInfo) {
    const normalized = normalizeGlobalInfo(info);
    return GLOBAL_INFO_FIELDS.some((field) => String(normalized[field.key] || "").trim() !== "") ||
      Boolean(normalized.logoSlot);
  }

  function readGlobalInfoFromControls() {
    const values = emptyGlobalInfo();
    globalInfoInputs.forEach((input) => {
      values[input.dataset.globalInfoKey] = input.value || "";
    });
    values.logoSlot = normalizeGlobalLogoSlot(globalInfoLogoSlot);
    return values;
  }

  function updateGlobalInfoControls(values = projectState.globalInfo) {
    const normalized = normalizeGlobalInfo(values);
    globalInfoInputs.forEach((input) => {
      input.value = normalized[input.dataset.globalInfoKey] || "";
    });
    setGlobalInfoLogoSlot(normalized.logoSlot, { silent: true });
    if (globalInfoStatusEl) {
      globalInfoStatusEl.textContent = "仅保存在当前 SOP 中";
    }
  }

  function getGlobalInfoFromPage(page) {
    const values = emptyGlobalInfo();
    GLOBAL_INFO_FIELDS.forEach((field) => {
      const cell = getPageCellByKey(page, field.cellKey);
      const valueElement = getTextCellValueElement(cell, field.fieldKey);
      values[field.key] = valueElement ? valueElement.textContent || "" : "";
    });
    const logoSlot = getGlobalInfoLogoSlotFromPage(page);
    values.logoSlot = logoSlot && logoSlot.dataset.hasImage === "true" ? serializeImageSlot(logoSlot) : null;
    return values;
  }

  function readGlobalInfoFromCurrentPage() {
    const page = getCurrentPage();
    if (!page) return;
    const values = getGlobalInfoFromPage(page);
    updateGlobalInfoControls(values);
    if (globalInfoStatusEl) {
      globalInfoStatusEl.textContent = "已读取当前页，点击保存并同步";
    }
  }

  function setGlobalInfoField(page, field, value) {
    const cell = getPageCellByKey(page, field.cellKey);
    const valueElement = getTextCellValueElement(cell, field.fieldKey);
    if (valueElement) {
      valueElement.textContent = value || "";
    }
  }

  async function applyGlobalInfoToPage(page, values = projectState.globalInfo) {
    if (!page) return;
    const normalized = normalizeGlobalInfo(values);
    GLOBAL_INFO_FIELDS.forEach((field) => {
      setGlobalInfoField(page, field, normalized[field.key]);
    });
    await setGlobalInfoLogoForPage(page, normalized.logoSlot);
  }

  async function applyGlobalInfoToAllPages(values = projectState.globalInfo) {
    for (const page of getPages()) {
      await applyGlobalInfoToPage(page, values);
    }
  }

  async function saveAndApplyGlobalInfo() {
    projectState.globalInfo = normalizeGlobalInfo(readGlobalInfoFromControls());
    await applyGlobalInfoToAllPages(projectState.globalInfo);
    markDirty();
    if (globalInfoStatusEl) {
      globalInfoStatusEl.textContent = "已同步到当前 SOP 的所有页面";
    }
  }

  function normalizeGlobalLogoSlot(slotData) {
    if (!slotData || typeof slotData !== "object" || slotData.hasImage !== true) return null;
    const clone = structuredCloneSafe(slotData);
    clone.key = GLOBAL_INFO_LOGO_CELL_KEY;
    clone.hasImage = true;
    clone.logo = true;
    clone.fit = "contain";
    clone.mediaKind = clone.mediaKind === "source" ? "source" : "image";
    clone.assetId = clone.mediaKind === "image" ? clone.assetId || null : null;
    clone.imageState = {
      naturalWidth: Number(clone.imageState && clone.imageState.naturalWidth) || 0,
      naturalHeight: Number(clone.imageState && clone.imageState.naturalHeight) || 0,
      scale: Number(clone.imageState && clone.imageState.scale) || 1,
      x: Number(clone.imageState && clone.imageState.x) || 0,
      y: Number(clone.imageState && clone.imageState.y) || 0
    };
    clone.sourceInfo = clone.mediaKind === "source" && clone.sourceInfo ? { ...clone.sourceInfo } : null;
    clone.annotations = Array.isArray(clone.annotations) ? clone.annotations.map(cloneModel) : [];
    clone.texts = Array.isArray(clone.texts) ? clone.texts.map(cloneModel) : [];
    if (clone.mediaKind === "image" && !clone.assetId) return null;
    return clone;
  }

  function getGlobalInfoLogoSlotFromPage(page) {
    return page ? page.querySelector(`.image-cell[data-logo="true"][data-cell-key="${GLOBAL_INFO_LOGO_CELL_KEY}"]`) : null;
  }

  async function setGlobalInfoLogoForPage(page, logoSlotData) {
    const logoSlot = getGlobalInfoLogoSlotFromPage(page);
    if (!logoSlot) return;
    if (!logoSlotData) {
      deleteImage(logoSlot, { keepFocus: false });
      return;
    }
    await applyImageSlotData(logoSlot, {
      ...logoSlotData,
      key: logoSlot.dataset.cellKey || GLOBAL_INFO_LOGO_CELL_KEY,
      fit: "contain",
      logo: true
    });
  }

  async function loadGlobalInfoLogoFile(file) {
    if (!file) return;
    const extension = getFileExtension(file.name);
    const isImage = ALLOWED_ASSET_IMAGE_MIMES.has(normalizeAssetMime(file.type || getImageMimeType(file.name || "")));
    if (!isImage) {
      if (!isLogoSourceExtension(extension)) {
        throw new Error("全局Logo只支持 PNG、JPG、WebP 图片，或 AI/EPS/PDF 源文件。");
      }
      setGlobalInfoLogoSlot({
        key: GLOBAL_INFO_LOGO_CELL_KEY,
        hasImage: true,
        mediaKind: "source",
        fit: "contain",
        logo: true,
        assetId: null,
        imageState: createImageState(),
        sourceInfo: {
          type: extension.replace(".", "").toUpperCase() || "SOURCE",
          name: file.name || "logo source file"
        },
        annotations: [],
        texts: []
      });
      if (globalInfoStatusEl) {
        globalInfoStatusEl.textContent = "Logo已更新，点击保存并同步";
      }
      return;
    }

    const asset = await createImageAssetFromBlob(projectState.documentId, file, "file", { fileName: file.name || "" });
    setGlobalInfoLogoSlot({
      key: GLOBAL_INFO_LOGO_CELL_KEY,
      hasImage: true,
      mediaKind: "image",
      fit: "contain",
      logo: true,
      assetId: asset.id,
      imageState: {
        naturalWidth: asset.width,
        naturalHeight: asset.height,
        scale: 1,
        x: 0,
        y: 0
      },
      sourceInfo: null,
      annotations: [],
      texts: []
    });
    if (globalInfoStatusEl) {
      globalInfoStatusEl.textContent = "Logo已更新，点击保存并同步";
    }
  }

  function setGlobalInfoLogoSlot(slotData, options = {}) {
    globalInfoLogoSlot = normalizeGlobalLogoSlot(slotData);
    renderGlobalInfoLogoPreview(globalInfoLogoSlot);
    if (!options.silent && globalInfoStatusEl) {
      globalInfoStatusEl.textContent = "未同步，点击保存并同步";
    }
  }

  async function renderGlobalInfoLogoPreview(slotData) {
    if (!globalInfoLogoPreview) return;
    if (globalInfoLogoPreviewUrl) {
      URL.revokeObjectURL(globalInfoLogoPreviewUrl);
      globalInfoLogoPreviewUrl = "";
    }
    globalInfoLogoPreview.replaceChildren();
    if (!slotData) {
      globalInfoLogoPreview.textContent = "未设置logo";
      globalInfoLogoPreview.classList.remove("has-logo");
      if (globalInfoLogoDeleteButton) globalInfoLogoDeleteButton.disabled = true;
      return;
    }
    globalInfoLogoPreview.classList.add("has-logo");
    if (globalInfoLogoDeleteButton) globalInfoLogoDeleteButton.disabled = false;

    if (slotData.mediaKind === "source" && slotData.sourceInfo) {
      const type = document.createElement("strong");
      type.textContent = slotData.sourceInfo.type || "SOURCE";
      const name = document.createElement("span");
      name.textContent = slotData.sourceInfo.name || "logo source file";
      globalInfoLogoPreview.append(type, name);
      return;
    }

    const blob = await getAssetBlob(slotData.assetId);
    if (!blob || globalInfoLogoSlot !== slotData) {
      globalInfoLogoPreview.textContent = "Logo资源缺失";
      return;
    }
    globalInfoLogoPreviewUrl = URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.alt = "全局Logo";
    img.src = globalInfoLogoPreviewUrl;
    globalInfoLogoPreview.appendChild(img);
  }

  function getTextCellPersistedText(cell) {
    if (!cell) return "";
    return cell.textContent || "";
  }

  function getTextCellFieldValues(cell) {
    if (!cell || cell.dataset.fieldMode !== "fields") return null;
    return Array.from(cell.querySelectorAll(".editable-cell-value")).map((valueElement) => {
      return {
        key: valueElement.dataset.fieldKey || "",
        text: valueElement.textContent || ""
      };
    });
  }

  function applySavedTextCell(cell, savedCell) {
    if (!cell || !savedCell) return;
    if (cell.dataset.fieldMode === "fields") {
      applySavedTextCellFields(cell, savedCell);
      return;
    }
    cell.textContent = savedCell.text || "";
  }

  function applySavedTextCellFields(cell, savedCell) {
    const valueElements = Array.from(cell.querySelectorAll(".editable-cell-value"));
    if (!valueElements.length) return;

    if (Array.isArray(savedCell.values) && savedCell.values.length) {
      const valuesByKey = new Map(savedCell.values.map((item) => [item.key, item]));
      valueElements.forEach((valueElement, index) => {
        const savedValue = valuesByKey.get(valueElement.dataset.fieldKey || "") || savedCell.values[index];
        valueElement.textContent = savedValue ? savedValue.text || "" : "";
      });
      return;
    }

    const parsedValues = parseSavedFieldValues(cell, savedCell.text || "");
    valueElements.forEach((valueElement, index) => {
      valueElement.textContent = parsedValues[index] || "";
    });
  }

  function parseSavedFieldValues(cell, savedText) {
    const text = String(savedText || "");
    const labels = Array.from(cell.querySelectorAll(".editable-cell-label")).map((label) => label.textContent || "");
    if (!labels.length || !text) return labels.map(() => "");

    const matches = labels.map((label) => findLabelInText(text, label));
    if (matches.every((match) => match.index < 0)) {
      return labels.length === 1 ? [text.trim()] : labels.map(() => "");
    }

    return labels.map((label, index) => {
      const match = matches[index];
      if (match.index < 0) return "";
      const start = match.index + match.length;
      const next = matches.slice(index + 1).find((item) => item.index >= 0 && item.index >= start);
      const end = next ? next.index : text.length;
      return text.slice(start, end).trim();
    });
  }

  function findLabelInText(text, label) {
    const exactIndex = text.indexOf(label);
    if (exactIndex >= 0) {
      return { index: exactIndex, length: label.length };
    }
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      return { index: -1, length: 0 };
    }
    const trimmedIndex = text.indexOf(trimmedLabel);
    return {
      index: trimmedIndex,
      length: trimmedIndex >= 0 ? trimmedLabel.length : 0
    };
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return String(value).replace(/["\\]/g, "\\$&");
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

    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) return;

      try {
        await loadImageFile(slot, file);
      } catch (error) {
        showFileError("插入图片失败", error);
      } finally {
        input.value = "";
      }
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
    editor.buttons.bubble = buildEditorButton("bubble", "气泡文本");
    editor.buttons.circle = buildEditorButton("circle", "圆圈");
    editor.buttons.rect = buildEditorButton("rect", "矩形");
    editor.buttons.arrow = buildEditorButton("arrow", "箭头");
    editor.buttons.reset = buildEditorButton("reset", "图片复位");
    editor.buttons.delete = buildEditorButton("delete", "删除所选");
    editor.buttons.done = buildEditorButton("done", "完成");
    const colorControl = document.createElement("div");
    colorControl.className = "editor-color-control";
    colorControl.setAttribute("aria-label", "预设颜色");
    const colorLabel = document.createElement("span");
    colorLabel.textContent = "颜色";
    const colorPresetList = document.createElement("div");
    colorPresetList.className = "preset-color-list";
    buildColorPresetButtons(colorPresetList, (color) => handleEditorColorChange(color));
    colorControl.append(colorLabel, colorPresetList);
    editor.colorPresetList = colorPresetList;

    const fontControl = document.createElement("label");
    fontControl.className = "editor-font-control";
    const fontLabel = document.createElement("span");
    fontLabel.textContent = "字号";
    const fontDecreaseButton = document.createElement("button");
    fontDecreaseButton.type = "button";
    fontDecreaseButton.className = "editor-font-step-button";
    fontDecreaseButton.setAttribute("aria-label", "减小字号");
    fontDecreaseButton.textContent = "-";
    const fontSizeInput = document.createElement("input");
    fontSizeInput.type = "number";
    fontSizeInput.min = String(GLOBAL_TEXT_FONT_MIN);
    fontSizeInput.max = String(GLOBAL_TEXT_FONT_MAX);
    fontSizeInput.step = "1";
    fontSizeInput.inputMode = "numeric";
    fontSizeInput.disabled = true;
    fontSizeInput.setAttribute("aria-label", "文字字号");
    const fontIncreaseButton = document.createElement("button");
    fontIncreaseButton.type = "button";
    fontIncreaseButton.className = "editor-font-step-button";
    fontIncreaseButton.setAttribute("aria-label", "增大字号");
    fontIncreaseButton.textContent = "+";
    fontControl.append(fontLabel, fontDecreaseButton, fontSizeInput, fontIncreaseButton);
    editor.fontSizeInput = fontSizeInput;
    editor.fontDecreaseButton = fontDecreaseButton;
    editor.fontIncreaseButton = fontIncreaseButton;

    toolbar.append(
      editor.buttons.crop,
      colorControl,
      fontControl,
      editor.buttons.text,
      editor.buttons.bubble,
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
    fontSizeInput.addEventListener("input", () => handleEditorFontSizeChange(fontSizeInput.value));
    fontSizeInput.addEventListener("change", () => updateEditorFontSizeControlFromSelection());
    fontDecreaseButton.addEventListener("click", () => adjustSelectedEditorFontSize(-1));
    fontIncreaseButton.addEventListener("click", () => adjustSelectedEditorFontSize(1));

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
    popover.setAttribute("aria-label", "物料搜索");

    const input = document.createElement("input");
    input.className = "material-search-input";
    input.type = "search";
    input.placeholder = "搜索或输入物料编号/名称";
    input.autocomplete = "off";

    const status = document.createElement("div");
    status.className = "material-search-status";
    status.textContent = "请先导入 BOM 表";

    const list = document.createElement("div");
    list.className = "material-search-list";

    popover.append(input, status, list);
    document.body.appendChild(popover);

    input.addEventListener("input", () => {
      if (activeMaterialSearchCell) {
        const field = getMaterialSearchField(activeMaterialSearchCell);
        setMaterialFieldValue(activeMaterialSearchCell, field, input.value);
        markDirty();
        applyExactBomMatch(activeMaterialSearchCell);
      }
      renderMaterialSearchResults(input.value);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const first = getFilteredBomItems(input.value)[0];
        if (first && activeMaterialSearchCell) {
          applyBomItemToMaterial(activeMaterialSearchCell, first);
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
    const cell = getMaterialSearchCell(event.target);
    if (cell) {
      showMaterialSearch(cell);
    }
  }

  function handleMaterialDocumentClick(event) {
    const cell = getMaterialSearchCell(event.target);
    if (cell) {
      showMaterialSearch(cell);
      return;
    }
    if (materialSearch.popover && materialSearch.popover.contains(event.target)) return;
    hideMaterialSearch();
  }

  function getMaterialSearchCell(target) {
    const cell = target && target.closest ?
      target.closest(".text-cell[data-material-field='number'], .text-cell[data-material-field='name']") :
      null;
    return cell && isEditableTextCell(cell) ? cell : null;
  }

  function showMaterialSearch(cell) {
    activeMaterialSearchCell = cell;
    if (!materialSearch.popover) return;

    const field = getMaterialSearchField(cell);
    materialSearch.input.placeholder = field === "name" ? "搜索或输入物料名称" : "搜索或输入物料编号";
    materialSearch.input.value = getMaterialFieldValue(cell, field);
    renderMaterialSearchResults(materialSearch.input.value);
    materialSearch.popover.hidden = false;
    positionMaterialSearch(cell);
  }

  function hideMaterialSearch() {
    activeMaterialSearchCell = null;
    if (materialSearch.popover) {
      materialSearch.popover.hidden = true;
    }
  }

  function getMaterialSearchField(cell) {
    return cell && cell.dataset.materialField === "name" ? "name" : "number";
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
      empty.textContent = activeMaterialSearchCell && getMaterialSearchField(activeMaterialSearchCell) === "name" ?
        "没有匹配的物料名称" :
        "没有匹配的物料编号";
      materialSearch.list.appendChild(empty);
      return;
    }

    items.slice(0, 80).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "material-search-option";
      const primary = document.createElement("strong");
      const detail = document.createElement("span");
      if (activeMaterialSearchCell && getMaterialSearchField(activeMaterialSearchCell) === "name") {
        primary.textContent = item.name || "未命名物料";
        detail.textContent = [item.code, item.spec].filter(Boolean).join(" · ") || "无物料编号";
      } else {
        primary.textContent = item.code || "";
        detail.textContent = [item.name, item.spec].filter(Boolean).join(" · ") || "未命名物料";
      }
      button.append(primary, detail);
      button.addEventListener("click", () => {
        if (activeMaterialSearchCell) {
          applyBomItemToMaterial(activeMaterialSearchCell, item).catch((error) => {
            showFileError("填入物料失败", error);
          });
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
    const field = getMaterialSearchField(cell);
    const value = normalizeSearchText(getMaterialFieldValue(cell, field));
    if (!value) return;
    const match = libraryState.activeBom.items.find((item) => {
      const target = field === "name" ? item.name : item.code;
      return normalizeSearchText(target) === value;
    });
    if (match) {
      applyBomItemToMaterial(cell, match, { keepSearchOpen: true }).catch((error) => {
        showFileError("填入物料失败", error);
      });
    }
  }

  async function applyBomItemToMaterial(sourceCell, item, options = {}) {
    const index = sourceCell.dataset.materialIndex;
    const page = sourceCell.closest(".sop-page");
    if (!page || index === undefined) return;

    const numberCell = page.querySelector(`.text-cell[data-material-index="${index}"][data-material-field="number"]`);
    const nameCell = page.querySelector(`.text-cell[data-material-index="${index}"][data-material-field="name"]`);
    const specCell = page.querySelector(`.text-cell[data-material-index="${index}"][data-material-field="spec"]`);
    const imageSlot = page.querySelector(`.image-cell[data-material-index="${index}"]`);

    if (numberCell) setMaterialFieldValue(numberCell, "number", item.code || "");
    if (nameCell) setMaterialFieldValue(nameCell, "name", item.name || "");
    if (specCell) setMaterialFieldValue(specCell, "spec", item.spec || "");
    if (imageSlot && item.imageSrc) {
      await loadImageSource(imageSlot, item.imageSrc, { keepOverlays: false });
    }

    highlightBomPreviewRow(item);
    markDirty();
    if (!options.keepSearchOpen) {
      hideMaterialSearch();
    } else {
      renderMaterialSearchResults(getMaterialFieldValue(sourceCell, getMaterialSearchField(sourceCell)));
    }
  }

  function getMaterialFieldValue(cell, field) {
    const valueElement = getTextCellValueElement(cell);
    if (valueElement) {
      return (valueElement.textContent || "").trim();
    }
    const text = cell ? cell.textContent || "" : "";
    const prefix = getMaterialFieldPrefix(field);
    return text.startsWith(prefix) ? text.slice(prefix.length).trim() : text.trim();
  }

  function setMaterialFieldValue(cell, field, value) {
    if (!cell) return;
    const valueElement = getTextCellValueElement(cell);
    if (valueElement) {
      valueElement.textContent = String(value || "").trim();
      return;
    }
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
    if (action === "text" || action === "bubble") {
      addEditorText(action);
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
    updateEditorColorInputFromSelection();
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
      applyAnnotationColor(shape, model);
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
      normalizeEditorTextModel(model, editor.slot);
      const isBubble = model.type === "bubble";
      const isSelected = editor.selected && editor.selected.kind === "text" && editor.selected.id === model.id;

      if (isBubble) {
        editor.textLayer.appendChild(buildEditorBubbleShape(model, ratio));
        const tailHandle = buildEditorBubbleTailHandle(model, ratio);
        tailHandle.classList.toggle("is-selected", isSelected);
        editor.textLayer.appendChild(tailHandle);
      }

      const box = document.createElement("div");
      box.className = `editor-text-box ${isBubble ? "is-bubble" : ""}`.trim();
      box.dataset.overlayId = model.id;
      box.style.left = `${model.x * ratio}px`;
      box.style.top = `${model.y * ratio}px`;
      box.style.width = `${model.width * ratio}px`;
      box.style.height = `${model.height * ratio}px`;
      box.style.fontSize = `${getTextFontSize(model) * ratio}px`;
      box.style.padding = `${Math.max(2, 3 * ratio)}px ${Math.max(3, 5 * ratio)}px`;
      applyTextBoxColor(box, model);
      if (isSelected) {
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

      const dragHandle = document.createElement("button");
      dragHandle.type = "button";
      dragHandle.className = "editor-text-drag-handle";
      dragHandle.title = "按住移动位置";
      dragHandle.setAttribute("aria-label", "按住移动位置");
      dragHandle.addEventListener("pointerdown", (event) => startTextMove(event, model.id));

      const resizeHandle = document.createElement("button");
      resizeHandle.type = "button";
      resizeHandle.className = "editor-text-resize-handle";
      resizeHandle.title = "缩放文字框";
      resizeHandle.setAttribute("aria-label", "缩放文字框");
      resizeHandle.addEventListener("pointerdown", (event) => startTextResize(event, model.id));

      box.append(content, moveHandle, dragHandle, resizeHandle);
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
    editor.textLayer.querySelectorAll(".editor-bubble-tail-handle").forEach((handle) => {
      const isSelected = editor.selected &&
        editor.selected.kind === "text" &&
        handle.dataset.overlayId === String(editor.selected.id);
      handle.classList.toggle("is-selected", Boolean(isSelected));
    });
  }

  function normalizeEditorTextModel(model, slot) {
    if (!model) return;
    model.type = model.type === "bubble" ? "bubble" : "text";
    if (model.type !== "bubble") return;

    const currentFontSize = getTextFontSize(model);
    const shouldUseReadableDefault = model.customFontSize !== true && currentFontSize < 16;
    model.fontSize = normalizeGlobalTextFontSize(shouldUseReadableDefault ? 18 : currentFontSize, 18);

    const width = slot ? slot.clientWidth : PPT_GRID_WIDTH;
    const height = slot ? slot.clientHeight : PPT_GRID_HEIGHT;
    if (!Number.isFinite(Number(model.tailX)) || !Number.isFinite(Number(model.tailY))) {
      model.tailX = roundCoordinate(Number(model.x || 0) + Number(model.width || 0) * 0.78);
      model.tailY = roundCoordinate(Number(model.y || 0) + Number(model.height || 0) + 20);
    }
    model.tailX = roundCoordinate(clamp(Number(model.tailX) || 0, 0, width));
    model.tailY = roundCoordinate(clamp(Number(model.tailY) || 0, 0, height));
  }

  function buildEditorBubbleShape(model, ratio) {
    return buildBubbleShapeSvg(
      model,
      editor.slot.clientWidth,
      editor.slot.clientHeight,
      "editor-bubble-tail-svg",
      "editor-bubble-shape"
    );
  }

  function buildEditorBubbleTailHandle(model, ratio) {
    const geometry = getBubbleTailGeometry(model, editor.slot.clientWidth, editor.slot.clientHeight);
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "editor-bubble-tail-handle";
    handle.dataset.overlayId = model.id;
    handle.title = "拖动改变气泡箭头方向";
    handle.setAttribute("aria-label", "拖动改变气泡箭头方向");
    handle.style.left = `${geometry.tip.x * ratio}px`;
    handle.style.top = `${geometry.tip.y * ratio}px`;
    handle.addEventListener("pointerdown", (event) => startEditorBubbleTailResize(event, model.id));
    return handle;
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
    ensureArrowControlPoint(model);
    const x1 = model.x1 * ratio;
    const y1 = model.y1 * ratio;
    const controlX = model.controlX * ratio;
    const controlY = model.controlY * ratio;
    const x2 = model.x2 * ratio;
    const y2 = model.y2 * ratio;
    const group = createSvgElement("g", {});
    const curve = createSvgElement("path", {
      d: `M ${roundCoordinate(x1)} ${roundCoordinate(y1)} Q ${roundCoordinate(controlX)} ${roundCoordinate(controlY)} ${roundCoordinate(x2)} ${roundCoordinate(y2)}`
    });
    const head = createSvgElement("polygon", {
      points: getArrowHeadPoints(controlX, controlY, x2, y2, ratio)
    });
    curve.classList.add("annotation-arrow-curve");
    head.classList.add("annotation-arrow-head");
    group.append(curve, head);
    return group;
  }

  function ensureArrowControlPoint(model) {
    if (!model || model.type !== "arrow") return;
    if (Number.isFinite(Number(model.controlX)) && Number.isFinite(Number(model.controlY))) return;
    model.controlX = roundCoordinate((Number(model.x1 || 0) + Number(model.x2 || 0)) / 2);
    model.controlY = roundCoordinate((Number(model.y1 || 0) + Number(model.y2 || 0)) / 2);
  }

  function getArrowHeadPoints(x1, y1, x2, y2, ratio) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const length = Math.max(10, 13 * ratio);
    const width = Math.max(7, 9 * ratio);
    const baseX = x2 - Math.cos(angle) * length;
    const baseY = y2 - Math.sin(angle) * length;
    const perpX = Math.cos(angle + Math.PI / 2) * width / 2;
    const perpY = Math.sin(angle + Math.PI / 2) * width / 2;
    return [
      `${roundCoordinate(x2)},${roundCoordinate(y2)}`,
      `${roundCoordinate(baseX + perpX)},${roundCoordinate(baseY + perpY)}`,
      `${roundCoordinate(baseX - perpX)},${roundCoordinate(baseY - perpY)}`
    ].join(" ");
  }

  function applyAnnotationColor(element, model) {
    const color = getOverlayColor(model);
    element.style.stroke = color;
    element.style.color = color;
    const arrowHead = element.querySelector && element.querySelector(".annotation-arrow-head");
    if (arrowHead) {
      arrowHead.style.fill = color;
      arrowHead.style.stroke = color;
    }
  }

  function applyTextBoxColor(box, model) {
    const color = getOverlayColor(model);
    box.style.setProperty("--overlay-color", color);
    box.style.color = color;
    box.style.borderColor = box.classList && box.classList.contains("is-bubble") ? "transparent" : color;
  }

  function getOverlayColor(model) {
    return normalizeOverlayColor(model && model.color);
  }

  function normalizeOverlayColor(value) {
    const text = String(value || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(text)) {
      return text.toLowerCase();
    }
    if (/^#[0-9a-f]{3}$/i.test(text)) {
      return `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`.toLowerCase();
    }
    return DEFAULT_OVERLAY_COLOR;
  }

  function setModelColor(model, color) {
    if (model) {
      model.color = normalizeOverlayColor(color);
    }
  }

  function buildColorPresetButtons(container, onSelect) {
    if (!container) return;
    container.replaceChildren();
    PRESET_OVERLAY_COLORS.forEach((preset) => {
      const color = normalizeOverlayColor(preset.value);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preset-color-button";
      button.dataset.color = color;
      button.title = preset.name;
      button.setAttribute("aria-label", preset.name);
      button.style.setProperty("--preset-color", color);
      button.addEventListener("click", () => onSelect(color));
      container.appendChild(button);
    });
    updateColorPresetSelection(container, DEFAULT_OVERLAY_COLOR);
  }

  function updateColorPresetSelection(container, color) {
    if (!container) return;
    const normalizedColor = normalizeOverlayColor(color);
    container.querySelectorAll(".preset-color-button").forEach((button) => {
      const active = normalizeOverlayColor(button.dataset.color) === normalizedColor;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function getSelectedEditorModel() {
    if (!editor.slot || !editor.selected) return null;
    const models = editor.selected.kind === "annotation" ? editor.slot._annotationModels : editor.slot._textModels;
    return findOverlayModel(models, editor.selected.id);
  }

  function handleEditorColorChange(color) {
    editor.color = normalizeOverlayColor(color);
    const model = getSelectedEditorModel();
    if (model) {
      setModelColor(model, editor.color);
      markDirty();
      renderSlotOverlays(editor.slot);
      renderEditorOverlays();
    }
  }

  function updateEditorColorInputFromSelection() {
    const model = getSelectedEditorModel();
    const color = getOverlayColor(model || { color: editor.color });
    editor.color = color;
    updateColorPresetSelection(editor.colorPresetList, color);
  }

  function handleEditorFontSizeChange(value) {
    const model = getSelectedEditorModel();
    if (!isSelectedEditorTextModel(model)) {
      updateEditorFontSizeControlFromSelection();
      return;
    }

    const nextFontSize = Number(value);
    if (!Number.isFinite(nextFontSize)) return;

    model.fontSize = normalizeGlobalTextFontSize(nextFontSize, getTextFontSize(model));
    model.customFontSize = true;
    markDirty();
    renderSlotOverlays(editor.slot);
    renderEditorTexts();
    updateEditorFontSizeControlFromSelection();
  }

  function adjustSelectedEditorFontSize(delta) {
    const model = getSelectedEditorModel();
    if (!isSelectedEditorTextModel(model)) return;
    handleEditorFontSizeChange(getTextFontSize(model) + delta);
  }

  function updateEditorFontSizeControlFromSelection() {
    if (!editor.fontSizeInput) return;
    const model = getSelectedEditorModel();
    const enabled = isSelectedEditorTextModel(model);
    editor.fontSizeInput.disabled = !enabled;
    editor.fontSizeInput.value = enabled ? String(normalizeGlobalTextFontSize(getTextFontSize(model), 14)) : "";
    if (editor.fontDecreaseButton) {
      editor.fontDecreaseButton.disabled = !enabled;
    }
    if (editor.fontIncreaseButton) {
      editor.fontIncreaseButton.disabled = !enabled;
    }
  }

  function isSelectedEditorTextModel(model) {
    return Boolean(model && editor.selected && editor.selected.kind === "text");
  }

  function getSelectedGlobalModel() {
    const selected = globalEditor.selected;
    if (!selected) return null;
    const page = getPageById(selected.pageId);
    if (!page) return null;
    const models = selected.kind === "annotation" ? page._globalAnnotationModels : page._globalTextModels;
    return findOverlayModel(models, selected.id);
  }

  function handleGlobalColorChange(color) {
    globalEditor.color = normalizeOverlayColor(color);
    const model = getSelectedGlobalModel();
    if (!model) return;
    setModelColor(model, globalEditor.color);
    const page = getPageById(globalEditor.selected.pageId);
    if (page) {
      markDirty();
      renderGlobalPageOverlays(page);
    }
  }

  function updateGlobalColorInputFromSelection() {
    const model = getSelectedGlobalModel();
    const color = getOverlayColor(model || { color: globalEditor.color });
    globalEditor.color = color;
    updateColorPresetSelection(globalColorPresetList, color);
  }

  function handleGlobalFontSizeChange(value) {
    const model = getSelectedGlobalModel();
    if (!isSelectedGlobalTextModel(model)) {
      updateGlobalFontSizeControlFromSelection();
      return;
    }

    const nextFontSize = Number(value);
    if (!Number.isFinite(nextFontSize)) return;

    model.fontSize = normalizeGlobalTextFontSize(nextFontSize, getTextFontSize(model));
    model.customFontSize = true;
    const page = getPageById(globalEditor.selected.pageId);
    if (page) {
      markDirty();
      renderGlobalPageOverlays(page);
    }
    updateGlobalFontSizeControlFromSelection();
  }

  function adjustSelectedGlobalFontSize(delta) {
    const model = getSelectedGlobalModel();
    if (!isSelectedGlobalTextModel(model)) return;
    handleGlobalFontSizeChange(getTextFontSize(model) + delta);
  }

  function updateGlobalFontSizeControlFromSelection() {
    if (!globalFontSizeInput) return;
    const model = getSelectedGlobalModel();
    const enabled = isSelectedGlobalTextModel(model);
    globalFontSizeInput.disabled = !enabled;
    globalFontSizeInput.value = enabled ? String(normalizeGlobalTextFontSize(getTextFontSize(model), 18)) : "";
    if (globalFontDecreaseButton) {
      globalFontDecreaseButton.disabled = !enabled;
    }
    if (globalFontIncreaseButton) {
      globalFontIncreaseButton.disabled = !enabled;
    }
  }

  function isSelectedGlobalTextModel(model) {
    return Boolean(model && globalEditor.selected && globalEditor.selected.kind === "text");
  }

  function normalizeGlobalTextFontSize(value, fallback) {
    const fontSize = Number(value);
    const defaultSize = Number.isFinite(Number(fallback)) ? Number(fallback) : 18;
    const nextSize = Number.isFinite(fontSize) ? fontSize : defaultSize;
    return roundCoordinate(clamp(nextSize, GLOBAL_TEXT_FONT_MIN, GLOBAL_TEXT_FONT_MAX));
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
    ensureArrowControlPoint(model);
    addSvgHandle(model.id, "start", model.x1, model.y1, "move");
    addSvgHandle(model.id, "control", model.controlX, model.controlY, "grab");
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
    if (editor.colorPresetList) {
      editor.colorPresetList.querySelectorAll(".preset-color-button").forEach((button) => {
        button.disabled = !hasSlot;
      });
    }

    Object.values(editor.buttons).forEach((button) => button.classList.remove("active"));
    if (editor.mode === "crop") {
      editor.buttons.crop.classList.add("active");
    }
    editor.stage.classList.toggle("is-crop-mode", editor.mode === "crop" && canCrop);
    updateEditorColorInputFromSelection();
    updateEditorFontSizeControlFromSelection();
  }

  function handleEditorStagePointerDown(event) {
    if (!editor.isOpen || !editor.slot || event.button !== 0) return;
    if (event.target.closest(".editor-annotation-shape, .editor-resize-handle, .editor-text-box, .editor-bubble-tail-handle")) return;

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
    const minScale = getMinimumImageScale(slot);
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
      if (model.type === "bubble") {
        normalizeEditorTextModel(drag.origin, slot);
        model.tailX = roundCoordinate(clamp(drag.origin.tailX + dx, 0, slot.clientWidth));
        model.tailY = roundCoordinate(clamp(drag.origin.tailY + dy, 0, slot.clientHeight));
      }
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
      model.customFontSize = true;
      if (model.type === "bubble") {
        normalizeEditorTextModel(model, slot);
      }
      renderSlotOverlays(slot);
      renderEditorTexts();
      syncEditorTextSelectionClasses();
      updateEditorFontSizeControlFromSelection();
      return;
    }

    if (drag.type === "bubble-tail") {
      const model = findOverlayModel(slot._textModels, drag.id);
      if (!model || model.type !== "bubble") return;
      const pointer = editorPointToSlot(event);
      model.tailX = roundCoordinate(pointer.x);
      model.tailY = roundCoordinate(pointer.y);
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

  function startEditorBubbleTailResize(event, id) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(editor.slot._textModels, id);
    if (!model || model.type !== "bubble") return;

    normalizeEditorTextModel(model, editor.slot);
    selectEditorItem("text", id);
    editor.drag = {
      type: "bubble-tail",
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

  function addEditorText(type = "text") {
    const slot = editor.slot;
    const width = slot.clientWidth;
    const height = slot.clientHeight;
    const isBubble = type === "bubble";
    const boxWidth = isBubble ? clamp(width * 0.46, 72, width - 12) : clamp(width * 0.36, 48, width - 12);
    const boxHeight = isBubble ? clamp(height * 0.24, 36, height - 12) : clamp(height * 0.16, 24, height - 12);
    const x = roundCoordinate((width - boxWidth) / 2);
    const y = roundCoordinate((height - boxHeight) / 2);
    const model = {
      id: newOverlayId(),
      type: isBubble ? "bubble" : "text",
      x,
      y,
      width: roundCoordinate(boxWidth),
      height: roundCoordinate(boxHeight),
      text: isBubble ? "说明" : "文字",
      fontSize: isBubble ? 18 : 14,
      customFontSize: false,
      tailX: isBubble ? roundCoordinate(clamp(x + boxWidth * 0.78, 0, width)) : undefined,
      tailY: isBubble ? roundCoordinate(clamp(y + boxHeight + 20, 0, height)) : undefined,
      color: editor.color
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
        r: roundCoordinate(radius),
        color: editor.color
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
        height: roundCoordinate(rectHeight),
        color: editor.color
      };
    } else {
      model = {
        id: newOverlayId(),
        type: "arrow",
        x1: roundCoordinate(width * 0.25),
        y1: roundCoordinate(height * 0.65),
        controlX: roundCoordinate(width * 0.5),
        controlY: roundCoordinate(height * 0.5),
        x2: roundCoordinate(width * 0.75),
        y2: roundCoordinate(height * 0.35),
        color: editor.color
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
    updateEditorColorInputFromSelection();
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

    ensureArrowControlPoint(origin);
    const minX = Math.min(origin.x1, origin.x2, origin.controlX);
    const maxX = Math.max(origin.x1, origin.x2, origin.controlX);
    const minY = Math.min(origin.y1, origin.y2, origin.controlY);
    const maxY = Math.max(origin.y1, origin.y2, origin.controlY);
    const clampedDx = clamp(dx, -minX, width - maxX);
    const clampedDy = clamp(dy, -minY, height - maxY);
    model.x1 = roundCoordinate(origin.x1 + clampedDx);
    model.y1 = roundCoordinate(origin.y1 + clampedDy);
    model.controlX = roundCoordinate(origin.controlX + clampedDx);
    model.controlY = roundCoordinate(origin.controlY + clampedDy);
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

    if (handle === "start" || handle === "end") {
      resizeArrowEndpoint(model, origin, pointer, handle);
    } else if (handle === "control") {
      model.controlX = roundCoordinate(pointer.x);
      model.controlY = roundCoordinate(pointer.y);
    }
  }

  function resizeArrowEndpoint(model, origin, pointer, handle) {
    ensureArrowControlPoint(origin);
    const start = handle === "start" ?
      { x: roundCoordinate(pointer.x), y: roundCoordinate(pointer.y) } :
      { x: Number(origin.x1) || 0, y: Number(origin.y1) || 0 };
    const end = handle === "end" ?
      { x: roundCoordinate(pointer.x), y: roundCoordinate(pointer.y) } :
      { x: Number(origin.x2) || 0, y: Number(origin.y2) || 0 };
    const control = getArrowControlForEndpoints(origin, start, end);

    model.x1 = start.x;
    model.y1 = start.y;
    model.x2 = end.x;
    model.y2 = end.y;
    model.controlX = control.x;
    model.controlY = control.y;
  }

  function getArrowControlForEndpoints(origin, start, end) {
    const originalStart = { x: Number(origin.x1) || 0, y: Number(origin.y1) || 0 };
    const originalEnd = { x: Number(origin.x2) || 0, y: Number(origin.y2) || 0 };
    const originalControl = { x: Number(origin.controlX) || 0, y: Number(origin.controlY) || 0 };
    const originalVector = {
      x: originalEnd.x - originalStart.x,
      y: originalEnd.y - originalStart.y
    };
    const originalLength = Math.hypot(originalVector.x, originalVector.y);
    const nextVector = {
      x: end.x - start.x,
      y: end.y - start.y
    };
    const nextLength = Math.hypot(nextVector.x, nextVector.y);

    if (originalLength < 0.01 || nextLength < 0.01) {
      return {
        x: roundCoordinate((start.x + end.x) / 2),
        y: roundCoordinate((start.y + end.y) / 2)
      };
    }

    const originalUnit = {
      x: originalVector.x / originalLength,
      y: originalVector.y / originalLength
    };
    const originalNormal = {
      x: -originalUnit.y,
      y: originalUnit.x
    };
    const controlVector = {
      x: originalControl.x - originalStart.x,
      y: originalControl.y - originalStart.y
    };
    const alongRatio = (
      controlVector.x * originalUnit.x +
      controlVector.y * originalUnit.y
    ) / originalLength;
    const normalOffset = controlVector.x * originalNormal.x + controlVector.y * originalNormal.y;
    const nextUnit = {
      x: nextVector.x / nextLength,
      y: nextVector.y / nextLength
    };
    const nextNormal = {
      x: -nextUnit.y,
      y: nextUnit.x
    };

    return {
      x: roundCoordinate(start.x + nextVector.x * alongRatio + nextNormal.x * normalOffset),
      y: roundCoordinate(start.y + nextVector.y * alongRatio + nextNormal.y * normalOffset)
    };
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
      applyAnnotationColor(shape, model);
      layer.appendChild(shape);
    });

    textLayer.replaceChildren();
    slot._textModels.forEach((model) => {
      normalizeEditorTextModel(model, slot);
      const isBubble = model.type === "bubble";
      if (isBubble) {
        textLayer.appendChild(buildBubbleShapeSvg(
          model,
          slot.clientWidth,
          slot.clientHeight,
          "slot-bubble-tail-svg",
          "slot-bubble-shape"
        ));
      }

      const box = document.createElement("div");
      box.className = `slot-text-box ${isBubble ? "is-bubble" : ""}`.trim();
      box.dataset.overlayId = model.id;
      box.textContent = model.text;
      box.style.left = `${model.x}px`;
      box.style.top = `${model.y}px`;
      box.style.width = `${model.width}px`;
      box.style.height = `${model.height}px`;
      box.style.fontSize = `${getTextFontSize(model)}px`;
      applyTextBoxColor(box, model);
      textLayer.appendChild(box);
    });
  }

  function handleGlobalEditCommand(action) {
    if (action === "delete") {
      deleteSelectedGlobalItem();
      return;
    }

    const page = getCurrentPage();
    if (!page) return;

    if (action === "text" || action === "bubble") {
      addGlobalText(action);
      return;
    }

    if (["circle", "rect", "arrow"].includes(action)) {
      addGlobalAnnotation(action);
    }
  }

  function setGlobalMode(mode) {
    globalEditor.mode = mode;
    updateGlobalEditState();
  }

  function updateGlobalEditState() {
    getPages().forEach((page) => {
      const sheet = getGlobalSheet(page);
      if (sheet) {
        sheet.classList.remove("global-edit-enabled");
      }
    });

    Object.entries(globalEditButtons).forEach(([action, button]) => {
      if (!button) return;
      button.classList.remove("active");
    });
    if (globalEditButtons.delete) {
      globalEditButtons.delete.disabled = !globalEditor.selected;
    }
    updateGlobalFontSizeControlFromSelection();
  }

  function renderGlobalPageOverlays(page) {
    if (!page) return;
    page._globalAnnotationModels = Array.isArray(page._globalAnnotationModels) ? page._globalAnnotationModels : [];
    page._globalTextModels = Array.isArray(page._globalTextModels) ? page._globalTextModels : [];

    const sheet = getGlobalSheet(page);
    const overlay = getGlobalOverlay(page);
    const layer = overlay && overlay.querySelector(".global-annotation-layer");
    const textLayer = overlay && overlay.querySelector(".global-text-layer");
    if (!sheet || !layer || !textLayer) return;

    sheet.classList.remove("global-edit-enabled");
    clearSvgOverlay(layer);
    const markerId = layer.dataset.arrowMarkerId;
    page._globalAnnotationModels.forEach((model) => {
      const shape = createAnnotationElement(model, 1, markerId);
      shape.classList.add("global-annotation-shape");
      shape.dataset.overlayId = model.id;
      applyAnnotationColor(shape, model);
      if (isGlobalSelected(page, "annotation", model.id)) {
        shape.classList.add("is-selected");
      }
      shape.addEventListener("pointerdown", (event) => startGlobalAnnotationMove(event, page, model.id));
      layer.appendChild(shape);
    });

    if (globalEditor.selected && globalEditor.selected.kind === "annotation" && globalEditor.selected.pageId === page.dataset.pageId) {
      const model = findOverlayModel(page._globalAnnotationModels, globalEditor.selected.id);
      if (model) {
        addGlobalAnnotationHandles(page, layer, model);
      }
    }

    renderGlobalTexts(page, textLayer);
    updateGlobalEditState();
  }

  function renderGlobalTexts(page, textLayer) {
    textLayer.replaceChildren();
    page._globalTextModels.forEach((model) => {
      normalizeGlobalTextModel(model);
      if (model.type === "bubble") {
        textLayer.appendChild(buildGlobalBubbleTail(page, model));
      }

      const box = document.createElement("div");
      box.className = `global-text-box ${model.type === "bubble" ? "is-bubble" : ""}`.trim();
      box.dataset.overlayId = model.id;
      box.style.left = `${model.x}px`;
      box.style.top = `${model.y}px`;
      box.style.width = `${model.width}px`;
      box.style.height = `${model.height}px`;
      box.style.fontSize = `${getTextFontSize(model)}px`;
      applyTextBoxColor(box, model);
      if (isGlobalSelected(page, "text", model.id)) {
        box.classList.add("is-selected");
      }
      box.addEventListener("pointerdown", (event) => {
        if (event.target === box) {
          startGlobalTextMove(event, page, model.id);
        }
      });

      const content = document.createElement("div");
      content.className = "global-text-content";
      content.contentEditable = "true";
      content.spellcheck = false;
      content.textContent = model.text || "";
      content.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
        selectGlobalItem(page, "text", model.id);
      });
      content.addEventListener("input", () => {
        model.text = content.textContent || "";
        markDirty();
      });

      const moveHandle = document.createElement("button");
      moveHandle.type = "button";
      moveHandle.className = "global-text-move-handle";
      moveHandle.title = "移动";
      moveHandle.setAttribute("aria-label", "移动");
      moveHandle.addEventListener("pointerdown", (event) => startGlobalTextMove(event, page, model.id));

      const dragHandle = document.createElement("button");
      dragHandle.type = "button";
      dragHandle.className = "global-text-drag-handle";
      dragHandle.title = "按住移动位置";
      dragHandle.setAttribute("aria-label", "按住移动位置");
      dragHandle.addEventListener("pointerdown", (event) => startGlobalTextMove(event, page, model.id));

      const resizeHandle = document.createElement("button");
      resizeHandle.type = "button";
      resizeHandle.className = "global-text-resize-handle";
      resizeHandle.title = "缩放";
      resizeHandle.setAttribute("aria-label", "缩放");
      resizeHandle.addEventListener("pointerdown", (event) => startGlobalTextResize(event, page, model.id));

      box.append(content, moveHandle, dragHandle, resizeHandle);
      textLayer.appendChild(box);
    });
  }

  function normalizeGlobalTextModel(model) {
    if (!model) return;
    if (model.type !== "bubble") return;
    const currentFontSize = getTextFontSize(model);
    const shouldUseReadableDefault = model.customFontSize !== true && currentFontSize < 22;
    model.fontSize = normalizeGlobalTextFontSize(shouldUseReadableDefault ? 24 : currentFontSize, 24);
    if (!Number.isFinite(Number(model.tailX)) || !Number.isFinite(Number(model.tailY))) {
      model.tailX = roundCoordinate(Number(model.x || 0) + Number(model.width || 0) * 0.78);
      model.tailY = roundCoordinate(Number(model.y || 0) + Number(model.height || 0) + 34);
    }
  }

  function buildGlobalBubbleTail(page, model) {
    normalizeGlobalTextModel(model);
    const geometry = getBubbleTailGeometry(model);
    const color = getOverlayColor(model);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("global-bubble-tail-svg");
    svg.style.setProperty("--overlay-color", color);
    svg.setAttribute("viewBox", `0 0 ${PPT_GRID_WIDTH} ${PPT_GRID_HEIGHT}`);
    svg.setAttribute("aria-hidden", "true");

    const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shape.classList.add("global-bubble-shape");
    shape.setAttribute("d", getBubbleShapePath(model, geometry));
    shape.style.fill = "#ffffff";
    shape.style.stroke = color;
    svg.appendChild(shape);

    const fragment = document.createDocumentFragment();
    fragment.append(svg);

    if (isGlobalSelected(page, "text", model.id)) {
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = "global-bubble-tail-handle";
      handle.title = "拖动改变气泡箭头方向";
      handle.setAttribute("aria-label", "拖动改变气泡箭头方向");
      handle.style.left = `${geometry.tip.x}px`;
      handle.style.top = `${geometry.tip.y}px`;
      handle.addEventListener("pointerdown", (event) => startGlobalBubbleTailResize(event, page, model.id));

      fragment.append(handle);
    }

    return fragment;
  }

  function buildBubbleShapeSvg(model, boundsWidth, boundsHeight, svgClassName, shapeClassName) {
    const width = Math.max(1, Number(boundsWidth) || 1);
    const height = Math.max(1, Number(boundsHeight) || 1);
    const geometry = getBubbleTailGeometry(model, width, height);
    const color = getOverlayColor(model);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add(svgClassName);
    svg.style.setProperty("--overlay-color", color);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("aria-hidden", "true");

    const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shape.classList.add(shapeClassName);
    shape.setAttribute("d", getBubbleShapePath(model, geometry));
    shape.style.fill = "#ffffff";
    shape.style.stroke = color;
    svg.appendChild(shape);
    return svg;
  }

  function getBubbleShapePath(model, geometry) {
    const x = Number(model.x) || 0;
    const y = Number(model.y) || 0;
    const width = Math.max(1, Number(model.width) || 1);
    const height = Math.max(1, Number(model.height) || 1);
    const right = x + width;
    const bottom = y + height;
    const radius = roundCoordinate(clamp(Math.min(width, height) * 0.18, 8, 16));
    const p1 = geometry.baseStart;
    const p2 = geometry.baseEnd;
    const tip = geometry.tip;
    const commands = [];
    const moveTo = (px, py) => commands.push(`M ${roundCoordinate(px)} ${roundCoordinate(py)}`);
    const lineTo = (px, py) => commands.push(`L ${roundCoordinate(px)} ${roundCoordinate(py)}`);
    const quadTo = (cx, cy, px, py) => commands.push(`Q ${roundCoordinate(cx)} ${roundCoordinate(cy)} ${roundCoordinate(px)} ${roundCoordinate(py)}`);

    moveTo(x + radius, y);
    if (geometry.baseSide === "top") {
      lineTo(p1.x, y);
      lineTo(tip.x, tip.y);
      lineTo(p2.x, y);
    }
    lineTo(right - radius, y);
    quadTo(right, y, right, y + radius);

    if (geometry.baseSide === "right") {
      lineTo(right, p1.y);
      lineTo(tip.x, tip.y);
      lineTo(right, p2.y);
    }
    lineTo(right, bottom - radius);
    quadTo(right, bottom, right - radius, bottom);

    if (geometry.baseSide === "bottom") {
      lineTo(p2.x, bottom);
      lineTo(tip.x, tip.y);
      lineTo(p1.x, bottom);
    }
    lineTo(x + radius, bottom);
    quadTo(x, bottom, x, bottom - radius);

    if (geometry.baseSide === "left") {
      lineTo(x, p2.y);
      lineTo(tip.x, tip.y);
      lineTo(x, p1.y);
    }
    lineTo(x, y + radius);
    quadTo(x, y, x + radius, y);
    commands.push("Z");
    return commands.join(" ");
  }

  function getBubbleTailGeometry(model, boundsWidth = PPT_GRID_WIDTH, boundsHeight = PPT_GRID_HEIGHT) {
    const x = Number(model.x) || 0;
    const y = Number(model.y) || 0;
    const width = Math.max(1, Number(model.width) || 1);
    const height = Math.max(1, Number(model.height) || 1);
    const maxX = Math.max(1, Number(boundsWidth) || PPT_GRID_WIDTH);
    const maxY = Math.max(1, Number(boundsHeight) || PPT_GRID_HEIGHT);
    const tip = {
      x: clamp(Number(model.tailX) || x + width * 0.78, 0, maxX),
      y: clamp(Number(model.tailY) || y + height + 34, 0, maxY)
    };
    const center = { x: x + width / 2, y: y + height / 2 };
    const dx = tip.x - center.x;
    const dy = tip.y - center.y;
    const useHorizontalSide = Math.abs(dx / width) > Math.abs(dy / height);
    const baseHalf = clamp(Math.min(width, height) * 0.16, 10, 22);
    let p1;
    let p2;
    let baseSide;

    if (useHorizontalSide) {
      const rightSide = dx >= 0;
      const baseX = rightSide ? x + width : x;
      const baseY = clamp(tip.y, y + baseHalf + 4, y + height - baseHalf - 4);
      p1 = { x: baseX, y: baseY - baseHalf };
      p2 = { x: baseX, y: baseY + baseHalf };
      baseSide = rightSide ? "right" : "left";
    } else {
      const bottomSide = dy >= 0;
      const baseY = bottomSide ? y + height : y;
      const baseX = clamp(tip.x, x + baseHalf + 4, x + width - baseHalf - 4);
      p1 = { x: baseX - baseHalf, y: baseY };
      p2 = { x: baseX + baseHalf, y: baseY };
      baseSide = bottomSide ? "bottom" : "top";
    }

    return {
      tip,
      baseCenter: {
        x: roundCoordinate((p1.x + p2.x) / 2),
        y: roundCoordinate((p1.y + p2.y) / 2)
      },
      baseStart: { x: roundCoordinate(p1.x), y: roundCoordinate(p1.y) },
      baseEnd: { x: roundCoordinate(p2.x), y: roundCoordinate(p2.y) },
      baseSide,
      baseOrientation: Math.abs(p1.y - p2.y) < 0.01 ? "horizontal" : "vertical",
      points: [
        { x: roundCoordinate(p1.x), y: roundCoordinate(p1.y) },
        { x: roundCoordinate(p2.x), y: roundCoordinate(p2.y) },
        { x: roundCoordinate(tip.x), y: roundCoordinate(tip.y) }
      ]
    };
  }

  function addGlobalAnnotationHandles(page, layer, model) {
    if (model.type === "circle") {
      addGlobalSvgHandle(page, layer, model.id, "radius", model.cx + model.r, model.cy, "ew-resize");
      return;
    }
    if (model.type === "rect") {
      const left = model.x;
      const right = model.x + model.width;
      const top = model.y;
      const bottom = model.y + model.height;
      addGlobalSvgHandle(page, layer, model.id, "nw", left, top, "nwse-resize");
      addGlobalSvgHandle(page, layer, model.id, "ne", right, top, "nesw-resize");
      addGlobalSvgHandle(page, layer, model.id, "sw", left, bottom, "nesw-resize");
      addGlobalSvgHandle(page, layer, model.id, "se", right, bottom, "nwse-resize");
      return;
    }
    ensureArrowControlPoint(model);
    addGlobalSvgHandle(page, layer, model.id, "start", model.x1, model.y1, "move");
    addGlobalSvgHandle(page, layer, model.id, "control", model.controlX, model.controlY, "grab");
    addGlobalSvgHandle(page, layer, model.id, "end", model.x2, model.y2, "move");
  }

  function addGlobalSvgHandle(page, layer, id, handle, x, y, cursor) {
    const circle = createSvgElement("circle", {
      cx: x,
      cy: y,
      r: 7
    });
    circle.classList.add("global-resize-handle");
    circle.dataset.overlayId = id;
    circle.dataset.handle = handle;
    circle.style.cursor = cursor;
    circle.addEventListener("pointerdown", (event) => startGlobalAnnotationResize(event, page, id, handle));
    layer.appendChild(circle);
  }

  function addGlobalText(type) {
    const page = getCurrentPage();
    const sheet = getGlobalSheet(page);
    if (!page || !sheet) return;

    const sheetWidth = sheet.clientWidth;
    const sheetHeight = sheet.clientHeight;
    const isBubble = type === "bubble";
    const boxWidth = isBubble ? 260 : 220;
    const boxHeight = isBubble ? 88 : 70;
    const model = {
      id: newOverlayId(),
      type: isBubble ? "bubble" : "text",
      x: roundCoordinate((sheetWidth - boxWidth) / 2),
      y: roundCoordinate((sheetHeight - boxHeight) / 2),
      width: boxWidth,
      height: boxHeight,
      text: isBubble ? "说明" : "文字",
      fontSize: isBubble ? 24 : 18,
      customFontSize: false,
      tailX: isBubble ? roundCoordinate((sheetWidth - boxWidth) / 2 + boxWidth * 0.78) : undefined,
      tailY: isBubble ? roundCoordinate((sheetHeight - boxHeight) / 2 + boxHeight + 34) : undefined,
      color: globalEditor.color
    };

    page._globalTextModels.push(model);
    setGlobalMode("select");
    selectGlobalItem(page, "text", model.id);
    markDirty();

    requestAnimationFrame(() => {
      const content = page.querySelector(`.global-text-box[data-overlay-id="${cssEscape(model.id)}"] .global-text-content`);
      if (content) {
        content.focus({ preventScroll: true });
        selectTextContent(content);
      }
    });
  }

  function addGlobalAnnotation(type) {
    const page = getCurrentPage();
    const sheet = getGlobalSheet(page);
    if (!page || !sheet) return;

    const width = sheet.clientWidth;
    const height = sheet.clientHeight;
    let model;

    if (type === "circle") {
      model = {
        id: newOverlayId(),
        type,
        cx: roundCoordinate(width / 2),
        cy: roundCoordinate(height / 2),
        r: 76,
        color: globalEditor.color
      };
    } else if (type === "rect") {
      const rectWidth = 300;
      const rectHeight = 130;
      model = {
        id: newOverlayId(),
        type,
        x: roundCoordinate((width - rectWidth) / 2),
        y: roundCoordinate((height - rectHeight) / 2),
        width: rectWidth,
        height: rectHeight,
        color: globalEditor.color
      };
    } else {
      model = {
        id: newOverlayId(),
        type: "arrow",
        x1: roundCoordinate(width * 0.42),
        y1: roundCoordinate(height * 0.6),
        controlX: roundCoordinate(width * 0.5),
        controlY: roundCoordinate(height * 0.51),
        x2: roundCoordinate(width * 0.58),
        y2: roundCoordinate(height * 0.42),
        color: globalEditor.color
      };
    }

    page._globalAnnotationModels.push(model);
    setGlobalMode("select");
    selectGlobalItem(page, "annotation", model.id);
    markDirty();
  }

  function handleGlobalOverlayPointerDown(event, page) {
    if (event.button !== 0) return;
    if (event.target.closest(".global-annotation-shape, .global-resize-handle, .global-text-box, .global-bubble-tail-handle")) return;
    event.preventDefault();
    clearGlobalSelection();
  }

  function handleGlobalBlankPointerDown(event) {
    if (event.button !== 0) return;
    if (!globalEditor.selected && !globalEditor.drag) return;
    if (globalEditor.drag) return;
    const target = event.target;
    if (!target || !target.closest) return;
    if (target.closest(".global-edit-toolbar, .global-annotation-shape, .global-resize-handle, .global-text-box, .global-bubble-tail-handle, .image-editor-overlay")) return;

    clearGlobalSelection();
  }

  function startGlobalAnnotationMove(event, page, id) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(page._globalAnnotationModels, id);
    if (!model) return;
    selectGlobalItem(page, "annotation", id);
    beginGlobalDrag(event, page, {
      type: "annotation-move",
      id,
      origin: cloneModel(model)
    });
  }

  function startGlobalAnnotationResize(event, page, id, handle) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(page._globalAnnotationModels, id);
    if (!model) return;
    selectGlobalItem(page, "annotation", id);
    beginGlobalDrag(event, page, {
      type: "annotation-resize",
      id,
      handle,
      origin: cloneModel(model)
    });
  }

  function startGlobalTextMove(event, page, id) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(page._globalTextModels, id);
    if (!model) return;
    selectGlobalItem(page, "text", id);
    beginGlobalDrag(event, page, {
      type: "text-move",
      id,
      origin: cloneModel(model)
    });
  }

  function startGlobalTextResize(event, page, id) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(page._globalTextModels, id);
    if (!model) return;
    selectGlobalItem(page, "text", id);
    beginGlobalDrag(event, page, {
      type: "text-resize",
      id,
      origin: cloneModel(model)
    });
  }

  function startGlobalBubbleTailResize(event, page, id) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const model = findOverlayModel(page._globalTextModels, id);
    if (!model || model.type !== "bubble") return;
    normalizeGlobalTextModel(model);
    selectGlobalItem(page, "text", id);
    beginGlobalDrag(event, page, {
      type: "bubble-tail",
      id,
      origin: cloneModel(model)
    });
  }

  function beginGlobalDrag(event, page, drag) {
    const overlay = getGlobalOverlay(page);
    globalEditor.drag = {
      ...drag,
      pageId: page.dataset.pageId,
      startPoint: globalPointToSheet(event, page)
    };
    if (overlay && overlay.setPointerCapture) {
      overlay.setPointerCapture(event.pointerId);
    }
  }

  function handleGlobalPointerMove(event) {
    const drag = globalEditor.drag;
    if (!drag) return;

    const page = getPageById(drag.pageId);
    const sheet = getGlobalSheet(page);
    if (!page || !sheet) return;

    const pointer = globalPointToSheet(event, page);
    const dx = pointer.x - drag.startPoint.x;
    const dy = pointer.y - drag.startPoint.y;

    if (drag.type === "annotation-move") {
      const model = findOverlayModel(page._globalAnnotationModels, drag.id);
      if (!model) return;
      moveAnnotationModel(sheet, model, drag.origin, dx, dy);
      renderGlobalPageOverlays(page);
      return;
    }

    if (drag.type === "annotation-resize") {
      const model = findOverlayModel(page._globalAnnotationModels, drag.id);
      if (!model) return;
      resizeAnnotationModel(sheet, model, drag.origin, pointer, drag.handle);
      renderGlobalPageOverlays(page);
      return;
    }

    if (drag.type === "text-move") {
      const model = findOverlayModel(page._globalTextModels, drag.id);
      if (!model) return;
      model.x = roundCoordinate(clamp(drag.origin.x + dx, 0, sheet.clientWidth - drag.origin.width));
      model.y = roundCoordinate(clamp(drag.origin.y + dy, 0, sheet.clientHeight - drag.origin.height));
      if (model.type === "bubble") {
        normalizeGlobalTextModel(drag.origin);
        model.tailX = roundCoordinate(clamp(drag.origin.tailX + dx, 0, sheet.clientWidth));
        model.tailY = roundCoordinate(clamp(drag.origin.tailY + dy, 0, sheet.clientHeight));
      }
      renderGlobalPageOverlays(page);
      return;
    }

    if (drag.type === "text-resize") {
      const model = findOverlayModel(page._globalTextModels, drag.id);
      if (!model) return;
      model.width = roundCoordinate(clamp(pointer.x - drag.origin.x, 36, sheet.clientWidth - drag.origin.x));
      model.height = roundCoordinate(clamp(pointer.y - drag.origin.y, 24, sheet.clientHeight - drag.origin.y));
      const widthScale = model.width / Math.max(1, drag.origin.width);
      const heightScale = model.height / Math.max(1, drag.origin.height);
      const fontScale = Math.min(widthScale, heightScale);
      const maxFontSize = Math.max(7, Math.min(96, model.height - 8));
      const minFontSize = GLOBAL_TEXT_FONT_MIN;
      model.fontSize = roundCoordinate(clamp(getTextFontSize(drag.origin) * fontScale, minFontSize, maxFontSize));
      model.customFontSize = true;
      if (model.type === "bubble") {
        normalizeGlobalTextModel(model);
      }
      renderGlobalPageOverlays(page);
      return;
    }

    if (drag.type === "bubble-tail") {
      const model = findOverlayModel(page._globalTextModels, drag.id);
      if (!model || model.type !== "bubble") return;
      model.tailX = roundCoordinate(pointer.x);
      model.tailY = roundCoordinate(pointer.y);
      renderGlobalPageOverlays(page);
    }
  }

  function endGlobalDrag(event) {
    if (!globalEditor.drag) return;
    const page = getPageById(globalEditor.drag.pageId);
    const overlay = getGlobalOverlay(page);
    if (overlay && overlay.hasPointerCapture && overlay.hasPointerCapture(event.pointerId)) {
      overlay.releasePointerCapture(event.pointerId);
    }
    globalEditor.drag = null;
    markDirty();
  }

  function selectGlobalItem(page, kind, id) {
    const previousPage = globalEditor.selected ? getPageById(globalEditor.selected.pageId) : null;
    globalEditor.selected = { pageId: page.dataset.pageId, kind, id };
    if (previousPage && previousPage !== page) {
      renderGlobalPageOverlays(previousPage);
    }
    renderGlobalPageOverlays(page);
    updateGlobalColorInputFromSelection();
    updateGlobalFontSizeControlFromSelection();
    updateGlobalEditState();
  }

  function clearGlobalSelection() {
    if (!globalEditor.selected) return;
    const page = getPageById(globalEditor.selected.pageId);
    globalEditor.selected = null;
    if (page) {
      renderGlobalPageOverlays(page);
    }
    updateGlobalColorInputFromSelection();
    updateGlobalFontSizeControlFromSelection();
    updateGlobalEditState();
  }

  function deleteSelectedGlobalItem() {
    const selected = globalEditor.selected;
    if (!selected) return;
    const page = getPageById(selected.pageId);
    if (!page) {
      globalEditor.selected = null;
      updateGlobalEditState();
      return;
    }

    if (selected.kind === "annotation") {
      page._globalAnnotationModels = page._globalAnnotationModels.filter((model) => model.id !== selected.id);
    } else {
      page._globalTextModels = page._globalTextModels.filter((model) => model.id !== selected.id);
    }
    globalEditor.selected = null;
    markDirty();
    renderGlobalPageOverlays(page);
    updateGlobalColorInputFromSelection();
    updateGlobalFontSizeControlFromSelection();
    updateGlobalEditState();
  }

  function globalPointToSheet(event, page) {
    const sheet = getGlobalSheet(page);
    if (!sheet) return { x: 0, y: 0 };
    const rect = sheet.getBoundingClientRect();
    const scaleX = sheet.clientWidth / Math.max(1, rect.width);
    const scaleY = sheet.clientHeight / Math.max(1, rect.height);
    return {
      x: roundCoordinate(clamp((event.clientX - rect.left) * scaleX, 0, sheet.clientWidth)),
      y: roundCoordinate(clamp((event.clientY - rect.top) * scaleY, 0, sheet.clientHeight))
    };
  }

  function isGlobalSelected(page, kind, id) {
    return Boolean(globalEditor.selected &&
      globalEditor.selected.pageId === page.dataset.pageId &&
      globalEditor.selected.kind === kind &&
      globalEditor.selected.id === id);
  }

  function getCurrentPage() {
    const pages = getPages();
    return pages.find((page) => page.dataset.pageId === currentPageId) || pages[0] || null;
  }

  function getPageById(pageId) {
    if (!pageId) return null;
    return getPages().find((page) => page.dataset.pageId === String(pageId)) || null;
  }

  function getGlobalSheet(page) {
    return page ? page.querySelector(".sop-sheet") : null;
  }

  function getGlobalOverlay(page) {
    return page ? page.querySelector(".global-overlay") : null;
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

  async function loadImageFile(slot, file, options = {}) {
    if (!file) return;
    const extension = getFileExtension(file.name);
    const isImage = file.type.startsWith("image/") || isDisplayableImageExtension(extension);
    if (!isImage) {
      if (isLogoSlot(slot) && isLogoSourceExtension(extension)) {
        loadLogoSourceFile(slot, file, extension);
      }
      return;
    }

    await loadImageBlob(slot, file, {
      source: options.source || "file",
      fileName: file.name || ""
    });
  }

  async function loadImageSource(slot, src, options = {}) {
    if (!slot || !src) return;
    const blob = await imageSourceToBlob(src);
    await loadImageBlob(slot, blob, {
      source: options.source || "file",
      fileName: options.fileName || "",
      keepOverlays: Boolean(options.keepOverlays)
    });
  }

  async function loadImageBlob(slot, blob, options = {}) {
    if (!slot || !blob) return;
    clearObjectUrl(slot);
    if (!options.keepOverlays) {
      clearSlotOverlays(slot);
    }
    slot._sourceInfo = null;
    const img = slot.querySelector("img");
    if (!img) return;
    const asset = await createImageAssetFromBlob(projectState.documentId, blob, options.source || "file", {
      fileName: options.fileName || ""
    });
    const objectUrl = await createObjectUrlForAsset(asset.id);
    slot._imageState.objectUrl = objectUrl;
    slot.dataset.assetId = asset.id;
    slot.dataset.mediaKind = "image";
    slot.classList.remove("is-missing-asset");
    img.src = objectUrl;
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
    slot.dataset.assetId = "";
    slot.dataset.hasImage = "false";
    slot.dataset.mediaKind = "empty";
    slot.classList.remove("is-missing-asset");
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
    state.scale = getMinimumImageScale(slot);
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

  function getContainScale(slot) {
    const state = slot._imageState;
    if (!state.naturalWidth || !state.naturalHeight) return 1;
    return Math.min(slot.clientWidth / state.naturalWidth, slot.clientHeight / state.naturalHeight);
  }

  function getMinimumImageScale(slot) {
    return shouldContainImageSlot(slot) ? getContainScale(slot) : getCoverScale(slot);
  }

  function shouldContainImageSlot(slot) {
    return Boolean(slot && slot.dataset.fit === "contain");
  }

  function shouldResetSavedImagePlacement(slot, savedSlot) {
    return shouldContainImageSlot(slot) && savedSlot && savedSlot.fit !== "contain";
  }

  function clampImage(slot) {
    const state = slot._imageState;
    if (!state.naturalWidth || !state.naturalHeight || isLogoSlot(slot)) return;

    const minScale = getMinimumImageScale(slot);
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

  async function handleDocumentFileDrop(event) {
    if (!isFileDragEvent(event)) return;
    event.preventDefault();

    const slot = getImageSlotFromElement(event.target);
    clearAllImageSlotDragStates();
    if (!slot) return;

    event.stopPropagation();
    const file = getFirstSupportedDroppedFile(slot, event.dataTransfer);
    if (!file) return;

    activateImageSlot(slot);
    try {
      await loadImageFile(slot, file);
    } catch (error) {
      showFileError("拖入图片失败", error);
    }
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
    const isImage = ALLOWED_ASSET_IMAGE_MIMES.has(normalizeAssetMime(file.type || getImageMimeType(file.name || "")));
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

  async function handleDocumentPaste(event) {
    const clipboard = event.clipboardData;
    if (!clipboard) return;

    const imageItem = getPreferredClipboardImageItem(clipboard);
    if (!imageItem) return;

    const slot = editor.isOpen ? editor.slot : getPasteTarget(event.target);
    if (!slot) return;

    const file = imageItem.getAsFile();
    if (!file) return;

    event.preventDefault();
    activateImageSlot(slot);
    try {
      await loadImageFile(slot, file, { source: "clipboard" });
    } catch (error) {
      showFileError("粘贴图片失败", error);
    }
  }

  function getPreferredClipboardImageItem(clipboard) {
    const items = Array.from(clipboard && clipboard.items || []).filter((item) => {
      return item.kind === "file" && ALLOWED_ASSET_IMAGE_MIMES.has(normalizeAssetMime(item.type));
    });
    if (!items.length) return null;
    const priority = ["image/png", "image/webp", "image/jpeg"];
    return items.sort((a, b) => {
      return priority.indexOf(normalizeAssetMime(a.type)) - priority.indexOf(normalizeAssetMime(b.type));
    })[0];
  }

  async function handleDocumentKeyDown(event) {
    const activeElement = document.activeElement;
    const isTyping = activeElement &&
      (activeElement.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName));

    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && !isTyping && !editor.isOpen) {
      const key = String(event.key || "").toLowerCase();
      if (key === "c" && copySelectedStepCard()) {
        event.preventDefault();
        return;
      }
      if (key === "c" && copySelectedMaterialCard()) {
        event.preventDefault();
        return;
      }
      if (key === "v" && stepCardClipboard && getSelectedStepCard()) {
        event.preventDefault();
        try {
          await pasteStepCardToSelection();
        } catch (error) {
          showFileError("粘贴步骤卡片失败", error);
        }
        return;
      }
      if (key === "v" && materialCardClipboard && getSelectedMaterialCard()) {
        event.preventDefault();
        try {
          await pasteMaterialCardToSelection();
        } catch (error) {
          showFileError("粘贴物料卡片失败", error);
        }
        return;
      }
    }

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

    if (["Delete", "Backspace"].includes(event.key) && globalEditor.selected && !isTyping) {
      event.preventDefault();
      deleteSelectedGlobalItem();
      return;
    }

    if (["Delete", "Backspace"].includes(event.key) && selectedStepCard && !isTyping && !editor.isOpen) {
      const selected = getSelectedStepCard();
      if (selected && isFreeStepPage(selected.page)) {
        event.preventDefault();
        try {
          await deleteFreeStepCard(selected.page, selected.index);
        } catch (error) {
          showFileError("删除步骤卡片失败", error);
        }
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

  function initializeProjectState(fileName = "未命名.sopzip", fileHandle = null, options = {}) {
    projectState.documentId = options.documentId || createId("doc");
    projectState.fileName = fileName;
    projectState.fileHandle = fileHandle;
    projectState.dirty = false;
    projectState.currentVersion = 0;
    projectState.lastVersion = 0;
    projectState.folderId = options.folderId || DEFAULT_FOLDER_ID;
    projectState.libraryFileId = options.libraryFileId || "";
    projectState.libraryFileHandle = options.libraryFileHandle || null;
    projectState.globalInfo = normalizeGlobalInfo(options.globalInfo);
    projectState.assets = normalizeAssetRecords(options.assets || {});
    projectState.history = [];
    updateGlobalInfoControls(projectState.globalInfo);
    createVersionSnapshot("初始版本", { keepClean: true });
    updateGlobalInfoControls(projectState.globalInfo);
    markClean();
  }

  function handleDocumentInput(event) {
    const editableValue = event.target.closest && event.target.closest(".editable-cell-value[contenteditable='true']");
    const editableCell = editableValue ?
      editableValue.closest(".text-cell[data-editable-cell='true']") :
      event.target.closest && event.target.closest(".sop-cell[contenteditable='true']");
    const editorText = event.target.closest && event.target.closest(".editor-text-content");
    if (editableCell || editorText) {
      markDirty();
    }
    if (editableCell && ["number", "name"].includes(editableCell.dataset.materialField)) {
      activeMaterialSearchCell = editableCell;
      if (materialSearch.popover && !materialSearch.popover.hidden) {
        const field = getMaterialSearchField(editableCell);
        materialSearch.input.value = getMaterialFieldValue(editableCell, field);
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
    projectState.globalInfo = normalizeGlobalInfo({});
    updateGlobalInfoControls(projectState.globalInfo);
    addPage();
    isApplyingProject = false;
    initializeProjectState("未命名.sopzip", null, { folderId: getLibraryFolderForNewSop() });
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
                "application/zip": [".sopzip"],
                "application/json": [".sop.json", ".json"]
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
    const project = await loadProjectDocumentFromFile(file);
    validateProjectFile(project);
    await applyProject(project, file.name || "未命名.sopzip", isSopPackageFileName(file.name) ? fileHandle : null);
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
                "application/zip": [".sopzip"]
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

      await downloadProjectFile(project, suggestedName);
      markClean();
      await saveCurrentProjectToLibrary({ silent: true, skipVersion: true });
    } catch (error) {
      if (error && error.name === "AbortError") return;
      showFileError("另存为失败", error);
    }
  }

  async function writeProjectToHandle(handle, project) {
    const blob = await createSopPackageBlob(project);
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }

  async function downloadProjectFile(project, fileName) {
    const blob = await createSopPackageBlob(project);
    downloadBlob(blob, fileName);
  }

  function downloadBlob(blob, fileName) {
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
      globalInfo: normalizeGlobalInfo(projectState.globalInfo),
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
    projectState.globalInfo = normalizeGlobalInfo(snapshot.globalInfo);
    await applyPages(snapshot.pages);
    projectState.currentVersion = snapshot.version;
    projectState.dirty = true;
    updateGlobalInfoControls(projectState.globalInfo);
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
        lastVersion: projectState.lastVersion,
        globalInfo: normalizeGlobalInfo(projectState.globalInfo)
      },
      assets: normalizeAssetRecords(projectState.assets),
      pages: serializePages(),
      history: options.includeHistory ? cloneHistory(projectState.history) : []
    };
  }

  function serializePages() {
    return getPages().map((page) => {
      if (isFreeStepPage(page)) {
        syncFreeStepCardsFromDom(page);
      }
      const pageData = {
        pageNumber: Number(page.dataset.pageNumber) || 0,
        stepTemplateCount: getPageStepTemplateCount(page),
        textCells: getEditableTextCells(page).map(serializeTextCell),
        imageSlots: Array.from(page.querySelectorAll(".image-cell")).map(serializeImageSlot),
        globalAnnotations: (page._globalAnnotationModels || []).map(cloneModel),
        globalTexts: (page._globalTextModels || []).map(cloneModel)
      };
      if (isFreeStepPage(page)) {
        pageData.stepCards = serializeFreeStepCards(page);
      }
      return pageData;
    });
  }

  function serializeFreeStepCards(page) {
    return getFreeStepCards(page).map((card) => ({
      id: card.id,
      size: normalizeFreeStepCardSize(card.size),
      imageSlot: card.imageSlot ? structuredCloneSafe(card.imageSlot) : null,
      descCell: card.descCell ? structuredCloneSafe(card.descCell) : null,
      noteCell: card.noteCell ? structuredCloneSafe(card.noteCell) : null
    }));
  }

  function serializeTextCell(cell) {
    const values = getTextCellFieldValues(cell);
    const entry = {
      key: cell.dataset.cellKey || "",
      text: getTextCellPersistedText(cell)
    };
    if (values) {
      entry.values = values;
    }
    return entry;
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
      assetId: slot.dataset.assetId || null,
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

    projectState.globalInfo = normalizeGlobalInfo(project.document && project.document.globalInfo);
    projectState.assets = normalizeAssetRecords(project.assets || {});
    await applyPages(project.pages || []);
    projectState.documentId = project.document && project.document.id ? project.document.id : createId("doc");
    projectState.fileName = fileName || (project.document && project.document.fileName) || "未命名.sopzip";
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
    updateGlobalInfoControls(projectState.globalInfo);
    markClean();
  }

  async function applyPages(pagesData) {
    isApplyingProject = true;
    try {
      pagesEl.replaceChildren();
      resetRuntimeCounters();

      const safePages = Array.isArray(pagesData) && pagesData.length ? pagesData : [{}];
      for (const pageData of safePages) {
        const page = buildPage(nextPageId++, {
          stepTemplateCount: getPageDataStepTemplateCount(pageData),
          stepCards: pageData && pageData.stepCards
        });
        pagesEl.appendChild(page);
        await applyPageData(page, pageData);
      }

      syncOverlayCounterFromPages();
      updatePageNumbers();
      const firstPage = getPages()[0];
      if (firstPage) {
        setCurrentPage(firstPage.dataset.pageId);
      }
      updateGlobalEditState();
    } finally {
      isApplyingProject = false;
    }
  }

  async function applyPageData(page, pageData) {
    page._globalAnnotationModels = (pageData.globalAnnotations || []).map(cloneModel);
    page._globalTextModels = (pageData.globalTexts || []).map(cloneModel);

    const textByKey = new Map((pageData.textCells || []).map((cell) => [cell.key, cell]));
    const textCells = getEditableTextCells(page);
    textCells.forEach((cell, index) => {
      const savedCell = textByKey.get(cell.dataset.cellKey) || (pageData.textCells || [])[index];
      if (savedCell) {
        applySavedTextCell(cell, savedCell);
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

    if (isFreeStepPage(page) && Array.isArray(pageData.stepCards)) {
      page._stepCards = normalizeFreeStepCards(pageData.stepCards);
      await applyFreeStepCardModels(page);
    }

    renderGlobalPageOverlays(page);
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

    if (savedSlot.assetId) {
      await applyAssetImageToSlot(slot, savedSlot);
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

    if (!savedSlot.imageState || shouldResetSavedImagePlacement(slot, savedSlot)) {
      resetImageCover(slot);
    } else {
      clampImage(slot);
      renderSlotImage(slot);
    }
    renderSlotOverlays(slot);
  }

  async function applyAssetImageToSlot(slot, savedSlot) {
    const assetId = savedSlot.assetId;
    const img = slot.querySelector("img");
    const savedState = savedSlot.imageState || {};
    slot.dataset.assetId = assetId || "";

    const blob = await getAssetBlob(assetId);
    if (!blob || !img) {
      Object.assign(slot._imageState, {
        naturalWidth: savedState.naturalWidth || 0,
        naturalHeight: savedState.naturalHeight || 0,
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
      slot.dataset.mediaKind = "missing";
      slot.classList.add("is-missing-asset");
      renderSlotOverlays(slot);
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    slot._imageState.objectUrl = objectUrl;
    img.src = objectUrl;
    await waitImageReady(img);
    await nextFrame();
    await nextFrame();

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
      objectUrl
    });
    slot.dataset.hasImage = "true";
    slot.dataset.mediaKind = "image";
    slot.classList.remove("is-missing-asset");

    if (!savedSlot.imageState || shouldResetSavedImagePlacement(slot, savedSlot)) {
      resetImageCover(slot);
    } else {
      clampImage(slot);
      renderSlotImage(slot);
    }
    renderSlotOverlays(slot);
  }

  function validateProjectFile(project) {
    if (!project || project.fileType !== SOP_FILE_TYPE) {
      throw new Error("这不是可编辑的 SOP 项目文件。请打开通过“保存SOP/另存为”导出的 .sopzip 项目包。");
    }
    if (Number(project.schemaVersion) > SOP_SCHEMA_VERSION) {
      throw new Error("这个 SOP 文件来自更新版本的编辑器，当前版本无法安全打开。");
    }
    if (!Array.isArray(project.pages)) {
      throw new Error("SOP 文件缺少页面数据。");
    }
  }

  function waitImageReady(img) {
    if (!img) {
      return Promise.reject(new Error("图片元素不存在"));
    }
    if (img.complete && img.naturalWidth) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      let finished = false;
      let poll = 0;
      let timeout = 0;
      const cleanup = () => {
        img.removeEventListener("load", checkReady);
        img.removeEventListener("error", handleError);
        window.clearTimeout(timeout);
        window.clearInterval(poll);
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        cleanup();
        resolve();
      };
      const fail = (error) => {
        if (finished) return;
        finished = true;
        cleanup();
        reject(error);
      };
      const checkReady = () => {
        if (img.complete && img.naturalWidth) {
          finish();
        }
      };
      const handleError = () => {
        fail(new Error("图片数据无法加载"));
      };
      timeout = window.setTimeout(() => {
        checkReady();
        if (!finished) {
          fail(new Error("图片加载超时"));
        }
      }, 5000);
      poll = window.setInterval(checkReady, 50);
      img.addEventListener("load", checkReady);
      img.addEventListener("error", handleError);
      checkReady();
    });
  }

  function nextFrame() {
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        resolve();
      };
      const timer = window.setTimeout(finish, 80);
      window.requestAnimationFrame(finish);
    });
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

  function normalizeAssetRecords(records) {
    const source = records && typeof records === "object" ? records : {};
    return Object.fromEntries(Object.entries(source).map(([key, record]) => {
      const id = record && record.id ? String(record.id) : String(key || "");
      if (!id) return null;
      const mime = normalizeAssetMime(record.mime) || "image/png";
      const hash = String(record.hash || id.replace(/^asset_/, ""));
      const prefix = hash.slice(0, 12) || id.replace(/^asset_/, "") || Date.now().toString(16);
      return [id, {
        id,
        kind: "image",
        mime,
        path: normalizePackageAssetPath(record.path || `assets/img_${prefix}${getImageAssetExtension(mime)}`),
        thumbnailPath: normalizePackageAssetPath(record.thumbnailPath || `thumbnails/thumb_${prefix}.webp`),
        width: Number(record.width) || 0,
        height: Number(record.height) || 0,
        byteSize: Number(record.byteSize) || 0,
        hash,
        source: record.source === "clipboard" ? "clipboard" : "file",
        createdAt: record.createdAt || new Date().toISOString()
      }];
    }).filter(Boolean));
  }

  function normalizeAssetMime(mime) {
    const value = String(mime || "").toLowerCase();
    if (value === "image/jpg") return "image/jpeg";
    return ALLOWED_ASSET_IMAGE_MIMES.has(value) ? value : "";
  }

  async function createImageAssetFromBlob(projectId, blob, source, options = {}) {
    if (!blob) throw new Error("图片数据为空。");
    const mime = normalizeAssetMime(blob.type || getImageMimeType(options.fileName || ""));
    if (!ALLOWED_ASSET_IMAGE_MIMES.has(mime)) {
      throw new Error("当前项目包只支持 PNG、JPG、WebP 图片资源。");
    }
    if (blob.size > MAX_IMAGE_ASSET_BYTES) {
      throw new Error("单张图片超过 10 MB，请压缩后重新插入。");
    }
    if (!projectState.documentId) {
      projectState.documentId = projectId || createId("doc");
    }

    const normalizedBlob = blob.type === mime ? blob : new Blob([blob], { type: mime });
    const hash = await hashBlob(normalizedBlob);
    const existing = findAssetByHash(hash);
    if (existing) {
      await storeAssetBlob(existing, normalizedBlob, await getAssetThumbnailBlob(existing.id));
      return existing;
    }

    const prefix = getUniqueAssetHashPrefix(hash);
    const id = `asset_${prefix}`;
    const dimensions = await getBlobImageSize(normalizedBlob);
    const thumbnailBlob = await createThumbnailBlob(normalizedBlob).catch(() => null);
    const record = {
      id,
      kind: "image",
      mime,
      path: `assets/img_${prefix}${getImageAssetExtension(mime)}`,
      thumbnailPath: `thumbnails/thumb_${prefix}.webp`,
      width: dimensions.width,
      height: dimensions.height,
      byteSize: normalizedBlob.size,
      hash,
      source: source === "clipboard" ? "clipboard" : "file",
      createdAt: new Date().toISOString()
    };

    projectState.assets = normalizeAssetRecords({
      ...projectState.assets,
      [id]: record
    });
    await storeAssetBlob(record, normalizedBlob, thumbnailBlob);
    return projectState.assets[id];
  }

  function findAssetByHash(hash) {
    return Object.values(projectState.assets || {}).find((record) => record.hash === hash) || null;
  }

  function getUniqueAssetHashPrefix(hash) {
    for (let length = 12; length <= Math.min(32, hash.length); length += 4) {
      const prefix = hash.slice(0, length);
      if (!projectState.assets[`asset_${prefix}`]) return prefix;
    }
    return `${hash.slice(0, 12)}_${Date.now().toString(16)}`;
  }

  async function hashBlob(blob) {
    const buffer = await blob.arrayBuffer();
    const digest = await window.crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function getBlobImageSize(blob) {
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.decoding = "async";
      const loaded = new Promise((resolve, reject) => {
        img.onload = () => resolve({
          width: img.naturalWidth || 0,
          height: img.naturalHeight || 0
        });
        img.onerror = () => reject(new Error("图片读取失败，请重新复制后粘贴。"));
      });
      img.src = url;
      return await loaded;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function createThumbnailBlob(blob) {
    const image = await loadImageElementFromBlob(blob);
    const maxSize = 360;
    const ratio = Math.min(1, maxSize / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
    const width = Math.max(1, Math.round((image.naturalWidth || 1) * ratio));
    const height = Math.max(1, Math.round((image.naturalHeight || 1) * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height);
    return new Promise((resolve) => {
      canvas.toBlob((result) => resolve(result || blob), "image/webp", 0.82);
    });
  }

  function loadImageElementFromBlob(blob) {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.decoding = "async";
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        URL.revokeObjectURL(url);
        img.onload = null;
        img.onerror = null;
      };
      img.onload = () => {
        cleanup();
        resolve(img);
      };
      img.onerror = () => {
        cleanup();
        reject(new Error("图片读取失败，请重新复制后粘贴。"));
      };
      img.src = url;
    });
  }

  async function imageSourceToBlob(src) {
    const value = String(src || "");
    if (/^data:image\//i.test(value)) {
      return dataUrlToBlob(value);
    }
    const response = await fetch(value);
    if (!response.ok) {
      throw new Error("图片读取失败，请重新复制后粘贴。");
    }
    return response.blob();
  }

  function dataUrlToBlob(dataUrl) {
    const match = String(dataUrl || "").match(/^data:([^;,]+)(;base64)?,(.*)$/i);
    if (!match) throw new Error("图片读取失败，请重新复制后粘贴。");
    const mime = normalizeAssetMime(match[1]);
    if (!mime) throw new Error("当前项目包只支持 PNG、JPG、WebP 图片资源。");
    const data = match[2] ? window.atob(match[3]) : decodeURIComponent(match[3]);
    const bytes = new Uint8Array(data.length);
    for (let index = 0; index < data.length; index += 1) {
      bytes[index] = data.charCodeAt(index);
    }
    return new Blob([bytes], { type: mime });
  }

  async function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("图片读取失败。"));
      reader.readAsDataURL(blob);
    });
  }

  function getImageAssetExtension(mime) {
    if (mime === "image/jpeg") return ".jpg";
    if (mime === "image/webp") return ".webp";
    return ".png";
  }

  function assetStoreKey(projectId, assetId) {
    return `${projectId || projectState.documentId || "doc"}::${assetId}`;
  }

  async function ensureAssetDbReady() {
    if (!window.indexedDB) {
      throw new Error("当前浏览器不支持 IndexedDB，无法保存图片资源。");
    }
    if (libraryState.db) return libraryState.db;
    if (!assetRuntime.dbPromise) {
      assetRuntime.dbPromise = openLibraryDb().then((db) => {
        libraryState.db = db;
        return db;
      }).finally(() => {
        assetRuntime.dbPromise = null;
      });
    }
    return assetRuntime.dbPromise;
  }

  async function storeAssetBlob(record, blob, thumbnailBlob) {
    if (!record || !record.id || !blob) return;
    await ensureAssetDbReady();
    const projectId = projectState.documentId;
    const key = assetStoreKey(projectId, record.id);
    assetRuntime.blobs.set(key, blob);
    await idbPut("assets", {
      key,
      projectId,
      assetId: record.id,
      record,
      blob,
      updatedAt: new Date().toISOString()
    });
    if (thumbnailBlob) {
      assetRuntime.thumbnails.set(key, thumbnailBlob);
      await idbPut("thumbnails", {
        key,
        projectId,
        assetId: record.id,
        blob: thumbnailBlob,
        mime: thumbnailBlob.type || "image/webp",
        updatedAt: new Date().toISOString()
      });
    }
  }

  async function getAssetBlob(assetId, projectId = projectState.documentId) {
    if (!assetId) return null;
    const key = assetStoreKey(projectId, assetId);
    if (assetRuntime.blobs.has(key)) {
      return assetRuntime.blobs.get(key);
    }
    if (!window.indexedDB) return null;
    await ensureAssetDbReady();
    const record = await idbGet("assets", key).catch(() => null);
    if (record && record.blob) {
      assetRuntime.blobs.set(key, record.blob);
      return record.blob;
    }
    return null;
  }

  async function getAssetThumbnailBlob(assetId, projectId = projectState.documentId) {
    if (!assetId) return null;
    const key = assetStoreKey(projectId, assetId);
    if (assetRuntime.thumbnails.has(key)) {
      return assetRuntime.thumbnails.get(key);
    }
    if (!window.indexedDB) return null;
    await ensureAssetDbReady();
    const record = await idbGet("thumbnails", key).catch(() => null);
    if (record && record.blob) {
      assetRuntime.thumbnails.set(key, record.blob);
      return record.blob;
    }
    return null;
  }

  async function createObjectUrlForAsset(assetId) {
    const blob = await getAssetBlob(assetId);
    if (!blob) throw new Error(`图片资源缺失：${assetId}`);
    return URL.createObjectURL(blob);
  }

  async function deleteStoredAsset(projectId, assetId) {
    const key = assetStoreKey(projectId, assetId);
    assetRuntime.blobs.delete(key);
    assetRuntime.thumbnails.delete(key);
    if (!window.indexedDB) return;
    await ensureAssetDbReady();
    await idbDelete("assets", key).catch(() => {});
    await idbDelete("thumbnails", key).catch(() => {});
  }

  function collectReferencedAssetIds(project) {
    const refs = new Set();
    walkProjectNodes(project, (value) => {
      if (!value || typeof value !== "object") return;
      if (value.assetId) refs.add(String(value.assetId));
    });
    return refs;
  }

  function walkProjectNodes(value, visitor) {
    visitor(value);
    if (Array.isArray(value)) {
      value.forEach((item) => walkProjectNodes(item, visitor));
      return;
    }
    if (value && typeof value === "object") {
      Object.values(value).forEach((item) => walkProjectNodes(item, visitor));
    }
  }

  async function cleanupUnusedAssets(project) {
    const documentId = project && project.document && project.document.id ? project.document.id : projectState.documentId;
    const refs = collectReferencedAssetIds(project);
    const assets = normalizeAssetRecords(project.assets || {});
    for (const assetId of Object.keys(assets)) {
      if (refs.has(assetId)) continue;
      delete assets[assetId];
      await deleteStoredAsset(documentId, assetId);
    }
    project.assets = assets;
    if (documentId === projectState.documentId) {
      projectState.assets = assets;
    }
  }

  async function createSopPackageBlob(projectInput) {
    if (!window.JSZip) {
      throw new Error("SOP 项目包导出依赖 JSZip 未加载，请刷新页面后重试。");
    }
    const project = sanitizeProjectForPackage(projectInput);
    await cleanupUnusedAssets(project);
    await validateSopDocumentForPackage(project);

    const zip = new JSZip();
    const manifest = createSopPackageManifest(project);
    zip.file(SOP_PACKAGE_DOCUMENT_PATH, JSON.stringify(project, null, 2));
    zip.file(SOP_PACKAGE_MANIFEST_PATH, JSON.stringify(manifest, null, 2));

    const assets = normalizeAssetRecords(project.assets || {});
    for (const record of Object.values(assets)) {
      const blob = await getAssetBlob(record.id, project.document && project.document.id);
      if (!blob) {
        throw new Error(`导出失败：部分图片资源缺失，请重新插入或恢复资源后再导出。缺失 ${record.id}`);
      }
      zip.file(record.path, blob);
      const thumbnail = await getAssetThumbnailBlob(record.id, project.document && project.document.id);
      if (thumbnail) {
        zip.file(record.thumbnailPath, thumbnail);
      }
    }

    return zip.generateAsync({
      type: "blob",
      mimeType: "application/zip",
      compression: "DEFLATE"
    });
  }

  function sanitizeProjectForPackage(projectInput) {
    const project = structuredCloneSafe(projectInput || {});
    project.fileType = SOP_FILE_TYPE;
    project.schemaVersion = SOP_SCHEMA_VERSION;
    project.appVersion = APP_VERSION;
    project.savedAt = new Date().toISOString();
    project.document = {
      ...(project.document || {}),
      id: project.document && project.document.id ? project.document.id : projectState.documentId || createId("doc"),
      fileName: normalizeProjectFileName(project.document && project.document.fileName || projectState.fileName),
      folderId: project.document && project.document.folderId ? project.document.folderId : projectState.folderId || DEFAULT_FOLDER_ID
    };
    project.assets = normalizeAssetRecords(project.assets || {});
    stripEmbeddedImageSources(project);
    return project;
  }

  function stripEmbeddedImageSources(value) {
    if (Array.isArray(value)) {
      value.forEach(stripEmbeddedImageSources);
      return;
    }
    if (!value || typeof value !== "object") return;
    if (Object.prototype.hasOwnProperty.call(value, "imageSrc")) {
      delete value.imageSrc;
    }
    Object.values(value).forEach(stripEmbeddedImageSources);
  }

  function createSopPackageManifest(project) {
    const assets = normalizeAssetRecords(project.assets || {});
    return {
      fileType: SOP_PACKAGE_FILE_TYPE,
      packageVersion: SOP_PACKAGE_VERSION,
      documentPath: SOP_PACKAGE_DOCUMENT_PATH,
      schemaVersion: Number(project.schemaVersion) || SOP_SCHEMA_VERSION,
      appVersion: APP_VERSION,
      createdAt: new Date().toISOString(),
      assetCount: Object.keys(assets).length,
      thumbnailCount: Object.values(assets).filter((record) => record.thumbnailPath).length
    };
  }

  async function validateSopDocumentForPackage(project) {
    assertNoEmbeddedBase64(project);
    const assets = normalizeAssetRecords(project.assets || {});
    Object.values(assets).forEach((record) => {
      if (!isSafePackagePath(record.path) || !record.path.startsWith("assets/")) {
        throw new Error(`导出失败：图片资源路径不安全：${record.path}`);
      }
      if (record.thumbnailPath && (!isSafePackagePath(record.thumbnailPath) || !record.thumbnailPath.startsWith("thumbnails/"))) {
        throw new Error(`导出失败：缩略图路径不安全：${record.thumbnailPath}`);
      }
    });
    const missing = [];
    walkProjectNodes(project, (value) => {
      if (!value || typeof value !== "object") return;
      if (value.mediaKind === "image" && value.hasImage === true && !value.assetId) {
        missing.push("未绑定资源的图片槽");
      }
      if (value.assetId && !assets[value.assetId]) {
        missing.push(String(value.assetId));
      }
    });
    if (missing.length) {
      throw new Error(`导出失败：部分图片资源缺失，请重新插入或恢复资源后再导出。${Array.from(new Set(missing)).join(", ")}`);
    }
  }

  function assertNoEmbeddedBase64(project) {
    const text = JSON.stringify(project || {});
    if (/data:image\/|;base64,/i.test(text)) {
      throw new Error("导出失败：document.json 中仍包含 Base64 图片数据。");
    }
  }

  async function importSopPackageFromFile(file) {
    if (!window.JSZip) {
      throw new Error("SOP 项目包导入依赖 JSZip 未加载，请刷新页面后重试。");
    }
    const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
    validatePackageZipPaths(zip);
    const manifest = await readPackageJson(zip, SOP_PACKAGE_MANIFEST_PATH);
    if (!manifest || manifest.fileType !== SOP_PACKAGE_FILE_TYPE) {
      throw new Error("这不是有效的 .sopzip 项目包。");
    }
    const project = await readPackageJson(zip, manifest.documentPath || SOP_PACKAGE_DOCUMENT_PATH);
    validateProjectFile(project);
    project.assets = normalizeAssetRecords(project.assets || {});
    const documentId = project.document && project.document.id ? project.document.id : createId("doc");
    if (!project.document) project.document = {};
    project.document.id = documentId;
    project.document.fileName = file.name || project.document.fileName || "未命名.sopzip";

    const missing = [];
    for (const record of Object.values(project.assets)) {
      const zipFile = zip.file(record.path);
      if (!zipFile) {
        missing.push(record.id);
        continue;
      }
      const blob = await getBlobFromZipFile(zipFile, record.mime);
      let thumbnail = null;
      const thumbFile = record.thumbnailPath ? zip.file(record.thumbnailPath) : null;
      if (thumbFile) {
        thumbnail = await getBlobFromZipFile(thumbFile, "image/webp");
      }
      await storeImportedAssetBlob(documentId, record, blob, thumbnail);
    }
    if (missing.length) {
      window.setTimeout(() => {
        window.alert(`图片资源缺失：${missing.join(", ")}`);
      }, 0);
    }
    return project;
  }

  async function storeImportedAssetBlob(projectId, record, blob, thumbnailBlob) {
    await ensureAssetDbReady();
    const key = assetStoreKey(projectId, record.id);
    assetRuntime.blobs.set(key, blob);
    await idbPut("assets", {
      key,
      projectId,
      assetId: record.id,
      record,
      blob,
      updatedAt: new Date().toISOString()
    });
    if (thumbnailBlob) {
      assetRuntime.thumbnails.set(key, thumbnailBlob);
      await idbPut("thumbnails", {
        key,
        projectId,
        assetId: record.id,
        blob: thumbnailBlob,
        mime: thumbnailBlob.type || "image/webp",
        updatedAt: new Date().toISOString()
      });
    }
  }

  function validatePackageZipPaths(zip) {
    Object.keys(zip.files || {}).forEach((path) => {
      if (!isSafePackagePath(path)) {
        throw new Error(`SOP 项目包包含不安全路径：${path}`);
      }
    });
  }

  function isSafePackagePath(path) {
    const value = String(path || "").replace(/\\/g, "/");
    if (!value || value.startsWith("/") || /^[A-Za-z]:/.test(value) || value.includes("../")) return false;
    return value === SOP_PACKAGE_DOCUMENT_PATH ||
      value === SOP_PACKAGE_MANIFEST_PATH ||
      value.startsWith("assets/") ||
      value.startsWith("thumbnails/");
  }

  async function readPackageJson(zip, path) {
    const safePath = normalizePackageAssetPath(path);
    const file = safePath ? zip.file(safePath) : null;
    if (!file) throw new Error(`SOP 项目包缺少 ${safePath || path}`);
    return JSON.parse(await file.async("text"));
  }

  async function getBlobFromZipFile(zipFile, mime) {
    const blob = await zipFile.async("blob");
    return blob.type === mime ? blob : new Blob([blob], { type: mime || blob.type || "application/octet-stream" });
  }

  function normalizePackageAssetPath(path) {
    return String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");
  }

  async function loadProjectDocumentFromFile(file) {
    if (isSopPackageFileName(file.name)) {
      return importSopPackageFromFile(file);
    }
    if (isLegacyProjectFileName(file.name)) {
      return parseLegacyProjectJsonFile(file);
    }
    throw new Error("请打开 .sopzip 项目包。旧版 .sop.json 暂不支持图片迁移。");
  }

  async function parseLegacyProjectJsonFile(file) {
    const rawText = await file.text();
    if (containsEmbeddedBase64(rawText)) {
      throw new Error("当前版本主要支持 .sopzip 项目包。旧版 .sop.json 暂不支持图片迁移。");
    }
    const project = JSON.parse(rawText);
    validateProjectFile(project);
    project.assets = normalizeAssetRecords(project.assets || {});
    return project;
  }

  function containsEmbeddedBase64(value) {
    return /data:image\/|;base64,/i.test(String(value || ""));
  }

  async function hydrateProjectImageSourcesForExport(projectInput) {
    const project = structuredCloneSafe(projectInput || {});
    const projectId = project.document && project.document.id ? project.document.id : projectState.documentId;
    const applySource = async (slot) => {
      if (!slot || typeof slot !== "object" || slot.mediaKind !== "image" || !slot.assetId || slot.imageSrc) return;
      const blob = await getAssetBlob(slot.assetId, projectId);
      if (blob) {
        slot.imageSrc = await blobToDataUrl(blob);
      }
    };
    const tasks = [];
    walkProjectNodes(project, (value) => {
      if (value && typeof value === "object" && value.assetId) {
        tasks.push(applySource(value));
      }
    });
    await Promise.all(tasks);
    return project;
  }

  function normalizeProjectFileName(fileName) {
    const baseName = String(fileName || "未命名.sopzip").trim() || "未命名.sopzip";
    return baseName.endsWith(SOP_PACKAGE_EXTENSION) ?
      baseName :
      removeProjectExtension(baseName) + SOP_PACKAGE_EXTENSION;
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
        globalInfo: normalizeGlobalInfo(snapshot.globalInfo),
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
    activeMaterialSearchCell = null;
    globalEditor.selected = null;
    globalEditor.drag = null;
    draggedPageId = null;
    draggedStepCard = null;
    stepCardPointerDrag = null;
    selectedStepCard = null;
    stepCardClipboard = null;
    draggedMaterialCard = null;
    materialCardPointerDrag = null;
    selectedMaterialCard = null;
    materialCardClipboard = null;
    nextAnnotationLayerId = 1;
    nextOverlayId = 1;
    updateGlobalEditState();
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
    getPages().forEach((page) => {
      [...(page._globalAnnotationModels || []), ...(page._globalTextModels || [])].forEach((model) => {
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
        if (!db.objectStoreNames.contains("assets")) {
          const assets = db.createObjectStore("assets", { keyPath: "key" });
          assets.createIndex("projectId", "projectId", { unique: false });
          assets.createIndex("assetId", "assetId", { unique: false });
        }
        if (!db.objectStoreNames.contains("thumbnails")) {
          const thumbnails = db.createObjectStore("thumbnails", { keyPath: "key" });
          thumbnails.createIndex("projectId", "projectId", { unique: false });
          thumbnails.createIndex("assetId", "assetId", { unique: false });
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
        parentId: "",
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
          parentId: folderId,
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
    return {
      id: createLibraryFileId(folderId, fileName),
      name: fileName,
      folderId,
      folderPath,
      fileName,
      fileHandle,
      folderHandle,
      updatedAt: "",
      source: "folder"
    };
  }

  async function readLibraryDocument(fileHandle, folderHandle, folderId, folderPath, fileName) {
    try {
      const file = await fileHandle.getFile();
      const project = await loadProjectDocumentFromFile(file);
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
    batchExportPptxButton.disabled = !libraryState.ready || libraryState.busy || !getVisibleLibraryDocuments().length;
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

    ensureActiveFolderTreeVisible();

    const allButton = buildFolderButton({
      id: ALL_FOLDER_ID,
      name: "全部",
      count: libraryState.documents.length
    });
    libraryFolderListEl.appendChild(allButton);

    const tree = buildLibraryFolderTree();
    const rootNode = tree.byId.get(DEFAULT_FOLDER_ID);
    if (rootNode) {
      libraryFolderListEl.appendChild(renderFolderTreeNode(rootNode, 0, tree));
    }
  }

  function buildLibraryFolderTree() {
    const byId = new Map();
    const folders = libraryState.folders.length ? libraryState.folders : [{
      id: DEFAULT_FOLDER_ID,
      name: libraryState.rootName || "根目录",
      parentId: "",
      path: "",
      handle: libraryState.rootHandle,
      system: true
    }];

    folders.forEach((folder) => {
      byId.set(folder.id, {
        ...folder,
        parentId: folder.parentId || "",
        children: []
      });
    });

    if (!byId.has(DEFAULT_FOLDER_ID)) {
      byId.set(DEFAULT_FOLDER_ID, {
        id: DEFAULT_FOLDER_ID,
        name: libraryState.rootName || "根目录",
        parentId: "",
        path: "",
        handle: libraryState.rootHandle,
        system: true,
        children: []
      });
    }

    const pathToId = new Map();
    byId.forEach((node) => {
      if (node.path) {
        pathToId.set(String(node.path), node.id);
      }
    });
    byId.forEach((node) => {
      let parentId = getFolderParentId(node);
      const path = String(node.path || "");
      if ((!node.parentId || node.parentId === DEFAULT_FOLDER_ID) && path.includes("/")) {
        const parentPath = path.split("/").slice(0, -1).join("/");
        if (pathToId.has(parentPath)) {
          parentId = pathToId.get(parentPath);
        }
      }
      node.parentId = parentId;
    });

    byId.forEach((node) => {
      if (node.id === DEFAULT_FOLDER_ID) return;
      const parentId = byId.has(node.parentId) && node.parentId !== node.id ? node.parentId : DEFAULT_FOLDER_ID;
      const parent = byId.get(parentId);
      if (parent) {
        parent.children.push(node);
      }
    });

    byId.forEach((node) => {
      node.children.sort((a, b) => String(a.path || a.name).localeCompare(String(b.path || b.name), "zh-Hans-CN"));
    });

    return { byId };
  }

  function renderFolderTreeNode(folder, level, tree) {
    const fragment = document.createDocumentFragment();
    const hasChildren = Boolean(folder.children && folder.children.length);
    const expanded = !hasChildren || libraryState.expandedFolderIds.has(folder.id);
    const count = getFolderDocumentCount(folder.id, tree);
    fragment.appendChild(buildFolderButton({ ...folder, count }, {
      tree: true,
      level,
      hasChildren,
      expanded
    }));

    if (libraryState.activeFolderId === folder.id) {
      getDirectFolderDocuments(folder.id).forEach((documentItem) => {
        fragment.appendChild(buildFolderDocumentTreeItem(documentItem, level + 1));
      });
    }

    if (hasChildren && expanded) {
      folder.children.forEach((child) => {
        fragment.appendChild(renderFolderTreeNode(child, level + 1, tree));
      });
    }
    return fragment;
  }

  function buildFolderButton(folder, options = {}) {
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

    if (!options.tree) {
      return button;
    }

    const row = document.createElement("div");
    row.className = "folder-tree-row";
    row.style.setProperty("--folder-depth", String(Math.max(0, options.level || 0)));

    if (options.hasChildren) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "folder-tree-toggle";
      toggle.classList.toggle("is-expanded", Boolean(options.expanded));
      toggle.setAttribute("aria-label", options.expanded ? "收起文件夹" : "展开文件夹");
      toggle.setAttribute("aria-expanded", String(Boolean(options.expanded)));
      toggle.innerHTML = `<span aria-hidden="true">&gt;</span>`;
      toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        setFolderTreeExpanded(folder.id, !options.expanded, { persist: true });
        renderLibrary();
      });
      row.appendChild(toggle);
    } else {
      const spacer = document.createElement("span");
      spacer.className = "folder-tree-toggle-spacer";
      row.appendChild(spacer);
    }

    row.appendChild(button);
    return row;
  }

  function getDirectFolderDocuments(folderId) {
    return libraryState.documents.filter((documentItem) => {
      return (documentItem.folderId || DEFAULT_FOLDER_ID) === folderId;
    });
  }

  function buildFolderDocumentTreeItem(documentItem, level) {
    const row = document.createElement("div");
    row.className = "folder-file-row";
    row.dataset.fileId = documentItem.id;
    row.dataset.documentId = documentItem.documentId || "";
    row.style.setProperty("--folder-depth", String(Math.max(0, level || 0)));
    const isActive = Boolean(
      (documentItem.id && documentItem.id === projectState.libraryFileId) ||
      (!projectState.libraryFileId && documentItem.documentId && documentItem.documentId === projectState.documentId)
    );
    row.classList.toggle("active", isActive);

    const spacer = document.createElement("span");
    spacer.className = "folder-tree-toggle-spacer";

    const card = document.createElement("div");
    card.className = "folder-file-card";

    const main = document.createElement("button");
    main.type = "button";
    main.className = "folder-file-main";
    main.addEventListener("click", () => switchLibraryDocument(documentItem.id));

    const title = document.createElement("strong");
    title.textContent = removeProjectExtension(documentItem.name || "未命名");
    const meta = document.createElement("span");
    meta.textContent = `V${documentItem.currentVersion || 1} · ${formatDateTime(documentItem.updatedAt)}`;
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "folder-file-actions";
    const renameButton = buildLibrarySmallButton("rename", "重命名");
    const deleteButton = buildLibrarySmallButton("delete", "删除");
    renameButton.addEventListener("click", () => renameLibraryDocument(documentItem.id));
    deleteButton.addEventListener("click", () => deleteLibraryDocument(documentItem.id));
    actions.append(renameButton, deleteButton);

    card.append(main, actions);
    row.append(spacer, card);
    return row;
  }

  function getFolderParentId(folder) {
    if (!folder || folder.id === DEFAULT_FOLDER_ID) return "";
    if (folder.parentId && folder.parentId !== folder.id) return folder.parentId;

    const path = String(folder.path || folder.id || "");
    if (path.includes("/")) {
      const parentPath = path.split("/").slice(0, -1).join("/");
      return parentPath || DEFAULT_FOLDER_ID;
    }
    return DEFAULT_FOLDER_ID;
  }

  function getFolderDescendantIds(folderId, tree = buildLibraryFolderTree()) {
    const ids = new Set();
    const start = tree.byId.get(folderId);
    if (!start) {
      ids.add(folderId || DEFAULT_FOLDER_ID);
      return ids;
    }

    const walk = (node) => {
      ids.add(node.id);
      (node.children || []).forEach(walk);
    };
    walk(start);
    return ids;
  }

  function getFolderDocumentCount(folderId, tree = buildLibraryFolderTree()) {
    const folderIds = getFolderDescendantIds(folderId, tree);
    return libraryState.documents.filter((documentItem) => {
      return folderIds.has(documentItem.folderId || DEFAULT_FOLDER_ID);
    }).length;
  }

  function getActiveFolderScopeIds() {
    if (libraryState.activeFolderId === ALL_FOLDER_ID) return null;
    return getFolderDescendantIds(libraryState.activeFolderId);
  }

  function itemMatchesActiveFolder(item) {
    if (libraryState.activeFolderId === ALL_FOLDER_ID) return true;
    const scope = getActiveFolderScopeIds();
    return scope ? scope.has(item.folderId || DEFAULT_FOLDER_ID) : false;
  }

  function initializeFolderTreeExpandedState() {
    let ids = [DEFAULT_FOLDER_ID];
    try {
      const raw = window.localStorage.getItem(FOLDER_TREE_EXPANDED_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) {
        ids = parsed.filter((id) => typeof id === "string" && id);
      }
    } catch (_) {
      ids = [DEFAULT_FOLDER_ID];
    }
    if (!ids.includes(DEFAULT_FOLDER_ID)) {
      ids.push(DEFAULT_FOLDER_ID);
    }
    libraryState.expandedFolderIds = new Set(ids);
  }

  function setFolderTreeExpanded(folderId, expanded, options = {}) {
    if (!folderId || folderId === ALL_FOLDER_ID) return;
    if (expanded) {
      libraryState.expandedFolderIds.add(folderId);
    } else {
      libraryState.expandedFolderIds.delete(folderId);
    }

    if (options.persist) {
      persistFolderTreeExpandedState();
    }
  }

  function persistFolderTreeExpandedState() {
    try {
      window.localStorage.setItem(FOLDER_TREE_EXPANDED_KEY, JSON.stringify(Array.from(libraryState.expandedFolderIds)));
    } catch (_) {
      // Ignore storage failures; tree state still updates for this session.
    }
  }

  function ensureActiveFolderTreeVisible() {
    if (libraryState.activeFolderId === ALL_FOLDER_ID) return;
    const tree = buildLibraryFolderTree();
    let folder = tree.byId.get(libraryState.activeFolderId);
    while (folder) {
      const parentId = getFolderParentId(folder);
      if (!parentId) break;
      libraryState.expandedFolderIds.add(parentId);
      folder = tree.byId.get(parentId);
    }
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
    const activeScope = getActiveFolderScopeIds();
    const folderBoms = libraryState.activeFolderId === ALL_FOLDER_ID ?
      libraryState.boms :
      libraryState.boms.filter((item) => activeScope && activeScope.has(item.folderId || DEFAULT_FOLDER_ID));
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
      empty.textContent = "连接电脑文件夹或飞书云盘后，这里会显示其中的 .sopzip 文件。";
      sopLibraryListEl.appendChild(empty);
      return;
    }

    if (libraryState.activeFolderId !== ALL_FOLDER_ID) {
      const notice = document.createElement("div");
      notice.className = "library-empty";
      notice.textContent = documents.length ?
        "当前文件夹的 SOP 文件已显示在上方文件夹树中。" :
        "当前文件夹暂无 SOP 文件。";
      sopLibraryListEl.appendChild(notice);
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
        const file = await getReadableFileFromHandle(handle, {
          request: true,
          deniedMessage: "浏览器拒绝读取这个 BOM 文件，请重新点击“选择BOM表”并选择文件。"
        });
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
        const file = await getReadableFileFromHandle(item.fileHandle, {
          request: true,
          deniedMessage: getBomFileHandleDeniedMessage(item)
        });
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

  async function getReadableFileFromHandle(fileHandle, options = {}) {
    if (!fileHandle || typeof fileHandle.getFile !== "function") {
      throw new Error("这个BOM历史记录缺少文件句柄，请重新选择BOM表。");
    }

    const hasPermission = await ensureFileHandleReadPermission(fileHandle, {
      request: Boolean(options.request)
    });
    if (!hasPermission) {
      throw new Error(options.deniedMessage || "没有这个BOM文件的读取权限，请重新选择BOM表。");
    }

    try {
      return await fileHandle.getFile();
    } catch (error) {
      if (isFileHandleAccessDeniedError(error)) {
        throw new Error(options.deniedMessage || "浏览器拒绝读取这个BOM文件，请重新选择BOM表。");
      }
      throw error;
    }
  }

  async function ensureFileHandleReadPermission(fileHandle, options = {}) {
    if (!fileHandle) return false;
    if (!fileHandle.queryPermission || !fileHandle.requestPermission) return true;

    try {
      let permission = await fileHandle.queryPermission({ mode: "read" });
      if (permission === "granted") return true;
      if (options.request) {
        permission = await fileHandle.requestPermission({ mode: "read" });
      }
      return permission === "granted";
    } catch (error) {
      if (isFileHandleAccessDeniedError(error)) return false;
      return false;
    }
  }

  function isFileHandleAccessDeniedError(error) {
    const name = String(error && error.name || "");
    const message = String(error && error.message || error || "");
    return name === "NotAllowedError" ||
      name === "SecurityError" ||
      /not allowed|permission|denied|current context|FileSystemFileHandle|getFile/i.test(message);
  }

  function getBomFileHandleDeniedMessage(item) {
    if (item && item.source === "folder") {
      return "浏览器拒绝读取这个BOM文件，请点击“刷新文件夹”重新授权，或点击“选择BOM表”重新选择文件。";
    }
    return "浏览器拒绝读取这个BOM历史记录，请重新点击“选择BOM表”选择文件。";
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
    if (activeMaterialSearchCell) {
      renderMaterialSearchResults(getMaterialFieldValue(activeMaterialSearchCell, getMaterialSearchField(activeMaterialSearchCell)));
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

  function buildAddPageTemplateMenu() {
    if (!addPageButton || document.getElementById("add-page-template-menu")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "add-page-control";
    addPageButton.parentNode.insertBefore(wrapper, addPageButton);
    wrapper.appendChild(addPageButton);

    addPageTemplateMenu = document.createElement("div");
    addPageTemplateMenu.className = "add-page-template-menu";
    addPageTemplateMenu.id = "add-page-template-menu";
    addPageTemplateMenu.setAttribute("role", "menu");
    addPageTemplateMenu.setAttribute("aria-label", "选择新增页面模板");

    STEP_TEMPLATE_COUNTS.forEach((count) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "add-page-template-option";
      button.setAttribute("role", "menuitem");
      button.dataset.stepTemplateCount = String(count);
      button.textContent = `${count}步骤模板`;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        addPage({ scrollIntoView: true, stepTemplateCount: count });
        addPageTemplateMenu.classList.remove("is-open");
      });
      addPageTemplateMenu.appendChild(button);
    });

    const blankCardButton = document.createElement("button");
    blankCardButton.type = "button";
    blankCardButton.className = "add-page-template-option";
    blankCardButton.setAttribute("role", "menuitem");
    blankCardButton.dataset.stepTemplateCount = String(FREE_STEP_TEMPLATE_COUNT);
    blankCardButton.dataset.blankStepCards = "true";
    blankCardButton.textContent = "空白卡片模板";
    blankCardButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      addPage({
        scrollIntoView: true,
        stepTemplateCount: FREE_STEP_TEMPLATE_COUNT,
        stepCards: []
      });
      addPageTemplateMenu.classList.remove("is-open");
    });
    addPageTemplateMenu.appendChild(blankCardButton);

    wrapper.appendChild(addPageTemplateMenu);
    bindHoverMenu(wrapper, addPageTemplateMenu);
  }

  function buildAddStepCardMenu() {
    if (!addPageButton || document.getElementById("add-step-card") || document.getElementById("add-step-card-menu")) return;

    const pageControl = addPageButton.closest(".add-page-control") || addPageButton;
    const wrapper = document.createElement("div");
    wrapper.className = "add-page-control add-step-card-control";
    pageControl.parentNode.insertBefore(wrapper, pageControl.nextSibling);

    addStepCardButton = document.createElement("button");
    addStepCardButton.type = "button";
    addStepCardButton.className = "toolbar-button";
    addStepCardButton.id = "add-step-card";
    addStepCardButton.innerHTML = `<span class="button-icon">C</span><span>新增卡片</span>`;
    addStepCardButton.addEventListener("click", async () => {
      await addFreeStepCardToCurrentPage("small");
    });
    wrapper.appendChild(addStepCardButton);

    addStepCardMenu = document.createElement("div");
    addStepCardMenu.className = "add-page-template-menu add-step-card-menu";
    addStepCardMenu.id = "add-step-card-menu";
    addStepCardMenu.setAttribute("role", "menu");
    addStepCardMenu.setAttribute("aria-label", "选择新增步骤卡片尺寸");

    FREE_STEP_CARD_SIZE_OPTIONS.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "add-page-template-option";
      button.setAttribute("role", "menuitem");
      button.dataset.stepCardSize = option.size;
      button.textContent = option.label;
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await addFreeStepCardToCurrentPage(option.size);
        addStepCardMenu.classList.remove("is-open");
      });
      addStepCardMenu.appendChild(button);
    });

    wrapper.appendChild(addStepCardMenu);
    bindHoverMenu(wrapper, addStepCardMenu, {
      canOpen: () => !addStepCardButton.disabled
    });
    updateAddStepCardControl();
  }

  function bindHoverMenu(wrapper, menu, options = {}) {
    let closeTimer = 0;
    const canOpen = typeof options.canOpen === "function" ? options.canOpen : () => true;
    const clearCloseTimer = () => {
      if (!closeTimer) return;
      window.clearTimeout(closeTimer);
      closeTimer = 0;
    };
    const openMenu = () => {
      clearCloseTimer();
      if (canOpen()) {
        menu.classList.add("is-open");
      }
    };
    const closeMenuSoon = () => {
      clearCloseTimer();
      closeTimer = window.setTimeout(() => {
        menu.classList.remove("is-open");
        closeTimer = 0;
      }, 220);
    };

    wrapper.addEventListener("mouseenter", openMenu);
    wrapper.addEventListener("mouseleave", closeMenuSoon);
    menu.addEventListener("mouseenter", openMenu);
    menu.addEventListener("mouseleave", closeMenuSoon);
    wrapper.addEventListener("focusin", openMenu);
    wrapper.addEventListener("focusout", (event) => {
      if (!wrapper.contains(event.relatedTarget)) {
        closeMenuSoon();
      }
    });
  }

  function updateAddStepCardControl() {
    if (!addStepCardButton) return;
    const enabled = isFreeStepPage(getCurrentPage());
    addStepCardButton.disabled = !enabled;
    addStepCardButton.title = enabled ? "给当前 8 步骤页新增步骤卡片" : "只有 8 步骤模板支持新增步骤卡片";
    if (!enabled && addStepCardMenu) {
      addStepCardMenu.classList.remove("is-open");
    }
  }

  function buildExportCollapsePanel() {
    const exportButtons = [printButton, batchPrintButton, exportPptxButton, batchExportPptxButton].filter(Boolean);
    if (!exportButtons.length || document.getElementById("export-panel")) return;

    exportPanel = document.createElement("section");
    exportPanel.className = "toolbar-collapse-panel is-collapsed";
    exportPanel.id = "export-panel";

    exportPanelToggle = document.createElement("button");
    exportPanelToggle.className = "toolbar-collapse-toggle";
    exportPanelToggle.id = "export-panel-toggle";
    exportPanelToggle.type = "button";
    exportPanelToggle.setAttribute("aria-expanded", "false");
    exportPanelToggle.setAttribute("aria-controls", "export-panel-body");
    exportPanelToggle.innerHTML = `
      <span>导出</span>
      <span class="toolbar-collapse-indicator" aria-hidden="true">&gt;</span>
    `;

    exportPanelBody = document.createElement("div");
    exportPanelBody.className = "toolbar-collapse-body";
    exportPanelBody.id = "export-panel-body";
    exportPanelBody.hidden = true;

    const anchor = printButton;
    anchor.parentNode.insertBefore(exportPanel, anchor);
    exportPanel.append(exportPanelToggle, exportPanelBody);
    exportButtons.forEach((button) => {
      exportPanelBody.appendChild(button);
    });
  }

  function initializeExportPanelCollapse() {
    let collapsed = true;
    try {
      const stored = window.localStorage.getItem(EXPORT_PANEL_COLLAPSED_KEY);
      if (stored === "false") {
        collapsed = false;
      }
    } catch (_) {
      collapsed = true;
    }
    setExportPanelCollapsed(collapsed);
  }

  function setExportPanelCollapsed(collapsed, options = {}) {
    if (!exportPanel || !exportPanelBody || !exportPanelToggle) return;

    const nextCollapsed = Boolean(collapsed);
    exportPanel.classList.toggle("is-collapsed", nextCollapsed);
    exportPanelBody.hidden = nextCollapsed;
    exportPanelToggle.setAttribute("aria-expanded", String(!nextCollapsed));

    if (options.persist) {
      try {
        window.localStorage.setItem(EXPORT_PANEL_COLLAPSED_KEY, String(nextCollapsed));
      } catch (_) {
        // Ignore storage failures; the UI state still updates for this session.
      }
    }
  }

  function buildVersionCollapsePanel() {
    const versionItems = [createVersionButton, versionSelect, fileStatusEl].filter(Boolean);
    if (!versionItems.length || document.getElementById("version-panel")) return;

    versionPanel = document.createElement("section");
    versionPanel.className = "library-collapse-panel is-collapsed";
    versionPanel.id = "version-panel";

    versionPanelToggle = document.createElement("button");
    versionPanelToggle.className = "library-collapse-toggle";
    versionPanelToggle.id = "version-panel-toggle";
    versionPanelToggle.type = "button";
    versionPanelToggle.setAttribute("aria-expanded", "false");
    versionPanelToggle.setAttribute("aria-controls", "version-panel-body");
    versionPanelToggle.innerHTML = `
      <span>版本</span>
      <span class="collapse-indicator" aria-hidden="true">&gt;</span>
    `;

    versionPanelBody = document.createElement("div");
    versionPanelBody.className = "library-collapse-body";
    versionPanelBody.id = "version-panel-body";
    versionPanelBody.hidden = true;

    const anchor = createVersionButton;
    anchor.parentNode.insertBefore(versionPanel, anchor);
    versionPanel.append(versionPanelToggle, versionPanelBody);
    versionItems.forEach((item) => {
      versionPanelBody.appendChild(item);
    });
  }

  function initializeVersionPanelCollapse() {
    let collapsed = true;
    try {
      const stored = window.localStorage.getItem(VERSION_PANEL_COLLAPSED_KEY);
      if (stored === "false") {
        collapsed = false;
      }
    } catch (_) {
      collapsed = true;
    }
    setVersionPanelCollapsed(collapsed);
  }

  function setVersionPanelCollapsed(collapsed, options = {}) {
    if (!versionPanel || !versionPanelBody || !versionPanelToggle) return;

    const nextCollapsed = Boolean(collapsed);
    versionPanel.classList.toggle("is-collapsed", nextCollapsed);
    versionPanelBody.hidden = nextCollapsed;
    versionPanelToggle.setAttribute("aria-expanded", String(!nextCollapsed));

    if (options.persist) {
      try {
        window.localStorage.setItem(VERSION_PANEL_COLLAPSED_KEY, String(nextCollapsed));
      } catch (_) {
        // Ignore storage failures; the UI state still updates for this session.
      }
    }
  }

  function getLibrarySectionTitleBefore(element) {
    let node = element ? element.previousElementSibling : null;
    while (node && !node.classList.contains("library-section-title")) {
      node = node.previousElementSibling;
    }
    return node;
  }

  function buildGlobalInfoCollapsePanel() {
    if (!globalInfoPanel || document.getElementById("global-info-panel-toggle")) return;

    globalInfoPanel.classList.add("library-collapse-panel");
    const title = globalInfoPanel.querySelector(".library-section-title");

    globalInfoPanelToggle = document.createElement("button");
    globalInfoPanelToggle.className = "library-collapse-toggle";
    globalInfoPanelToggle.id = "global-info-panel-toggle";
    globalInfoPanelToggle.type = "button";
    globalInfoPanelToggle.setAttribute("aria-expanded", "false");
    globalInfoPanelToggle.setAttribute("aria-controls", "global-info-panel-body");
    globalInfoPanelToggle.innerHTML = `
      <span>全局信息</span>
      <span class="collapse-indicator" aria-hidden="true">&gt;</span>
    `;

    globalInfoPanelBody = document.createElement("div");
    globalInfoPanelBody.className = "library-collapse-body global-info-body";
    globalInfoPanelBody.id = "global-info-panel-body";

    Array.from(globalInfoPanel.children).forEach((child) => {
      if (child === title) return;
      globalInfoPanelBody.appendChild(child);
    });

    if (title) {
      title.replaceWith(globalInfoPanelToggle);
    } else {
      globalInfoPanel.prepend(globalInfoPanelToggle);
    }
    globalInfoPanel.appendChild(globalInfoPanelBody);
  }

  function initializeGlobalInfoPanelCollapse() {
    let collapsed = true;
    try {
      const stored = window.localStorage.getItem(GLOBAL_INFO_PANEL_COLLAPSED_KEY);
      if (stored !== null) {
        collapsed = stored === "true";
      }
    } catch (_) {
      collapsed = true;
    }
    setGlobalInfoPanelCollapsed(collapsed);
  }

  function setGlobalInfoPanelCollapsed(collapsed, options = {}) {
    if (!globalInfoPanel || !globalInfoPanelBody || !globalInfoPanelToggle) return;
    const nextCollapsed = Boolean(collapsed);
    globalInfoPanel.classList.toggle("is-collapsed", nextCollapsed);
    globalInfoPanelBody.hidden = nextCollapsed;
    globalInfoPanelToggle.setAttribute("aria-expanded", String(!nextCollapsed));
    if (options.persist) {
      try {
        window.localStorage.setItem(GLOBAL_INFO_PANEL_COLLAPSED_KEY, String(nextCollapsed));
      } catch (_) {
        // Ignore storage failures; the UI state still updates for this session.
      }
    }
  }

  function buildBomCollapsePanel() {
    if (!bomPickFileButton || !bomHistoryListEl || document.getElementById("bom-panel")) return;

    const bomActions = bomPickFileButton.closest(".library-actions");
    const bomTitle = getLibrarySectionTitleBefore(bomActions);
    const bomHistoryTitle = getLibrarySectionTitleBefore(bomHistoryListEl);
    const bomItems = [bomTitle, bomActions, bomFileInput, bomHistoryTitle, bomHistoryListEl].filter(Boolean);
    if (!bomItems.length) return;

    bomPanel = document.createElement("section");
    bomPanel.className = "library-collapse-panel is-collapsed";
    bomPanel.id = "bom-panel";

    bomPanelToggle = document.createElement("button");
    bomPanelToggle.className = "library-collapse-toggle";
    bomPanelToggle.id = "bom-panel-toggle";
    bomPanelToggle.type = "button";
    bomPanelToggle.setAttribute("aria-expanded", "false");
    bomPanelToggle.setAttribute("aria-controls", "bom-panel-body");
    bomPanelToggle.innerHTML = `
      <span>BOM</span>
      <span class="collapse-indicator" aria-hidden="true">&gt;</span>
    `;

    bomPanelBody = document.createElement("div");
    bomPanelBody.className = "library-collapse-body";
    bomPanelBody.id = "bom-panel-body";
    bomPanelBody.hidden = true;

    bomItems[0].parentNode.insertBefore(bomPanel, bomItems[0]);
    bomPanel.append(bomPanelToggle, bomPanelBody);
    bomItems.forEach((item) => {
      bomPanelBody.appendChild(item);
    });
  }

  function initializeBomPanelCollapse() {
    let collapsed = true;
    try {
      const stored = window.localStorage.getItem(BOM_PANEL_COLLAPSED_KEY);
      if (stored === "false") {
        collapsed = false;
      }
    } catch (_) {
      collapsed = true;
    }
    setBomPanelCollapsed(collapsed);
  }

  function setBomPanelCollapsed(collapsed, options = {}) {
    if (!bomPanel || !bomPanelBody || !bomPanelToggle) return;

    const nextCollapsed = Boolean(collapsed);
    bomPanel.classList.toggle("is-collapsed", nextCollapsed);
    bomPanelBody.hidden = nextCollapsed;
    bomPanelToggle.setAttribute("aria-expanded", String(!nextCollapsed));

    if (options.persist) {
      try {
        window.localStorage.setItem(BOM_PANEL_COLLAPSED_KEY, String(nextCollapsed));
      } catch (_) {
        // Ignore storage failures; the UI state still updates for this session.
      }
    }
  }

  function buildSopHistoryCollapsePanel() {
    if (!sopLibraryListEl || document.getElementById("sop-history-panel")) return;

    const sopHistoryTitle = getLibrarySectionTitleBefore(sopLibraryListEl);
    const sopHistoryItems = [sopHistoryTitle, sopLibraryListEl].filter(Boolean);
    if (!sopHistoryItems.length) return;

    sopHistoryPanel = document.createElement("section");
    sopHistoryPanel.className = "library-collapse-panel is-collapsed";
    sopHistoryPanel.id = "sop-history-panel";

    sopHistoryPanelToggle = document.createElement("button");
    sopHistoryPanelToggle.className = "library-collapse-toggle";
    sopHistoryPanelToggle.id = "sop-history-panel-toggle";
    sopHistoryPanelToggle.type = "button";
    sopHistoryPanelToggle.setAttribute("aria-expanded", "false");
    sopHistoryPanelToggle.setAttribute("aria-controls", "sop-history-panel-body");
    sopHistoryPanelToggle.innerHTML = `
      <span>SOP历史</span>
      <span class="collapse-indicator" aria-hidden="true">&gt;</span>
    `;

    sopHistoryPanelBody = document.createElement("div");
    sopHistoryPanelBody.className = "library-collapse-body";
    sopHistoryPanelBody.id = "sop-history-panel-body";
    sopHistoryPanelBody.hidden = true;

    sopHistoryItems[0].parentNode.insertBefore(sopHistoryPanel, sopHistoryItems[0]);
    sopHistoryPanel.append(sopHistoryPanelToggle, sopHistoryPanelBody);
    sopHistoryItems.forEach((item) => {
      sopHistoryPanelBody.appendChild(item);
    });
  }

  function initializeSopHistoryPanelCollapse() {
    let collapsed = true;
    try {
      const stored = window.localStorage.getItem(SOP_HISTORY_PANEL_COLLAPSED_KEY);
      if (stored === "false") {
        collapsed = false;
      }
    } catch (_) {
      collapsed = true;
    }
    setSopHistoryPanelCollapsed(collapsed);
  }

  function setSopHistoryPanelCollapsed(collapsed, options = {}) {
    if (!sopHistoryPanel || !sopHistoryPanelBody || !sopHistoryPanelToggle) return;

    const nextCollapsed = Boolean(collapsed);
    sopHistoryPanel.classList.toggle("is-collapsed", nextCollapsed);
    sopHistoryPanelBody.hidden = nextCollapsed;
    sopHistoryPanelToggle.setAttribute("aria-expanded", String(!nextCollapsed));

    if (options.persist) {
      try {
        window.localStorage.setItem(SOP_HISTORY_PANEL_COLLAPSED_KEY, String(nextCollapsed));
      } catch (_) {
        // Ignore storage failures; the UI state still updates for this session.
      }
    }
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
      document.body.dataset.selftestStep = "start";
      const imageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";
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
      document.body.dataset.selftestStep = "bom-preview";
      const numberCell = document.querySelector(".text-cell[data-material-field='number'][data-material-index='0']");
      await applyBomItemToMaterial(numberCell, bom.items[0]);
      document.body.dataset.selftestStep = "bom-applied";
      const page = numberCell.closest(".sop-page");
      const nameCell = page.querySelector(".text-cell[data-material-field='name'][data-material-index='0']");
      const specCell = page.querySelector(".text-cell[data-material-field='spec'][data-material-index='0']");
      const imageSlot = page.querySelector(".image-cell[data-material-index='0']");
      const img = imageSlot.querySelector("img");
      document.body.dataset.selftestStep = "bom-image-wait";
      await waitImageReady(img);
      await nextFrame();

      setMaterialFieldValue(numberCell, "number", "");
      setMaterialFieldValue(nameCell, "name", "测试物料");
      setMaterialFieldValue(specCell, "spec", "");
      deleteImage(imageSlot, { keepFocus: false });
      await applyBomItemToMaterial(nameCell, bom.items[0], { keepSearchOpen: true });
      const matchedImg = imageSlot.querySelector("img");
      await waitImageReady(matchedImg);
      await nextFrame();
      document.body.dataset.selftestStep = "bom-match";

      const stepPage = getPages()[0];
      const sourceStep = getStepCardElements(stepPage, 0);
      const sourceStepImage = sourceStep.image;
      const sourceStepDesc = sourceStep.desc;
      const sourceStepNote = getTextCellValueElement(sourceStep.note, "value");
      sourceStepDesc.textContent = "SELFTEST_STEP_SOURCE";
      sourceStepNote.textContent = "SELFTEST_NOTE_SOURCE";
      await loadImageSource(sourceStepImage, imageData);
      await waitImageReady(sourceStepImage.querySelector("img"));
      await nextFrame();

      selectStepCard(stepPage, 0);
      const copied = copySelectedStepCard();
      selectStepCard(stepPage, 1);
      const pasted = await pasteStepCardToSelection();
      const pastedStep = getStepCardElements(stepPage, 1);
      const pastedStepDesc = pastedStep.desc;
      const pastedStepNote = getTextCellValueElement(pastedStep.note, "value");
      const pastedStepImage = pastedStep.image;
      const pasteStepPassed = pasted &&
        pastedStepDesc.textContent === "SELFTEST_STEP_SOURCE" &&
        pastedStepNote.textContent === "SELFTEST_NOTE_SOURCE" &&
        pastedStepImage.dataset.hasImage === "true";
      await moveStepCardWithinPage(stepPage, 1, 3);
      const movedStep = getStepCardElements(stepPage, 3);
      const movedStepDesc = movedStep.desc;
      const movedStepNote = getTextCellValueElement(movedStep.note, "value");
      const movedStepImage = movedStep.image;
      const stepCardPassed = copied &&
        pasteStepPassed &&
        movedStepDesc.textContent === "SELFTEST_STEP_SOURCE" &&
        movedStepNote.textContent === "SELFTEST_NOTE_SOURCE" &&
        movedStepImage.dataset.hasImage === "true";
      document.body.dataset.selftestStep = "step-card";

      const sourceMaterialImage = getPageCellByKey(stepPage, "c1r15");
      const sourceMaterialName = getPageCellByKey(stepPage, "c3r15");
      const sourceMaterialNumber = getPageCellByKey(stepPage, "c3r16");
      const sourceMaterialSpec = getPageCellByKey(stepPage, "c3r17");
      setMaterialFieldValue(sourceMaterialName, "name", "SELFTEST_MATERIAL_NAME");
      setMaterialFieldValue(sourceMaterialNumber, "number", "SELFTEST-MAT-001");
      setMaterialFieldValue(sourceMaterialSpec, "spec", "SELFTEST_SPEC");
      await loadImageSource(sourceMaterialImage, imageData);
      await waitImageReady(sourceMaterialImage.querySelector("img"));
      await nextFrame();
      document.body.dataset.selftestStep = "material-source";

      selectMaterialCard(stepPage, 4);
      const materialCopied = copySelectedMaterialCard();
      selectMaterialCard(stepPage, 5);
      const materialPasted = await pasteMaterialCardToSelection();
      const pastedMaterialImage = getPageCellByKey(stepPage, "c1r18");
      const pastedMaterialName = getPageCellByKey(stepPage, "c3r18");
      const pastedMaterialNumber = getPageCellByKey(stepPage, "c3r19");
      const pastedMaterialSpec = getPageCellByKey(stepPage, "c3r20");
      const pasteMaterialPassed = materialPasted &&
        getMaterialFieldValue(pastedMaterialName, "name") === "SELFTEST_MATERIAL_NAME" &&
        getMaterialFieldValue(pastedMaterialNumber, "number") === "SELFTEST-MAT-001" &&
        getMaterialFieldValue(pastedMaterialSpec, "spec") === "SELFTEST_SPEC" &&
        pastedMaterialImage.dataset.hasImage === "true";
      await moveMaterialCardWithinPage(stepPage, 5, 7);
      const movedMaterialImage = getPageCellByKey(stepPage, "c1r24");
      const movedMaterialName = getPageCellByKey(stepPage, "c3r24");
      const movedMaterialNumber = getPageCellByKey(stepPage, "c3r25");
      const movedMaterialSpec = getPageCellByKey(stepPage, "c3r26");
      const materialCardPassed = materialCopied &&
        pasteMaterialPassed &&
        getMaterialFieldValue(movedMaterialName, "name") === "SELFTEST_MATERIAL_NAME" &&
        getMaterialFieldValue(movedMaterialNumber, "number") === "SELFTEST-MAT-001" &&
        getMaterialFieldValue(movedMaterialSpec, "spec") === "SELFTEST_SPEC" &&
        movedMaterialImage.dataset.hasImage === "true";
      document.body.dataset.selftestStep = "material-card";

      const logoSlot = getGlobalInfoLogoSlotFromPage(stepPage);
      await loadImageSource(logoSlot, imageData);
      await waitImageReady(logoSlot.querySelector("img"));
      await nextFrame();
      const globalInfoWithLogo = getGlobalInfoFromPage(stepPage);
      updateGlobalInfoControls(globalInfoWithLogo);
      const logoControlPassed = Boolean(
        globalInfoLogoSlot &&
        globalInfoWithLogo.logoSlot &&
        globalInfoLogoSlot.assetId === globalInfoWithLogo.logoSlot.assetId
      );
      await applyGlobalInfoToPage(stepPage, readGlobalInfoFromControls());
      const logoAfterApply = getGlobalInfoLogoSlotFromPage(stepPage);
      const logoPassed = logoControlPassed &&
        logoAfterApply.dataset.hasImage === "true" &&
        logoAfterApply.dataset.assetId === globalInfoWithLogo.logoSlot.assetId;
      document.body.dataset.selftestStep = "global-logo";

      const bomPassed = getMaterialFieldValue(numberCell, "number") === "MAT-001" &&
        getMaterialFieldValue(nameCell, "name") === "测试物料" &&
        getMaterialFieldValue(specCell, "spec") === "2PCS" &&
        imageSlot.dataset.hasImage === "true" &&
        bomPreviewPanel.hidden === false &&
        appShellEl.classList.contains("bom-preview-open");
      document.body.dataset.selftestStep = "sopzip-package";
      const packageProject = serializeProject({ includeHistory: true });
      const assetIds = Object.keys(packageProject.assets || {});
      const packageBlob = await createSopPackageBlob(packageProject);
      const packageZip = await window.JSZip.loadAsync(await packageBlob.arrayBuffer());
      const packageDocumentText = await packageZip.file(SOP_PACKAGE_DOCUMENT_PATH).async("text");
      const packageManifestText = await packageZip.file(SOP_PACKAGE_MANIFEST_PATH).async("text");
      const packageDocument = JSON.parse(packageDocumentText);
      const packageManifest = JSON.parse(packageManifestText);
      const packageAssetPaths = assetIds.map((assetId) => packageDocument.assets[assetId] && packageDocument.assets[assetId].path);
      const packagePassed = Boolean(
        assetIds.length === 1 &&
        packageZip.file(SOP_PACKAGE_DOCUMENT_PATH) &&
        packageZip.file(SOP_PACKAGE_MANIFEST_PATH) &&
        packageManifest.fileType === SOP_PACKAGE_FILE_TYPE &&
        packageAssetPaths.every((path) => path && packageZip.file(path)) &&
        !containsEmbeddedBase64(packageDocumentText) &&
        Object.values(packageDocument.assets || {}).every((asset) => asset.path && asset.thumbnailPath)
      );
      const importedPackage = await importSopPackageFromFile(new File([packageBlob], "selftest.sopzip", { type: "application/zip" }));
      const importPassed = Boolean(
        importedPackage &&
        importedPackage.fileType === SOP_FILE_TYPE &&
        Object.keys(importedPackage.assets || {}).length === assetIds.length &&
        Array.isArray(importedPackage.pages) &&
        importedPackage.pages.length === packageProject.pages.length
      );
      document.body.dataset.selftestStep = "sopzip-import";
      const passed = bomPassed && stepCardPassed && materialCardPassed && logoPassed && packagePassed && importPassed;
      document.body.dataset.selftest = passed ? "pass" : "fail";
      if (!passed) {
        document.body.dataset.selftestError = `BOM:${bomPassed} STEP_CARD:${stepCardPassed} MATERIAL_CARD:${materialCardPassed} LOGO:${logoPassed} PACKAGE:${packagePassed} IMPORT:${importPassed}`;
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
        initializeProjectState("未命名.sopzip", null, { folderId: getLibraryFolderForNewSop() });
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
    if (libraryFolderListEl) {
      libraryFolderListEl.querySelectorAll(".folder-file-row").forEach((item) => {
        const matchesFile = item.dataset.fileId && item.dataset.fileId === projectState.libraryFileId;
        const matchesDocument = item.dataset.documentId && item.dataset.documentId === projectState.documentId;
        item.classList.toggle("active", Boolean(matchesFile || (!projectState.libraryFileId && matchesDocument)));
      });
    }
  }

  function getVisibleLibraryDocuments() {
    if (libraryState.activeFolderId === ALL_FOLDER_ID) {
      return libraryState.documents;
    }
    const activeScope = getActiveFolderScopeIds();
    return libraryState.documents.filter((documentItem) => {
      return activeScope && activeScope.has(documentItem.folderId || DEFAULT_FOLDER_ID);
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
        initializeProjectState("未命名.sopzip", null, { folderId: getLibraryFolderForNewSop() });
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
        parentId: "",
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
    return isSopPackageFileName(fileName) || isLegacyProjectFileName(fileName);
  }

  function isSopPackageFileName(fileName) {
    return /\.sopzip$/i.test(String(fileName || ""));
  }

  function isLegacyProjectFileName(fileName) {
    const value = String(fileName || "");
    return /\.sop\.json$/i.test(value) || (/\.json$/i.test(value) && !isSopPackageFileName(value));
  }

  function isBomFileName(fileName) {
    return bomFileExtensions.includes(getFileExtension(fileName));
  }

  function sanitizeLibraryName(value) {
    return String(value || "").trim().replace(/[\\/:*?"<>|]/g, "-").slice(0, 80);
  }

  function removeProjectExtension(fileName) {
    return String(fileName || "未命名")
      .replace(/\.sopzip$/i, "")
      .replace(/\.sop\.json$/i, "")
      .replace(/\.json$/i, "");
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

  function idbDelete(storeName, key) {
    return idbRequest(storeName, "readwrite", (store) => store.delete(key));
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

  async function exportPptx() {
    try {
      ensurePptxExportReady();
      const project = serializeProject({ includeHistory: false });
      const baseName = removeProjectExtension(projectState.fileName || "未命名");
      const blob = await createPptxBlob(project, baseName);
      downloadBlob(blob, `${sanitizeLibraryName(baseName) || "SOP"}.pptx`);
      libraryStatusEl.textContent = "已导出 PPT：表格、文字、图片和标注均尽量保留为可编辑对象。";
    } catch (error) {
      showFileError("导出PPT失败", error);
    }
  }

  async function batchExportPptx() {
    if (libraryState.busy) return;

    try {
      ensurePptxExportReady();
      if (!await ensureLibraryAccess(true)) return;

      const documents = await collectVisibleLibraryProjects("PPT");
      if (!documents.length) {
        libraryStatusEl.textContent = "当前筛选范围没有可批量导出的 SOP。";
        updateLibraryControls();
        return;
      }

      const scopeName = getBatchPrintScopeName();
      const totalPages = documents.reduce((sum, documentItem) => sum + getProjectPageCount(documentItem.project), 0);
      const ok = window.confirm(`将逐个导出“${scopeName}”中的 ${documents.length} 个 SOP，共 ${totalPages} 页。\n每个 SOP 会单独下载一个 .pptx 文件，不会合并。`);
      if (!ok) return;

      libraryState.busy = true;
      updateLibraryControls();

      for (let index = 0; index < documents.length; index += 1) {
        const documentItem = documents[index];
        const baseName = removeProjectExtension(documentItem.name || documentItem.fileName || `SOP-${index + 1}`);
        const pageCount = getProjectPageCount(documentItem.project);
        libraryStatusEl.textContent = `正在导出 PPT ${index + 1} / ${documents.length}：${baseName}（${pageCount} 页）`;
        const blob = await createPptxBlob(documentItem.project, baseName);
        downloadBlob(blob, `${sanitizeLibraryName(baseName) || `SOP-${index + 1}`}.pptx`);
        await delay(220);
      }

      libraryStatusEl.textContent = `批量导出PPT已结束：${documents.length} 个 SOP，已分别下载 .pptx 文件。`;
    } catch (error) {
      showFileError("批量导出PPT失败", error);
    } finally {
      libraryState.busy = false;
      updateLibraryControls();
    }
  }

  function ensurePptxExportReady() {
    if (!window.JSZip) {
      throw new Error("PPT导出依赖 JSZip 未加载，请刷新页面后重试。");
    }
  }

  async function collectVisibleLibraryProjects(label) {
    const rawDocuments = getVisibleLibraryDocuments();
    const currentProject = serializeProject({ includeHistory: true });
    const documents = [];

    for (const documentItem of rawDocuments) {
      const shouldUseCurrentProject = isCurrentLibraryDocument(documentItem);
      let project = shouldUseCurrentProject ? currentProject : documentItem.project;
      if (!project && documentItem.source === STORAGE_MODE_FEISHU) {
        libraryStatusEl.textContent = `正在读取飞书 SOP：${removeProjectExtension(documentItem.name)}（用于导出${label}）`;
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

    return documents;
  }

  async function createPptxBlob(project, title) {
    project = await hydrateProjectImageSourcesForExport(project);
    const zip = new JSZip();
    const pages = Array.isArray(project && project.pages) && project.pages.length ? project.pages : [{}];
    const media = [];
    const slideInfos = [];

    pages.forEach((pageData, index) => {
      const slide = buildPptxSlide(pageData || {}, index + 1, pages.length, media);
      slideInfos.push(slide);
    });

    addPptxPackageFiles(zip, slideInfos, media, title || "SOP");
    return zip.generateAsync({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      compression: "DEFLATE"
    });
  }

  function buildPptxSlide(pageData, pageNumber, pageTotal, media) {
    const rels = [{ id: "rId1", type: "slideLayout", target: "../slideLayouts/slideLayout1.xml" }];
    let relIndex = 2;
    let shapeId = 2;
    const elements = [];
    const textByKey = new Map((pageData.textCells || []).map((cell) => [cell.key, cell]));
    const imageByKey = new Map((pageData.imageSlots || []).map((slot) => [slot.key, slot]));
    const freeStepCards = getPptFreeStepCards(pageData);
    if (freeStepCards.length) {
      addFreeStepCardsToPptMaps(textByKey, imageByKey, freeStepCards);
    }
    let editableIndex = 0;
    let imageIndex = 0;

    const definitions = getPptPageDefinitions(pageData, freeStepCards);
    definitions.forEach((definition) => {
      const box = getPptCellBox(definition);
      if (definition.kind === "image") {
        const savedSlot = imageByKey.get(definition.cellKey) || (pageData.imageSlots || [])[imageIndex];
        imageIndex += 1;
        addPptImageCell(elements, rels, media, definition, savedSlot, box, () => shapeId++, () => `rId${relIndex++}`);
        return;
      }

      const editable = isPptEditableDefinition(definition);
      const savedCell = editable ? textByKey.get(definition.cellKey) || (pageData.textCells || [])[editableIndex] : null;
      if (editable) editableIndex += 1;
      const text = getPptTextCellText(definition, savedCell, pageNumber, pageTotal);
      addPptTextCell(elements, definition, box, text, shapeId++);
    });

    (pageData.globalAnnotations || []).forEach((model) => {
      addPptAnnotation(elements, model, 0, 0, () => shapeId++);
    });
    (pageData.globalTexts || []).forEach((model) => {
      addPptOverlayText(elements, model, 0, 0, () => shapeId++);
    });

    const xml = pptSlideXml(elements.join(""));
    const relXml = pptRelationshipsXml(rels);
    return { xml, relXml };
  }

  function getPptFreeStepCards(pageData) {
    if (!isFreeStepTemplateCount(getPageDataStepTemplateCount(pageData))) return [];
    return normalizeFreeStepCards(pageData && pageData.stepCards);
  }

  function addFreeStepCardsToPptMaps(textByKey, imageByKey, cards) {
    cards.forEach((card) => {
      if (card.imageSlot) {
        imageByKey.set(getFreeStepCardCellKey(card.id, "image"), {
          ...structuredCloneSafe(card.imageSlot),
          key: getFreeStepCardCellKey(card.id, "image")
        });
      }
      if (card.descCell) {
        textByKey.set(getFreeStepCardCellKey(card.id, "desc"), {
          ...structuredCloneSafe(card.descCell),
          key: getFreeStepCardCellKey(card.id, "desc")
        });
      }
      if (card.noteCell) {
        textByKey.set(getFreeStepCardCellKey(card.id, "note"), {
          ...structuredCloneSafe(card.noteCell),
          key: getFreeStepCardCellKey(card.id, "note")
        });
      }
    });
  }

  function getPptPageDefinitions(pageData, freeStepCards) {
    const count = getPageDataStepTemplateCount(pageData);
    const definitions = getTemplateCells(count).slice();
    if (isFreeStepTemplateCount(count)) {
      const layout = layoutFreeStepCards(freeStepCards || []);
      if (layout.ok) {
        layout.placements.forEach((placement) => {
          definitions.push(
            placement.definitions.image,
            placement.definitions.desc,
            placement.definitions.note
          );
        });
      }
    }
    return definitions.sort((a, b) => (a.row - b.row) || (a.col - b.col));
  }

  function addPptTextCell(elements, definition, box, text, shapeId) {
    const style = getPptCellStyle(definition);
    elements.push(pptShapeXml({
      id: shapeId,
      name: `Cell ${definition.cellKey}`,
      preset: "rect",
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      fill: style.fill,
      line: "111111",
      lineWidth: 0.75,
      text,
      fontSize: style.fontSize,
      bold: style.bold,
      align: style.align,
      color: "000000",
      margin: 1.2
    }));
  }

  function addPptImageCell(elements, rels, media, definition, savedSlot, box, nextShapeId, nextRelId) {
    const style = getPptImageCellStyle(definition);
    elements.push(pptShapeXml({
      id: nextShapeId(),
      name: `Image frame ${definition.cellKey}`,
      preset: "rect",
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      fill: style.fill,
      line: "111111",
      lineWidth: 0.75,
      text: "",
      margin: 0
    }));

    if (!savedSlot || savedSlot.hasImage !== true) return;

    if (savedSlot.mediaKind === "source" && savedSlot.sourceInfo) {
      const label = `${savedSlot.sourceInfo.type || "SOURCE"}\n${savedSlot.sourceInfo.name || "logo source file"}`;
      elements.push(pptShapeXml({
        id: nextShapeId(),
        name: `Logo source ${definition.cellKey}`,
        preset: "rect",
        x: box.x + 4,
        y: box.y + 4,
        w: Math.max(8, box.w - 8),
        h: Math.max(8, box.h - 8),
        fill: "FFFFFF",
        line: "B7B7B7",
        lineWidth: 0.6,
        text: label,
        fontSize: 10,
        bold: true,
        align: "center",
        color: "111111"
      }));
      addPptImageCellBorder(elements, definition, box, nextShapeId);
      return;
    }

    if (savedSlot.mediaKind !== "image" || !savedSlot.imageSrc) return;

    const image = addPptMedia(media, savedSlot.imageSrc);
    if (!image) return;

    const relId = nextRelId();
    rels.push({ id: relId, type: "image", target: `../media/${image.fileName}` });
    const imageBox = getPptImagePlacement(definition, savedSlot, box);
    elements.push(pptPictureXml({
      id: nextShapeId(),
      name: `Image ${definition.cellKey}`,
      relId,
      x: imageBox.x,
      y: imageBox.y,
      w: imageBox.w,
      h: imageBox.h,
      crop: imageBox.crop
    }));
    addPptImageCellBorder(elements, definition, box, nextShapeId);

    (savedSlot.annotations || []).forEach((model) => {
      addPptAnnotation(elements, model, box.gridX, box.gridY, nextShapeId);
    });
    (savedSlot.texts || []).forEach((model) => {
      addPptOverlayText(elements, model, box.gridX, box.gridY, nextShapeId, {
        boundsWidth: box.gridW,
        boundsHeight: box.gridH,
        context: "slot"
      });
    });
  }

  function addPptImageCellBorder(elements, definition, box, nextShapeId) {
    elements.push(pptShapeXml({
      id: nextShapeId(),
      name: `Image border ${definition.cellKey}`,
      preset: "rect",
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      fill: null,
      line: "111111",
      lineWidth: 0.75,
      text: "",
      margin: 0
    }));
  }

  function addPptAnnotation(elements, model, baseGridX, baseGridY, nextShapeId) {
    if (!model) return;
    const color = colorToHex(getOverlayColor(model));
    if (model.type === "circle") {
      elements.push(pptShapeXml({
        id: nextShapeId(),
        name: "Circle annotation",
        preset: "ellipse",
        x: gridXToMm(baseGridX + model.cx - model.r),
        y: gridYToMm(baseGridY + model.cy - model.r),
        w: gridWidthToMm(model.r * 2),
        h: gridHeightToMm(model.r * 2),
        fill: null,
        line: color,
        lineWidth: 2.25
      }));
      return;
    }
    if (model.type === "rect") {
      elements.push(pptShapeXml({
        id: nextShapeId(),
        name: "Rectangle annotation",
        preset: "rect",
        x: gridXToMm(baseGridX + model.x),
        y: gridYToMm(baseGridY + model.y),
        w: gridWidthToMm(model.width),
        h: gridHeightToMm(model.height),
        fill: null,
        line: color,
        lineWidth: 2.25
      }));
      return;
    }
    ensureArrowControlPoint(model);
    elements.push(pptQuadraticArrowXml({
      id: nextShapeId(),
      name: "Arrow annotation",
      x1: gridXToMm(baseGridX + model.x1),
      y1: gridYToMm(baseGridY + model.y1),
      controlX: gridXToMm(baseGridX + model.controlX),
      controlY: gridYToMm(baseGridY + model.controlY),
      x2: gridXToMm(baseGridX + model.x2),
      y2: gridYToMm(baseGridY + model.y2),
      color,
      width: 2.25
    }));
  }

  function addPptOverlayText(elements, model, baseGridX, baseGridY, nextShapeId, options = {}) {
    if (!model) return;
    if (options.context === "slot") {
      normalizeEditorTextModel(model, {
        clientWidth: options.boundsWidth || PPT_GRID_WIDTH,
        clientHeight: options.boundsHeight || PPT_GRID_HEIGHT
      });
    } else {
      normalizeGlobalTextModel(model);
    }
    const color = colorToHex(getOverlayColor(model));
    const isBubble = model.type === "bubble";
    elements.push(pptShapeXml({
      id: nextShapeId(),
      name: isBubble ? "Bubble text" : "Text annotation",
      preset: isBubble ? "roundRect" : "rect",
      x: gridXToMm(baseGridX + model.x),
      y: gridYToMm(baseGridY + model.y),
      w: gridWidthToMm(model.width),
      h: gridHeightToMm(model.height),
      fill: "FFFFFF",
      line: color,
      lineWidth: 1.4,
      text: model.text || "",
      fontSize: pxToPt(getTextFontSize(model)),
      bold: true,
      align: "center",
      color,
      margin: 1.4
    }));
    if (isBubble) {
      const tail = getBubbleTailGeometry(
        model,
        options.boundsWidth || PPT_GRID_WIDTH,
        options.boundsHeight || PPT_GRID_HEIGHT
      );
      elements.push(pptLineXml({
        id: nextShapeId(),
        name: "Bubble tail",
        x1: gridXToMm(baseGridX + tail.baseCenter.x),
        y1: gridYToMm(baseGridY + tail.baseCenter.y),
        x2: gridXToMm(baseGridX + tail.tip.x),
        y2: gridYToMm(baseGridY + tail.tip.y),
        color,
        width: 2,
        arrow: false
      }));
    }
  }

  function addPptxPackageFiles(zip, slides, media, title) {
    zip.file("[Content_Types].xml", pptContentTypesXml(slides.length));
    zip.file("_rels/.rels", packageRelationshipsXml());
    zip.file("docProps/core.xml", corePropertiesXml(title));
    zip.file("docProps/app.xml", appPropertiesXml(slides.length));
    zip.file("ppt/presentation.xml", presentationXml(slides.length));
    zip.file("ppt/_rels/presentation.xml.rels", presentationRelationshipsXml(slides.length));
    zip.file("ppt/slideMasters/slideMaster1.xml", slideMasterXml());
    zip.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", slideMasterRelationshipsXml());
    zip.file("ppt/slideLayouts/slideLayout1.xml", slideLayoutXml());
    zip.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", slideLayoutRelationshipsXml());
    zip.file("ppt/theme/theme1.xml", themeXml());
    slides.forEach((slide, index) => {
      zip.file(`ppt/slides/slide${index + 1}.xml`, slide.xml);
      zip.file(`ppt/slides/_rels/slide${index + 1}.xml.rels`, slide.relXml);
    });
    media.forEach((item) => {
      zip.file(`ppt/media/${item.fileName}`, item.data, { base64: true });
    });
  }

  function addPptMedia(media, dataUrl) {
    const parsed = parseDataUrl(dataUrl);
    if (!parsed) return null;
    const extension = getPptImageExtension(parsed.mimeType);
    const fileName = `image${media.length + 1}.${extension}`;
    const item = {
      fileName,
      mimeType: parsed.mimeType,
      data: parsed.base64
    };
    media.push(item);
    return item;
  }

  function parseDataUrl(dataUrl) {
    const match = String(dataUrl || "").match(/^data:([^;,]+)(;base64)?,(.*)$/i);
    if (!match) return null;
    const mimeType = match[1].toLowerCase();
    const rawData = match[3] || "";
    const base64 = match[2] ?
      rawData.replace(/\s+/g, "") :
      window.btoa(unescape(encodeURIComponent(decodeURIComponent(rawData))));
    return { mimeType, base64 };
  }

  function getPptImageExtension(mimeType) {
    if (mimeType === "image/jpeg") return "jpg";
    if (mimeType === "image/png") return "png";
    if (mimeType === "image/gif") return "gif";
    if (mimeType === "image/bmp") return "bmp";
    if (mimeType === "image/svg+xml") return "svg";
    if (mimeType === "image/webp") return "webp";
    return "png";
  }

  function getPptImagePlacement(definition, savedSlot, box) {
    if (definition.logo || definition.fit === "contain") {
      const state = savedSlot.imageState || {};
      const naturalWidth = Number(state.naturalWidth) || box.gridW;
      const naturalHeight = Number(state.naturalHeight) || box.gridH;
      const inset = definition.logo ? 6 : 0;
      const maxW = Math.max(1, box.gridW - inset * 2);
      const maxH = Math.max(1, box.gridH - inset * 2);
      const ratio = Math.min(maxW / naturalWidth, maxH / naturalHeight);
      const gridW = naturalWidth * ratio;
      const gridH = naturalHeight * ratio;
      return {
        x: gridXToMm(box.gridX + (box.gridW - gridW) / 2),
        y: gridYToMm(box.gridY + (box.gridH - gridH) / 2),
        w: gridWidthToMm(gridW),
        h: gridHeightToMm(gridH),
        crop: null
      };
    }

    return {
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      crop: getPptImageCrop(savedSlot, box)
    };
  }

  function getPptImageCrop(savedSlot, box) {
    const state = savedSlot.imageState || {};
    const naturalWidth = Number(state.naturalWidth) || 0;
    const naturalHeight = Number(state.naturalHeight) || 0;
    const scale = Number(state.scale) || 1;
    if (!naturalWidth || !naturalHeight || !scale) return null;

    const left = clamp((-Number(state.x || 0)) / scale, 0, naturalWidth);
    const top = clamp((-Number(state.y || 0)) / scale, 0, naturalHeight);
    const right = clamp((box.gridW - Number(state.x || 0)) / scale, 0, naturalWidth);
    const bottom = clamp((box.gridH - Number(state.y || 0)) / scale, 0, naturalHeight);
    return {
      l: Math.round((left / naturalWidth) * 100000),
      t: Math.round((top / naturalHeight) * 100000),
      r: Math.round(((naturalWidth - right) / naturalWidth) * 100000),
      b: Math.round(((naturalHeight - bottom) / naturalHeight) * 100000)
    };
  }

  function getPptCellBox(definition) {
    const gridX = getPptGridColumnStart(definition.col);
    const gridY = getPptGridRowStart(definition.row);
    const gridW = sumRange(PPT_COL_FRACTIONS, definition.col - 1, definition.colSpan);
    const gridH = sumRange(PPT_ROW_FRACTIONS, definition.row - 1, definition.rowSpan);
    return {
      gridX,
      gridY,
      gridW,
      gridH,
      x: gridXToMm(gridX),
      y: gridYToMm(gridY),
      w: gridWidthToMm(gridW),
      h: gridHeightToMm(gridH)
    };
  }

  function getPptGridColumnStart(col) {
    return sumRange(PPT_COL_FRACTIONS, 0, Math.max(0, col - 1));
  }

  function getPptGridRowStart(row) {
    return sumRange(PPT_ROW_FRACTIONS, 0, Math.max(0, row - 1));
  }

  function sumRange(values, start, count) {
    return values.slice(start, start + count).reduce((sum, value) => sum + value, 0);
  }

  function gridXToMm(value) {
    return PPT_CONTENT_X_MM + (Number(value) || 0) / PPT_GRID_WIDTH * PPT_CONTENT_WIDTH_MM;
  }

  function gridYToMm(value) {
    return PPT_CONTENT_Y_MM + (Number(value) || 0) / PPT_GRID_HEIGHT * PPT_CONTENT_HEIGHT_MM;
  }

  function gridWidthToMm(value) {
    return (Number(value) || 0) / PPT_GRID_WIDTH * PPT_CONTENT_WIDTH_MM;
  }

  function gridHeightToMm(value) {
    return (Number(value) || 0) / PPT_GRID_HEIGHT * PPT_CONTENT_HEIGHT_MM;
  }

  function isPptEditableDefinition(definition) {
    return Boolean(!definition.autoPage && (definition.editable || (definition.fields && definition.fields.length)));
  }

  function getPptTextCellText(definition, savedCell, pageNumber, pageTotal) {
    if (definition.autoPage) {
      return `页码：${pageNumber} / ${pageTotal}`;
    }
    if (definition.fields && definition.fields.length) {
      const values = getPptSavedFieldValues(definition, savedCell);
      return definition.fields.map((field, index) => {
        return `${field.label || ""}${values[index] || ""}`;
      }).join("");
    }
    if (definition.editable) {
      return savedCell ? savedCell.text || "" : definition.text || "";
    }
    return definition.text || "";
  }

  function getPptSavedFieldValues(definition, savedCell) {
    if (savedCell && Array.isArray(savedCell.values) && savedCell.values.length) {
      const valuesByKey = new Map(savedCell.values.map((item) => [item.key, item]));
      return definition.fields.map((field, index) => {
        const savedValue = valuesByKey.get(field.key) || savedCell.values[index];
        return savedValue ? savedValue.text || "" : "";
      });
    }
    if (savedCell && savedCell.text) {
      return parseTextWithLabels(savedCell.text, definition.fields.map((field) => field.label || ""));
    }
    return definition.fields.map(() => "");
  }

  function parseTextWithLabels(text, labels) {
    const content = String(text || "");
    const matches = labels.map((label) => findLabelInText(content, label));
    if (matches.every((match) => match.index < 0)) {
      return labels.length === 1 ? [content.trim()] : labels.map(() => "");
    }
    return labels.map((label, index) => {
      const match = matches[index];
      if (match.index < 0) return "";
      const start = match.index + match.length;
      const next = matches.slice(index + 1).find((item) => item.index >= 0 && item.index >= start);
      const end = next ? next.index : content.length;
      return content.slice(start, end).trim();
    });
  }

  function getPptCellStyle(definition) {
    const className = definition.className || "";
    if (className.includes("header-cell")) return { fill: "D9D9D9", bold: true, fontSize: 12, align: "left" };
    if (className.includes("section-title")) return { fill: "EEEEEE", bold: true, fontSize: 13.5, align: "center" };
    if (className.includes("note-cell")) return { fill: "FFF3C4", bold: true, fontSize: 9.75, align: "left" };
    if (className.includes("footer-cell")) return { fill: "EEEEEE", bold: false, fontSize: 9, align: className.includes("center") ? "center" : "left" };
    if (className.includes("blank-cell")) return { fill: "FAFAFA", bold: false, fontSize: 9, align: "left" };
    return { fill: "FFFFFF", bold: className.includes("material-label") ? false : false, fontSize: 9, align: className.includes("center") ? "center" : "left" };
  }

  function getPptImageCellStyle(definition) {
    return { fill: definition.logo ? "D9D9D9" : "FAFAFA" };
  }

  function pptShapeXml(options) {
    const shapeId = options.id;
    const text = options.text || "";
    const hasText = text.length > 0;
    const fillXml = options.fill ? pptSolidFillXml(options.fill) : "<a:noFill/>";
    const lineXml = options.line ? pptLineXmlPart(options.line, options.lineWidth || 0.75) : "<a:ln><a:noFill/></a:ln>";
    return `
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="${shapeId}" name="${xmlEscape(options.name || `Shape ${shapeId}`)}"/>
          <p:cNvSpPr txBox="${hasText ? 1 : 0}"/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          ${pptXfrmXml(options.x, options.y, options.w, options.h)}
          <a:prstGeom prst="${options.preset || "rect"}"><a:avLst/></a:prstGeom>
          ${fillXml}
          ${lineXml}
        </p:spPr>
        ${pptTextBodyXml(text, options)}
      </p:sp>`;
  }

  function pptLineXml(options) {
    const minX = Math.min(options.x1, options.x2);
    const minY = Math.min(options.y1, options.y2);
    const width = Math.max(0.1, Math.abs(options.x2 - options.x1));
    const height = Math.max(0.1, Math.abs(options.y2 - options.y1));
    const flipH = options.x2 < options.x1 ? ' flipH="1"' : "";
    const flipV = options.y2 < options.y1 ? ' flipV="1"' : "";
    const arrowXml = options.arrow ? '<a:tailEnd type="triangle"/>' : "";
    return `
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="${options.id}" name="${xmlEscape(options.name || `Line ${options.id}`)}"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm${flipH}${flipV}>
            <a:off x="${mmToEmu(minX)}" y="${mmToEmu(minY)}"/>
            <a:ext cx="${mmToEmu(width)}" cy="${mmToEmu(height)}"/>
          </a:xfrm>
          <a:prstGeom prst="line"><a:avLst/></a:prstGeom>
          <a:ln w="${ptToEmu(options.width || 2)}">
            <a:solidFill><a:srgbClr val="${colorToHex(options.color)}"/></a:solidFill>
            ${arrowXml}
          </a:ln>
        </p:spPr>
        ${pptTextBodyXml("", {})}
      </p:sp>`;
  }

  function pptQuadraticArrowXml(options) {
    const minX = Math.min(options.x1, options.controlX, options.x2);
    const minY = Math.min(options.y1, options.controlY, options.y2);
    const width = Math.max(0.1, Math.max(options.x1, options.controlX, options.x2) - minX);
    const height = Math.max(0.1, Math.max(options.y1, options.controlY, options.y2) - minY);
    const widthEmu = mmToEmu(width);
    const heightEmu = mmToEmu(height);
    const localX = (value) => mmToEmu(value - minX);
    const localY = (value) => mmToEmu(value - minY);

    return `
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="${options.id}" name="${xmlEscape(options.name || `Curved arrow ${options.id}`)}"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${mmToEmu(minX)}" y="${mmToEmu(minY)}"/>
            <a:ext cx="${widthEmu}" cy="${heightEmu}"/>
          </a:xfrm>
          <a:custGeom>
            <a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/>
            <a:rect l="l" t="t" r="r" b="b"/>
            <a:pathLst>
              <a:path w="${widthEmu}" h="${heightEmu}">
                <a:moveTo><a:pt x="${localX(options.x1)}" y="${localY(options.y1)}"/></a:moveTo>
                <a:quadBezTo>
                  <a:pt x="${localX(options.controlX)}" y="${localY(options.controlY)}"/>
                  <a:pt x="${localX(options.x2)}" y="${localY(options.y2)}"/>
                </a:quadBezTo>
              </a:path>
            </a:pathLst>
          </a:custGeom>
          <a:noFill/>
          <a:ln w="${ptToEmu(options.width || 2)}">
            <a:solidFill><a:srgbClr val="${colorToHex(options.color)}"/></a:solidFill>
            <a:tailEnd type="triangle"/>
          </a:ln>
        </p:spPr>
        ${pptTextBodyXml("", {})}
      </p:sp>`;
  }

  function pptPictureXml(options) {
    const crop = options.crop;
    const cropXml = crop ? `<a:srcRect l="${clamp(crop.l, 0, 100000)}" t="${clamp(crop.t, 0, 100000)}" r="${clamp(crop.r, 0, 100000)}" b="${clamp(crop.b, 0, 100000)}"/>` : "";
    return `
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="${options.id}" name="${xmlEscape(options.name || `Picture ${options.id}`)}"/>
          <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="${options.relId}"/>
          ${cropXml}
          <a:stretch><a:fillRect/></a:stretch>
        </p:blipFill>
        <p:spPr>
          ${pptXfrmXml(options.x, options.y, options.w, options.h)}
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        </p:spPr>
      </p:pic>`;
  }

  function pptTextBodyXml(text, options = {}) {
    const paragraphs = String(text || "").split(/\n/);
    const fontSize = Math.max(1, Math.round((Number(options.fontSize) || 9) * 100));
    const margin = mmToEmu(options.margin === undefined ? 0.8 : options.margin);
    const align = options.align === "center" ? ' algn="ctr"' : "";
    const bold = options.bold ? ' b="1"' : "";
    const color = colorToHex(options.color || "000000");
    const paragraphXml = (paragraphs.length ? paragraphs : [""]).map((line) => {
      return `<a:p><a:pPr${align}/><a:r><a:rPr lang="zh-CN" sz="${fontSize}"${bold}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Microsoft YaHei"/><a:ea typeface="Microsoft YaHei"/><a:cs typeface="Microsoft YaHei"/></a:rPr><a:t>${xmlEscape(line)}</a:t></a:r><a:endParaRPr lang="zh-CN" sz="${fontSize}"/></a:p>`;
    }).join("");
    return `
      <p:txBody>
        <a:bodyPr lIns="${margin}" tIns="${margin}" rIns="${margin}" bIns="${margin}" anchor="mid" wrap="square"/>
        <a:lstStyle/>
        ${paragraphXml}
      </p:txBody>`;
  }

  function pptXfrmXml(x, y, w, h) {
    return `<a:xfrm><a:off x="${mmToEmu(x)}" y="${mmToEmu(y)}"/><a:ext cx="${mmToEmu(w)}" cy="${mmToEmu(h)}"/></a:xfrm>`;
  }

  function pptSolidFillXml(color) {
    return `<a:solidFill><a:srgbClr val="${colorToHex(color)}"/></a:solidFill>`;
  }

  function pptLineXmlPart(color, widthPt) {
    return `<a:ln w="${ptToEmu(widthPt)}"><a:solidFill><a:srgbClr val="${colorToHex(color)}"/></a:solidFill></a:ln>`;
  }

  function pptSlideXml(shapeTreeXml) {
    return xmlHeader() + `
      <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
        <p:cSld>
          <p:spTree>
            <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
            <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
            ${shapeTreeXml}
          </p:spTree>
        </p:cSld>
        <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
      </p:sld>`;
  }

  function pptRelationshipsXml(rels) {
    return xmlHeader() + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels.map((rel) => {
      const type = rel.type === "image" ?
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" :
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout";
      return `<Relationship Id="${rel.id}" Type="${type}" Target="${xmlEscape(rel.target)}"/>`;
    }).join("")}</Relationships>`;
  }

  function pptContentTypesXml(slideCount) {
    const slideOverrides = Array.from({ length: slideCount }, (_, index) => {
      return `<Override PartName="/ppt/slides/slide${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
    }).join("");
    return xmlHeader() + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Default Extension="png" ContentType="image/png"/>
      <Default Extension="jpg" ContentType="image/jpeg"/>
      <Default Extension="jpeg" ContentType="image/jpeg"/>
      <Default Extension="gif" ContentType="image/gif"/>
      <Default Extension="bmp" ContentType="image/bmp"/>
      <Default Extension="svg" ContentType="image/svg+xml"/>
      <Default Extension="webp" ContentType="image/webp"/>
      <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
      <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
      <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
      <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
      <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
      <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
      ${slideOverrides}
    </Types>`;
  }

  function packageRelationshipsXml() {
    return xmlHeader() + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
      <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
      <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
    </Relationships>`;
  }

  function presentationXml(slideCount) {
    const slideIds = Array.from({ length: slideCount }, (_, index) => {
      return `<p:sldId id="${256 + index}" r:id="rId${index + 2}"/>`;
    }).join("");
    return xmlHeader() + `<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
      <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
      <p:sldIdLst>${slideIds}</p:sldIdLst>
      <p:sldSz cx="${mmToEmu(PPT_SLIDE_WIDTH_MM)}" cy="${mmToEmu(PPT_SLIDE_HEIGHT_MM)}" type="custom"/>
      <p:notesSz cx="6858000" cy="9144000"/>
    </p:presentation>`;
  }

  function presentationRelationshipsXml(slideCount) {
    const slideRels = Array.from({ length: slideCount }, (_, index) => {
      return `<Relationship Id="rId${index + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${index + 1}.xml"/>`;
    }).join("");
    return xmlHeader() + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
      ${slideRels}
    </Relationships>`;
  }

  function slideMasterXml() {
    return xmlHeader() + `<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
      <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
      <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
      <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
      <p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles>
    </p:sldMaster>`;
  }

  function slideMasterRelationshipsXml() {
    return xmlHeader() + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
      <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
    </Relationships>`;
  }

  function slideLayoutXml() {
    return xmlHeader() + `<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
      <p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
      <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
    </p:sldLayout>`;
  }

  function slideLayoutRelationshipsXml() {
    return xmlHeader() + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
    </Relationships>`;
  }

  function themeXml() {
    return xmlHeader() + `<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="SOP">
      <a:themeElements>
        <a:clrScheme name="SOP"><a:dk1><a:srgbClr val="000000"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F2937"/></a:dk2><a:lt2><a:srgbClr val="F8FAFC"/></a:lt2><a:accent1><a:srgbClr val="2563EB"/></a:accent1><a:accent2><a:srgbClr val="EF1D1D"/></a:accent2><a:accent3><a:srgbClr val="10B981"/></a:accent3><a:accent4><a:srgbClr val="F59E0B"/></a:accent4><a:accent5><a:srgbClr val="7C3AED"/></a:accent5><a:accent6><a:srgbClr val="0EA5E9"/></a:accent6><a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink></a:clrScheme>
        <a:fontScheme name="SOP"><a:majorFont><a:latin typeface="Microsoft YaHei"/><a:ea typeface="Microsoft YaHei"/><a:cs typeface="Microsoft YaHei"/></a:majorFont><a:minorFont><a:latin typeface="Microsoft YaHei"/><a:ea typeface="Microsoft YaHei"/><a:cs typeface="Microsoft YaHei"/></a:minorFont></a:fontScheme>
        <a:fmtScheme name="SOP"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme>
      </a:themeElements>
    </a:theme>`;
  }

  function corePropertiesXml(title) {
    const now = new Date().toISOString();
    return xmlHeader() + `<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <dc:title>${xmlEscape(title || "SOP")}</dc:title>
      <dc:creator>SOP编辑器</dc:creator>
      <cp:lastModifiedBy>SOP编辑器</cp:lastModifiedBy>
      <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
      <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
    </cp:coreProperties>`;
  }

  function appPropertiesXml(slideCount) {
    return xmlHeader() + `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
      <Application>SOP编辑器</Application>
      <PresentationFormat>A4 Landscape</PresentationFormat>
      <Slides>${slideCount}</Slides>
      <ScaleCrop>false</ScaleCrop>
    </Properties>`;
  }

  function xmlHeader() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  }

  function xmlEscape(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function colorToHex(value) {
    const text = String(value || "").trim();
    if (/^[0-9a-f]{6}$/i.test(text)) {
      return text.toUpperCase();
    }
    if (/^#[0-9a-f]{6}$/i.test(text)) {
      return text.slice(1).toUpperCase();
    }
    if (/^#[0-9a-f]{3}$/i.test(text)) {
      return normalizeOverlayColor(text).replace("#", "").toUpperCase();
    }
    return DEFAULT_OVERLAY_COLOR.replace("#", "").toUpperCase();
  }

  function pxToPt(value) {
    return Math.max(1, (Number(value) || 12) * 0.75);
  }

  function mmToEmu(value) {
    return Math.round((Number(value) || 0) * EMU_PER_MM);
  }

  function ptToEmu(value) {
    return Math.round((Number(value) || 0) * 12700);
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
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
        const pageData = pagesData[index] || {};
        const page = buildPage(nextPageId++, {
          stepTemplateCount: getPageDataStepTemplateCount(pageData),
          stepCards: pageData.stepCards
        });
        page.dataset.batchDocumentId = documentItem.documentId || "";
        page.dataset.batchFileName = documentItem.name || "";
        pagesEl.appendChild(page);
        await applyPageData(page, pageData);
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
    projectState.globalInfo = normalizeGlobalInfo(restore.project && restore.project.document && restore.project.document.globalInfo);
    projectState.history = cloneHistory(restore.history || []);
    if (restore.pageTitle) {
      document.title = restore.pageTitle;
    }
    updateGlobalInfoControls(projectState.globalInfo);
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
    if (globalEditor.selected && globalEditor.selected.pageId === page.dataset.pageId) {
      globalEditor.selected = null;
      globalEditor.drag = null;
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
    updateAddStepCardControl();
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

    const viewportRect = workspaceEl ? workspaceEl.getBoundingClientRect() : null;
    const viewportCenter = viewportRect ?
      viewportRect.top + viewportRect.height / 2 :
      window.innerHeight / 2;
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
    updateAddStepCardControl();
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
