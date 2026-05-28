"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ToolContextType {
  hasFiles: boolean;
  setHasFiles: (has: boolean) => void;
  fileCount: number;
  setFileCount: (count: number) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

const noop = () => {};

const defaultToolContext: ToolContextType = {
  hasFiles: false,
  setHasFiles: noop,
  fileCount: 0,
  setFileCount: noop,
  sidebarOpen: false,
  setSidebarOpen: noop,
};

export function ToolProvider({
  children,
  initialHasFiles = false,
  initialFileCount = 0,
}: {
  children: React.ReactNode;
  initialHasFiles?: boolean;
  initialFileCount?: number;
}) {
  const [hasFiles, setHasFiles] = useState(initialHasFiles);
  const [fileCount, setFileCount] = useState(initialFileCount);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setHasFiles(initialHasFiles);
  }, [initialHasFiles]);

  useEffect(() => {
    setFileCount(initialFileCount);
  }, [initialFileCount]);

  return (
    <ToolContext.Provider value={{ hasFiles, setHasFiles, fileCount, setFileCount, sidebarOpen, setSidebarOpen }}>
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const context = useContext(ToolContext);
  if (!context) {
    return defaultToolContext;
  }
  return context;
}
