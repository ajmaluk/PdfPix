"use client";

import React, { createContext, useContext, useState } from "react";

interface ToolContextType {
  hasFiles: boolean;
  setHasFiles: (has: boolean) => void;
  fileCount: number;
  setFileCount: (count: number) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: React.ReactNode }) {
  const [hasFiles, setHasFiles] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToolContext.Provider value={{ hasFiles, setHasFiles, fileCount, setFileCount, sidebarOpen, setSidebarOpen }}>
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const context = useContext(ToolContext);
  if (!context) {
    return {
      hasFiles: false,
      setHasFiles: () => {},
      fileCount: 0,
      setFileCount: () => {},
      sidebarOpen: false,
      setSidebarOpen: () => {},
    };
  }
  return context;
}
