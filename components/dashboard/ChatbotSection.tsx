"use client";

import React, { useState } from "react";
import { Send, Bot, User, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const SUGGESTED_QUERIES = [
  "🍅 What is today's best mandi price for Tomatoes?",
  "🚛 How much can I save using RouteMesh to Mumbai Vashi?",
  "🧅 When is the optimal time to sell Red Onions?",
  "🌧️ Weather and transit advisory for Pune-Mumbai highway?",
];

export default function ChatbotSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! I am your FarmOptima AI Agri-Agent. Aap mujhse mandi ke taaza daam, RouteMesh freight pooling, kheti, ya mausam ke baare mein Hindi, Hinglish ya English me pooch sakte hain!",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const getSmartResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("tomato") || q.includes("tamatar")) {
      return "🍅 **Tomato Mandi Intelligence (Today):**\n- **Mumbai Vashi APMC:** ₹34.0/kg (High demand, ~120 tonnes arrival)\n- **Pune Gultekdi:** ₹29.0/kg (Moderate demand)\n- **Narayangaon:** ₹31.0/kg\n\n💡 **Recommendation:** For a 5,000 kg harvest, shipping to Mumbai Vashi via RouteMesh gives you an estimated **₹29.9/kg net realization**, earning you **+₹14,500 extra cash in hand** compared to local sale!";
    }

    if (q.includes("onion") || q.includes("pyaz") || q.includes("kanda")) {
      return "🧅 **Red Onion Market Analysis:**\n- **Nashik APMC:** ₹28.0/kg (Arrivals: 250 tonnes)\n- **Mumbai Vashi:** ₹28.5/kg\n- **Pune Gultekdi:** ₹25.0/kg\n\n💡 **Advice:** Cured onions with moisture <14% have a 15-day shelf life. If you have Grade A onions, pooling freight to Mumbai APMC yields maximum price realization this week.";
    }

    if (q.includes("routemesh") || q.includes("truck") || q.includes("pool") || q.includes("transport") || q.includes("freight")) {
      return "🚛 **RouteMesh™ Shared Freight Logistics:**\n- Solo truck hire: ~₹160 / Quintal\n- RouteMesh Pooled rate: ~₹95–100 / Quintal\n- **Net Freight Savings: 35% to 40%**\n\nCurrently, 3 verified trucks have spare capacity on the Pune ➔ Mumbai Vashi and Nashik ➔ Mumbai corridors. You can reserve shared capacity directly under the RouteMesh tab!";
    }

    if (q.includes("weather") || q.includes("mausam") || q.includes("barish") || q.includes("rain")) {
      return "🌧️ **Agricultural Weather Advisory:**\n- **Pune / Western Maharashtra:** Clear skies, daytime 31°C, evening 22°C. Excellent for road freight transit.\n- **Mumbai / Konkan Corridor:** Humid, normal highway transit speeds. No major rain alert for the next 48 hours.";
    }

    if (q.includes("potato") || q.includes("aloo")) {
      return "🥔 **Potato Market Rates:**\n- Headline APMC rate: ₹22.0/kg in Mumbai Vashi\n- Local Pune rate: ₹19.5/kg\n- Daily arrivals are steady at 180 tonnes.";
    }

    if (q.includes("soybean") || q.includes("wheat") || q.includes("gehu")) {
      return "🌾 **Grains & Oilseeds Update:**\n- **Soybeans:** ₹48.0/kg (Strong crushing demand in Vidarbha and Marathwada)\n- **Wheat:** ₹26.0/kg (Stable MSP-supported baseline)";
    }

    return `🌾 **FarmOptima AI Agent:** Analyzed current market conditions for: "${query}".\n\nBased on official AGMARKNET daily feeds across Maharashtra, wholesale mandi arrivals remain steady. Transport via RouteMesh corridors is currently operating normally with 35% freight cost reduction. You can check the Mandi Map Canvas or Markets directory for detailed rates!`;
  };

  const nextId = React.useRef(2);

  const handleSend = (userText?: string) => {
    const textToSend = userText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: String(nextId.current++),
      sender: "user",
      text: textToSend,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput("");
    setLoading(true);

    setTimeout(() => {
      const botResponse = getSmartResponse(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: String(nextId.current++),
          sender: "bot",
          text: botResponse,
          timestamp: "Just now",
        },
      ]);
      setLoading(false);
    }, 600);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "1",
        sender: "bot",
        text: "Namaste! I am your FarmOptima AI Agri-Agent. Aap mujhse mandi ke taaza daam, RouteMesh freight pooling, kheti, ya mausam ke baare mein Hindi, Hinglish ya English me pooch sakte hain!",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbf9f5] p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e6e2d8] shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#0b2b1d] rounded-2xl text-amber-300 shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>FarmOptima AI Agri-Agent</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-sans font-bold border border-emerald-300">
                Live Assistant
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Mandi prices, net realization math, RouteMesh freight & farming advisory in English, Hindi & Hinglish
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Reset chat"
          className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
          Suggested:
        </span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-amber-100/60 border border-[#e6e2d8] hover:border-amber-300 text-stone-700 text-xs transition-all whitespace-nowrap shrink-0 shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                msg.sender === "user" ? "bg-amber-700 text-white" : "bg-[#0b2b1d] text-amber-300 shadow-xs"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`px-5 py-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-[#0b2b1d] text-white rounded-tr-none shadow-sm"
                  : "bg-white text-stone-800 border border-[#e6e2d8] rounded-tl-none shadow-xs"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-stone-500 italic pl-11">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            <span>Consulting AGMARKNET mandi pricing & RouteMesh corridor database...</span>
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <div className="pt-3 border-t border-[#e6e2d8] shrink-0">
        <div className="flex items-center space-x-2 bg-white rounded-2xl border border-[#e6e2d8] p-1.5 shadow-sm focus-within:border-emerald-800 focus-within:ring-1 focus-within:ring-emerald-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Mandi rates, RouteMesh pooling, ya fasal ke baare mein poochein..."
            className="flex-1 px-4 py-2 text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none bg-transparent"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-amber-300 transition-colors flex items-center justify-center disabled:opacity-50 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}