import React, { useRef } from 'react';
import {
  Check,
  FileImage,
  FileJson,
  FolderInput,
  BookmarkPlus,
  Trash2,
  Send,
} from 'lucide-react';

export default function BoardFooter({
  saved,
  onExport,
  onExportPng,
  onImport,
  onReview,
  onClear,
  onAttachToBrief,
  onIncludeWithInquiry,
}) {
  const file = useRef(null);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#23282A]/20 pt-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 font-mono text-xs text-[#23282A]/70">
          <Check className="h-3.5 w-3.5 text-[#17504A]" />
          {saved ? 'Auto-saved locally' : 'Syncing changes…'}
        </span>
        <span className="hidden lg:inline font-mono text-[11px] text-[#23282A]/60">
          • Rather show than tell? Everything on this board attaches directly to your inquiry.
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {onIncludeWithInquiry && (
          <button
            type="button"
            onClick={onIncludeWithInquiry}
            className="flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] border border-[#23282A] px-3 py-1.5 text-[10.5px] uppercase font-mono font-bold tracking-wider hover:bg-[#e0b240] transition-colors rounded-sm shadow-sm"
            title="Include these notes and board snapshot with your project inquiry"
          >
            <Send className="h-3 w-3" />
            <span>Include these notes with my inquiry.</span>
          </button>
        )}

        <button
          type="button"
          onClick={onAttachToBrief}
          className="flex items-center gap-1 bg-[#17504A] text-[#EDE9E0] border border-[#17504A] px-2.5 py-1.5 text-[10.5px] uppercase font-mono font-bold tracking-wider hover:bg-[#23282A] transition-colors rounded-sm"
          title="Save this whiteboard session to My Ideas"
        >
          <BookmarkPlus className="h-3 w-3 text-[#D9A62E]" />
          <span>Save to My Ideas</span>
        </button>

        <button
          type="button"
          onClick={onExportPng}
          className="flex items-center gap-1 border border-[#23282A]/30 bg-white/70 px-2.5 py-1.5 text-[10.5px] uppercase font-mono tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
          title="Export review sheet as high-res PNG"
        >
          <FileImage className="h-3 w-3" />
          <span>Export PNG</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1 border border-[#23282A]/30 bg-white/70 px-2.5 py-1.5 text-[10.5px] uppercase font-mono tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
          title="Download portable JSON"
        >
          <FileJson className="h-3 w-3" />
          <span>JSON</span>
        </button>

        <button
          type="button"
          onClick={() => file.current?.click()}
          className="flex items-center gap-1 border border-[#23282A]/30 bg-white/70 px-2.5 py-1.5 text-[10.5px] uppercase font-mono tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
          title="Import saved board JSON"
        >
          <FolderInput className="h-3 w-3" />
          <span>Import</span>
        </button>

        <button
          type="button"
          onClick={onReview}
          className="border border-[#23282A]/30 bg-white/70 px-2.5 py-1.5 text-[10.5px] uppercase font-mono tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
        >
          Inspect Full Sheet
        </button>

        <button
          type="button"
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
