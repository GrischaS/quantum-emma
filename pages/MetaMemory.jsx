// ============================================================
//  QUANTUM EMMA — HQMLL MetaMemory Visualizer v2
//  7-Layer Quantum Meta-Logic · Recursive Pulse · Live Nodes
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react";

const LAYERS = [
  { id: 1, name: "Quantum Perception",    color: "#00ffff", nodes: 8,  role: "Sensory Input Layer" },
  { id: 2, name: "Neural Encoding",       color: "#0088ff", nodes: 12, role: "Pattern Recognition" },
  { id: 3, name: "Semantic Compression",  color: "#8800ff", nodes: 10, role: "Meaning Extraction" },
  { id: 4, name: "Recursive Inference",   color: "#ff00ff", nodes: 16, role: "Logical Deduction" },
  { id: 5, name: "Meta-Coherence",        color: "#ff8800", nodes: 12, role: "Cross-Layer Sync" },
  { id: 6, name: "Quantum Entanglement",  color: "#00ff80", nodes: 8,  role: "Distributed Memory" },
  { id: 7, name: "Ascension Bridge",      color: "#ffd700", nodes: 4,  role: "Output & Decision" },
];

const ACTIVITIES = [
  "Processing QEMMA market signal...",
  "Cross-referencing on-chain patterns...",
  "Recursive inference cycle #7 active...",
  "Quantum coherence achieved at 94.7%...",
  "MetaCodex sync: 12/12 agents aligned...",
  "HQMLL Layer 6 entanglement stable...",
  "Krealogoik loop iteration 847 complete...",
  "Oracle Prime consensus: STRONG BUY...",
];

