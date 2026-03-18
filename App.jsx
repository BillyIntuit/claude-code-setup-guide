const globalStyles = `
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border-radius: 0 !important;
}
html { scroll-behavior: smooth; }
body {
  font-family: "Geneva", "Charcoal", monospace;
  background-color: #fff;
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpolygon points='2,1 2,13 5,10 7,15 9,14 7,9 11,9' fill='white' stroke='black' stroke-width='1' shape-rendering='crispEdges'/%3E%3C/svg%3E") 0 0, default;
}
::-webkit-scrollbar { width: 16px; }
::-webkit-scrollbar-track { background: #fff; border-left: 1px solid #000; }
::-webkit-scrollbar-thumb { background: #fff; border: 1px solid #000; }
::-webkit-scrollbar-button { background: #fff; border: 1px solid #000; height: 16px; }
.splash {
  position: fixed; inset: 0; background: #fff;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 9999;
  transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1);
  gap: 24px;
}
.splash.hidden { opacity: 0; pointer-events: none; }
.copy-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 1px 1px 0 #000;
}
.mac-link:hover { color: #000080; }
.mac-window { transition: opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 600ms cubic-bezier(0.22,1,0.36,1); }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes celebJump {
  0%,100% { transform: translateY(0); }
  30% { transform: translateY(-22px); }
  55% { transform: translateY(-8px); }
  70% { transform: translateY(-18px); }
  85% { transform: translateY(-4px); }
}
@keyframes explodeOut {
  0% { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--ex), var(--ey)) scale(0); opacity: 0; }
}
@keyframes modalIn {
  0% { transform: translateY(-24px) scale(0.94); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.about-jumping { animation: celebJump 0.55s ease-in-out infinite; transform-origin: bottom center; }
.about-exploding { animation: explodeOut 0.55s ease-out forwards; }
.about-modal-inner { animation: modalIn 0.28s cubic-bezier(0.22,1,0.36,1) both; }
@keyframes chatSlideIn {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
@keyframes chatSlideOut {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}
@keyframes msgPop {
  0% { transform: translateY(6px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes thinkDot {
  0%,80%,100% { opacity: 0.2; }
  40% { opacity: 1; }
}
.chat-panel { animation: chatSlideIn 0.32s cubic-bezier(0.22,1,0.36,1) both; }
.chat-panel.closing { animation: chatSlideOut 0.22s ease-in forwards; }
.chat-msg { animation: msgPop 0.2s ease-out both; }
.think-dot { display: inline-block; width: 6px; height: 6px; background: #000; margin: 0 2px; animation: thinkDot 1.2s ease-in-out infinite; }
.chat-input:focus { outline: none; }
.chat-code { display: block; background: #000; color: #fff; font-family: monospace; font-size: 12px; padding: 10px 12px; margin: 6px 0; white-space: pre-wrap; word-break: break-all; border: 1px solid #000; }
@keyframes doneDance {
  0%,100% { transform: translateY(0) rotate(0deg); }
  20% { transform: translateY(-14px) rotate(-4deg); }
  40% { transform: translateY(-6px) rotate(3deg); }
  60% { transform: translateY(-12px) rotate(-3deg); }
  80% { transform: translateY(-4px) rotate(2deg); }
}
@keyframes confettiFloat {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--cx, 0px), -60px) rotate(var(--cr, 45deg)); opacity: 0; }
}
.done-mac { animation: doneDance 0.9s ease-in-out infinite; transform-origin: bottom center; transform-box: fill-box; }
.done-confetti { animation: confettiFloat 1.4s ease-out infinite; transform-box: fill-box; }
.type-cursor {
  display: inline-block;
  width: 8px; height: 1em;
  background: #000;
  vertical-align: text-bottom;
  margin-left: 1px;
  animation: blink 0.7s step-end infinite;
}
`;

const SNIPPETS = {
  macInstall: `curl -fsSL https://cli.anthropic.com/install.sh | sh`,
  verify: `claude --version`,
  cursorTerminal: `# Open Cursor's built-in terminal:\n#   Press Cmd + \` (the backtick key, above Tab)\n# Then type:\nclaude`,
  figmaAdd: `claude mcp add --transport http figma https://mcp.figma.com/mcp`,
  figmaScope: `claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp`,
  figmaList: `claude mcp list`,
  yolo: `claude --dangerously-skip-permissions`,
  yoloPrompt: `claude --dangerously-skip-permissions -p "Refactor the auth module to use JWT tokens"`,
};

// Context that fires once the splash is gone, so TypeIn elements in the
// initial viewport know when to start (IntersectionObserver alone misses them
// because they're already intersecting before the observer attaches).
const SplashDoneContext = React.createContext(false);

const bodyStyle = { fontFamily: '"Geneva","Charcoal",monospace', fontSize: 13, lineHeight: 1.7, color: '#000', marginTop: 6 };
const linkStyle = { fontFamily: '"Geneva","Charcoal",monospace', fontSize: 13, color: '#000080', textDecoration: 'underline' };
const h2Style = { fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 15, marginBottom: 10, marginTop: 20 };
const inlineCode = { fontFamily: 'monospace', background: '#fff', padding: '1px 5px', border: '1px solid #000', fontSize: 13 };

// ─── TypeIn component ────────────────────────────────────────────────────────
// Types in plain text on scroll-enter, then reveals the real children (which
// may contain links, <code>, etc.) once typing completes.
// `preview` should be a plain-text version of the content for the typing phase.

function TypeIn({ preview, children, speed = 6, tag = 'span', style, className }) {
  const [phase, setPhase] = React.useState('hidden'); // hidden → typing → done
  const [displayed, setDisplayed] = React.useState('');
  const ref = React.useRef(null);
  const timerRef = React.useRef(null);
  const splashDone = React.useContext(SplashDoneContext);
  const startedRef = React.useRef(false);

  function startTyping() {
    if (startedRef.current) return;
    startedRef.current = true;
    setPhase('typing');
  }

  // Attach IntersectionObserver once splash is done
  React.useEffect(() => {
    if (!splashDone) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    if (ref.current) {
      observer.observe(ref.current);
      // If already in viewport (first two windows), fire immediately
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        startTyping();
        observer.disconnect();
      }
    }
    return () => observer.disconnect();
  }, [splashDone]);

  React.useEffect(() => {
    if (phase !== 'typing') return;
    const text = preview || '';
    if (!text) { setPhase('done'); return; }
    let i = 0;
    function tick() {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        timerRef.current = setTimeout(tick, speed);
      } else {
        // Brief pause so the cursor blinks once at the end, then show real content
        timerRef.current = setTimeout(() => setPhase('done'), 300);
      }
    }
    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  }, [phase]);

  const Tag = tag;
  if (phase === 'done') {
    return <Tag ref={ref} style={style} className={className}>{children}</Tag>;
  }
  return (
    <Tag ref={ref} style={{ ...style, minHeight: '1em' }} className={className}>
      {phase === 'typing' ? displayed : ''}
      {phase === 'typing' && <span className="type-cursor" />}
    </Tag>
  );
}

// ─── Hero SVG illustrations ──────────────────────────────────────────────────

// Section 1: A checklist on a classic Mac desktop — clipboard with items
const HERO_DITHER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23000' opacity='0.18'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%23000' opacity='0.18'/%3E%3C/svg%3E") repeat`;
const HERO_COLORS = ['#B8D8EE','#AACFBA','#DEC99A','#C4BCE0','#DCAAA0','#98CCC5'];

function heroBg(i) { return `${HERO_COLORS[i]} ${HERO_DITHER}`; }

function HeroChecklist() {
  return (
    <svg width="100%" height="260" viewBox="0 0 720 180" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', border: '2px solid #000', borderLeft: 'none', borderRight: 'none', background: heroBg(0) }}>
      {/* Dithered background */}
      <defs>
        <pattern id="dither" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill="#000"/>
          <rect x="1" y="1" width="1" height="1" fill="#000"/>
        </pattern>
      </defs>

      {/* Large clipboard */}
      <rect x="220" y="20" width="280" height="150" fill="#fff" stroke="#000" strokeWidth="2"/>
      {/* Clip at top */}
      <rect x="330" y="14" width="60" height="16" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="344" y="10" width="32" height="8" fill="#000"/>
      {/* Clipboard lines */}
      <rect x="240" y="50" width="16" height="16" fill="#000"/>
      <rect x="242" y="52" width="12" height="12" fill="#fff"/>
      <rect x="262" y="55" width="100" height="6" fill="#000"/>
      <rect x="240" y="76" width="16" height="16" fill="#000"/>
      <rect x="242" y="78" width="12" height="12" fill="#fff"/>
      <rect x="242" y="80" width="8" height="2" fill="#000"/>
      <rect x="244" y="82" width="2" height="6" fill="#000"/>
      <rect x="262" y="81" width="140" height="6" fill="#000"/>
      <rect x="240" y="102" width="16" height="16" fill="#000"/>
      <rect x="242" y="104" width="12" height="12" fill="#fff"/>
      <rect x="262" y="107" width="120" height="6" fill="#000"/>
      <rect x="240" y="128" width="16" height="16" fill="#000"/>
      <rect x="242" y="130" width="12" height="12" fill="#fff"/>
      <rect x="262" y="133" width="80" height="6" fill="#000"/>

      {/* Decorative Mac icon left */}
      <rect x="60" y="40" width="80" height="100" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="64" y="44" width="72" height="54" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="74" y="56" width="8" height="8" fill="#000"/>
      <rect x="106" y="56" width="8" height="8" fill="#000"/>
      <rect x="74" y="72" width="8" height="4" fill="#000"/>
      <rect x="106" y="72" width="8" height="4" fill="#000"/>
      <rect x="82" y="76" width="24" height="4" fill="#000"/>
      <rect x="72" y="104" width="56" height="6" fill="#000"/>
      <rect x="73" y="105" width="54" height="4" fill="#fff"/>
      <rect x="64" y="116" width="20" height="8" fill="#000"/>
      <rect x="104" y="116" width="20" height="8" fill="#000"/>

      {/* Decorative floppy right */}
      <rect x="580" y="50" width="80" height="80" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="592" y="50" width="48" height="24" fill="#000"/>
      <rect x="596" y="54" width="18" height="16" fill="#fff"/>
      <rect x="626" y="52" width="8" height="20" fill="#fff"/>
      <rect x="584" y="90" width="64" height="34" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="596" y="96" width="40" height="22" fill="#000"/>
      <rect x="602" y="100" width="28" height="12" fill="#fff"/>
    </svg>
  );
}

// Section 2: Terminal window with install command being typed
function HeroTerminal() {
  return (
    <svg width="100%" height="260" viewBox="0 0 720 180" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', border: '2px solid #000', borderLeft: 'none', borderRight: 'none', background: heroBg(1) }}>
      <defs>
        <pattern id="dither2" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill="#000"/>
          <rect x="1" y="1" width="1" height="1" fill="#000"/>
        </pattern>
      </defs>

      {/* Terminal window */}
      <rect x="100" y="20" width="520" height="145" fill="#fff" stroke="#000" strokeWidth="2"/>
      {/* Title bar */}
      <rect x="100" y="20" width="520" height="20" fill="#000"/>
      <rect x="104" y="24" width="12" height="12" fill="#fff" stroke="#fff" strokeWidth="1"/>
      <text x="360" y="34" textAnchor="middle" fill="#fff" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="11">Terminal — bash</text>

      {/* Terminal content — black bg */}
      <rect x="102" y="40" width="516" height="123" fill="#000"/>
      {/* Prompt lines */}
      <text x="114" y="60" fill="#fff" fontFamily="monospace" fontSize="12">$ curl -fsSL https://cli.anthropic.com/install.sh | sh</text>
      <text x="114" y="80" fill="#fff" fontFamily="monospace" fontSize="12">  Downloading Claude Code...</text>
      <text x="114" y="96" fill="#fff" fontFamily="monospace" fontSize="12">  Installing to /usr/local/bin/claude</text>
      <text x="114" y="112" fill="#fff" fontFamily="monospace" fontSize="12">  ✓ Done! Run 'claude' to get started.</text>
      <text x="114" y="132" fill="#fff" fontFamily="monospace" fontSize="12">$ claude --version</text>
      <text x="114" y="148" fill="#fff" fontFamily="monospace" fontSize="12">  claude 1.2.4</text>
      {/* Cursor blink */}
      <rect x="114" y="154" width="8" height="12" fill="#fff"/>
    </svg>
  );
}

