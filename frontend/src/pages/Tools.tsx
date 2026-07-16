import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench, Search, MessageSquare, Image, Wand2, Video, Box, Workflow,
  LayoutGrid, Bot, Mic, Database, Code2, Palette, Cpu, Brain, ExternalLink,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import clsx from "clsx";

/* ─────────────── Categories ─────────────── */
const CATEGORIES = [
  { id: "chat",       label: "GPTs & Chat",     icon: MessageSquare },
  { id: "imggen",     label: "Image Gen",       icon: Image },
  { id: "imgedit",    label: "Image Edit",      icon: Wand2 },
  { id: "video",      label: "Video",           icon: Video },
  { id: "3d",         label: "3D & Avatars",    icon: Box },
  { id: "automation", label: "Automation",      icon: Workflow },
  { id: "directory",  label: "Directories",     icon: LayoutGrid },
  { id: "assistant",  label: "Assistants",      icon: Bot },
  { id: "voice",      label: "Voice & Audio",   icon: Mic },
  { id: "api",        label: "Data & APIs",     icon: Database },
  { id: "dev",        label: "Dev Tools",       icon: Code2 },
  { id: "design",     label: "Design",          icon: Palette },
  { id: "gpu",        label: "GPU & Compute",   icon: Cpu },
  { id: "models",     label: "Models & Training", icon: Brain },
];

/* ─────────────── Tools Data ─────────────── */
type Tool = { name: string; url: string; cat: string; free?: boolean };

