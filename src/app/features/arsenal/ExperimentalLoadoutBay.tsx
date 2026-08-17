import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Brain,
  Code,
  Cpu,
  Eye,
  Flame,
  Layers,
  Layout,
  MessageSquare,
  Monitor,
  PenTool,
  Search,
  Share2,
  Sparkles,
  Terminal,
  Video,
} from 'lucide-react';

type CategoryTab = 'Design Core' | 'AI for UX' | 'Research' | 'Dev Bridge' | 'Collaboration';
type Preset = 'AI Product Designer' | 'Design Systems Lead' | 'UX Strategist';

type ToolEntry = {
  id: string;
  name: string;
  category: CategoryTab;
  role: string;
  description: string;
  tags: string[];
  detail: string;
  levelLabel: string;
  levelValue: number;
  icon: React.ElementType;
  presets: Preset[];
};

const tabs: CategoryTab[] = ['Design Core', 'AI for UX', 'Research', 'Dev Bridge', 'Collaboration'];
const presets: Preset[] = ['AI Product Designer', 'Design Systems Lead', 'UX Strategist'];

const tools: ToolEntry[] = [
  {
    id: 'figma',
    name: 'Figma',
    category: 'Design Core',
    role: 'Interface Authoring',
    description: 'Primary vector workspace for product UI and systems.',
    tags: ['UI', 'Components', 'Prototyping'],
    detail: 'Connected libraries keep specs in sync across squads.',
    levelLabel: 'Mastery',
    levelValue: 95,
    icon: PenTool,
    presets: ['AI Product Designer', 'Design Systems Lead', 'UX Strategist'],
  },
  {
    id: 'figjam',
    name: 'FigJam',
    category: 'Design Core',
    role: 'Workshop Canvas',
    description: 'Collaborative ideation and journey mapping environment.',
    tags: ['Mapping', 'Workshops', 'Flows'],
    detail: 'Fast synthesis boards for discovery to concept handoff.',
    levelLabel: 'Advanced',
    levelValue: 87,
    icon: Layout,
    presets: ['AI Product Designer', 'Design Systems Lead', 'UX Strategist'],
  },
  {
    id: 'framer',
    name: 'Framer',
    category: 'Design Core',
    role: 'Prototype Motion',
    description: 'High-fidelity interaction and transition simulation.',
    tags: ['Motion', 'Prototype', 'Narrative'],
    detail: 'Validates micro-flow quality before engineering build.',
    levelLabel: 'Advanced',
    levelValue: 84,
    icon: Sparkles,
    presets: ['AI Product Designer', 'UX Strategist'],
  },
  {
    id: 'chatgpt',
    name: 'OpenAI / ChatGPT',
    category: 'AI for UX',
    role: 'UX Copilot',
    description: 'Generates exploration paths, flows, and copy variants.',
    tags: ['LLM', 'UX Ops', 'Ideation'],
    detail: 'Prompt chains accelerate concept to validation loops.',
    levelLabel: 'Integrated',
    levelValue: 92,
    icon: Brain,
    presets: ['AI Product Designer', 'UX Strategist'],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'AI for UX',
    role: 'Code Assist',
    description: 'AI-native IDE support for rapid interface iteration.',
    tags: ['IDE', 'Refactor', 'UI Build'],
    detail: 'Bridges design intent with implementation patterns quickly.',
    levelLabel: 'Advanced',
    levelValue: 86,
    icon: Terminal,
    presets: ['AI Product Designer', 'Design Systems Lead'],
  },
  {
    id: 'v0',
    name: 'v0',
    category: 'AI for UX',
    role: 'UI Generator',
    description: 'Speeds up component scaffolding and layout experiments.',
    tags: ['Generative UI', 'Rapid Drafting', 'Components'],
    detail: 'Useful for fast variant testing under strict time windows.',
    levelLabel: 'Proficient',
    levelValue: 79,
    icon: Sparkles,
    presets: ['AI Product Designer', 'Design Systems Lead'],
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'AI for UX',
    role: 'Reasoning Assist',
    description: 'Long-context reasoning for product and UX articulation.',
    tags: ['Reasoning', 'Docs', 'Strategy'],
    detail: 'Helps pressure-test assumptions and edge-case narratives.',
    levelLabel: 'Advanced',
    levelValue: 83,
    icon: MessageSquare,
    presets: ['AI Product Designer', 'UX Strategist'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'AI for UX',
    role: 'Multimodal Analyst',
    description: 'Multimodal support for comparative solution exploration.',
    tags: ['Vision', 'Prompting', 'Comparative'],
    detail: 'Used to benchmark ideas across text and visual contexts.',
    levelLabel: 'Proficient',
    levelValue: 76,
    icon: Cpu,
    presets: ['AI Product Designer', 'UX Strategist'],
  },
  {
    id: 'magician',
    name: 'Magician',
    category: 'AI for UX',
    role: 'Design Plugin',
    description: 'In-canvas assistant for quick UI ideation in Figma.',
    tags: ['Plugin', 'Concept', 'Assist'],
    detail: 'Reduces blank-canvas time during exploratory passes.',
    levelLabel: 'Proficient',
    levelValue: 74,
    icon: Flame,
    presets: ['AI Product Designer'],
  },
  {
    id: 'uizard',
    name: 'Uizard',
    category: 'AI for UX',
    role: 'Wireframe AI',
    description: 'Transforms rough concepts into early-stage interfaces.',
    tags: ['Wireframe', 'Flows', 'Speed'],
    detail: 'Great for framing hypotheses before final visual design.',
    levelLabel: 'Proficient',
    levelValue: 72,
    icon: Layout,
    presets: ['AI Product Designer', 'UX Strategist'],
  },
  {
    id: 'galileo',
    name: 'Galileo AI',
    category: 'AI for UX',
    role: 'UI Concept Model',
    description: 'Rapid visual concept output for product direction drafts.',
    tags: ['Concepting', 'Generative', 'Direction'],
    detail: 'Supports concept branching when timelines are compressed.',
    levelLabel: 'Proficient',
    levelValue: 71,
    icon: Eye,
    presets: ['AI Product Designer'],
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    category: 'Research',
    role: 'Behavior Analytics',
    description: 'Session replay and heatmap intelligence for UX tuning.',
    tags: ['Heatmaps', 'Replay', 'Behavior'],
    detail: 'Highlights friction points that surveys often miss.',
    levelLabel: 'Advanced',
    levelValue: 82,
    icon: Flame,
    presets: ['UX Strategist', 'AI Product Designer'],
  },
  {
    id: 'maze',
    name: 'Maze',
    category: 'Research',
    role: 'Usability Validation',
    description: 'Task-based prototype testing for rapid decision support.',
    tags: ['Testing', 'Insights', 'Validation'],
    detail: 'Provides quant-backed signals for flow prioritization.',
    levelLabel: 'Advanced',
    levelValue: 85,
    icon: Search,
    presets: ['UX Strategist', 'AI Product Designer'],
  },
  {
    id: 'ga4',
    name: 'GA4',
    category: 'Research',
    role: 'Product Telemetry',
    description: 'Event-level analytics to align design with outcomes.',
    tags: ['Events', 'Funnels', 'KPIs'],
    detail: 'Connects qualitative findings with performance metrics.',
    levelLabel: 'Proficient',
    levelValue: 78,
    icon: Monitor,
    presets: ['UX Strategist', 'Design Systems Lead'],
  },
  {
    id: 'react',
    name: 'React',
    category: 'Dev Bridge',
    role: 'UI Runtime',
    description: 'Component architecture for shipping production interfaces.',
    tags: ['Components', 'State', 'Patterns'],
    detail: 'Makes design intent executable with reusable primitives.',
    levelLabel: 'Advanced',
    levelValue: 88,
    icon: Code,
    presets: ['Design Systems Lead', 'AI Product Designer'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Dev Bridge',
    role: 'App Framework',
    description: 'Production framework for performant front-end delivery.',
    tags: ['Routing', 'SSR', 'Deploy'],
    detail: 'Keeps UX quality and performance targets aligned.',
    levelLabel: 'Advanced',
    levelValue: 84,
    icon: Layers,
    presets: ['Design Systems Lead', 'AI Product Designer'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    category: 'Dev Bridge',
    role: 'Styling System',
    description: 'Utility-first styling for fast UI implementation loops.',
    tags: ['Tokens', 'Utilities', 'Scale'],
    detail: 'Improves velocity while staying close to design tokens.',
    levelLabel: 'Expert',
    levelValue: 91,
    icon: Sparkles,
    presets: ['Design Systems Lead', 'AI Product Designer'],
  },
  {
    id: 'storybook',
    name: 'Storybook',
    category: 'Dev Bridge',
    role: 'Component Lab',
    description: 'Isolated component documentation and QA environment.',
    tags: ['Docs', 'Testing', 'Components'],
    detail: 'Improves handoff clarity for design and engineering.',
    levelLabel: 'Advanced',
    levelValue: 83,
    icon: Terminal,
    presets: ['Design Systems Lead'],
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Dev Bridge',
    role: 'Version Ops',
    description: 'Code collaboration, review, and release orchestration.',
    tags: ['PRs', 'CI', 'Delivery'],
    detail: 'Maintains traceable design-to-code evolution.',
    levelLabel: 'Advanced',
    levelValue: 86,
    icon: Share2,
    presets: ['Design Systems Lead', 'AI Product Designer'],
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Collaboration',
    role: 'Knowledge Hub',
    description: 'Structured project memory for design and product teams.',
    tags: ['Docs', 'Specs', 'Roadmap'],
    detail: 'Central source for strategic and tactical decisions.',
    levelLabel: 'Expert',
    levelValue: 89,
    icon: Layers,
    presets: ['UX Strategist', 'Design Systems Lead', 'AI Product Designer'],
  },
  {
    id: 'jira',
    name: 'Jira',
    category: 'Collaboration',
    role: 'Delivery Tracking',
    description: 'Planning and sprint-level execution management.',
    tags: ['Planning', 'Tickets', 'Execution'],
    detail: 'Maps UX milestones directly to shipping cadence.',
    levelLabel: 'Advanced',
    levelValue: 84,
    icon: Cpu,
    presets: ['UX Strategist', 'Design Systems Lead'],
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Collaboration',
    role: 'Realtime Comms',
    description: 'Operational communication layer for fast alignment.',
    tags: ['Comms', 'Sync', 'Cross-team'],
    detail: 'Keeps iteration loops short across distributed teams.',
    levelLabel: 'Expert',
    levelValue: 90,
    icon: MessageSquare,
    presets: ['UX Strategist', 'Design Systems Lead', 'AI Product Designer'],
  },
  {
    id: 'loom',
    name: 'Loom',
    category: 'Collaboration',
    role: 'Async Review',
    description: 'Context-rich async walkthroughs for design decisions.',
    tags: ['Walkthroughs', 'Feedback', 'Handoff'],
    detail: 'Cuts review latency and reduces meeting overhead.',
    levelLabel: 'Advanced',
    levelValue: 82,
    icon: Video,
    presets: ['UX Strategist', 'Design Systems Lead', 'AI Product Designer'],
  },
];

export default function ExperimentalLoadoutBay() {
  const [activeTab, setActiveTab] = React.useState<CategoryTab>('Design Core');
  const [activePreset, setActivePreset] = React.useState<Preset>('AI Product Designer');

  const visibleTools = React.useMemo(
    () =>
      tools.filter(
        (tool) => tool.category === activeTab && tool.presets.includes(activePreset),
      ),
    [activeTab, activePreset],
  );

  const tabCount = React.useMemo(
    () =>
      tabs.reduce<Record<CategoryTab, number>>(
        (acc, tab) => ({ ...acc, [tab]: tools.filter((tool) => tool.category === tab).length }),
        {
          'Design Core': 0,
          'AI for UX': 0,
          Research: 0,
          'Dev Bridge': 0,
          Collaboration: 0,
        },
      ),
    [],
  );

  return (
    <section className="mb-24">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#07090D]"
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(0, 209, 255, 0.08)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 209, 255, 0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 209, 255, 0.09) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 0.8px, transparent 0.8px)',
            backgroundSize: '3px 3px',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 120% at 0% 0%, rgba(255, 42, 42, 0.14) 0%, rgba(0, 209, 255, 0.08) 44%, rgba(0, 0, 0, 0) 70%)',
          }}
        />
        <div className="relative z-10 p-5 md:p-8">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="mb-3 inline-flex items-center rounded-full border border-[#00D1FF]/35 bg-[#00D1FF]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7CE7FF]">
                Experimental Mode Active
              </span>
              <h3 className="font-heading text-[clamp(26px,4vw,44px)] font-bold uppercase tracking-[0.08em] text-white">
                EXPERIMENTAL LOADOUT BAY
              </h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gray-400">
                Prototype Systems // Sandbox Environment
              </p>
            </div>

            <div
              className="w-full max-w-[280px] rounded-xl border border-white/15 bg-white/[0.03] p-4 backdrop-blur-sm"
              style={{ boxShadow: 'inset 0 0 18px rgba(0, 209, 255, 0.08)' }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9CEAFF]">System Panel</div>
              <div className="mt-3 space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-300">
                <div>SYS.VER EXP-1.0</div>
                <div>MODE: SANDBOX</div>
                <div>SYNC: LOCAL</div>
                <div className="text-[#7CE7FF]">AI CORE: ONLINE</div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  className="rounded-lg border px-3 py-2 text-left backdrop-blur-sm transition-colors duration-200"
                  style={{
                    borderColor: active ? 'rgba(0, 209, 255, 0.55)' : 'rgba(255,255,255,0.14)',
                    background: active ? 'rgba(0, 209, 255, 0.14)' : 'rgba(255,255,255,0.03)',
                    color: active ? '#E6FBFF' : 'rgba(255,255,255,0.68)',
                    boxShadow: active ? '0 0 20px rgba(0, 209, 255, 0.12)' : 'none',
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  <div className="font-ui text-[12px] font-bold uppercase tracking-[0.12em]">{tab}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500">
                    {String(tabCount[tab]).padStart(2, '0')} tools
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">Loadout Presets</span>
            {presets.map((preset) => {
              const active = preset === activePreset;
              return (
                <button
                  key={preset}
                  type="button"
                  className="rounded-md border px-3 py-1.5 font-ui text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-200"
                  style={{
                    borderColor: active ? 'rgba(255, 42, 42, 0.5)' : 'rgba(255,255,255,0.14)',
                    background: active ? 'rgba(255, 42, 42, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: active ? '#FFE9E9' : 'rgba(255,255,255,0.68)',
                    boxShadow: active ? '0 0 16px rgba(255, 42, 42, 0.14)' : 'none',
                  }}
                  onClick={() => setActivePreset(preset)}
                >
                  {preset}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visibleTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <motion.article
                        key={tool.id}
                        layout
                        initial={{ opacity: 0, y: 8, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="group relative overflow-hidden rounded-xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm"
                        style={{
                          boxShadow:
                            '0 10px 28px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.03)',
                        }}
                      >
                        <div
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          style={{
                            background:
                              'linear-gradient(145deg, rgba(0,209,255,0.12) 0%, rgba(255,42,42,0.08) 100%)',
                          }}
                        />
                        <div className="relative z-10">
                          <div className="mb-4 flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/20"
                              style={{
                                boxShadow:
                                  'inset 0 0 12px rgba(0, 209, 255, 0.08), 0 0 10px rgba(0, 209, 255, 0.1)',
                              }}
                            >
                              <Icon className="h-5 w-5 text-[#8CEEFF]" strokeWidth={1.6} />
                            </div>
                            <div>
                              <h4 className="font-heading text-[18px] font-bold uppercase tracking-[0.05em] text-white">
                                {tool.name}
                              </h4>
                              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#7CE7FF]">
                                {tool.role}
                              </div>
                            </div>
                          </div>

                          <p className="min-h-[40px] text-[13px] leading-relaxed text-gray-300">{tool.description}</p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {tool.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-400">
                                Proficiency
                              </span>
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9CEAFF]">
                                {tool.levelLabel}
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background:
                                    'linear-gradient(90deg, rgba(255,42,42,0.9) 0%, rgba(0,209,255,0.9) 100%)',
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${tool.levelValue}%` }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                              />
                            </div>
                          </div>

                          <p className="mt-3 text-[12px] text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {tool.detail}
                          </p>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {visibleTools.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-white/15 bg-black/25 p-6 text-center"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400">
                    No tools available in this tab for the selected preset.
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
