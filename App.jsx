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
.mac-desktop {
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23000'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%23000'/%3E%3C/svg%3E");
  background-size: 2px 2px;
  min-height: 100vh;
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
`;

const SNIPPETS = {
  macInstall: `curl -fsSL https://cli.anthropic.com/install.sh | sh`,
  winInstall: `irm https://cli.anthropic.com/install.ps1 | iex`,
  verify: `claude --version`,
  cursorTerminal: `# Open Cursor's built-in terminal:\n#   Mac: press Cmd + \` (the key above Tab)\n#   Windows: press Ctrl + \`\n# Then type:\nclaude`,
  figmaAdd: `claude mcp add --transport http figma https://mcp.figma.com/mcp`,
  figmaScope: `claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp`,
  figmaList: `claude mcp list`,
  yolo: `claude --dangerously-skip-permissions`,
  yoloPrompt: `claude --dangerously-skip-permissions -p "Refactor the auth module to use JWT tokens"`,
};

const bodyStyle = { fontFamily: '"Geneva","Charcoal",monospace', fontSize: 13, lineHeight: 1.7, color: '#000', marginTop: 6 };
const linkStyle = { fontFamily: '"Geneva","Charcoal",monospace', fontSize: 13, color: '#000080', textDecoration: 'underline' };
const h2Style = { fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 15, marginBottom: 10, marginTop: 16 };
const inlineCode = { fontFamily: 'monospace', background: '#fff', padding: '1px 5px', border: '1px solid #000', fontSize: 13 };

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

function AppleLogoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="0" width="2" height="2" fill="#000"/>
      <rect x="8" y="1" width="2" height="1" fill="#000"/>
      <rect x="4" y="2" width="6" height="2" fill="#000"/>
      <rect x="3" y="4" width="8" height="2" fill="#000"/>
      <rect x="2" y="6" width="10" height="2" fill="#000"/>
      <rect x="2" y="8" width="10" height="2" fill="#000"/>
      <rect x="3" y="10" width="8" height="2" fill="#000"/>
      <rect x="4" y="12" width="2" height="2" fill="#000"/>
      <rect x="8" y="12" width="2" height="2" fill="#000"/>
      <rect x="6" y="7" width="2" height="1" fill="#fff"/>
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

function Splash({ visible }) {
  return (
    <div className={`splash${visible ? '' : ' hidden'}`}>
      <HappyMacIcon />
      <div style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 18, letterSpacing: 1 }}>
        Welcome to Macintosh
      </div>
    </div>
  );
}

function MenuBar({ currentStep }) {
  const labels = ['Prerequisites', 'Install', 'Cursor', 'Figma MCP', 'YOLO Mode', 'Done'];
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 20,
      background: '#fff', borderBottom: '1px solid #000',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 8px', zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <AppleLogoIcon />
        <span style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 12 }}>Setup Guide</span>
      </div>
      <span style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 12 }}>
        {currentStep + 1} of 6 — {labels[currentStep]}
      </span>
    </div>
  );
}

