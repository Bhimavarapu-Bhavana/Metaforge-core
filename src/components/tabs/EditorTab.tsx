import React, { useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AppConfig } from '../../data/defaultConfig';

export const EditorTab: React.FC = () => {
  const { configText, setConfigText, showToast } = useApp();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const linesCount = useMemo(() => {
    return configText.split('\n').length || 1;
  }, [configText]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newText = configText.substring(0, start) + '  ' + configText.substring(end);
      setConfigText(newText);

      // Restore cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    try {
      const dataText = e.dataTransfer.getData('text/plain');
      if (!dataText) return;

      const data = JSON.parse(dataText);
      if (data && data.type) {
        // Try parsing config
        let currentConfig: AppConfig | null = null;
        try {
          currentConfig = JSON.parse(configText);
        } catch {
          showToast('error', 'Cannot drop component: JSON is currently invalid');
          return;
        }

        if (currentConfig && currentConfig.pages && currentConfig.pages[0]) {
          if (!currentConfig.pages[0].components) {
            currentConfig.pages[0].components = [];
          }
          currentConfig.pages[0].components.push({ type: data.type, props: {} });

          setConfigText(JSON.stringify(currentConfig, null, 2));
          showToast('info', `Added ${data.type} component`);
        } else {
          showToast('warning', 'No valid page layout found to drop component');
        }
      }
    } catch {
      // Ignore if not a valid JSON drag item
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      <div
        ref={lineNumbersRef}
        className="line-numbers"
        style={{
          overflow: 'hidden',
          padding: '16px 8px 16px 16px',
          textAlign: 'right',
          userSelect: 'none',
          minWidth: '40px'
        }}
      >
        {Array.from({ length: linesCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className="editor-area"
        spellCheck={false}
        value={configText}
        onChange={e => setConfigText(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        placeholder="// Paste or write your AppConfig JSON here"
      />
    </div>
  );
};