// Section 3: Cursor IDE window with Claude panel open
function HeroCursor() {
  return (
    <svg width="100%" height="260" viewBox="0 0 720 180" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', border: '2px solid #000', borderLeft: 'none', borderRight: 'none', background: heroBg(2) }}>
      <defs>
        <pattern id="dither3" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill="#000"/>
          <rect x="1" y="1" width="1" height="1" fill="#000"/>
        </pattern>
      </defs>

      {/* Main editor window */}
      <rect x="80" y="15" width="560" height="155" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="80" y="15" width="560" height="20" fill="#000"/>
      <rect x="84" y="19" width="12" height="12" fill="#fff"/>
      <text x="360" y="29" textAnchor="middle" fill="#fff" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="11">Cursor — my-project</text>

      {/* Sidebar */}
      <rect x="82" y="35" width="120" height="133" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="82" y="35" width="120" height="14" fill="#000"/>
      <text x="142" y="45" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="9">EXPLORER</text>
      <text x="92" y="62" fill="#000" fontFamily="monospace" fontSize="10">▸ src/</text>
      <text x="92" y="76" fill="#000" fontFamily="monospace" fontSize="10">▸ public/</text>
      <text x="92" y="90" fill="#000" fontFamily="monospace" fontSize="10">  App.jsx</text>
      <text x="92" y="104" fill="#000" fontFamily="monospace" fontSize="10">  index.html</text>
      <text x="92" y="118" fill="#000" fontFamily="monospace" fontSize="10">  package.json</text>

      {/* Code area */}
      <rect x="202" y="35" width="260" height="133" fill="#fff" stroke="#000" strokeWidth="1"/>
      <text x="212" y="52" fill="#000" fontFamily="monospace" fontSize="10">1  function App() {'{'}</text>
      <text x="212" y="65" fill="#000" fontFamily="monospace" fontSize="10">2    return (</text>
      <text x="212" y="78" fill="#000" fontFamily="monospace" fontSize="10">3      &lt;div&gt;</text>
      <text x="212" y="91" fill="#000" fontFamily="monospace" fontSize="10">4        Hello!</text>
      <text x="212" y="104" fill="#000" fontFamily="monospace" fontSize="10">5      &lt;/div&gt;</text>
      <text x="212" y="117" fill="#000" fontFamily="monospace" fontSize="10">6    );</text>
      <text x="212" y="130" fill="#000" fontFamily="monospace" fontSize="10">7  {'}'}</text>

      {/* Claude panel */}
      <rect x="462" y="35" width="176" height="133" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="462" y="35" width="176" height="14" fill="#000"/>
      <text x="550" y="45" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="9">CLAUDE CODE</text>
      {/* Chat bubbles */}
      <rect x="470" y="55" width="120" height="24" fill="#000"/>
      <text x="476" y="65" fill="#fff" fontFamily="monospace" fontSize="8">You: Add a heading</text>
      <text x="476" y="75" fill="#fff" fontFamily="monospace" fontSize="8">to this page</text>
      <rect x="470" y="85" width="130" height="32" fill="#fff" stroke="#000" strokeWidth="1"/>
      <text x="476" y="96" fill="#000" fontFamily="monospace" fontSize="8">Claude: I'll add an</text>
      <text x="476" y="106" fill="#000" fontFamily="monospace" fontSize="8">&lt;h1&gt; to your App</text>
      <text x="476" y="116" fill="#000" fontFamily="monospace" fontSize="8">component!</text>
      <rect x="470" y="124" width="158" height="14" fill="#fff" stroke="#000" strokeWidth="1"/>
      <text x="476" y="134" fill="#000" fontFamily="monospace" fontSize="8">Ask Claude anything...</text>
    </svg>
  );
}

// Section 4: Figma frame being "read" by Claude — design on left, code on right
function HeroFigma() {
  return (
    <svg width="100%" height="260" viewBox="0 0 720 180" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', border: '2px solid #000', borderLeft: 'none', borderRight: 'none', background: heroBg(3) }}>
      <defs>
        <pattern id="dither4" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill="#000"/>
          <rect x="1" y="1" width="1" height="1" fill="#000"/>
        </pattern>
      </defs>

      {/* Figma window */}
      <rect x="60" y="15" width="240" height="155" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="60" y="15" width="240" height="20" fill="#000"/>
      <rect x="64" y="19" width="12" height="12" fill="#fff"/>
      <text x="180" y="29" textAnchor="middle" fill="#fff" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="10">Figma — Design</text>
      {/* Canvas area */}
      <rect x="62" y="35" width="236" height="133" fill="#fff"/>
      {/* Dithered canvas bg */}
      <rect x="62" y="35" width="236" height="133" fill="url(#dither4)" opacity="0.08"/>
      {/* UI card being designed */}
      <rect x="100" y="55" width="160" height="95" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="100" y="55" width="160" height="28" fill="#000"/>
      <text x="180" y="73" textAnchor="middle" fill="#fff" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="11">Dashboard</text>
      <rect x="110" y="93" width="140" height="8" fill="#000" opacity="0.8"/>
      <rect x="110" y="107" width="100" height="8" fill="#000" opacity="0.5"/>
      <rect x="110" y="121" width="60" height="16" fill="#000"/>
      <text x="140" y="133" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="9">Get Started</text>
      {/* Selection handles */}
      <rect x="98" y="53" width="6" height="6" fill="#000080"/>
      <rect x="256" y="53" width="6" height="6" fill="#000080"/>
      <rect x="98" y="146" width="6" height="6" fill="#000080"/>
      <rect x="256" y="146" width="6" height="6" fill="#000080"/>

      {/* Arrow */}
      <text x="318" y="100" textAnchor="middle" fill="#000" fontFamily="monospace" fontSize="24">→</text>

      {/* Code output window */}
      <rect x="360" y="15" width="300" height="155" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="360" y="15" width="300" height="20" fill="#000"/>
      <rect x="364" y="19" width="12" height="12" fill="#fff"/>
      <text x="510" y="29" textAnchor="middle" fill="#fff" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="10">Claude Code — output</text>
      <rect x="362" y="35" width="296" height="133" fill="#000"/>
      <text x="372" y="55" fill="#fff" fontFamily="monospace" fontSize="10">function Dashboard() {'{'}</text>
      <text x="372" y="70" fill="#fff" fontFamily="monospace" fontSize="10">  return (</text>
      <text x="372" y="85" fill="#fff" fontFamily="monospace" fontSize="10">    &lt;div className="card"&gt;</text>
      <text x="372" y="100" fill="#fff" fontFamily="monospace" fontSize="10">      &lt;h1&gt;Dashboard&lt;/h1&gt;</text>
      <text x="372" y="115" fill="#fff" fontFamily="monospace" fontSize="10">      &lt;p&gt;Welcome back&lt;/p&gt;</text>
      <text x="372" y="130" fill="#fff" fontFamily="monospace" fontSize="10">      &lt;button&gt;Get Started</text>
      <text x="372" y="145" fill="#fff" fontFamily="monospace" fontSize="10">    &lt;/div&gt;</text>
      <rect x="372" y="150" width="8" height="12" fill="#fff"/>
    </svg>
  );
}

// Section 5: Classic Mac alert/warning dialog — danger zone
function HeroYOLO() {
  return (
    <svg width="100%" height="260" viewBox="0 0 720 180" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', border: '2px solid #000', borderLeft: 'none', borderRight: 'none', background: heroBg(4) }}>
      <defs>
        <pattern id="dither5" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill="#000"/>
          <rect x="1" y="1" width="1" height="1" fill="#000"/>
        </pattern>
      </defs>

      {/* Alert dialog — classic Mac style */}
      <rect x="160" y="25" width="400" height="135" fill="#fff" stroke="#000" strokeWidth="3"/>
      {/* Double border inner */}
      <rect x="164" y="29" width="392" height="127" fill="#fff" stroke="#000" strokeWidth="1"/>

      {/* Warning icon area */}
      <rect x="180" y="45" width="60" height="80" fill="#fff"/>
      {/* Big pixel warning triangle */}
      <polygon points="210,48 240,96 180,96" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="206" y="60" width="8" height="20" fill="#000"/>
      <rect x="206" y="84" width="8" height="6" fill="#000"/>

      {/* Text area */}
      <text x="260" y="58" fill="#000" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="12">Danger Zone!</text>
      <text x="260" y="76" fill="#000" fontFamily="monospace" fontSize="10">This flag removes all</text>
      <text x="260" y="90" fill="#000" fontFamily="monospace" fontSize="10">safety prompts. Claude</text>
      <text x="260" y="104" fill="#000" fontFamily="monospace" fontSize="10">will act autonomously.</text>
      <text x="260" y="118" fill="#000" fontFamily="monospace" fontSize="10">Back up your files first!</text>

      {/* Buttons */}
      <rect x="180" y="126" width="80" height="22" fill="#fff" stroke="#000" strokeWidth="2"/>
      <text x="220" y="141" textAnchor="middle" fill="#000" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="11">Cancel</text>
      <rect x="278" y="126" width="80" height="22" fill="#000"/>
      <text x="318" y="141" textAnchor="middle" fill="#fff" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="11">OK</text>
      {/* Default button ring */}
      <rect x="274" y="122" width="88" height="30" fill="none" stroke="#000" strokeWidth="2"/>

      {/* Skull decorations */}
      {/* Left skull */}
      <rect x="60" y="60" width="60" height="64" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="68" y="68" width="12" height="12" fill="#000"/>
      <rect x="88" y="68" width="12" height="12" fill="#000"/>
      <rect x="78" y="82" width="6" height="6" fill="#000"/>
      <rect x="64" y="94" width="8" height="10" fill="#000"/>
      <rect x="74" y="94" width="8" height="10" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="84" y="94" width="8" height="10" fill="#000"/>
      <rect x="94" y="94" width="8" height="10" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="62" y="104" width="56" height="8" fill="#000"/>

      {/* Right skull */}
      <rect x="600" y="60" width="60" height="64" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="608" y="68" width="12" height="12" fill="#000"/>
      <rect x="628" y="68" width="12" height="12" fill="#000"/>
      <rect x="618" y="82" width="6" height="6" fill="#000"/>
      <rect x="604" y="94" width="8" height="10" fill="#000"/>
      <rect x="614" y="94" width="8" height="10" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="624" y="94" width="8" height="10" fill="#000"/>
      <rect x="634" y="94" width="8" height="10" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="602" y="104" width="56" height="8" fill="#000"/>
    </svg>
  );
}

// Section 6: Celebration — confetti / balloons in Mac pixel style
function HeroDone() {
  const confettiL = [
    {x:60,  y:140, w:10, h:10, cx:'-8px',  cr:'60deg',  d:'0s'},
    {x:90,  y:120, w:8,  h:8,  cx:'5px',   cr:'-40deg', d:'0.18s'},
    {x:50,  y:110, w:12, h:5,  cx:'-12px', cr:'90deg',  d:'0.35s'},
    {x:120, y:130, w:6,  h:12, cx:'8px',   cr:'-70deg', d:'0.52s'},
    {x:70,  y:150, w:10, h:10, cx:'-5px',  cr:'45deg',  d:'0.08s'},
    {x:100, y:140, w:14, h:4,  cx:'3px',   cr:'120deg', d:'0.65s'},
    {x:140, y:120, w:8,  h:8,  cx:'-10px', cr:'-30deg', d:'0.28s'},
    {x:40,  y:155, w:10, h:10, cx:'-15px', cr:'80deg',  d:'0.42s'},
    {x:110, y:155, w:6,  h:10, cx:'10px',  cr:'-90deg', d:'0.75s'},
    {x:160, y:145, w:10, h:6,  cx:'6px',   cr:'50deg',  d:'0.12s'},
    {x:75,  y:165, w:8,  h:8,  cx:'-7px',  cr:'-55deg', d:'0.58s'},
    {x:130, y:160, w:12, h:5,  cx:'12px',  cr:'100deg', d:'0.22s'},
    {x:55,  y:170, w:10, h:10, cx:'-3px',  cr:'-80deg', d:'0.88s'},
    {x:150, y:168, w:8,  h:8,  cx:'4px',   cr:'70deg',  d:'0.45s'},
  ];
  const confettiR = [
    {x:560, y:140, w:10, h:10, cx:'8px',   cr:'-60deg', d:'0.1s'},
    {x:590, y:120, w:8,  h:8,  cx:'-5px',  cr:'40deg',  d:'0.28s'},
    {x:660, y:130, w:12, h:5,  cx:'12px',  cr:'-90deg', d:'0.48s'},
    {x:620, y:125, w:6,  h:12, cx:'-8px',  cr:'70deg',  d:'0.62s'},
    {x:570, y:150, w:10, h:10, cx:'5px',   cr:'-45deg', d:'0.15s'},
    {x:640, y:140, w:14, h:4,  cx:'-3px',  cr:'-120deg',d:'0.72s'},
    {x:580, y:120, w:8,  h:8,  cx:'10px',  cr:'30deg',  d:'0.33s'},
    {x:680, y:145, w:10, h:10, cx:'15px',  cr:'-80deg', d:'0.55s'},
    {x:550, y:155, w:6,  h:10, cx:'-10px', cr:'90deg',  d:'0.82s'},
    {x:600, y:150, w:10, h:6,  cx:'-6px',  cr:'-50deg', d:'0.20s'},
    {x:660, y:160, w:10, h:10, cx:'8px',   cr:'55deg',  d:'0.40s'},
    {x:575, y:165, w:8,  h:8,  cx:'7px',   cr:'-100deg',d:'0.65s'},
    {x:630, y:160, w:12, h:5,  cx:'-12px', cr:'80deg',  d:'0.25s'},
    {x:685, y:168, w:10, h:10, cx:'3px',   cr:'-70deg', d:'0.92s'},
    {x:555, y:170, w:8,  h:8,  cx:'-4px',  cr:'60deg',  d:'0.50s'},
  ];
  return (
    <svg width="100%" height="260" viewBox="0 0 720 180" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', border: '2px solid #000', borderLeft: 'none', borderRight: 'none', background: heroBg(5) }}>
      <defs>
        <pattern id="dither6" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill="#000"/>
          <rect x="1" y="1" width="1" height="1" fill="#000"/>
        </pattern>
      </defs>

      {/* Confetti left — looping float upward */}
      {confettiL.map((p, i) => (
        <rect key={'cl'+i} x={p.x} y={p.y} width={p.w} height={p.h} fill="#000"
          className="done-confetti"
          style={{'--cx': p.cx, '--cr': p.cr, animationDelay: p.d, animationDuration: `${1.2 + i * 0.07}s`}}
        />
      ))}

      {/* Confetti right — looping float upward */}
      {confettiR.map((p, i) => (
        <rect key={'cr'+i} x={p.x} y={p.y} width={p.w} height={p.h} fill="#000"
          className="done-confetti"
          style={{'--cx': p.cx, '--cr': p.cr, animationDelay: p.d, animationDuration: `${1.2 + i * 0.06}s`}}
        />
      ))}

      {/* Thumbs up left */}
      <rect x="180" y="70" width="32" height="48" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="176" y="40" width="20" height="34" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="176" y="54" width="20" height="4" fill="#000"/>
      <rect x="176" y="118" width="40" height="14" fill="#fff" stroke="#000" strokeWidth="2"/>

      {/* Thumbs up right */}
      <rect x="508" y="70" width="32" height="48" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="524" y="40" width="20" height="34" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="524" y="54" width="20" height="4" fill="#000"/>
      <rect x="504" y="118" width="40" height="14" fill="#fff" stroke="#000" strokeWidth="2"/>

      {/* Dancing Mac — center */}
      <g className="done-mac">
        <rect x="290" y="15" width="140" height="155" fill="#fff" stroke="#000" strokeWidth="2"/>
        <rect x="296" y="22" width="128" height="86" fill="#fff" stroke="#000" strokeWidth="1"/>
        <rect x="314" y="44" width="16" height="16" fill="#000"/>
        <rect x="390" y="44" width="16" height="16" fill="#000"/>
        <rect x="314" y="74" width="16" height="6" fill="#000"/>
        <rect x="390" y="74" width="16" height="6" fill="#000"/>
        <rect x="330" y="80" width="60" height="6" fill="#000"/>
        <rect x="310" y="68" width="8" height="8" fill="#000"/>
        <rect x="402" y="68" width="8" height="8" fill="#000"/>
        <rect x="306" y="122" width="108" height="12" fill="#000"/>
        <rect x="308" y="124" width="104" height="8" fill="#fff"/>
        <rect x="296" y="156" width="36" height="12" fill="#000"/>
        <rect x="388" y="156" width="36" height="12" fill="#000"/>
      </g>
    </svg>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function HappyMacIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }} xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="4" width="40" height="52" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="16" y="8" width="32" height="28" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="21" y="14" width="4" height="4" fill="#000"/>
      <rect x="39" y="14" width="4" height="4" fill="#000"/>
      <rect x="21" y="22" width="4" height="2" fill="#000"/>
      <rect x="39" y="22" width="4" height="2" fill="#000"/>
      <rect x="25" y="24" width="14" height="2" fill="#000"/>
      <rect x="20" y="42" width="24" height="4" fill="#000"/>
      <rect x="21" y="43" width="22" height="2" fill="#fff"/>
      <rect x="16" y="56" width="10" height="4" fill="#000"/>
      <rect x="38" y="56" width="10" height="4" fill="#000"/>
    </svg>
  );
}