const TOOLS: Tool[] = [
  // GPTs & Chat
  { name: "Grok", url: "https://grok.com/", cat: "chat" },
  { name: "Z.ai Chat", url: "https://chat.z.ai/", cat: "chat", free: true },
  { name: "LM Arena", url: "https://lmarena.ai/", cat: "chat", free: true },
  { name: "Perplexity", url: "https://www.perplexity.ai/", cat: "chat" },
  { name: "MS Copilot", url: "https://copilot.microsoft.com/", cat: "chat", free: true },
  { name: "AI4Bharat", url: "https://ai4bharat.iitm.ac.in/", cat: "chat", free: true },
  { name: "Together AI", url: "https://www.together.ai/", cat: "chat" },
  { name: "Mammouth", url: "https://mammouth.ai/login", cat: "chat" },
  { name: "Aymo AI", url: "https://aymo.ai/", cat: "chat" },
  { name: "Merlin", url: "https://www.getmerlin.in/", cat: "chat" },
  { name: "API Free LLM", url: "https://apifreellm.com/en/api-access", cat: "chat", free: true },
  { name: "LogicBalls", url: "https://logicballs.com/", cat: "chat" },
  { name: "ArliAI", url: "https://www.arliai.com/?lang=en", cat: "chat" },
  { name: "FlowGPT", url: "https://flowgpt.com/", cat: "chat" },
  { name: "Duck.ai", url: "https://duck.ai/", cat: "chat", free: true },
  { name: "LM Studio", url: "https://lmstudio.ai/", cat: "chat", free: true },
  { name: "LibreChat", url: "https://www.librechat.ai/", cat: "chat", free: true },
  { name: "IWantMyAI", url: "https://iwantmy.ai/", cat: "chat" },
  { name: "UnlimitedAI", url: "https://unlimitedai.chat/", cat: "chat", free: true },
  { name: "WebLLM Chat", url: "https://chat.webllm.ai/", cat: "chat", free: true },
  { name: "Chats-LLM", url: "https://chats-llm.com/", cat: "chat" },
  { name: "Free-LLM", url: "http://free-llm.com/", cat: "chat", free: true },

  // Assistants
  { name: "NoteGPT", url: "https://notegpt.io/", cat: "assistant" },
  { name: "Clawd Bot", url: "https://clawd-bot.com/", cat: "assistant" },
  { name: "Monica", url: "https://monica.im/", cat: "assistant" },
  { name: "HeyAlice", url: "https://heyalice.app/", cat: "assistant" },

  // Image Gen
  { name: "Craiyon", url: "https://www.craiyon.com/en", cat: "imggen", free: true },
  { name: "SubNP", url: "https://subnp.com/", cat: "imggen", free: true },
  { name: "Perchance AI", url: "https://perchance.org/pretty-ai", cat: "imggen", free: true },
  { name: "Perchance T2I", url: "https://perchance.org/ai-text-to-image-generator", cat: "imggen", free: true },
  { name: "Featherless", url: "https://featherless.ai/", cat: "imggen" },
  { name: "AI Img2Img", url: "https://aiimagetoimage.io/#image-generator", cat: "imggen", free: true },
  { name: "KI Bilder", url: "https://ki-bilder-erstellen.com/en", cat: "imggen", free: true },
  { name: "Blinkshot", url: "https://www.blinkshot.io/", cat: "imggen", free: true },
  { name: "Skywork", url: "https://skywork.ai/", cat: "imggen" },
  { name: "DeepDream", url: "https://deepdreamgenerator.com/", cat: "imggen" },
  { name: "Vheer", url: "https://vheer.com/", cat: "imggen", free: true },
  { name: "Pixazo", url: "https://www.pixazo.ai/api/pricing-plan", cat: "imggen" },
  { name: "DeepAI", url: "https://deepai.org/", cat: "imggen" },
  { name: "NightCafe", url: "https://creator.nightcafe.studio/", cat: "imggen" },
  { name: "FreeGen", url: "https://freegen.app/", cat: "imggen", free: true },
  { name: "Raphael", url: "https://raphael.app/", cat: "imggen", free: true },
  { name: "ImageFree", url: "https://imagefree.org/", cat: "imggen", free: true },
  { name: "Image2Image", url: "https://www.image2image.ai/", cat: "imggen" },
  { name: "Dezgo", url: "https://dezgo.com/", cat: "imggen", free: true },
  { name: "GizAI Image", url: "https://app.giz.ai/assistant?mode=image-generation", cat: "imggen", free: true },
  { name: "Draw FreeForAI", url: "https://draw.freeforai.com/", cat: "imggen", free: true },
  { name: "Upsampler Gen", url: "https://upsampler.com/free-image-generator-no-signup", cat: "imggen", free: true },
  { name: "Imageka", url: "https://imageka.com/", cat: "imggen", free: true },
  { name: "AIFreeForever", url: "https://aifreeforever.com/", cat: "imggen", free: true },
  { name: "Vider", url: "https://vider.ai/index.html", cat: "imggen" },
  { name: "ImgGen AI", url: "https://imagegeneratorai.io/", cat: "imggen" },
  { name: "HiDream", url: "https://hidream.org/", cat: "imggen" },
  { name: "Magi1", url: "https://www.magi1.ai/ai-image-generator", cat: "imggen" },
  { name: "StableDiff", url: "https://stabledifffusion.com/features/ai-image-generator#generator", cat: "imggen", free: true },

  // Image Edit / Enhance
  { name: "Phot.ai", url: "https://www.phot.ai/", cat: "imgedit" },
  { name: "BigJPG", url: "https://bigjpg.com/", cat: "imgedit", free: true },
  { name: "Img Upscaling", url: "https://image-upscaling.net/upscaling/en.html", cat: "imgedit", free: true },
  { name: "Upsampler Edit", url: "https://upsampler.com/free-image-editing-model-no-signup", cat: "imgedit", free: true },
  { name: "Headshot Master", url: "https://headshotmaster.io/ai-photo-editor", cat: "imgedit" },
  { name: "ImgSearch", url: "https://imgsearch.com/", cat: "imgedit", free: true },

  // Video
  { name: "Google Flow", url: "https://labs.google/fx/tools/flow", cat: "video" },
  { name: "Upsampler Video", url: "https://upsampler.com/free-video-generator-no-signup", cat: "video", free: true },
  { name: "MotionVid", url: "https://motionvid.ai/", cat: "video" },
  { name: "VideoEffects", url: "https://videoeffects.com/", cat: "video" },

  // 3D & Avatars
  { name: "Spline Spell", url: "https://spell.spline.design/", cat: "3d" },
  { name: "SuperSplat", url: "https://superspl.at/", cat: "3d", free: true },
  { name: "Rokoko", url: "https://www.rokoko.com/", cat: "3d" },
  { name: "VRoid Studio", url: "https://vroid.com/en/studio", cat: "3d", free: true },
  { name: "VRoid Hub", url: "https://hub.vroid.com/en", cat: "3d", free: true },

  // Automation
  { name: "n8n", url: "https://n8n.io/", cat: "automation", free: true },
  { name: "UiPath", url: "https://www.uipath.com/", cat: "automation" },
  { name: "Blue Prism", url: "https://www.blueprism.com/", cat: "automation" },
  { name: "Floyo", url: "https://www.floyo.ai/", cat: "automation" },
  { name: "Flowise AI", url: "https://flowiseai.com/", cat: "automation", free: true },
  { name: "Activepieces", url: "https://www.activepieces.com/", cat: "automation", free: true },
  { name: "Windmill", url: "https://www.windmill.dev/", cat: "automation", free: true },
  { name: "Node-RED", url: "https://nodered.org/", cat: "automation", free: true },
  { name: "Paperclip", url: "https://paperclip.ing/", cat: "automation" }, // NEW

  // Directories / All-in-One
  { name: "TAAFT", url: "https://theresanaiforthat.com/", cat: "directory", free: true },
  { name: "FutureTools", url: "https://www.futuretools.io/", cat: "directory", free: true },
  { name: "OpenRouter", url: "https://openrouter.ai/", cat: "directory" },
  { name: "Fireworks AI", url: "https://app.fireworks.ai/account/home", cat: "directory" },
  { name: "Galaxy AI", url: "https://galaxy.ai/tools", cat: "directory" },
  { name: "Artificial Studio", url: "https://app.artificialstudio.ai/", cat: "directory" },
  { name: "GlbGPT", url: "https://www.glbgpt.com/", cat: "directory" },
  { name: "Puter Playground", url: "https://docs.puter.com/playground/", cat: "directory", free: true },
  { name: "Pixazo Play", url: "https://playground.pixazo.ai/", cat: "directory", free: true },
  { name: "AI Tools Dir", url: "https://aitoolsdirectory.com/", cat: "directory", free: true },
  { name: "TopAI Tools", url: "https://topai.tools/", cat: "directory", free: true },
  { name: "Agents Directory", url: "https://aiagentsdirectory.com/", cat: "directory", free: true },
  { name: "GizAI", url: "https://www.giz.ai/", cat: "directory", free: true },
  { name: "ZenCreator", url: "https://app.zencreator.pro/tools", cat: "directory" },

  // Voice & Audio
  { name: "Respeecher TTS", url: "https://github.com/respeecher/marketplace_tts_python_client", cat: "voice", free: true },
  { name: "Veena (Indian)", url: "https://huggingface.co/maya-research/Veena", cat: "voice", free: true },
  { name: "FutureBeeAI", url: "https://www.futurebeeai.com/", cat: "voice" },
  { name: "Hindi Speech Data", url: "https://github.com/Nexdata-AI/760-Hours-Hindi-Conversational-Speech-Data-by-Telephone", cat: "voice", free: true },
  { name: "Audio Datasets", url: "https://github.com/Yuan-ManX/ai-audio-datasets", cat: "voice", free: true },
  { name: "Vakyansh ASR", url: "https://github.com/Open-Speech-EkStep/vakyansh-models", cat: "voice", free: true },

  // Data & APIs
  { name: "LibreTranslate", url: "https://libretranslate.com/", cat: "api", free: true },
  { name: "ImgBB API", url: "https://api.imgbb.com/", cat: "api", free: true },
  { name: "Apify", url: "https://apify.com/", cat: "api" },
  { name: "Currency API", url: "https://currency-api.pages.dev/v1/currencies/inr.json", cat: "api", free: true },
  { name: "Open-Meteo", url: "https://open-meteo.com/", cat: "api", free: true },
  { name: "CommonCrawl", url: "https://commoncrawl.org/", cat: "api", free: true },
  { name: "AI.CC API", url: "https://api.ai.cc/pricing", cat: "api" },

  // Dev Tools
  { name: "Reflex Build", url: "https://build.reflex.dev/", cat: "dev", free: true },
  { name: "Replit", url: "https://replit.com/~", cat: "dev" },
  { name: "Loadly", url: "https://loadly.io/", cat: "dev", free: true },
  { name: "CodeShare", url: "https://codeshare.io/", cat: "dev", free: true },
  { name: "Emailnator", url: "https://www.emailnator.com/", cat: "dev", free: true },
  { name: "SmailPro", url: "https://smailpro.com/temporary-email", cat: "dev", free: true },
  { name: "React Bits", url: "https://reactbits.dev/", cat: "dev", free: true }, // NEW
  { name: "Emergent", url: "https://app.emergent.sh/", cat: "dev" }, // NEW (Cleaned URL)

  // Design
  { name: "Logopony", url: "https://www.logopony.com/", cat: "design" },
  { name: "IdeaMap", url: "https://ideamap.ai/", cat: "design", free: true },
  { name: "PopAI Slides", url: "https://www.popai.pro/", cat: "design" },
  { name: "Shader Playground", url: "https://robert.leitl.dev/artifacts/shader-playground/#/1", cat: "design", free: true },
  { name: "Gapsy Studio", url: "https://gapsystudio.com/", cat: "design" },
  { name: "Lanoi", url: "https://lanoi.webflow.io/", cat: "design", free: true },
  { name: "AutoAE", url: "https://autoae.online/", cat: "design" }, // NEW
  { name: "Animos", url: "https://animos.app/", cat: "design" }, // NEW
  { name: "Reve", url: "https://app.reve.com/", cat: "design" }, // NEW
  { name: "Rive", url: "https://rive.app/", cat: "design", free: true }, // NEW

  // GPU & Compute
  { name: "RunPod", url: "https://www.runpod.io/", cat: "gpu" },
  { name: "Vast.ai", url: "https://vast.ai/", cat: "gpu" },
  { name: "Scaleway", url: "https://www.scaleway.com/en/pricing/", cat: "gpu" },

  // Models & Training
  { name: "HuggingFace", url: "https://huggingface.co/", cat: "models", free: true },
  { name: "Civitai", url: "https://civitai.com/", cat: "models", free: true },
  { name: "Kohya SS", url: "https://github.com/bmaltais/kohya_ss", cat: "models", free: true },
  { name: "Unsloth", url: "https://github.com/unslothai/unsloth", cat: "models", free: true },
  { name: "Mosaic Research", url: "https://www.databricks.com/research/mosaic", cat: "models", free: true },
  { name: "Healthcare AI", url: "https://microsoft.github.io/healthcareai-examples/", cat: "models", free: true },
  { name: "DramAI", url: "https://github.com/hyyyyyyz/dramai", cat: "models", free: true },
];