function MacWindow({ title, icon, children, sectionIndex = 0 }) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
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
        marginBottom: 32,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
        transitionDelay: `${sectionIndex * 120}ms`,
      }}
    >
      <div style={{
        background: '#000', color: '#fff', height: 20,
        display: 'flex', alignItems: 'center',
        padding: '0 4px', gap: 6, position: 'relative',
      }}>
        <div style={{ width: 12, height: 12, border: '1px solid #fff', background: '#fff', flexShrink: 0 }} />
        <div style={{ flex: 1, height: 8, backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)', opacity: 0.4 }} />
        <span style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 12, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon} {title}
        </span>
        <div style={{ flex: 1, height: 8, backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)', opacity: 0.4 }} />
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

function CodeSnippet({ code, label }) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

function PrerequisitesSection({ sectionRef }) {
  const items = [
    { label: 'A computer', detail: 'Mac, Windows, or Linux — any will do! As long as it can run a web browser and connect to the internet.' },
    { label: 'A Claude account (Pro plan or higher)', detail: "The free plan doesn't include Claude Code. Think of the Pro plan like a gym membership — it unlocks the good stuff.", link: 'https://claude.ai', linkText: 'Get one at claude.ai' },
    { label: 'Cursor installed', detail: "Cursor is a code editor — like a fancy word processor, but for code. We'll connect Claude Code to it later.", link: 'https://cursor.com', linkText: 'Download at cursor.com' },
    { label: 'A Figma account', detail: "Figma is a design tool — it's where your team's mockups and designs live. The free plan works fine.", link: 'https://figma.com', linkText: 'Sign up at figma.com' },
  ];
  return (
    <div ref={sectionRef}>
      <MacWindow title="What You'll Need Before We Start" icon={<ChecklistIcon size={16} />} sectionIndex={0}>
        <p style={bodyStyle}>Before we dive in, make sure you have these four things ready. Don't worry — we'll walk through each step together.</p>
        <ul style={{ listStyle: 'none', marginTop: 16 }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 16, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>☐</span>
              <div>
                <strong style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 13 }}>{item.label}</strong>
                <p style={bodyStyle}>{item.detail}</p>
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={linkStyle} className="mac-link">{item.linkText} ↗</a>}
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
      <MacWindow title="Step 1 — Install Claude Code" icon={<FloppyDiskIcon size={16} />} sectionIndex={1}>
        <p style={bodyStyle}>
          First, let's open a terminal. A terminal is just a text box where you type commands to your computer — like passing notes to a very literal-minded assistant. On Mac, search for "Terminal" in Spotlight. On Windows, search for "PowerShell".
        </p>
        <h2 style={h2Style}>Mac or Linux</h2>
        <CodeSnippet code={SNIPPETS.macInstall} label="macOS / Linux" />
        <p style={bodyStyle}>This tells your computer to download Claude Code and set it up automatically. You only do this once.</p>
        <h2 style={h2Style}>Windows</h2>
        <CodeSnippet code={SNIPPETS.winInstall} label="Windows (PowerShell)" />
        <p style={bodyStyle}>Same idea, just for Windows. Paste this into PowerShell and press Enter.</p>
        <h2 style={h2Style}>Check that it worked</h2>
        <CodeSnippet code={SNIPPETS.verify} label="Verify it worked" />
        <p style={bodyStyle}>If you see a version number (like <code style={inlineCode}>1.2.3</code>), you're golden! If it says "command not found", close your terminal, open a fresh one, and try again.</p>
        <p style={{ ...bodyStyle, marginTop: 16, padding: '12px 16px', border: '1px solid #000', background: '#fff' }}>
          Now type <code style={inlineCode}>claude</code> and press Enter. A browser window will pop up asking you to log in. Sign in with your Claude account and you're all connected!
        </p>
      </MacWindow>
    </div>
  );
}

function CursorSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="Step 2 — Hook Claude Code Into Cursor" icon={<PlugIcon size={16} />} sectionIndex={2}>
        <p style={bodyStyle}>
          Cursor is a code editor — think of it like a fancy word processor, but for code. Claude Code can live right inside it, watching your files and offering help in real time. Here's how to connect them.
        </p>
        <h2 style={h2Style}>Install the Extension</h2>
        <p style={bodyStyle}>
          Open Cursor, then press <code style={inlineCode}>Cmd+Shift+X</code> on Mac (or <code style={inlineCode}>Ctrl+Shift+X</code> on Windows). This opens the Extensions panel — it's like an app store just for your code editor. Search for <strong>"Claude Code"</strong> and click Install. Done!
        </p>
        <h2 style={h2Style}>Alternative: Use Claude Code in Cursor's Terminal</h2>
        <CodeSnippet code={SNIPPETS.cursorTerminal} label="Alternative: use Claude Code in Cursor's terminal" />
        <p style={bodyStyle}>
          This starts Claude Code right inside Cursor. Now they can talk to each other — Claude can see your files, and you can see Claude's changes appear in real time. Pro tip: enable Auto-Save in Cursor's settings so edits show up the moment Claude makes them.
        </p>
      </MacWindow>
    </div>
  );
}

function FigmaMCPSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="Step 3 — Connect Figma With the MCP Server" icon={<PaletteIcon size={16} />} sectionIndex={3}>
        <p style={bodyStyle}>
          MCP stands for "Model Context Protocol" — but all you need to know is: it lets Claude look at your Figma designs and understand them. It's like giving Claude a pair of eyes for your design files.
        </p>
        <h2 style={h2Style}>Add the Figma MCP Server</h2>
        <CodeSnippet code={SNIPPETS.figmaAdd} label="Add Figma MCP (recommended)" />
        <h2 style={h2Style}>Make It Available Everywhere (Optional but Recommended)</h2>
        <CodeSnippet code={SNIPPETS.figmaScope} label="Make it available in ALL projects (optional)" />
        <p style={bodyStyle}>This saves the connection so you don't have to set it up again in every project folder.</p>
        <h2 style={h2Style}>Check the Connection</h2>
        <CodeSnippet code={SNIPPETS.figmaList} label="Verify the connection" />
        <p style={bodyStyle}>
          After running that command, restart Claude Code. Then type <code style={inlineCode}>/mcp</code> inside Claude Code, find "figma", and click "Authenticate". A browser window pops up — click "Allow Access". That's it!
        </p>
        <p style={{ ...bodyStyle, marginTop: 16, padding: '12px 16px', border: '1px solid #000' }}>
          <strong style={{ fontFamily: '"Chicago","ChicagoFLF",monospace' }}>How to use it:</strong> Copy a link to any frame in Figma and paste it into Claude Code with a prompt like: <em>"Build this design as a React component: [paste Figma link here]"</em>
        </p>
      </MacWindow>
    </div>
  );
}

function YOLOSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="Bonus: YOLO Mode (Use With Caution!)" icon={<SkullIcon size={16} />} sectionIndex={4}>
        <p style={bodyStyle}>
          Normally, Claude Code asks your permission before doing anything — like editing a file or running a command. This is a safety net, and it's a good one. But if you trust what you're asking it to do and don't want to keep clicking "Yes" every 10 seconds, you can turn off the permission prompts.
        </p>
        <h2 style={h2Style}>Skip All Permission Prompts</h2>
        <CodeSnippet code={SNIPPETS.yolo} label="Skip all permission prompts" />
        <h2 style={h2Style}>Fully Autonomous Mode</h2>
        <CodeSnippet code={SNIPPETS.yoloPrompt} label="Combine with a direct prompt (fully autonomous)" />
        <p style={bodyStyle}>The <code style={inlineCode}>-p</code> flag lets you give Claude a task directly. It runs, does the work, and stops — no back-and-forth needed.</p>

        <div style={{ border: '2px solid #000', background: '#fff', padding: 16, marginTop: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" style={{ imageRendering: 'pixelated' }} xmlns="http://www.w3.org/2000/svg">
              <polygon points="14,2 26,24 2,24" fill="#fff" stroke="#000" strokeWidth="2"/>
              <rect x="12" y="9" width="4" height="8" fill="#000"/>
              <rect x="12" y="19" width="4" height="3" fill="#000"/>
            </svg>
          </div>
          <div>
            <strong style={{ fontFamily: '"Chicago","ChicagoFLF",monospace', fontSize: 13, display: 'block', marginBottom: 8 }}>
              Warning: This skips ALL safety checks
            </strong>
            <p style={bodyStyle}>
              Claude can delete files, run any command, and make changes without asking first. ONLY use this in a test project or inside a Docker container. NEVER use this in a folder with important files you haven't backed up. Commit your work to git before you start!
            </p>
          </div>
        </div>
      </MacWindow>
    </div>
  );
}

function DoneSection({ sectionRef }) {
  return (
    <div ref={sectionRef}>
      <MacWindow title="You're All Set!" icon={<ThumbsUpIcon size={16} />} sectionIndex={5}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <ThumbsUpIcon />
          <h2 style={{ ...h2Style, textAlign: 'center', marginTop: 20, fontSize: 20 }}>You're All Set!</h2>
          <p style={{ ...bodyStyle, textAlign: 'center', maxWidth: 480, margin: '12px auto 0' }}>
            That's it! You now have Claude Code installed, hooked up to Cursor, and connected to Figma. You've built the scaffolding — now go build something cool.
          </p>
        </div>
      </MacWindow>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [currentStep, setCurrentStep] = React.useState(0);

  const sectionRefs = [
    React.useRef(null), React.useRef(null), React.useRef(null),
    React.useRef(null), React.useRef(null), React.useRef(null),
  ];

  React.useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2200);
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
    <>
      <style>{globalStyles}</style>
      <Splash visible={showSplash} />
      <MenuBar currentStep={currentStep} />
      <div className="mac-desktop">
        <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px', paddingTop: 52 }}>
          <PrerequisitesSection sectionRef={sectionRefs[0]} />
          <InstallSection sectionRef={sectionRefs[1]} />
          <CursorSection sectionRef={sectionRefs[2]} />
          <FigmaMCPSection sectionRef={sectionRefs[3]} />
          <YOLOSection sectionRef={sectionRefs[4]} />
          <DoneSection sectionRef={sectionRefs[5]} />
        </main>
      </div>
    </>
  );
}