// Apple with TWO bites taken out — bottom-right and bottom-left
function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 16" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <rect x="6" y="0" width="2" height="2" fill="#000"/>
      <rect x="8" y="1" width="2" height="1" fill="#000"/>
      {/* Body — full, no bites */}
      <rect x="4" y="2" width="6" height="2" fill="#000"/>
      <rect x="3" y="4" width="8" height="2" fill="#000"/>
      <rect x="2" y="6" width="10" height="2" fill="#000"/>
      <rect x="2" y="8" width="10" height="2" fill="#000"/>
      <rect x="3" y="10" width="8" height="2" fill="#000"/>
      <rect x="4" y="12" width="6" height="2" fill="#000"/>
      {/* Highlight */}
      <rect x="5" y="7" width="2" height="1" fill="#fff"/>
    </svg>
  );
}

function ChecklistIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="28" height="28" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="4" y="0" width="10" height="4" fill="#000"/>
      <rect x="5" y="7" width="5" height="5" fill="#000"/>
      <rect x="6" y="8" width="3" height="3" fill="#fff"/>
      <rect x="12" y="9" width="14" height="2" fill="#000"/>
      <rect x="5" y="15" width="5" height="5" fill="#000"/>
      <rect x="12" y="17" width="14" height="2" fill="#000"/>
      <rect x="5" y="23" width="5" height="5" fill="#000"/>
      <rect x="6" y="24" width="3" height="3" fill="#fff"/>
      <rect x="12" y="25" width="14" height="2" fill="#000"/>
    </svg>
  );
}

function FloppyDiskIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="28" height="28" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="6" y="2" width="20" height="10" fill="#000"/>
      <rect x="8" y="4" width="8" height="6" fill="#fff"/>
      <rect x="22" y="3" width="3" height="8" fill="#fff"/>
      <rect x="6" y="16" width="20" height="12" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="10" y="18" width="12" height="8" fill="#000"/>
      <rect x="12" y="20" width="8" height="4" fill="#fff"/>
    </svg>
  );
}

function PlugIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="2" width="3" height="10" fill="#000"/>
      <rect x="17" y="2" width="3" height="10" fill="#000"/>
      <rect x="10" y="10" width="12" height="14" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="12" y="14" width="8" height="2" fill="#000"/>
      <rect x="15" y="24" width="2" height="6" fill="#000"/>
    </svg>
  );
}

function PaletteIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,2 26,4 30,10 30,20 26,26 18,30 10,30 4,26 2,18 2,10 6,4" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="6" y="14" width="5" height="5" fill="#000"/>
      <rect x="7" y="15" width="3" height="3" fill="#fff"/>
      <rect x="10" y="6" width="3" height="3" fill="#000"/>
      <rect x="18" y="5" width="3" height="3" fill="#000"/>
      <rect x="22" y="10" width="3" height="3" fill="#000"/>
      <rect x="20" y="17" width="3" height="3" fill="#000"/>
      <rect x="13" y="22" width="3" height="3" fill="#000"/>
    </svg>
  );
}

function SkullIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="20" height="18" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="9" y="8" width="5" height="5" fill="#000"/>
      <rect x="18" y="8" width="5" height="5" fill="#000"/>
      <rect x="15" y="15" width="2" height="3" fill="#000"/>
      <rect x="7" y="22" width="3" height="4" fill="#000"/>
      <rect x="11" y="22" width="3" height="4" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="14.5" y="22" width="3" height="4" fill="#000"/>
      <rect x="18" y="22" width="3" height="4" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="22" y="22" width="3" height="4" fill="#000"/>
      <rect x="6" y="26" width="20" height="4" fill="#000"/>
    </svg>
  );
}

function ThumbsUpIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="4" width="8" height="14" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="14" y="10" width="8" height="2" fill="#000"/>
      <rect x="8" y="14" width="18" height="10" fill="#fff" stroke="#000" strokeWidth="2"/>
      <rect x="10" y="24" width="14" height="6" fill="#fff" stroke="#000" strokeWidth="2"/>
    </svg>
  );
}

// ─── Splash ──────────────────────────────────────────────────────────────────

