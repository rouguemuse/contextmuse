import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function BoardComposer({ onAddText, onAddLink, notice }) {
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const input = useRef(null);

  const submitText = () => {
    const value = text.trim();
    if (!value) {
      input.current?.focus();
      return;
    }
    onAddText(value);
    setText('');
  };

  const submitLink = () => {
    const value = link.trim();
    if (!value) return;
    const url = value.startsWith('http') ? value : `https://${value}`;
    onAddLink(url);
    setLink('');
  };

  return (
    <div className="border border-[#23282A]/20 bg-paper p-3.5 text-[#23282A] shadow-[8px_8px_0_rgba(35,40,42,0.09)] sm:p-4">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor="board-composer" className="eyebrow">
          Write something for your board
        </label>
        <span className="eyebrow t-faint">Type here ↓</span>
      </div>

      <textarea
        id="board-composer"
        ref={input}
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitText();
        }}
        placeholder="Type your idea here — a page, a note, a next step…"
        className="mt-2 w-full resize-none border-0 border-b border-[#23282A]/25 bg-transparent pb-2 font-display text-[17px] font-semibold leading-snug outline-none placeholder:font-body placeholder:text-[13.5px] placeholder:font-normal placeholder:opacity-45 focus:border-[#17504A]"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={submitText}
          className="flex items-center gap-2 bg-[#17504A] px-3.5 py-2.5 text-[10.5px] uppercase tracking-[0.14em] text-bone transition-colors duration-200 hover:bg-[#123F38]"
        >
          Add text to board <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10.5px] uppercase tracking-[0.12em] t-faint">⌘ + Enter</span>

        <div className="ml-auto flex items-center gap-1">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitLink();
            }}
            placeholder="or paste a link"
            className="w-[168px] border border-[#23282A]/20 bg-transparent px-2 py-2 text-[12px] outline-none placeholder:opacity-45 focus:border-[#17504A]"
          />
          <button
            onClick={submitLink}
            className="border border-[#23282A]/25 px-2.5 py-2 text-[10.5px] uppercase tracking-[0.12em] transition-colors hover:bg-[#23282A] hover:text-bone"
          >
            Add link
          </button>
        </div>
      </div>

      {notice && <p className="mt-2 text-[11px] text-[#8A2A1E]">{notice}</p>}
    </div>
  );
}