/* ─────────────── CSS Logo Generator ─────────────── */
const GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-green-600",
  "from-fuchsia-500 to-pink-600",
  "from-sky-500 to-indigo-500",
  "from-lime-500 to-emerald-600",
  "from-red-500 to-fuchsia-600",
];

// Deterministic hash → same tool always gets the same gradient
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function ToolLogo({ name }: { name: string }) {
  const gradient = GRADIENTS[hashStr(name) % GRADIENTS.length];
  const initials = name
    .split(/[\s-]/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className={clsx(
      "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center",
      "text-white font-bold text-sm shadow-sm shrink-0", gradient
    )}>
      {initials}
    </div>
  );
}

/* ─────────────── Page ─────────────── */
export default function Tools() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [freeOnly, setFreeOnly] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    TOOLS.forEach((t) => (c[t.cat] = (c[t.cat] || 0) + 1));
    return c;
  }, []);

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      if (activeCat !== "all" && t.cat !== activeCat) return false;
      if (freeOnly && !t.free) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, activeCat, freeOnly]);

  const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="p-8 bg-hero-glow min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-[0.25em] text-primary-600 mb-2 font-semibold flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5" /> Tools
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900">
            AI Tools <span className="gradient-text">Arsenal</span>
          </h1>
          <p className="text-ink-500 mt-2">
            {TOOLS.length}+ curated tools for hackathons — click any card to open.
          </p>
        </motion.div>

        {/* Search + Free filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <button
            onClick={() => setFreeOnly((f) => !f)}
            className={clsx(
              "px-4 py-2.5 rounded-xl text-sm font-semibold border transition",
              freeOnly
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-ink-500 border-ink-200 hover:border-emerald-400 hover:text-emerald-600"
            )}
          >
            FREE only
          </button>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          <CatChip
            active={activeCat === "all"}
            onClick={() => setActiveCat("all")}
            label={`All (${TOOLS.length})`}
          />
          {CATEGORIES.map((c) => (
            <CatChip
              key={c.id}
              active={activeCat === c.id}
              onClick={() => setActiveCat(activeCat === c.id ? "all" : c.id)}
              label={`${c.label} (${counts[c.id] || 0})`}
              Icon={c.icon}
            />
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card>
            <div className="text-center py-10 text-ink-400 text-sm">
              No tools match your filter.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((t, i) => (
              <motion.a
                key={t.url + t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.4) }}
                className="group relative bg-white rounded-2xl border border-ink-100 p-4 hover:border-primary-300 hover:shadow-soft hover:-translate-y-0.5 transition-all"
              >
                {t.free && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 tracking-wide">
                    FREE
                  </span>
                )}
                <ToolLogo name={t.name} />
                <div className="mt-3 font-semibold text-sm text-ink-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {t.name}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-ink-400">{catLabel(t.cat)}</span>
                  <ExternalLink className="w-3 h-3 text-ink-300 group-hover:text-primary-500 transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CatChip({ active, onClick, label, Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition",
        active
          ? "bg-brand-gradient text-white border-transparent shadow-soft"
          : "bg-white text-ink-500 border-ink-200 hover:border-primary-300 hover:text-primary-600"
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}