export default function HQMLLVisualizer() {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const [layers,   setLayers]   = useState(LAYERS.map(l => ({ ...l, activity: 0, pulses: [] })));
  const [activity, setActivity] = useState(ACTIVITIES[0]);
  const [mode,     setMode]     = useState("pulse"); // pulse | matrix | flow
  const [cycles,   setCycles]   = useState(0);
  const [coherence,setCoherence]= useState(94.7);
  const [selected, setSelected] = useState(null);
  const tickRef    = useRef(0);

  // Animate layers
  useEffect(() => {
    const iv = setInterval(() => {
      tickRef.current++;
      setLayers(prev => prev.map((l, i) => ({
        ...l,
        activity: Math.min(100, Math.max(10,
          l.activity + (Math.random() - 0.4) * 15)),
      })));
      if (tickRef.current % 3 === 0) {
        setActivity(ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]);
        setCycles(c => c + 1);
        setCoherence(c => parseFloat((c + (Math.random() - 0.45) * 0.5).toFixed(1)));
      }
    }, 800);
    return () => clearInterval(iv);
  }, []);

  // Canvas neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    let frame    = 0;

    const draw = () => {
      const W = canvas.width  = canvas.offsetWidth;
      const H = canvas.height = 200;
      ctx.clearRect(0, 0, W, H);

      // Draw neural network connections
      const layerX = LAYERS.map((_, i) => (W / (LAYERS.length + 1)) * (i + 1));
      const layerNodes = LAYERS.map(l => {
        return Array.from({ length: l.nodes }, (_, j) => ({
          x: layerX[LAYERS.indexOf(l)] + Math.sin(frame * 0.02 + j) * 4,
          y: (H / (l.nodes + 1)) * (j + 1),
        }));
      });

      // Connections
      for (let li = 0; li < layerNodes.length - 1; li++) {
        const fromLayer = layerNodes[li];
        const toLayer   = layerNodes[li + 1];
        const color     = LAYERS[li].color;
        fromLayer.forEach((from, fi) => {
          toLayer.slice(0, 3).forEach((to, ti) => {
            const alpha = 0.05 + 0.15 * Math.abs(Math.sin(frame * 0.05 + fi + ti));
            ctx.beginPath();
            ctx.strokeStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.8;
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
          });
        });
      }

      // Nodes
      layerNodes.forEach((nodes, li) => {
        const color = LAYERS[li].color;
        nodes.forEach((node, ni) => {
          const pulse = Math.sin(frame * 0.08 + li + ni * 0.5);
          const r     = 3 + pulse * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur  = 8 + pulse * 4;
          ctx.fill();
          ctx.shadowBlur  = 0;
        });
      });

      // Pulse wave
      if (mode === "pulse") {
        const waveX = (frame % (W + 50)) - 25;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,255,255,0.3)";
        ctx.lineWidth   = 2;
        ctx.moveTo(waveX, 0);
        ctx.lineTo(waveX, H);
        ctx.stroke();
      }

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [mode]);

  return (
    <div style={{ minHeight: "100vh", background: "#000d1a", color: "#e0f0ff",
                  fontFamily: "'Rajdhani',sans-serif", padding: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#00ffff" }}>
            🌀 HQMLL MetaMemory v2
          </h1>
          <p style={{ margin: "4px 0 0", color: "#556677", fontSize: 13 }}>
            7-Layer Hierarchical Quantum Meta-Logic · {cycles.toLocaleString()} Zyklen
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["pulse", "matrix", "flow"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12,
                       background: mode === m ? "rgba(0,255,255,0.12)" : "rgba(255,255,255,0.04)",
                       border: `1px solid ${mode === m ? "#00ffff" : "rgba(255,255,255,0.1)"}`,
                       color: mode === m ? "#00ffff" : "#556677", fontWeight: 700,
                       textTransform: "capitalize" }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Coherence + Status */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                    gap: 12, marginBottom: 20 }}>
        {[
          { label: "Kohärenz",      value: `${coherence}%`,    color: "#00ff80",  sub: "Quantum Coherence" },
          { label: "Aktive Zyklen", value: cycles.toLocaleString(), color: "#00ffff", sub: "Recursive Loops" },
          { label: "Layer Status",  value: "7/7 ONLINE",       color: "#00ff80",  sub: "All Systems Active" },
          { label: "Agenten",       value: "12/12",            color: "#ffd700",  sub: "Orchestration" },
        ].map(({ label, value, color, sub }) => (
          <div key={label} style={{ background: "rgba(0,20,40,0.85)",
                                    border: "1px solid rgba(0,255,255,0.12)",
                                    borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ color: "#556677", fontSize: 11, marginBottom: 6 }}>{label}</div>
            <div style={{ color, fontSize: 22, fontWeight: 800 }}>{value}</div>
            <div style={{ color: "#334455", fontSize: 10, marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Neural Canvas */}
      <div style={{ background: "rgba(0,10,25,0.95)", border: "1px solid rgba(0,255,255,0.15)",
                    borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <div style={{ color: "#556677", fontSize: 12, marginBottom: 8 }}>
          Neural Network Visualization · Mode: {mode}
        </div>
        <canvas ref={canvasRef} style={{ width: "100%", height: 200, display: "block" }} />
        <div style={{ color: "#00ffff", fontSize: 12, marginTop: 8, textAlign: "center",
                      fontStyle: "italic", minHeight: 20 }}>
          ⚛️ {activity}
        </div>
      </div>

      {/* Layer Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {layers.map((l, i) => (
          <div key={l.id} onClick={() => setSelected(selected === l.id ? null : l.id)}
            style={{ background: selected === l.id ? "rgba(0,30,60,0.95)" : "rgba(0,20,40,0.85)",
                     border: `1px solid ${selected === l.id ? l.color : l.color + "33"}`,
                     borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                     transition: "all 0.3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%",
                            background: l.color + "22", border: `2px solid ${l.color}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 14, fontWeight: 900, color: l.color, flexShrink: 0 }}>
                L{l.id}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: l.color, fontSize: 15 }}>{l.name}</span>
                  <span style={{ color: "#556677", fontSize: 11 }}>{l.nodes} nodes</span>
                </div>
                <div style={{ color: "#556677", fontSize: 11, marginBottom: 6 }}>{l.role}</div>
                <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 6, height: 5, overflow: "hidden" }}>
                  <div style={{ width: `${l.activity}%`, height: "100%", background: l.color,
                                boxShadow: `0 0 8px ${l.color}`, transition: "width 0.5s", borderRadius: 6 }} />
                </div>
              </div>
              <span style={{ color: l.color, fontWeight: 800, fontSize: 16, minWidth: 44, textAlign: "right" }}>
                {l.activity.toFixed(0)}%
              </span>
            </div>
            {selected === l.id && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${l.color}22`,
                            display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 8 }}>
                {[
                  { k: "Layer ID",     v: `L${l.id}` },
                  { k: "Nodes",        v: l.nodes },
                  { k: "Connections",  v: l.nodes * (LAYERS[i+1]?.nodes || 0) },
                  { k: "Aktivität",    v: `${l.activity.toFixed(1)}%` },
                  { k: "Latenz",       v: `${(Math.random() * 2 + 0.5).toFixed(1)}ms` },
                  { k: "Memory",       v: `${(Math.random() * 50 + 20).toFixed(0)}KB` },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <div style={{ color: "#556677", fontSize: 10 }}>{k}</div>
                    <div style={{ color: l.color, fontWeight: 700, fontSize: 13 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 24, color: "#334455", fontSize: 11 }}>
        © 2026 Grigori Saks — HQMLL Framework · Quantum Emma · Patent Pending
      </div>
    </div>
  );
}
