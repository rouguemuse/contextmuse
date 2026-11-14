function Nav() {
  return (
    <div className="flex h-full w-full items-center justify-between border border-[#23282A]/20 bg-paper px-3">
      <div className="flex items-center gap-2">
        <span className="block h-3 w-3 bg-[#D9A62E]" />
        <span className="block h-[5px] w-12 bg-[#23282A]/30" />
      </div>
      <div className="flex items-center gap-2.5">
        <span className="block h-[4px] w-4 bg-[#23282A]/20" />
        <span className="block h-[4px] w-6 bg-[#23282A]/20" />
        <span className="block h-[4px] w-5 bg-[#23282A]/20" />
        <span className="block h-[4px] w-3 bg-[#23282A]/20" />
      </div>
      <span className="bg-[#23282A] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.16em] text-bone">
        Start
      </span>
    </div>
  );
}

function Hero() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden border border-[#23282A]/20 bg-paper p-3">
      <span className="text-[8px] uppercase tracking-[0.2em] text-[#23282A]/40">Hero</span>
      <div className="space-y-1.5">
        <span className="block h-[10px] w-[88%] bg-[#23282A]/80" />
        <span className="block h-[10px] w-[64%] bg-[#23282A]/80" />
        <span className="block h-[4px] w-[74%] bg-[#23282A]/20" />
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="bg-[#D9A62E] px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.14em] text-[#23282A]">
          Get in touch
        </span>
        <span className="h-10 w-16 bg-[#A9CFC7]/50" />
      </div>
    </div>
  );
}

function TextBlock() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 overflow-hidden border border-[#23282A]/20 bg-paper p-3">
      <span className="block h-[5px] w-10 bg-[#D9A62E]" />
      <span className="block h-[4px] w-[94%] bg-[#23282A]/20" />
      <span className="block h-[4px] w-full bg-[#23282A]/20" />
      <span className="block h-[4px] w-[86%] bg-[#23282A]/20" />
      <span className="block h-[4px] w-[92%] bg-[#23282A]/20" />
      <span className="block h-[4px] w-[58%] bg-[#23282A]/20" />
    </div>
  );
}

function ImageBlock() {
  return (
    <div className="relative h-full w-full overflow-hidden border border-[#23282A]/20 bg-[#C9C3B2]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to top right, transparent calc(50% - 0.5px), rgba(35,40,42,0.18) 50%, transparent calc(50% + 0.5px)), linear-gradient(to bottom right, transparent calc(50% - 0.5px), rgba(35,40,42,0.18) 50%, transparent calc(50% + 0.5px))',
        }}
      />
      <span className="absolute bottom-2 left-2 text-[7px] uppercase tracking-[0.18em] text-[#23282A]/55">
        Image
      </span>
    </div>
  );
}

function Cards() {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-1.5">
      {[
        { color: '#D9A62E', top: '34%' },
        { color: '#2B7C72', top: '46%' },
        { color: '#A9CFC7', top: '28%' },
      ].map(({ color, top }) => (
        <div key={color} className="flex flex-col overflow-hidden border border-[#23282A]/20 bg-paper">
          <span className="block w-full" style={{ backgroundColor: color, height: top }} />
          <div className="flex flex-1 flex-col gap-1 p-1.5">
            <span className="block h-[4px] w-[70%] bg-[#23282A]/50" />
            <span className="block h-[3px] w-full bg-[#23282A]/20" />
            <span className="block h-[3px] w-[80%] bg-[#23282A]/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Form() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 overflow-hidden border border-[#23282A]/20 bg-paper p-2.5">
      <span className="block h-[5px] w-[54%] bg-[#23282A]/70" />
      <span className="block h-4 w-full border border-[#23282A]/25 bg-white/50" />
      <span className="mt-auto block h-5 w-full bg-[#17504A] text-center text-[7px] font-bold uppercase leading-5 tracking-[0.16em] text-bone">
        Sign me up
      </span>
    </div>
  );
}

function Footer() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#23282A] p-2.5">
      <div className="flex items-start justify-between">
        <span className="text-[7px] uppercase tracking-[0.2em] text-bone/75">contextmuse®</span>
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1">
              <span className="block h-[3px] w-8 bg-bone/30" />
              <span className="block h-[3px] w-6 bg-bone/20" />
              <span className="block h-[3px] w-7 bg-bone/20" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <span className="mb-1.5 block h-px w-full bg-bone/20" />
        <span className="block text-[6px] uppercase tracking-[0.16em] text-bone/40">
          A working playground
        </span>
      </div>
    </div>
  );
}

const VARIANTS = {
  nav: Nav,
  hero: Hero,
  text: TextBlock,
  image: ImageBlock,
  cards: Cards,
  form: Form,
  footer: Footer,
};

export default function UiPiece({ variant }) {
  const Piece = VARIANTS[variant] || TextBlock;
  return <Piece />;
}