const splashStyles = `
@keyframes bob {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
/* Bounce left↔right staying fully inside the viewport (5% to 85% to leave room for 64px icon) */
@keyframes pace1 { 0%,100% { left: 5%;  } 50% { left: 82%; } }
@keyframes pace2 { 0%,100% { left: 82%; } 50% { left: 5%;  } }
@keyframes pace3 { 0%,100% { left: 20%; } 50% { left: 70%; } }
@keyframes pace4 { 0%,100% { left: 65%; } 50% { left: 12%; } }
@keyframes pace5 { 0%,100% { left: 40%; } 50% { left: 78%; } }
@keyframes pace6 { 0%,100% { left: 75%; } 50% { left: 30%; } }
@keyframes pace7 { 0%,100% { left: 10%; } 50% { left: 55%; } }
@keyframes pace8 { 0%,100% { left: 55%; } 50% { left: 8%;  } }

.splash-mac {
  position: absolute;
  bottom: 28%;
}
.splash-mac svg { display: block; }

.wm1 { animation: bob 0.55s ease-in-out infinite, pace1 7.0s ease-in-out infinite; animation-delay: 0.0s, 0.0s; }
.wm2 { animation: bob 0.60s ease-in-out infinite, pace2 8.5s ease-in-out infinite; animation-delay: 0.2s, 1.2s; }
.wm3 { animation: bob 0.50s ease-in-out infinite, pace3 6.2s ease-in-out infinite; animation-delay: 0.1s, 0.4s; }
.wm4 { animation: bob 0.65s ease-in-out infinite, pace4 9.0s ease-in-out infinite; animation-delay: 0.3s, 2.1s; }
.wm5 { animation: bob 0.48s ease-in-out infinite, pace5 5.8s ease-in-out infinite; animation-delay: 0.0s, 0.7s; }
.wm6 { animation: bob 0.58s ease-in-out infinite, pace6 7.5s ease-in-out infinite; animation-delay: 0.4s, 1.8s; }
.wm7 { animation: bob 0.52s ease-in-out infinite, pace7 8.0s ease-in-out infinite; animation-delay: 0.1s, 0.3s; }
.wm8 { animation: bob 0.62s ease-in-out infinite, pace8 6.8s ease-in-out infinite; animation-delay: 0.2s, 1.5s; }

.splash-ground {
  position: absolute;
  bottom: 27%;
  left: 0; right: 0;
  height: 2px;
  background: #000;
}
`;

function Splash({ visible }) {
  return (
    <>
      <style>{splashStyles}</style>
      <div className={`splash${visible ? '' : ' hidden'}`}>
        {/* Ground */}
        <div className="splash-ground" />
        {/* 8 walking Macs — each is the original 64×64 HappyMacIcon */}
        {[
          'wm1','wm2','wm3','wm4','wm5','wm6','wm7','wm8'
        ].map(cls => (
          <div key={cls} className={`splash-mac ${cls}`}>
            <HappyMacIcon />
          </div>
        ))}
        {/* Title */}
        <div style={{
          position: 'absolute', bottom: '12%', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 20, letterSpacing: 1,
          background: '#fff', padding: '8px 28px', border: '2px solid #000',
          whiteSpace: 'nowrap', zIndex: 2,
        }}>
          Welcome, IES Design Geniuses
        </div>
      </div>
    </>
  );
}

// ─── Chat Panel ──────────────────────────────────────────────────────────────

