import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

const BlueprintDoc = () => {
  const [content, setContent] = useState("");
  const [docId, setDocId] = useState("blueprint");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetch(`/api/docs/${docId}`)
      .then(res => res.json())
      .then(data => setContent(data.content));
  }, [docId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in transition-all">
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: "blueprint", label: "Quantum AI" },
          { id: "agent-plan", label: "Enterprise Agent" },
          { id: "multi-agent", label: "Multi-Agent System" },
          { id: "routing", label: "Agent Routing" },
          { id: "orchestration", label: "Orchestration" },
          { id: "qiskit", label: "Qiskit Agent" },
          { id: "ai-models", label: "AI Models" },
          { id: "hitl", label: "HITL Design" },
          { id: "quantum-trust", label: "Quantum Trust" },
          { id: "low-latency", label: "Optical Speed" },
          { id: "military-defence", label: "Military-X" },
          { id: "frontend-ux", label: "Next-Gen UX" },
          { id: "ux-upgrade", label: "UX Upgrade" },
        ].map((doc) => (
          <button 
            key={doc.id}
            onClick={() => setDocId(doc.id)}
            className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest border transition-all ${
              docId === doc.id ? "bg-quantum-primary/10 border-quantum-primary text-quantum-primary" : "border-quantum-border text-[#8E9299] hover:border-quantum-primary/30"
            }`}
          >
            {doc.label}
          </button>
        ))}
      </div>
      <div className="bg-quantum-panel border border-quantum-border rounded-xl p-8 max-w-4xl mx-auto w-full">
        <div className="prose prose-invert prose-emerald max-w-none font-sans text-sm leading-relaxed text-[#8E9299]">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BlueprintDoc;
