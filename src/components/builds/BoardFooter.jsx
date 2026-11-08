import React, { useRef } from 'react';
import { Check, Download, FileImage, FileJson, FolderInput, BookmarkPlus, Trash2 } from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

export default function BoardFooter({
  saved,
  onSave,
  onExport,
  onExportPng,
  onImport,
  onReview,
  onClear,
  onAttachToBrief,
}) {
  const file = useRef(null);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#23282A]/20 pt-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-mono text-xs text-[#23282A]/70">
          <Check className="h-3.5 w-3.5 text-[#17504A]" />
          {saved ? 'Auto-saved locally' : 'Syncing changes…'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={onAttachToBrief}
          className="flex items-center gap-1 bg-[#17504A] text-[#EDE9E0] border border-[#17504A] px-2.5 py-1.5 text-[10.5px] uppercase font-mono font-bold tracking-wider hover:bg-[#23282A] transition-colors rounded-sm"
          title="Save this whiteboard session to My Ideas"
        >
          <BookmarkPlus className="h-3 w-3 text-[#D9A62E]" />
          <span>Save to My Ideas</span>
        </button>

        <button
          onClick={onExportPng}
          className="flex items-center gap-1 border border-[#23282A]/30 bg-white/70 px-2.5 py-1.5 text-[10.5px] uppercase font-mono tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
          title="Export review sheet as high-res PNG"
        >
          <FileImage className="h-3 w-3" />
          <span>Export PNG</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1 border border-[#23282A]/30 bg-white/70 px-2.5 py-1.5 text-[10.5px] uppercase font-mono tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
          title="Download portable JSON"
        >
          <FileJson className="h-3 w-3" />
          <span>JSON</span>
        </button>

        <button
          onClick={() => file.current?.click()}
          className="flex items-center gap-1 border border-[#23282A]/30 bg-white/70 px-2.5 py-1.5 text-[10.5px] uppercase font-mono tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
          title="Import saved board JSON"
        >
          <FolderInput className="h-3 w-3" />
          <span>Import</span>
        </button>

        <button
          onClick={onReview}
          className="border border-[#23282A]/30 bg-white/70 px-2.5 py-1.5 text-[10.5px] uppercase font-mono tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
        >
          Inspect Full Sheet
        </button>

        <button
          onClick={onClear}
          className="p-1.5 text-[#23282A]/50 hover:text-red-700 transition-colors"
          title="Clear Board"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <input ref={file} type="file" accept="application/json" onChange={onImport} className="hidden" />
    </div>
  );
}
