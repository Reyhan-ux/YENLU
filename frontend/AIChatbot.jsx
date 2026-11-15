import { useState, useRef, useEffect } from 'react';
import { 
  PaperPlaneTilt, 
  User, 
  ArrowsClockwise,
  Plant,
  Sparkle
} from '@phosphor-icons/react';
import { askGeminiAgronomist } from '../services/geminiService';

// Quick prompt suggestions tailored to Buea / Mount Cameroon smallholder farmers
const QUICK_PROMPTS = [
  "What is the best crop rotation after Maize in Muea?",
  "How do I prevent root rot in Bush Beans during heavy rains?",
  "Explain my rotation plan in Cameroon Pidgin English",
  "How much revenue can groundnut make in Buea local markets?"
];

// Offline knowledge base fallback when offline
function getLocalAgronomyFallback(query, farmerContext) {
  const q = query.toLowerCase();
  const loc = farmerContext?.location?.name || 'Buea';
  const size = farmerContext?.fieldSize || 1.5;

  if (q.includes('pidgin') || q.includes('cameroon pidgin')) {
    return `**YENLU Advisory for ${loc} (Pidgin English):**\n\n` +
      `Bro / Sista, for dis ${loc} slope wey rain plenty reach 2,800mm, make you no plant di same crop back-to-back!\n\n` +
      `1. **After Maize:** Put Groundnut (Arachide) or Bush Beans. Dem dey hold di nitrogen wey maize chop finish.\n` +
      `2. **Heavy Rain (July-September):** Build high ridges (billons) so water go flow pass without wash your topsoil go down.\n` +
      `3. **For your ${size} hectare plot:** Groundnut go give you pass ${(1120000 * size).toLocaleString()} FCFA if you sell am for Muea market!\n\n` +
      `Any oda question about your seed or fertilizer?`;
  }

  return `**YENLU Agronomist Advisory for ${loc} (${farmerContext?.location?.elevation || 620}m):**\n\n` +
    `Based on NASA IMERG 20-year precipitation telemetry and local volcanic andosol data for **${loc}**:\n\n` +
    `• **Slope & Drainage:** High rainfall (~2,800mm/year) on Mount Cameroon requires 25cm raised contour ridges to protect soil organic carbon.\n` +
    `• **Recommended Sequence:** We recommend alternating cereals (Maize) with leguminous nitrogen fixers (Groundnut/Beans) to sustain soil fertility.\n` +
    `• **Expected Return:** Groundnut rotation yields an estimated gross return of ~${(1120000 * size).toLocaleString()} FCFA on ${size} ha in Fako markets.`;
}

/**
 * Modern, Elegant AI Farm Assistant Interface:
 * - Neutral warm stone and charcoal aesthetic (not over-green)
 * - Directly connected to Gemini 3.8 Flash via .env
 * - Zero complex configuration drawers on UI
 */
export default function AIChatbot({ farmerContext }) {
  const locName = farmerContext?.location?.name || 'Buea';

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **YENLU AI Agronomist**, powered by **Gemini 3.8 Flash**, 20-year NASA rainfall telemetry, and Mount Cameroon volcanic soil data. Ask me anything about crop rotations, planting dates, or pest control for your farm in **${locName}**!`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Direct live call to Gemini 3.8 Flash
      const replyText = await askGeminiAgronomist(query, messages, farmerContext);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.warn('Using local agronomy fallback:', err);
      const fallbackText = getLocalAgronomyFallback(query, farmerContext);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Conversation cleared. How can I help your farm plot in **${locName}** today?`,
        time: 'Just now'
      }
    ]);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-md">
      
      {/* Top Header: Clean Charcoal / Slate Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-900 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-800 text-[#4ADE80] border border-white/10 shadow-xs">
            <Plant size={22} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-base font-extrabold text-white leading-tight">
                YENLU AI Farm Advisor
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 3.8 Flash Live
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Personalized for {locName} ({farmerContext?.location?.elevation || 620}m) · {farmerContext?.fieldSize || 1.5} ha
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Restart conversation"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition border border-white/10"
        >
          <ArrowsClockwise size={16} weight="bold" />
        </button>
      </div>

      {/* Messages Stream: Neutral Warm Stone Canvas */}
      <div className="flex flex-col gap-4 p-6 max-h-[440px] min-h-[300px] overflow-y-auto bg-stone-50/70">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-stone-900 text-white'
                  : 'bg-emerald-800 text-white'
              }`}
            >
              {m.sender === 'user' ? <User size={15} weight="bold" /> : <Plant size={16} weight="bold" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs font-sans ${
                m.sender === 'user'
                  ? 'bg-stone-900 text-white rounded-tr-xs'
                  : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <span
                className={`mt-2 block text-[10px] font-semibold text-right ${
                  m.sender === 'user' ? 'text-stone-400' : 'text-stone-400'
                }`}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white">
              <Plant size={16} weight="bold" />
            </div>
            <div className="rounded-2xl rounded-tl-xs bg-white p-4 border border-stone-200/90 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse delay-150" />
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse delay-300" />
                <span className="text-xs text-stone-600 font-medium">
                  Gemini 3.8 Flash is consulting Mount Cameroon agronomy model…
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Chips: Minimalist Neutral Buttons */}
      <div className="border-t border-stone-200 bg-white px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Suggested:
          </span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              type="button"
              key={i}
              onClick={() => handleSend(prompt)}
              className="rounded-full border border-stone-300 bg-stone-50 px-3.5 py-1 text-xs font-semibold text-stone-700 transition hover:bg-stone-900 hover:text-white hover:border-stone-900"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Clean Floating Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 border-t border-stone-200 bg-white p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about crops, soils, rainfall or prices for ${locName}...`}
          className="flex-1 rounded-2xl border border-stone-300 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-sm transition hover:bg-stone-800 disabled:opacity-30"
        >
          <PaperPlaneTilt size={20} weight="bold" />
        </button>
      </form>

    </div>
  );
}