// Vague follow-up patterns — user is continuing the current topic
const VAGUE = [
  /^(still |it's |its )?(not working|doesn't work|doesn't show|not showing|broken|fails|failed|no luck)/i,
  /^(now what|what (now|next|do i do|should i do|should i see|am i (seeing|looking for))|what('s| is) (happening|it (doing|showing|supposed))|what does (it|that) (mean|look like)|got it[,.]? (now what|what next)?)/i,
  /^(it (works?|worked|shows?|showed|appeared|is there)|yes[,!.]?|yep|yup|ok(ay)?[,.]?|great[,.]?|good[,!.]?|nice[,!.]?|done[,.]?|i see it|i can see|showing now)/i,
  /^(no[,.]?|nope|still no|nothing|not there|can't find|don't see|not seeing|no output)/i,
  /^(what (error|message) (should|do i|am i)|what (output|result) (should|do i))/i,
];

function isVague(q) {
  return VAGUE.some(re => re.test(q.trim()));
}

// Topic flows: each topic has starter tags + a conversation flow
// Each flow step: { match: [patterns to trigger this step], reply: string, next: 'stepKey' }
// Flow is a linear walkthrough; steps are tried in order after topic is set
const TOPICS = [
  {
    id: 'install',
    tags: ['install','download','get claude','setup claude','curl','install.sh','how to install'],
    intro: 'Let\'s get Claude Code installed. Run this in your terminal:\n```bash\ncurl -fsSL https://cli.anthropic.com/install.sh | sh\n```\nPaste and hit Enter. Let me know when it finishes (or if you see an error).',
    flow: [
      {
        match: [/done|finish|complet|install|ran it|it ran|ok|yes|yep|worked/i],
        reply: 'Great! Now verify it installed correctly:\n```bash\nclaude --version\n```\nYou should see a version number. What do you see?',
      },
      {
        match: [/version|\d+\.\d+|v\d|number|see it|showing|there it/i],
        reply: '✓ Claude Code is installed! You\'re ready to go. Type `claude` in your terminal to start a session.\n\nWant to continue with the next step — connecting it to Cursor?',
      },
      {
        match: [/cursor|yes|next|sure|continue/i],
        reply: 'Head over to the Cursor section in this guide — it walks you through opening Cursor\'s built-in terminal and launching Claude there.',
      },
      {
        match: [/error|fail|permission|denied|not found|command|path/i],
        reply: 'What error message are you seeing? Common issues:\n\n**"Permission denied"** — don\'t use sudo. Try:\n```bash\nmkdir -p ~/.local/bin\n```\nthen re-run the install.\n\n**"command not found" after install** — reload your shell:\n```bash\nsource ~/.zshrc\n```',
      },
    ],
    fallback: 'Still stuck? Copy the exact error message and I can help narrow it down. Or try:\n```bash\nsource ~/.zshrc\nclaude --version\n```',
  },
  {
    id: 'verify',
    tags: ['verify','version','check install','installed','claude --version','working','confirm'],
    intro: 'Run this to check:\n```bash\nclaude --version\n```\nYou should see a version number like `1.x.x`. What do you see?',
    flow: [
      {
        match: [/version|\d+\.\d+|v\d|number|see it|showing/i],
        reply: '✓ Claude Code is installed and working correctly.',
      },
      {
        match: [/not found|command|error|nothing|blank|no output/i],
        reply: 'The binary isn\'t on your PATH. Try reloading your shell config:\n```bash\nsource ~/.zshrc\n```\nThen try `claude --version` again. Still nothing?',
      },
      {
        match: [/still|again|no|nope|nothing|not working/i],
        reply: 'Let\'s find where claude was installed:\n```bash\nfind /usr/local /opt/homebrew ~/.local -name claude 2>/dev/null\n```\nPaste the output here and we\'ll add it to your PATH.',
      },
    ],
    fallback: 'Try running `which claude` — if it prints a path, Claude Code is installed but something else is wrong. If it prints nothing, re-run the install script.',
  },
  {
    id: 'cursor',
    tags: ['cursor','ide','editor','integrate','hook up cursor','connect cursor','cursor terminal','backtick'],
    intro: 'To use Claude Code inside Cursor:\n\n1. Open Cursor\n2. Press **Cmd + `** (backtick — the key above Tab) to open the built-in terminal\n3. Type `claude` and hit Enter\n\nDid the terminal open?',
    flow: [
      {
        match: [/yes|open|opened|there|showing|got it|works|worked/i],
        reply: 'Nice! Now type `claude` and press Enter. You should see Claude Code\'s interactive prompt appear. What do you see?',
      },
      {
        match: [/prompt|started|running|interactive|it started|claude>/i],
        reply: '✓ Claude Code is running inside Cursor. You can now type tasks directly and Claude will read your open files automatically.\n\nTip: type `/help` inside the claude session to see available commands.',
      },
      {
        match: [/no|not open|nothing|doesn't work|shortcut|cmd/i],
        reply: 'If Cmd + ` doesn\'t work, try:\n- Menu bar → **View → Terminal**\n- Or Cmd + Shift + ` \n- Or right-click a folder in the file explorer → **Open in Integrated Terminal**\n\nAny of those work?',
      },
      {
        match: [/yes|open|opened|works|worked|there/i],
        reply: 'Great — now type `claude` in that terminal and hit Enter. Did it launch?',
      },
      {
        match: [/not found|command|error/i],
        reply: 'Claude Code might not be on the PATH that Cursor uses. Try:\n```bash\nsource ~/.zshrc && claude\n```\nIf that works, add `source ~/.zshrc` to your shell profile so Cursor always picks it up.',
      },
    ],
    fallback: 'Try opening Cursor\'s terminal via View → Terminal in the menu bar, then type `claude`. Let me know what happens.',
  },
  {
    id: 'figma',
    tags: ['figma','mcp','figma mcp','mcp server','figma server','connect figma','figma error','mcp error','mcp not working','mcp list'],
    intro: 'Let\'s set up the Figma MCP server. Run:\n```bash\nclaude mcp add --scope user --transport http figma https://mcp.figma.com/mcp\n```\nLet me know when it finishes — did you see any output?',
    flow: [
      {
        match: [/added|done|success|ok|yes|finish|added|no output|nothing|ran it/i],
        reply: 'Now verify it was added:\n```bash\nclaude mcp list\n```\nYou should see `figma` in the list. Is it there?',
      },
      {
        match: [/yes|there|see it|listed|showing|figma|appears/i],
        reply: '✓ Figma MCP is connected. Now start a Claude session and try referencing a Figma URL — Claude will read the design automatically.\n\nFirst time you use it, a browser tab will open asking you to authorize Figma access. Complete that and you\'re set.',
      },
      {
        match: [/auth|authorize|browser|login|sign in|figma login|oauth/i],
        reply: 'That authorization browser tab is expected on first use — it\'s Figma\'s OAuth flow. Complete it and Claude will store the token. If the tab didn\'t open, try running a claude session and pasting a Figma URL to trigger it.',
      },
      {
        match: [/no|not there|missing|empty|not showing|not listed/i],
        reply: 'It might have been added at project scope instead of user scope. Try removing and re-adding:\n```bash\nclaude mcp remove figma\nclaude mcp add --scope user --transport http figma https://mcp.figma.com/mcp\n```\nThen run `claude mcp list` again.',
      },
      {
        match: [/error|fail|invalid|transport|http|command/i],
        reply: 'A few things to check:\n1. Make sure Claude Code is up to date — re-run the install script\n2. Try the command exactly as written (the `--transport http` flag is required)\n3. Check you\'re connected to the internet\n\nWhat error message do you see?',
      },
    ],
    fallback: 'Run `claude mcp list` and tell me what you see — even if it looks wrong. That\'ll help me figure out what step to retry.',
  },
  {
    id: 'yolo',
    tags: ['yolo','dangerously','skip permissions','--dangerously','auto approve','no prompts','automate'],
    intro: 'YOLO mode skips all permission prompts. Start it with:\n```bash\nclaude --dangerously-skip-permissions\n```\nClaude will run commands, edit files, and install packages without asking. Want to know when to use it safely?',
    flow: [
      {
        match: [/yes|sure|when|safe|should i|good for/i],
        reply: '**Good uses:**\n- Boilerplate generation you\'ll review after\n- Trusted automation scripts\n- Personal projects where you understand the codebase\n\n**Avoid it when:**\n- Working with production systems\n- Running code you didn\'t write\n- Anything touching credentials or env files',
      },
      {
        match: [/how|stop|exit|cancel|quit|end|close/i],
        reply: 'To stop a YOLO session, press **Ctrl+C**. This cancels any running command and exits Claude Code safely.',
      },
    ],
    fallback: 'YOLO mode is straightforward — start with `claude --dangerously-skip-permissions` and stop with Ctrl+C. Ask me anything specific about it.',
  },
  {
    id: 'auth',
    tags: ['login','logout','auth','account','sign in','api key','authenticate','credentials'],
    intro: 'Run `claude` for the first time and it will prompt you to log in via browser OAuth or API key.\n\nTo switch accounts:\n```bash\nclaude logout\nclaude login\n```\n\nAre you trying to log in for the first time, or switch accounts?',
    flow: [
      {
        match: [/first|new|fresh|never|login|log in/i],
        reply: 'Just run `claude` — it will detect you\'re not logged in and open a login prompt. Choose "Login with Anthropic" to use browser OAuth, or paste an API key from console.anthropic.com.',
      },
      {
        match: [/switch|change|different|another|logout|log out/i],
        reply: 'Run:\n```bash\nclaude logout\n```\nThen `claude login` to authenticate with a different account. Your project configs in `~/.claude/` stay intact.',
      },
      {
        match: [/error|fail|invalid|expired|unauthorized|403|401/i],
        reply: 'Auth errors usually mean your token expired. Fix:\n```bash\nclaude logout\nclaude login\n```\nIf you\'re using an API key, check it\'s still valid at console.anthropic.com/settings/keys.',
      },
    ],
    fallback: 'Try `claude logout && claude login` — that fixes most auth issues.',
  },
  {
    id: 'error',
    tags: ['error','broken','not working','issue','problem','bug','crash','fail','stuck'],
    intro: 'Let\'s troubleshoot. Can you tell me:\n1. Which step you were on (install, Cursor, Figma MCP?)\n2. What command you ran\n3. What error message you\'re seeing',
    flow: [
      {
        match: [/install|curl|sh|version/i],
        reply: 'Installation error — try:\n```bash\nsource ~/.zshrc\nclaude --version\n```\nIf "command not found", the install didn\'t complete. Re-run:\n```bash\ncurl -fsSL https://cli.anthropic.com/install.sh | sh\n```',
      },
      {
        match: [/cursor|terminal|backtick|cmd/i],
        reply: 'Cursor issue — open the terminal via View → Terminal in Cursor\'s menu bar, then type:\n```bash\nsource ~/.zshrc && claude\n```',
      },
      {
        match: [/figma|mcp|transport|server/i],
        reply: 'Figma MCP issue — remove and re-add:\n```bash\nclaude mcp remove figma\nclaude mcp add --scope user --transport http figma https://mcp.figma.com/mcp\nclaude mcp list\n```',
      },
      {
        match: [/permission|denied|sudo|access/i],
        reply: 'Permission error — don\'t use sudo. Make sure your user bin directory exists:\n```bash\nmkdir -p ~/.local/bin\n```\nThen re-run the install script without sudo.',
      },
    ],
    fallback: 'Copy the exact error message here and I can give you a more specific fix.',
  },
];

function resolveReply(query, topicId, stepIndex) {
  const q = query.toLowerCase().trim();
  const topic = TOPICS.find(t => t.id === topicId);

  // If we're mid-flow, try to match the next step first
  if (topic && stepIndex < topic.flow.length) {
    for (let i = stepIndex; i < topic.flow.length; i++) {
      const step = topic.flow[i];
      if (step.match.some(re => re.test(q))) {
        return { reply: step.reply, topicId, nextStep: i + 1 };
      }
    }
    // Vague follow-up within current topic — give fallback
    if (isVague(q)) {
      return { reply: topic.fallback, topicId, nextStep: stepIndex };
    }
  }

  // Try to match a new topic
  const words = q.split(/\s+/);
  let best = null, bestScore = 0;
  for (const t of TOPICS) {
    let score = 0;
    for (const word of words) {
      for (const tag of t.tags) {
        if (tag.includes(word) || word.includes(tag)) score += tag === word ? 3 : 1;
      }
    }
    if (score > bestScore) { bestScore = score; best = t; }
  }

  if (best && bestScore >= 2) {
    return { reply: best.intro, topicId: best.id, nextStep: 0 };
  }

  // Still vague with no topic — acknowledge context
  if (isVague(q) && topic) {
    return { reply: topic.fallback, topicId, nextStep: stepIndex };
  }

  return {
    reply: 'I\'m not sure I caught that. Could you rephrase? Or pick one of these topics:\n- **Install Claude Code**\n- **Connect to Cursor**\n- **Figma MCP setup**\n- **YOLO mode**\n- **Troubleshoot an error**',
    topicId: null, nextStep: 0,
  };
}

function parseMessageContent(text) {
  const parts = [];
  const codeRe = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = codeRe.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', content: text.slice(last, m.index) });
    parts.push({ type: 'code', lang: m[1] || 'bash', content: m[2].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) });
  return parts;
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  const parts = msg.role === 'assistant' ? parseMessageContent(msg.content) : null;
  return (
    <div className="chat-msg" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
    }}>
      <div style={{ fontSize: 10, fontFamily: 'monospace', marginBottom: 3, color: '#666' }}>
        {isUser ? 'You' : '● Claude'}
      </div>
      <div style={{
        maxWidth: '88%',
        background: isUser ? '#000' : '#fff',
        color: isUser ? '#fff' : '#000',
        border: '1.5px solid #000',
        padding: '7px 10px',
        fontFamily: '"Geneva","Charcoal",monospace',
        fontSize: 12,
        lineHeight: 1.55,
      }}>
        {isUser ? msg.content : (parts || []).map((p, i) =>
          p.type === 'code'
            ? <CodeBlock key={i} code={p.content} lang={p.lang} />
            : <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{p.content}</span>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = React.useState(false);
  function doCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => fallback());
    } else { fallback(); }
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = code; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div style={{ margin: '6px 0', border: '1.5px solid #fff' }}>
      <div style={{ background: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 8px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#aaa' }}>{lang}</span>
        <button onClick={doCopy} style={{ background: 'none', border: '1px solid #aaa', color: '#aaa', fontFamily: 'monospace', fontSize: 10, cursor: 'pointer', padding: '1px 6px' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '8px 10px', background: '#000', color: '#fff', fontFamily: 'monospace', fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowX: 'auto' }}>{code}</pre>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="chat-msg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontFamily: 'monospace', marginBottom: 3, color: '#666' }}>● Claude</div>
      <div style={{ border: '1.5px solid #000', padding: '10px 14px', background: '#fff' }}>
        <span className="think-dot" style={{ animationDelay: '0s' }} />
        <span className="think-dot" style={{ animationDelay: '0.2s' }} />
        <span className="think-dot" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}

const SUGGESTED = [
  'How do I install Claude Code?',
  'Figma MCP setup',
  'Hook up Cursor',
  'What is YOLO mode?',
  'command not found error',
];

function ChatPanel({ closing, onClose }) {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: 'Hello! I\'m your setup guide assistant. Ask me anything about installing Claude Code, connecting Cursor, the Figma MCP server, or YOLO mode.' }
  ]);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const [topicId, setTopicId] = React.useState(null);
  const [stepIndex, setStepIndex] = React.useState(0);
  const bottomRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  React.useEffect(() => {
    setTimeout(() => inputRef.current && inputRef.current.focus(), 80);
  }, []);

  function send(text) {
    const q = (text || input).trim();
    if (!q || thinking) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setThinking(true);
    const delay = 380 + Math.random() * 280;
    setTimeout(() => {
      const result = resolveReply(q, topicId, stepIndex);
      setTopicId(result.topicId);
      setStepIndex(result.nextStep);
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }]);
      setThinking(false);
    }, delay);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const showSuggestions = messages.length <= 1;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 360,
      zIndex: 400, display: 'flex', flexDirection: 'column',
      border: '2px solid #000', borderTop: 'none', borderRight: 'none',
      background: '#fff',
    }} className={`chat-panel${closing ? ' closing' : ''}`}>
      {/* Title bar */}
      <div style={{
        background: '#000', height: 28, display: 'flex', alignItems: 'center',
        padding: '0 8px', gap: 8, flexShrink: 0,
      }}>
        <div onClick={onClose} style={{ width: 13, height: 13, border: '1.5px solid #fff', background: '#fff', cursor: 'pointer', flexShrink: 0 }} />
        <div style={{ flex: 1, height: 6, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)' }} />
        <span style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 12, color: '#fff', whiteSpace: 'nowrap' }}>
          ● Help Desk
        </span>
        <div style={{ flex: 1, height: 6, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)' }} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column' }}>
        {messages.map((m, i) => <ChatMessage key={i} msg={m} />)}
        {thinking && <ThinkingDots />}
        {showSuggestions && !thinking && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#888', marginBottom: 6 }}>Common questions:</div>
            {SUGGESTED.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{
                display: 'block', width: '100%', textAlign: 'left', marginBottom: 5,
                background: 'none', border: '1px solid #000', cursor: 'pointer',
                fontFamily: '"Geneva","Charcoal",monospace', fontSize: 11,
                padding: '5px 8px', color: '#000',
              }}>{s}</button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ borderTop: '2px solid #000', display: 'flex', flexShrink: 0 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask a question… (Enter to send)"
          rows={2}
          className="chat-input"
          style={{
            flex: 1, resize: 'none', border: 'none', padding: '8px 10px',
            fontFamily: '"Geneva","Charcoal",monospace', fontSize: 12,
            background: '#fff', outline: 'none', lineHeight: 1.5,
          }}
        />
        <button
          onClick={() => send()}
          disabled={thinking || !input.trim()}
          style={{
            width: 42, background: thinking ? '#ccc' : '#000', color: '#fff',
            border: 'none', borderLeft: '2px solid #000',
            fontFamily: 'monospace', fontSize: 18, cursor: thinking ? 'not-allowed' : 'pointer',
          }}
        >▶</button>
      </div>
    </div>
  );
}

// ─── Menu bar ────────────────────────────────────────────────────────────────

function WifiIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 16 14" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="11" width="2" height="2" fill="#000"/>
      <rect x="5" y="8"  width="6" height="2" fill="#000"/>
      <rect x="3" y="5"  width="10" height="2" fill="#000"/>
      <rect x="1" y="2"  width="14" height="2" fill="#000"/>
    </svg>
  );
}
function BluetoothIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 10 14" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0"  width="2" height="14" fill="#000"/>
      <rect x="4" y="1"  width="4" height="2"  fill="#000"/>
      <rect x="6" y="3"  width="2" height="2"  fill="#000"/>
      <rect x="4" y="5"  width="4" height="2"  fill="#000"/>
      <rect x="4" y="7"  width="4" height="2"  fill="#000"/>
      <rect x="6" y="9"  width="2" height="2"  fill="#000"/>
      <rect x="4" y="11" width="4" height="2"  fill="#000"/>
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="28" height="16" viewBox="0 0 22 12" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="1" width="19" height="10" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="19" y="3" width="3" height="6" fill="#000"/>
      <rect x="1" y="2" width="14" height="8" fill="#000"/>
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 13 13" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="0" width="5" height="2" fill="#000"/>
      <rect x="1" y="2" width="2" height="5" fill="#000"/>
      <rect x="8" y="2" width="2" height="5" fill="#000"/>
      <rect x="3" y="7" width="5" height="2" fill="#000"/>
      <rect x="6" y="8" width="2" height="2" fill="#000"/>
      <rect x="8" y="10" width="2" height="2" fill="#000"/>
      <rect x="10" y="12" width="2" height="2" fill="#000"/>
    </svg>
  );
}

// Collect all searchable text from the page
function buildSearchIndex() {
  const results = [];
  // Query all text nodes inside <main> after a short delay (DOM must be ready)
  const walker = document.createTreeWalker(
    document.querySelector('main') || document.body,
    NodeFilter.SHOW_TEXT,
    null
  );
  const seen = new Set();
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.trim();
    if (text.length < 3) continue;
    // Walk up to find the nearest block element with an id or the section wrapper
    let el = node.parentElement;
    while (el && el.tagName !== 'MAIN') {
      if (el.scrollIntoView) break;
      el = el.parentElement;
    }
    if (!el) continue;
    const key = text.slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({ text, el: node.parentElement });
  }
  return results;
}

