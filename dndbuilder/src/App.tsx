import { useState, useCallback, useRef, useEffect } from "react";
import BottomToolbar from "./dialogs/BottomToolbar";
import CharacterSheet from "./pages/PageFront";
import CharacterBackSide from "./pages/PageBack";
import SpellSheet from "./pages/PageSpell";
import ArchiveDialog from "./dialogs/ArchiveDialog";
import ExportDialog from "./dialogs/ExportPdfDialog";
import CustomItemDialog from "./dialogs/CustomItemDialog";
import { CharacterProvider } from "./shared/storage/CharacterContext";
import MobileWarning from "./shared/touch/MobileWarning";

// 用户交互时重试持久存储请求（user gesture 下授予概率更高）
let persistRetried = false;
function retryPersistOnUserGesture() {
  if (persistRetried) return;
  persistRetried = true;
  document.removeEventListener("click", retryPersistOnUserGesture);
  if (navigator.storage?.persist) {
    navigator.storage.persist().then((granted) => {
      if (granted) console.log("✅ 持久存储权限已授予（用户交互后）");
    });
  }
}
document.addEventListener("click", retryPersistOnUserGesture, { once: true });

// ============================================================================
// 页面导航栏
// ============================================================================

function PageNavigationBar() {
  return (
    <div className="absolute bg-sheet-nav-bg h-[75px] left-0 overflow-clip rounded-tl-[5px] rounded-tr-[5px] top-0 w-[1224px]" data-name="page-navigation">
      <div className="-translate-x-1/2 absolute h-[67px] left-1/2 overflow-clip top-[8px] w-[1208px]" data-name="page-turner">
        <div className="absolute h-[67px] left-[1137px] overflow-clip rounded-[3px] top-0 w-[71px]" data-name="add-page">
          <div className="absolute inset-[20.9%_22.54%]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 39">
              <g clipPath="url(#clip0_4_1163)" id="add-page-icon">
                <g id="Vector" />
                <path d="M19.5 9.75V29.25" id="Vector_2" stroke="var(--color-sheet-text-secondary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d="M9.75 19.5H29.25" id="Vector_3" stroke="var(--color-sheet-text-secondary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <defs>
                <clipPath id="clip0_4_1163">
                  <rect fill="white" height="39" width="39" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale] = useState(0.8);
  const pinchRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setScale(s => {
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      return Math.max(0.5, Math.min(1.1, +(s + delta).toFixed(2)));
    });
  }, []);

  // 用原生事件监听避免被动模式导致 preventDefault 失效
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 2 || pinchRef.current === null) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ratio = dist / pinchRef.current;
    pinchRef.current = dist;
    setScale(s => Math.max(0.5, Math.min(1.1, +(s * ratio).toFixed(2))));
  }, []);

  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null;
  }, []);

  const closeDialog = () => setActiveDialog(null);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* 主内容区域 */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
        <div className="flex items-start justify-center min-w-max">
          {/* 画布缩放容器 - 支持 Ctrl+滚轮 / 双指缩放 */}
          <div
            ref={canvasRef}
            className="canvas-scale-wrapper"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center top', touchAction: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="canvas-content" style={{ width: '1414px', height: '1410px' }}>
                {/* 角色卡内容（包含页码标签） */}
                <div className="relative mx-auto" style={{ width: "1224px", height: "1659px", filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))' }}>
                  <PageNavigationBar />
                  {currentPage === 0 && <CharacterSheet />}
                  {currentPage === 1 && <CharacterBackSide />}
                  {currentPage === 2 && <SpellSheet />}

                  {/* 页码标签样式控制层 */}
                  <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[1208px] h-[67px] pointer-events-none">
                    {[0, 1, 2].map((page) => (
                      <div
                        key={page}
                        className={`absolute top-0 h-[67px] w-[379px] rounded-tl-[3px] rounded-tr-[3px] transition-opacity duration-200 ${
                          currentPage === page ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ left: `${page * 379}px` }}
                      >
                        <div className="absolute inset-0 bg-white rounded-tl-[3px] rounded-tr-[3px]" />
                        <div className="relative h-full flex items-center justify-center">
                          <span
                            className="font-sans-medium-cjk font-medium text-[20px] text-sheet-text-page-active"
                            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
                          >
                            {page === 0 ? '第一页' : page === 1 ? '第二页' : '第三页'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {[0, 1, 2].map((page) => (
                      <div
                        key={`mask-${page}`}
                        className={`absolute top-0 h-[67px] w-[379px] rounded-tl-[3px] rounded-tr-[3px] bg-sheet-nav-bg flex items-center justify-center transition-opacity duration-200 ${
                          currentPage === page ? 'opacity-0' : 'opacity-100'
                        }`}
                        style={{ left: `${page * 379}px` }}
                      >
                        <span
                          className="font-sans-medium-cjk font-medium text-[20px] text-sheet-text-secondary"
                          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
                        >
                          {page === 0 ? '第一页' : page === 1 ? '第二页' : '第三页'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 页码标签点击区域 */}
                  <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[1208px] h-[67px] pointer-events-none">
                    {[0, 1, 2].map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="absolute top-0 h-[67px] w-[379px] pointer-events-auto cursor-pointer transition-all duration-200 hover:opacity-80"
                        style={{ left: `${page * 379}px`, background: 'transparent', border: 'none' }}
                      />
                    ))}
                    <button
                      className="absolute left-[1137px] top-0 h-[67px] w-[71px] pointer-events-auto cursor-pointer hover:opacity-60 transition-all duration-200"
                      style={{ background: 'transparent', border: 'none' }}
                    />
                  </div>

                  {/* 左翻页按钮 - 绝对定位叠在左侧 */}
                  <div className="absolute" style={{ top: "8px", left: "-95px" }}>
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 hover:scale-110 active:scale-105"
                      style={{
                        width: "75px",
                        height: "67px",
                        filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15))',
                      }}
                    >
                      <div className="bg-white overflow-clip relative rounded-[34px] size-full shadow-md group-hover:shadow-xl transition-shadow duration-200">
                        <div className="absolute left-[15px] size-[37px] top-[15px]">
                          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 37">
                            <g>
                              <path
                                clipRule="evenodd"
                                d="M24.2151 6.61821C24.8171 7.22027 24.8171 8.19639 24.2151 8.79846L14.5136 18.5L24.2151 28.2016C24.8171 28.8036 24.8171 29.7798 24.2151 30.3818C23.6131 30.9838 22.6369 30.9838 22.0349 30.3818L11.2432 19.5901C10.9541 19.301 10.7917 18.9088 10.7917 18.5C10.7917 18.0911 10.9541 17.6989 11.2432 17.4099L22.0349 6.61821C22.6369 6.01615 23.6131 6.01615 24.2151 6.61821Z"
                                fill="var(--color-sheet-icon-nav-default)"
                                fillRule="evenodd"
                                className="group-hover:fill-sheet-icon-hover transition-colors duration-200 group-disabled:fill-sheet-icon-disabled"
                              />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* 右翻页按钮 - 绝对定位叠在右侧 */}
                  <div className="absolute" style={{ top: "8px", right: "-95px" }}>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === 2}
                      className="group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 hover:scale-110 active:scale-105"
                      style={{
                        width: "75px",
                        height: "67px",
                        filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15))',
                      }}
                    >
                      <div className="bg-white overflow-clip relative rounded-[34px] size-full shadow-md group-hover:shadow-xl transition-shadow duration-200">
                        <div className="absolute right-[15px] size-[37px] top-[15px]">
                          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 37">
                            <g>
                              <path
                                clipRule="evenodd"
                                d="M12.7849 6.61821C12.1829 7.22027 12.1829 8.19639 12.7849 8.79846L22.4864 18.5L12.7849 28.2016C12.1829 28.8036 12.1829 29.7798 12.7849 30.3818C13.3869 30.9838 14.3631 30.9838 14.9651 30.3818L25.7568 19.5901C26.0459 19.301 26.2083 18.9088 26.2083 18.5C26.2083 18.0911 26.0459 17.6989 25.7568 17.4099L14.9651 6.61821C14.3631 6.01615 13.3869 6.01615 12.7849 6.61821Z"
                                fill="var(--color-sheet-icon-nav-default)"
                                fillRule="evenodd"
                                className="group-hover:fill-sheet-icon-hover transition-colors duration-200 group-disabled:fill-sheet-icon-disabled"
                              />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部工具栏 */}
      <BottomToolbar
        onExportFileClick={() => setActiveDialog("export")}
        onBuildGuideClick={() => setActiveDialog("guide")}
        onArchiveManageClick={() => setActiveDialog("archive")}
        onCustomItemClick={() => setActiveDialog("custom")}
      />

      {/* 对话框 */}
      <ArchiveDialog open={activeDialog === "archive"} onOpenChange={(open) => { if (!open) closeDialog(); }} />
      <ExportDialog open={activeDialog === "export"} onOpenChange={(open) => { if (!open) closeDialog(); }} />
      <CustomItemDialog open={activeDialog === "custom"} onOpenChange={(open) => { if (!open) closeDialog(); }} />
    </div>
  );
}

export default function App() {
  return (
    <CharacterProvider>
      <MobileWarning />
      <AppContent />
    </CharacterProvider>
  );
}
