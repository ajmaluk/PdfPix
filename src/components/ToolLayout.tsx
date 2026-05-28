import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolProvider, useTool } from "@/components/ToolContext";

interface ToolLayoutProps {
  title: string;
  subtitle: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  hasFiles?: boolean;
  fileCount?: number;
}

function ToolLayoutInner({ title, subtitle, sidebar, children }: ToolLayoutProps) {
  const { hasFiles, sidebarOpen, setSidebarOpen } = useTool();

  return (
    <>
      <Header />
      <div className={`main toolpage ${hasFiles ? "has-files" : "no-files"}`}>
        <div className={`tool ${hasFiles ? "tool--has-files" : "tool--no-files tool--small"}`}>
          <div className="tool__workarea" id="workArea">
            <div id="dropArea"></div>
            {!hasFiles && (
              <div className="tool__header">
                <h1 className="tool__header__title">{title}</h1>
                <h2 className="tool__header__subtitle">{subtitle}</h2>
              </div>
            )}
            {hasFiles && (
              <div className="uploading__bar uploading__bar--small">
                <span className="uploading__bar__completed"></span>
              </div>
            )}
            {children}
          </div>
          {hasFiles && sidebar && (
            <>
              {/* Mobile Gear Settings Toggle Button */}
              <button 
                type="button"
                className="mobile-settings-toggle show--sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle settings panel"
                aria-expanded={sidebarOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>

              {/* Sidebar Backdrop Overlay on Mobile */}
              {sidebarOpen && (
                <div className="sidebar-backdrop show--sm" onClick={() => setSidebarOpen(false)}></div>
              )}

              {/* Settings Sidebar Panel */}
              <div id="sidebar" className={`tool__sidebar ${sidebarOpen ? "open" : ""}`}>
                {sidebar}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function ToolLayout(props: ToolLayoutProps) {
  return (
    <ToolProvider initialHasFiles={props.hasFiles} initialFileCount={props.fileCount}>
      <ToolLayoutInner {...props} />
    </ToolProvider>
  );
}