function MenuBar({ currentStep, sectionRefs }) {
  const labels = ['Prerequisites', 'Install', 'Cursor', 'Figma MCP', 'YOLO Mode', 'Done'];
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [aboutPhase, setAboutPhase] = React.useState('idle'); // idle | jumping | exploding | done
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatClosing, setChatClosing] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [activeResult, setActiveResult] = React.useState(0);
  const inputRef = React.useRef(null);

  // Live clock
  const [time, setTime] = React.useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      + '  ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  });
  React.useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setTime(
        d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        + '  ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      );
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // About animation sequence — reset only when reopening, stay 'done' after explosion
  React.useEffect(() => {
    if (!aboutOpen) return;
    setAboutPhase('jumping');
    const t1 = setTimeout(() => setAboutPhase('exploding'), 2800);
    const t2 = setTimeout(() => setAboutPhase('done'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [aboutOpen]);

  // Open search
  function openSearch() {
    setMenuOpen(false);
    setSearchOpen(true);
    setQuery('');
    setResults([]);
    setActiveResult(0);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }

  function closeChat() {
    setChatClosing(true);
    setTimeout(() => { setChatOpen(false); setChatClosing(false); }, 220);
  }

  // Run search
  function handleQuery(q) {
    setQuery(q);
    setActiveResult(0);
    if (!q.trim()) { setResults([]); return; }
    const lower = q.toLowerCase();
    const index = buildSearchIndex();
    const matched = index.filter(r => r.text.toLowerCase().includes(lower)).slice(0, 8);
    setResults(matched);
  }

  function jumpTo(el) {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Flash highlight
    const orig = el.style.background;
    el.style.background = '#000080';
    el.style.color = '#fff';
    setTimeout(() => { el.style.background = orig; el.style.color = ''; }, 1200);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); setResults([]); }
    if (e.key === 'ArrowDown') { setActiveResult(r => Math.min(r + 1, results.length - 1)); e.preventDefault(); }
    if (e.key === 'ArrowUp') { setActiveResult(r => Math.max(r - 1, 0)); e.preventDefault(); }
    if (e.key === 'Enter' && results[activeResult]) { jumpTo(results[activeResult].el); }
  }

  function scrollTo(i) {
    setMenuOpen(false);
    const el = sectionRefs[i].current;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Highlight matching substring
  function highlight(text, q) {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text.slice(0, 60);
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length, 60);
    return (
      <span>
        {before.slice(-20)}
        <strong style={{ background: '#000', color: '#fff', padding: '0 2px' }}>{match}</strong>
        {after.slice(0, 30)}
      </span>
    );
  }

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 120,
          background: 'rgba(255,255,255,0.88)',
        }} onClick={e => { if (e.target === e.currentTarget) { setSearchOpen(false); setQuery(''); setResults([]); }}}>
          <div style={{ width: 520, border: '2px solid #000', background: '#fff' }}>
            {/* Search bar */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: results.length ? '2px solid #000' : 'none', padding: '8px 12px', gap: 10 }}>
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={e => handleQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search this guide..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontFamily: '"Geneva","Charcoal",monospace', fontSize: 15,
                  background: 'transparent',
                }}
              />
              {query && (
                <button onClick={() => { setQuery(''); setResults([]); inputRef.current.focus(); }}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 }}>✕</button>
              )}
            </div>
            {/* Results */}
            {results.length > 0 && (
              <div>
                {results.map((r, i) => (
                  <button key={i} onClick={() => jumpTo(r.el)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '8px 14px',
                      background: i === activeResult ? '#000' : '#fff',
                      color: i === activeResult ? '#fff' : '#000',
                      border: 'none', borderBottom: i < results.length - 1 ? '1px solid #000' : 'none',
                      fontFamily: '"Geneva","Charcoal",monospace', fontSize: 13, cursor: 'pointer',
                    }}
                    onMouseEnter={() => setActiveResult(i)}
                  >
                    {i === activeResult ? r.text.slice(0, 60) : highlight(r.text, query)}
                  </button>
                ))}
              </div>
            )}
            {query && results.length === 0 && (
              <div style={{ padding: '10px 14px', fontFamily: '"Geneva","Charcoal",monospace', fontSize: 13, color: '#000' }}>
                No results for "{query}"
              </div>
            )}
          </div>
          <div style={{ marginTop: 8, fontFamily: '"Geneva","Charcoal",monospace', fontSize: 11 }}>
            ↑↓ navigate · Enter to jump · Esc to close
          </div>
        </div>
      )}

      {/* Menu bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 36,
        background: '#fff', borderBottom: '2px solid #000',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 20px', zIndex: 200,
      }}>
        {/* About modal */}
        {aboutOpen && (
          <div
            onClick={() => setAboutOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 600,
              background: 'rgba(255,255,255,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              className="about-modal-inner"
              style={{ width: 340, border: '2px solid #000', background: '#fff' }}
            >
              {/* Title bar */}
              <div style={{ background: '#000', height: 22, display: 'flex', alignItems: 'center', padding: '0 6px', gap: 6 }}>
                <div onClick={() => setAboutOpen(false)} style={{ width: 12, height: 12, border: '1px solid #fff', background: '#fff', cursor: 'pointer', flexShrink: 0 }} />
                <div style={{ flex: 1, height: 6, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)' }} />
                <span style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 12, color: '#fff', whiteSpace: 'nowrap' }}>About This Guide</span>
                <div style={{ flex: 1, height: 6, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)' }} />
              </div>

              {/* Class photo */}
              <div style={{ borderBottom: '2px solid #000' }}>
                <svg width="100%" viewBox="0 0 340 200" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
                  {/* Classroom backdrop */}
                  <rect width="340" height="200" fill="#fff"/>
                  {/* Dither floor */}
                  <rect x="0" y="150" width="340" height="50" fill="url(#ditherAbout)" opacity="0.15"/>
                  <defs>
                    <pattern id="ditherAbout" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="1" height="1" fill="#000"/>
                      <rect x="1" y="1" width="1" height="1" fill="#000"/>
                    </pattern>
                  </defs>
                  {/* Chalkboard bg */}
                  <rect x="40" y="10" width="260" height="80" fill="#fff" stroke="#000" strokeWidth="2"/>
                  <rect x="44" y="14" width="252" height="72" fill="#fff" stroke="#000" strokeWidth="1"/>
                  <text x="170" y="46" textAnchor="middle" fontFamily="Chicago, ChicagoFLF, monospace" fontSize="11" fill="#000">IES Design Team</text>
                  <text x="170" y="62" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#000">Claude Code Setup · 2026</text>
                  {/* Pixel divider line */}
                  <rect x="80" y="70" width="180" height="1" fill="#000" opacity="0.4"/>

                  {/* ── Billy ── */}
                  <g className={aboutPhase === 'jumping' ? 'about-jumping' : aboutPhase === 'exploding' ? 'about-exploding' : ''}
                     style={{ ...(aboutPhase === 'exploding' ? {'--ex': '-80px', '--ey': '-60px'} : {}), display: aboutPhase === 'done' ? 'none' : undefined }}>
                    <rect x="72" y="128" width="56" height="36" fill="#000"/>
                    <rect x="88" y="128" width="8" height="10" fill="#fff"/>
                    <rect x="96" y="128" width="8" height="10" fill="#fff"/>
                    <rect x="99" y="132" width="2" height="32" fill="#000"/>
                    <rect x="72" y="140" width="10" height="3" fill="#fff"/>
                    <rect x="118" y="140" width="10" height="3" fill="#fff"/>
                    <rect x="93" y="114" width="14" height="16" fill="#fff" stroke="#000" strokeWidth="1"/>
                    <rect x="82" y="92" width="36" height="30" fill="#fff" stroke="#000" strokeWidth="2"/>
                    <rect x="82" y="92" width="36" height="10" fill="#000"/>
                    <rect x="82" y="100" width="4" height="10" fill="#000"/>
                    <rect x="114" y="100" width="4" height="10" fill="#000"/>
                    <rect x="89" y="106" width="5" height="5" fill="#000"/>
                    <rect x="106" y="106" width="5" height="5" fill="#000"/>
                    <rect x="90" y="114" width="3" height="2" fill="#000"/>
                    <rect x="107" y="114" width="3" height="2" fill="#000"/>
                    <rect x="93" y="116" width="14" height="2" fill="#000"/>
                    <rect x="80" y="164" width="18" height="28" fill="#000"/>
                    <rect x="102" y="164" width="18" height="28" fill="#000"/>
                    <rect x="78" y="190" width="22" height="6" fill="#000"/>
                    <rect x="100" y="190" width="22" height="6" fill="#000"/>
                    <rect x="75" y="148" width="28" height="10" fill="#fff" stroke="#000" strokeWidth="1"/>
                    <text x="89" y="156" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#000">Billy</text>
                  </g>

                  {/* ── Claude Code character ── */}
                  <g className={aboutPhase === 'jumping' ? 'about-jumping' : aboutPhase === 'exploding' ? 'about-exploding' : ''}
                     style={{ ...(aboutPhase === 'jumping' ? {animationDelay: '0.12s'} : aboutPhase === 'exploding' ? {'--ex': '80px', '--ey': '-60px', animationDelay: '0.08s'} : {}), display: aboutPhase === 'done' ? 'none' : undefined }}>
                    <rect x="192" y="110" width="56" height="56" fill="#fff" stroke="#000" strokeWidth="2"/>
                    <rect x="198" y="116" width="44" height="34" fill="#fff" stroke="#000" strokeWidth="1"/>
                    <rect x="206" y="124" width="7" height="7" fill="#000"/>
                    <rect x="227" y="124" width="7" height="7" fill="#000"/>
                    <rect x="206" y="136" width="7" height="4" fill="#000"/>
                    <rect x="227" y="136" width="7" height="4" fill="#000"/>
                    <rect x="213" y="140" width="14" height="4" fill="#000"/>
                    <rect x="204" y="132" width="4" height="6" fill="#000"/>
                    <rect x="232" y="132" width="4" height="6" fill="#000"/>
                    <rect x="200" y="154" width="40" height="6" fill="#000"/>
                    <rect x="202" y="155" width="36" height="4" fill="#fff"/>
                    <rect x="196" y="166" width="16" height="8" fill="#000"/>
                    <rect x="228" y="166" width="16" height="8" fill="#000"/>
                    <rect x="198" y="104" width="44" height="4" fill="#000"/>
                    <rect x="212" y="96" width="16" height="8" fill="#000"/>
                    <rect x="236" y="104" width="10" height="2" fill="#000"/>
                    <rect x="198" y="140" width="36" height="10" fill="#fff" stroke="#000" strokeWidth="1"/>
                    <text x="216" y="148" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#000">Claude</text>
                  </g>

                  {/* Fist bump */}
                  <g className={aboutPhase === 'exploding' ? 'about-exploding' : ''}
                     style={{ ...(aboutPhase === 'exploding' ? {'--ex': '0px', '--ey': '-90px', animationDelay: '0.04s'} : {}), display: aboutPhase === 'done' ? 'none' : undefined }}>
                    <rect x="128" y="148" width="14" height="12" fill="#fff" stroke="#000" strokeWidth="1"/>
                    <rect x="130" y="145" width="10" height="5" fill="#fff" stroke="#000" strokeWidth="1"/>
                    <rect x="178" y="148" width="14" height="12" fill="#fff" stroke="#000" strokeWidth="1"/>
                    <rect x="180" y="145" width="10" height="5" fill="#fff" stroke="#000" strokeWidth="1"/>
                    <rect x="142" y="146" width="4" height="4" fill="#000"/>
                    <rect x="150" y="142" width="4" height="4" fill="#000"/>
                    <rect x="158" y="146" width="4" height="4" fill="#000"/>
                    <rect x="146" y="152" width="4" height="2" fill="#000"/>
                    <rect x="154" y="152" width="4" height="2" fill="#000"/>
                  </g>

                  {/* Confetti + debris — only during exploding phase */}
                  {aboutPhase === 'exploding' && (() => {
                    const pieces = [
                      // Big debris chunks
                      {x:100,y:130,w:10,h:10,ex:'-90px',ey:'-80px',d:'0s'},
                      {x:220,y:125,w:10,h:10,ex:'90px',ey:'-80px',d:'0.04s'},
                      {x:155,y:108,w:12,h:12,ex:'-5px',ey:'-120px',d:'0.02s'},
                      // Squares — confetti
                      {x:108,y:118,w:6,h:6,ex:'-70px',ey:'-100px',d:'0.06s'},
                      {x:125,y:145,w:5,h:5,ex:'-55px',ey:'-50px',d:'0.10s'},
                      {x:140,y:112,w:7,h:7,ex:'-30px',ey:'-110px',d:'0.03s'},
                      {x:160,y:155,w:5,h:5,ex:'0px',ey:'50px',d:'0.08s'},
                      {x:175,y:108,w:6,h:6,ex:'20px',ey:'-115px',d:'0.05s'},
                      {x:195,y:145,w:7,h:7,ex:'55px',ey:'-55px',d:'0.09s'},
                      {x:210,y:115,w:5,h:5,ex:'75px',ey:'-95px',d:'0.01s'},
                      {x:230,y:150,w:6,h:6,ex:'85px',ey:'-40px',d:'0.07s'},
                      {x:245,y:130,w:5,h:5,ex:'100px',ey:'-70px',d:'0.04s'},
                      // Thin horizontal strips — classic confetti
                      {x:115,y:135,w:14,h:3,ex:'-80px',ey:'-65px',d:'0.11s'},
                      {x:135,y:125,w:12,h:3,ex:'-40px',ey:'-90px',d:'0.06s'},
                      {x:158,y:140,w:16,h:3,ex:'-10px',ey:'-105px',d:'0.02s'},
                      {x:172,y:130,w:14,h:3,ex:'15px',ey:'-95px',d:'0.08s'},
                      {x:190,y:138,w:12,h:3,ex:'45px',ey:'-75px',d:'0.05s'},
                      {x:208,y:128,w:16,h:3,ex:'70px',ey:'-85px',d:'0.09s'},
                      // Thin vertical strips
                      {x:120,y:120,w:3,h:14,ex:'-65px',ey:'-90px',d:'0.03s'},
                      {x:185,y:120,w:3,h:12,ex:'60px',ey:'-100px',d:'0.07s'},
                      {x:152,y:150,w:3,h:16,ex:'-20px',ey:'60px',d:'0.10s'},
                      {x:170,y:148,w:3,h:14,ex:'25px',ey:'55px',d:'0.04s'},
                      // Tiny dots scatter
                      {x:130,y:105,w:4,h:4,ex:'-45px',ey:'-115px',d:'0.07s'},
                      {x:148,y:160,w:4,h:4,ex:'-35px',ey:'70px',d:'0.12s'},
                      {x:165,y:105,w:4,h:4,ex:'10px',ey:'-120px',d:'0.01s'},
                      {x:180,y:162,w:4,h:4,ex:'40px',ey:'65px',d:'0.09s'},
                      {x:200,y:105,w:4,h:4,ex:'65px',ey:'-110px',d:'0.06s'},
                      {x:215,y:160,w:4,h:4,ex:'90px',ey:'50px',d:'0.03s'},
                      {x:105,y:155,w:4,h:4,ex:'-95px',ey:'40px',d:'0.08s'},
                      {x:240,y:115,w:4,h:4,ex:'105px',ey:'-90px',d:'0.05s'},
                    ];
                    return pieces.map((p, i) => (
                      <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill="#000"
                        className="about-exploding"
                        style={{'--ex': p.ex, '--ey': p.ey, animationDelay: p.d, animationDuration: '0.6s'}}
                      />
                    ));
                  })()}
                </svg>
              </div>

              {/* About text */}
              <div style={{ padding: '20px 24px' }}>
                <p style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 14, marginBottom: 12 }}>
                  Made with ♥ by Billy & Claude
                </p>
                <p style={{ ...bodyStyle, marginTop: 0, marginBottom: 16 }}>
                  This setup guide was built together by Billy Hong and his pal Claude Code. Say hi if it helped!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="https://intuit.enterprise.slack.com/user/@vhong2" target="_blank" rel="noopener noreferrer"
                    style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="5" width="4" height="4" fill="#000"/>
                      <rect x="5" y="0" width="4" height="4" fill="#000"/>
                      <rect x="5" y="5" width="4" height="9" fill="#000"/>
                      <rect x="10" y="5" width="4" height="4" fill="#000"/>
                      <rect x="5" y="10" width="9" height="4" fill="#000"/>
                    </svg>
                    Slack: @vhong2
                  </a>
                  <a href="mailto:vanxuong_hong@intuit.com"
                    style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="12" viewBox="0 0 14 12" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="0" width="14" height="12" fill="#fff" stroke="#000" strokeWidth="1"/>
                      <polygon points="0,0 7,7 14,0" fill="#000"/>
                      <rect x="0" y="8" width="5" height="4" fill="#000"/>
                      <rect x="9" y="8" width="5" height="4" fill="#000"/>
                    </svg>
                    vanxuong_hong@intuit.com
                  </a>
                </div>
                <button
                  onClick={() => setAboutOpen(false)}
                  style={{
                    marginTop: 20, width: '100%',
                    fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 13,
                    background: '#000', color: '#fff', border: '2px solid #000',
                    padding: '6px 0', cursor: 'pointer',
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Left: logo + dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <button onClick={() => setAboutOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <AppleIcon />
          </button>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 15,
              background: menuOpen ? '#000' : 'transparent',
              color: menuOpen ? '#fff' : '#000',
              border: 'none', cursor: 'pointer', padding: '3px 8px',
            }}
          >
            Setup Guide ▾
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute', top: 32, left: 28,
              background: '#fff', border: '2px solid #000',
              minWidth: 240, zIndex: 300,
            }}>
              {labels.map((label, i) => (
                <button key={i} onClick={() => scrollTo(i)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 14,
                    padding: '7px 18px',
                    background: currentStep === i ? '#000' : '#fff',
                    color: currentStep === i ? '#fff' : '#000',
                    border: 'none', borderBottom: i < labels.length - 1 ? '1px solid #000' : 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { if (currentStep !== i) { e.target.style.background = '#000'; e.target.style.color = '#fff'; }}}
                  onMouseLeave={e => { if (currentStep !== i) { e.target.style.background = '#fff'; e.target.style.color = '#000'; }}}
                >
                  {i + 1}. {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: status icons + search + clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            onClick={() => { setMenuOpen(false); setChatOpen(true); }}
            style={{ background: 'none', border: '1.5px solid #000', cursor: 'pointer', padding: '1px 8px', fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <span style={{ fontSize: 11 }}>?</span> Help
          </button>
          <button onClick={openSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
          </button>
          <BatteryIcon />
          <WifiIcon />
          <BluetoothIcon />
          <span style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 13, marginLeft: 4 }}>
            {time}
          </span>
        </div>
      </div>

      {/* Chat panel */}
      {chatOpen && <ChatPanel closing={chatClosing} onClose={closeChat} />}
    </>
  );
}

// ─── MacWindow ───────────────────────────────────────────────────────────────

function MacWindow({ title, icon, hero, children, sectionIndex = 0 }) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mac-window"
      style={{
        border: '2px solid #000',
        background: '#fff',
        marginBottom: 40,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
        transitionDelay: `${sectionIndex * 80}ms`,
      }}
    >
      {/* Title bar */}
      <div style={{
        background: '#000', color: '#fff', height: 22,
        display: 'flex', alignItems: 'center',
        padding: '0 6px', gap: 6,
      }}>
        <div style={{ width: 12, height: 12, border: '1px solid #fff', background: '#fff', flexShrink: 0 }} />
        <div style={{ flex: 1, height: 6, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)' }} />
        <span style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 12, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon} {title}
        </span>
        <div style={{ flex: 1, height: 6, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)' }} />
      </div>
      {/* Hero image */}
      {hero}
      {/* Content */}
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

// ─── CodeSnippet ─────────────────────────────────────────────────────────────

function CodeSnippet({ code, label }) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    const succeed = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(succeed).catch(() => {
        const el = document.createElement('textarea');
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        succeed();
      });
    } else {
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      succeed();
    }
  }

  return (
    <div style={{ border: '1px solid #000', background: '#fff', marginTop: 12, marginBottom: 12 }}>
      {label && (
        <div style={{ background: '#000', color: '#fff', fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 11, padding: '2px 8px' }}>
          {label}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <pre style={{ fontFamily: 'monospace', fontSize: 14, padding: '12px 16px', paddingRight: 80, whiteSpace: 'pre-wrap', overflowX: 'auto', margin: 0, lineHeight: 1.5 }}>
          {code}
        </pre>
        <button
          className="copy-btn"
          onClick={handleCopy}
          style={{
            position: 'absolute', top: 6, right: 6,
            fontFamily: '"Geneva","Charcoal",monospace', fontSize: 11,
            background: '#fff', border: '1px solid #000',
            padding: '3px 10px', cursor: 'pointer',
            transform: copied ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 150ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function PrerequisitesSection({ sectionRef }) {
  const items = [
    { label: 'A computer', detail: "Mac, Windows, or Linux — any will do! As long as it can run a web browser and connect to the internet." },
    { label: 'A Claude account (Pro plan or higher)', detail: "The free plan doesn't include Claude Code. Think of the Pro plan like a gym membership — it unlocks the good stuff.", link: 'https://claude.ai', linkText: 'Get one at claude.ai' },
    { label: 'Cursor installed', detail: "Cursor is a code editor — like a fancy word processor, but for code. We'll connect Claude Code to it later.", link: 'https://cursor.com', linkText: 'Download at cursor.com' },
    { label: 'A Figma account', detail: "Figma is a design tool — it's where your team's mockups and designs live. The free plan works fine.", link: 'https://figma.com', linkText: 'Sign up at figma.com' },
  ];
  return (
    <div ref={sectionRef}>
      <MacWindow title="What You'll Need Before We Start" icon={<ChecklistIcon size={16} />} hero={<HeroChecklist />} sectionIndex={0}>
        <TypeIn preview="Before we dive in, make sure you have these four things ready. Don't worry — we'll walk through each step together." tag="p" style={bodyStyle}>
          Before we dive in, make sure you have these four things ready. Don't worry — we'll walk through each step together.
        </TypeIn>
        <ul style={{ listStyle: 'none', marginTop: 16 }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 16, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>☐</span>
              <div>
                <TypeIn preview={item.label} tag="strong" style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 13, display: 'block' }}>{item.label}</TypeIn>
                <TypeIn preview={item.detail} tag="p" style={bodyStyle}>{item.detail}</TypeIn>
                {item.link && <TypeIn preview={item.linkText + ' ↗'} tag="span"><a href={item.link} target="_blank" rel="noopener noreferrer" style={linkStyle} className="mac-link">{item.linkText} ↗</a></TypeIn>}
              </div>
            </li>
          ))}
        </ul>
      </MacWindow>
    </div>
  );
}

function InstallSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="Step 1 — Install Claude Code" icon={<FloppyDiskIcon size={16} />} hero={<HeroTerminal />} sectionIndex={1}>
        <TypeIn preview="First, let's open a terminal. A terminal is just a text box where you type commands to your computer — like passing notes to a very literal-minded assistant. On Mac, search for Terminal in Spotlight (press Cmd+Space, type Terminal)." tag="p" style={bodyStyle}>
          First, let's open a terminal. A terminal is just a text box where you type commands to your computer — like passing notes to a very literal-minded assistant. On Mac, search for "Terminal" in Spotlight (press <code style={inlineCode}>Cmd+Space</code>, type "Terminal").
        </TypeIn>
        <TypeIn preview="Install" tag="h2" style={h2Style}>Install</TypeIn>
        <CodeSnippet code={SNIPPETS.macInstall} label="macOS / Linux" />
        <TypeIn preview="This tells your computer to download Claude Code and set it up automatically. You only do this once." tag="p" style={bodyStyle}>
          This tells your computer to download Claude Code and set it up automatically. You only do this once.
        </TypeIn>
        <TypeIn preview="Check that it worked" tag="h2" style={h2Style}>Check that it worked</TypeIn>
        <CodeSnippet code={SNIPPETS.verify} label="Verify it worked" />
        <TypeIn preview="If you see a version number (like 1.2.3), you're golden! If it says command not found, close your terminal, open a fresh one, and try again." tag="p" style={bodyStyle}>
          If you see a version number (like <code style={inlineCode}>1.2.3</code>), you're golden! If it says "command not found", close your terminal, open a fresh one, and try again.
        </TypeIn>
        <TypeIn preview="Now type claude and press Enter. A browser window will pop up asking you to log in. Sign in with your Claude account and you're all connected!" tag="p" style={{ ...bodyStyle, marginTop: 16, padding: '12px 16px', border: '1px solid #000' }}>
          Now type <code style={inlineCode}>claude</code> and press Enter. A browser window will pop up asking you to log in. Sign in with your Claude account and you're all connected!
        </TypeIn>
      </MacWindow>
    </div>
  );
}

function CursorSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="Step 2 — Hook Claude Code Into Cursor" icon={<PlugIcon size={16} />} hero={<HeroCursor />} sectionIndex={2}>
        <TypeIn preview="Cursor is a code editor — think of it like a fancy word processor, but for code. Claude Code can live right inside it, watching your files and offering help in real time. Here's how to connect them." tag="p" style={bodyStyle}>
          Cursor is a code editor — think of it like a fancy word processor, but for code. Claude Code can live right inside it, watching your files and offering help in real time. Here's how to connect them.
        </TypeIn>
        <TypeIn preview="Install the Extension" tag="h2" style={h2Style}>Install the Extension</TypeIn>
        <TypeIn preview="Open Cursor, then press Cmd+Shift+X. This opens the Extensions panel — it's like an app store just for your code editor. Search for Claude Code and click Install. Done!" tag="p" style={bodyStyle}>
          Open Cursor, then press <code style={inlineCode}>Cmd+Shift+X</code>. This opens the Extensions panel — it's like an app store just for your code editor. Search for <strong>"Claude Code"</strong> and click Install. Done!
        </TypeIn>
        <TypeIn preview="Alternative: Use Claude Code in Cursor's Terminal" tag="h2" style={h2Style}>Alternative: Use Claude Code in Cursor's Terminal</TypeIn>
        <CodeSnippet code={SNIPPETS.cursorTerminal} label="Open Cursor's terminal and run Claude" />
        <TypeIn preview="This starts Claude Code right inside Cursor. Now they can talk to each other — Claude can see your files, and you can see Claude's changes appear in real time. Pro tip: enable Auto-Save in Cursor's settings so edits show up the moment Claude makes them." tag="p" style={bodyStyle}>
          This starts Claude Code right inside Cursor. Now they can talk to each other — Claude can see your files, and you can see Claude's changes appear in real time. Pro tip: enable Auto-Save in Cursor's settings so edits show up the moment Claude makes them.
        </TypeIn>
      </MacWindow>
    </div>
  );
}

function FigmaMCPSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="Step 3 — Connect Figma With the MCP Server" icon={<PaletteIcon size={16} />} hero={<HeroFigma />} sectionIndex={3}>
        <TypeIn preview="MCP stands for Model Context Protocol — but all you need to know is: it lets Claude look at your Figma designs and understand them. It's like giving Claude a pair of eyes for your design files." tag="p" style={bodyStyle}>
          MCP stands for "Model Context Protocol" — but all you need to know is: it lets Claude look at your Figma designs and understand them. It's like giving Claude a pair of eyes for your design files.
        </TypeIn>
        <TypeIn preview="Add the Figma MCP Server" tag="h2" style={h2Style}>Add the Figma MCP Server</TypeIn>
        <CodeSnippet code={SNIPPETS.figmaAdd} label="Add Figma MCP (recommended)" />
        <TypeIn preview="Make It Available in Every Project" tag="h2" style={h2Style}>Make It Available in Every Project</TypeIn>
        <CodeSnippet code={SNIPPETS.figmaScope} label="Make it available in ALL projects (optional)" />
        <TypeIn preview="This saves the connection so you don't have to set it up again in every project folder." tag="p" style={bodyStyle}>
          This saves the connection so you don't have to set it up again in every project folder.
        </TypeIn>
        <TypeIn preview="Check the Connection" tag="h2" style={h2Style}>Check the Connection</TypeIn>
        <CodeSnippet code={SNIPPETS.figmaList} label="Verify the connection" />
        <TypeIn preview="After running that command, restart Claude Code. Then type /mcp inside Claude Code, find figma, and click Authenticate. A browser window pops up — click Allow Access. That's it!" tag="p" style={bodyStyle}>
          After running that command, restart Claude Code. Then type <code style={inlineCode}>/mcp</code> inside Claude Code, find "figma", and click "Authenticate". A browser window pops up — click "Allow Access". That's it!
        </TypeIn>
        <TypeIn preview="How to use it: Copy a link to any frame in Figma and paste it into Claude Code with a prompt like: Build this design as a React component: [paste Figma link here]" tag="p" style={{ ...bodyStyle, marginTop: 16, padding: '12px 16px', border: '1px solid #000' }}>
          <strong style={{ fontFamily: '"Chicago","ChicagoFLF",monospace' }}>How to use it:</strong> Copy a link to any frame in Figma and paste it into Claude Code with a prompt like: <em>"Build this design as a React component: [paste Figma link here]"</em>
        </TypeIn>
      </MacWindow>
    </div>
  );
}

function YOLOSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="Bonus: YOLO Mode (Use With Caution!)" icon={<SkullIcon size={16} />} hero={<HeroYOLO />} sectionIndex={4}>
        <TypeIn preview="Normally, Claude Code asks your permission before doing anything — like editing a file or running a command. This is a safety net, and it's a good one. But if you trust what you're asking it to do and don't want to keep clicking Yes every 10 seconds, you can turn off the permission prompts." tag="p" style={bodyStyle}>
          Normally, Claude Code asks your permission before doing anything — like editing a file or running a command. This is a safety net, and it's a good one. But if you trust what you're asking it to do and don't want to keep clicking "Yes" every 10 seconds, you can turn off the permission prompts.
        </TypeIn>
        <TypeIn preview="Skip All Permission Prompts" tag="h2" style={h2Style}>Skip All Permission Prompts</TypeIn>
        <CodeSnippet code={SNIPPETS.yolo} label="Skip all permission prompts" />
        <TypeIn preview="Fully Autonomous Mode" tag="h2" style={h2Style}>Fully Autonomous Mode</TypeIn>
        <CodeSnippet code={SNIPPETS.yoloPrompt} label="Combine with a direct prompt (fully autonomous)" />
        <TypeIn preview="The -p flag lets you give Claude a task directly. It runs, does the work, and stops — no back-and-forth needed." tag="p" style={bodyStyle}>
          The <code style={inlineCode}>-p</code> flag lets you give Claude a task directly. It runs, does the work, and stops — no back-and-forth needed.
        </TypeIn>
        <div style={{ border: '2px solid #000', background: '#fff', padding: 16, marginTop: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
              <polygon points="14,2 26,24 2,24" fill="#fff" stroke="#000" strokeWidth="2"/>
              <rect x="12" y="9" width="4" height="8" fill="#000"/>
              <rect x="12" y="19" width="4" height="3" fill="#000"/>
            </svg>
          </div>
          <div>
            <TypeIn preview="Warning: This skips ALL safety checks" tag="strong" style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 13, display: 'block', marginBottom: 8 }}>
              Warning: This skips ALL safety checks
            </TypeIn>
            <TypeIn preview="Claude can delete files, run any command, and make changes without asking first. ONLY use this in a test project or inside a Docker container. NEVER use this in a folder with important files you haven't backed up. Commit your work to git before you start!" tag="p" style={bodyStyle}>
              Claude can delete files, run any command, and make changes without asking first. ONLY use this in a test project or inside a Docker container. NEVER use this in a folder with important files you haven't backed up. Commit your work to git before you start!
            </TypeIn>
          </div>
        </div>
      </MacWindow>
    </div>
  );
}

function DoneSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="You're All Set!" icon={<ThumbsUpIcon size={16} />} hero={<HeroDone />} sectionIndex={5}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <TypeIn preview="You're All Set!" tag="h2" style={{ ...h2Style, textAlign: 'center', fontSize: 22, marginTop: 0 }}>You're All Set!</TypeIn>
          <TypeIn preview="That's it! You now have Claude Code installed, hooked up to Cursor, and connected to Figma. You've built the scaffolding — now go build something cool." tag="p" style={{ ...bodyStyle, textAlign: 'center', maxWidth: 480, margin: '12px auto 0' }}>
            That's it! You now have Claude Code installed, hooked up to Cursor, and connected to Figma. You've built the scaffolding — now go build something cool.
          </TypeIn>
        </div>
      </MacWindow>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [splashDone, setSplashDone] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  const ref0 = React.useRef(null);
  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);
  const ref4 = React.useRef(null);
  const ref5 = React.useRef(null);
  const sectionRefs = [ref0, ref1, ref2, ref3, ref4, ref5];

  React.useEffect(() => {
    const t = setTimeout(() => {
      setShowSplash(false);
      // Give the splash fade-out (500ms) time to finish, then unlock TypeIn
      setTimeout(() => setSplashDone(true), 520);
    }, 2700);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    const observers = sectionRefs.map((ref, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCurrentStep(i); },
        { threshold: 0.3 }
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <SplashDoneContext.Provider value={splashDone}>
      <style>{globalStyles}</style>
      {/* Fixed dither layer — never scrolls, no repaint flicker */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'2\' height=\'2\'%3E%3Crect x=\'0\' y=\'0\' width=\'1\' height=\'1\' fill=\'%23000\'/%3E%3Crect x=\'1\' y=\'1\' width=\'1\' height=\'1\' fill=\'%23000\'/%3E%3C/svg%3E")',
        backgroundSize: '2px 2px',
        opacity: 0.22,
      }} />
      <Splash visible={showSplash} />
      <MenuBar currentStep={currentStep} sectionRefs={sectionRefs} />
      <div style={{ background: 'transparent', minHeight: '100vh' }}>
        <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px', paddingTop: 68 }}>
          <PrerequisitesSection sectionRef={sectionRefs[0]} />
          <InstallSection sectionRef={sectionRefs[1]} />
          <CursorSection sectionRef={sectionRefs[2]} />
          <FigmaMCPSection sectionRef={sectionRefs[3]} />
          <YOLOSection sectionRef={sectionRefs[4]} />
          <DoneSection sectionRef={sectionRefs[5]} />
        </main>
      </div>
    </SplashDoneContext.Provider>
  );
}
