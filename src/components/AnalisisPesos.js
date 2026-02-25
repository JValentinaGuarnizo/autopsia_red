import React, { useMemo, useState } from "react";
import { theme, DarkCard, LightPanel } from "../styles/theme";

export default function AnalisisPesos() {
  // =========================
  // Datos (tuyos)
  // =========================
  const inputLabels = [
    "Preg", "Gluc", "Pres", "Plieg",
    "Insul", "IMC", "Pedig", "Edad"
  ];

  // Pesos entrenados capa oculta 1 (8x4)
  const weights = [
    [-0.022, 0.031, -0.001, -0.054],
    [-0.042, 0.051, -0.001, -0.033],
    [-0.037, -0.057, 0.014, -0.033],
    [-0.002, -0.037, 0.001, 0.021],
    [0.004, -0.082, -0.015, -0.030],
    [-0.046, 0.066, -0.029, -0.000],
    [0.032, 0.027, -0.043, 0.020],
    [-0.037, -0.055, -0.047, 0.029]
  ];

  // Sesgos entrenados capa 1 (4)
  const biases = [-0.022, -0.132, -0.008, -0.054];

  // Registros (5x8)
  const registros = [
    [6, 148, 72, 35, 0, 33.6, 0.627, 50],
    [1, 85, 66, 29, 0, 26.6, 0.351, 31],
    [8, 183, 64, 0, 0, 23.3, 0.672, 32],   // R3
    [1, 89, 66, 23, 94, 28.1, 0.167, 21],
    [0, 137, 40, 35, 168, 43.1, 2.288, 33] // R5
  ];

  // =========================
  // Estado UI (minimal pero potente)
  // =========================
  const [neurona, setNeurona] = useState(1); // Arranca en N2 (se ve actividad en R3)
  const [modo, setModo] = useState("dominante"); // dominante | debil
  const [delta, setDelta] = useState(50); // cambio en la variable seleccionada
  const [hoverCell, setHoverCell] = useState(null); // {i,j,w,x,y}

  // Fijamos el experimento como tú pediste: registro R3 para (b)(c)
  const xBase = registros[2]; // R3
  const xCompare = registros[4]; // R5 para (d)

  // =========================
  // Helpers
  // =========================
  const relu = (z) => Math.max(0, z);

  const zForNeuron = (x, j) => {
    let s = biases[j];
    for (let i = 0; i < 8; i++) s += x[i] * weights[i][j];
    return s;
  };

  const argMaxAbsCol = (j) => {
    let best = 0;
    let bestAbs = -1;
    for (let i = 0; i < 8; i++) {
      const a = Math.abs(weights[i][j]);
      if (a > bestAbs) { bestAbs = a; best = i; }
    }
    return best;
  };

  const argMinAbsCol = (j) => {
    let best = 0;
    let bestAbs = Infinity;
    for (let i = 0; i < 8; i++) {
      const a = Math.abs(weights[i][j]);
      if (a < bestAbs) { bestAbs = a; best = i; }
    }
    return best;
  };

  const maxAbsWeight = useMemo(
    () => Math.max(...weights.flat().map(w => Math.abs(w))),
    [weights]
  );

  // =========================
  // 3(a) métricas globales
  // =========================
  const varsInfluence = useMemo(() => {
    return weights.map((fila, i) => ({
      name: inputLabels[i],
      sumAbs: fila.reduce((acc, w) => acc + Math.abs(w), 0),
    }));
  }, [weights, inputLabels]);

  const maxInfluence = Math.max(...varsInfluence.map(v => v.sumAbs));

  const top3 = [...varsInfluence].sort((a, b) => b.sumAbs - a.sumAbs).slice(0, 3);

  const maxGlobal = useMemo(() => {
    let best = { i: 0, j: 0, w: weights[0][0], abs: Math.abs(weights[0][0]) };
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        const absw = Math.abs(weights[i][j]);
        if (absw > best.abs) best = { i, j, w: weights[i][j], abs: absw };
      }
    }
    return best;
  }, [weights]);

  // =========================
  // 3(b)(c) Selección variable
  // =========================
  const domIdx = argMaxAbsCol(neurona);
  const weakIdx = argMinAbsCol(neurona);
  const varIdx = (modo === "dominante") ? domIdx : weakIdx;

  // Base
  const z0 = zForNeuron(xBase, neurona);
  const a0 = relu(z0);

  // Modificado: solo cambia la variable seleccionada
  const xMod = xBase.map((v, i) => (i === varIdx ? v + delta : v));
  const z1 = zForNeuron(xMod, neurona);
  const a1 = relu(z1);

  const zGaugeMax = Math.max(1, Math.abs(z0), Math.abs(z1), Math.abs(biases[neurona])) * 1.2;

  // =========================
  // 3(d) Comparación R3 vs R5
  // =========================
  const actR3 = useMemo(() => {
    const z = [0, 0, 0, 0], a = [0, 0, 0, 0];
    for (let j = 0; j < 4; j++) {
      z[j] = zForNeuron(xBase, j);
      a[j] = relu(z[j]);
    }
    return { z, a };
  }, [xBase]);

  const actR5 = useMemo(() => {
    const z = [0, 0, 0, 0], a = [0, 0, 0, 0];
    for (let j = 0; j < 4; j++) {
      z[j] = zForNeuron(xCompare, j);
      a[j] = relu(z[j]);
    }
    return { z, a };
  }, [xCompare]);

  const bestDiffNeuron = useMemo(() => {
    let bestJ = 0;
    let bestDif = -1;
    for (let j = 0; j < 4; j++) {
      const dif = Math.abs(actR3.a[j] - actR5.a[j]);
      if (dif > bestDif) { bestDif = dif; bestJ = j; }
    }
    return { j: bestJ, dif: bestDif };
  }, [actR3, actR5]);

  const [neuronaComparada, setNeuronaComparada] = useState(null);
  const [showAbs, setShowAbs] = useState(false);

  const selectedComp = neuronaComparada ?? bestDiffNeuron.j;

  // z pre-ReLU: suma ponderada antes de aplicar ReLU (explica apagado si z < 0)
  const zR3 = useMemo(
    () => zForNeuron(xBase, selectedComp),
    [xBase, selectedComp, weights, biases]
  );
  const zR5 = useMemo(
    () => zForNeuron(xCompare, selectedComp),
    [xCompare, selectedComp, weights, biases]
  );
  const aR3 = useMemo(() => relu(zR3), [zR3]);
  const aR5 = useMemo(() => relu(zR5), [zR5]);

  // Δz_i = (x_i(R3) - x_i(R5)) * w_i  (con signo: sube o baja z)
  const contrib = useMemo(() => {
    const all = [];
    for (let i = 0; i < 8; i++) {
      const dx = xBase[i] - xCompare[i];
      const dz = dx * weights[i][selectedComp];
      all.push({ i, label: inputLabels[i], dx, w: weights[i][selectedComp], dz });
    }
    all.sort((a, b) => Math.abs(b.dz) - Math.abs(a.dz));
    const top5 = all.slice(0, 5);
    const rest = all.slice(5);
    const others = rest.reduce((acc, v) => acc + v.dz, 0);
    return { all, top5, others };
  }, [xBase, xCompare, weights, inputLabels, selectedComp]);

  // ReLU apaga cuando z < 0 (a = 0), por eso es clave ver z antes de ReLU.
  const crossesZero = (zR3 >= 0 && zR5 < 0) || (zR3 < 0 && zR5 >= 0);
  const crossLabel = crossesZero
    ? (zR3 >= 0 ? "Cruza 0 → se enciende con ReLU" : "Cruza 0 → se apaga con ReLU")
    : "No cruza 0";

  const maxAbsContrib = useMemo(() => {
    const vals = contrib.top5.map((c) => Math.abs(c.dz));
    vals.push(Math.abs(contrib.others));
    return Math.max(...vals, 1e-6);
  }, [contrib]);

  // =========================
  // Estilos (modo proyección)
  // =========================
  const card = DarkCard;

  const chip = (active) => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.borderDark}`,
    background: active ? theme.accentPos : theme.borderDark,
    color: active ? theme.textOnLight : theme.mutedOnDark,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 800,
    transition: "transform .12s ease, background .12s ease",
    transform: active ? "translateY(-1px)" : "translateY(0px)"
  });

  const accentGood = theme.accentPos;
  const accentBad = theme.accentNeg;
  const accentViolet = theme.accentPurple;
  const accentPurple = theme.accentPurple;

  const renderSignedBar = (value, maxAbs) => {
    const half = 50;
    const w = Math.min(half, (Math.abs(value) / maxAbs) * half);
    const left = value >= 0 ? half : Math.max(0, half - w);
    return (
      <div style={{
        position: "relative",
        height: 14,
        background: theme.surfaceAlt,
        border: `1px solid ${theme.border}`,
        borderRadius: 999,
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          left: `${left}%`,
          width: `${w}%`,
          height: "100%",
          background: value >= 0 ? accentGood : accentBad,
          opacity: 0.85,
          borderRadius: 999
        }} />
        <div style={{
          position: "absolute",
          left: "50%",
          top: -2,
          bottom: -2,
          width: 1,
          background: theme.borderLight
        }} />
      </div>
    );
  };

  // =========================
  // Mini componentes SVG (puro SVG)
  // =========================
  const MiniNetwork = () => {
    // Dibuja inputs -> neurona seleccionada con grosor por |w|, color por signo
    const Wcol = weights.map(row => row[neurona]); // 8 valores
    const maxAbs = Math.max(...Wcol.map(v => Math.abs(v)), 1e-6);

    const xL = 80, xR = 360;
    const y0 = 40;
    const dy = 34;

    const yNeuron = y0 + (7 * dy) / 2; // centrado
    const neuronR = 26;

    return (
      <svg width={430} height={330} style={{ display: "block", width: "100%", maxWidth: 430, height: "auto" }}>
        {/* Fondo suave */}
        <rect x="0" y="0" width="430" height="330" rx="16" fill={theme.surface} stroke={theme.border} />

        {/* Inputs */}
        {inputLabels.map((name, i) => {
          const y = y0 + i * dy;
          const isSel = i === varIdx;
          const valueText = isSel
            ? `${Number(xBase[i].toFixed(3))} → ${Number(xMod[i].toFixed(3))}`
            : Number(xBase[i].toFixed(3));
          return (
            <g key={i}>
              <circle
                cx={xL}
                cy={y}
                r={isSel ? 13 : 11}
                fill={isSel ? accentViolet : theme.accentBlue}
                style={{ filter: isSel ? "drop-shadow(0 0 8px rgba(0, 245, 196, 0.6))" : "none" }}
              />
              <text x={xL - 18} y={y + 4} textAnchor="end" fontSize="12" fill={theme.textOnDark}>
                {name}
              </text>
              {/* valor x */}
              <text x={xL + 18} y={y + 4} textAnchor="start" fontSize="11" fill={isSel ? accentViolet : theme.mutedOnDark} style={{ fontWeight: isSel ? 800 : 400 }}>
                {valueText}
              </text>
            </g>
          );
        })}

        {/* Edges */}
        {Wcol.map((w, i) => {
          const y = y0 + i * dy;
          const absw = Math.abs(w);
          const baseThickness = 1.2 + (absw / maxAbs) * 4.0;
          const color = w >= 0 ? accentGood : accentBad;
          const isSel = i === varIdx;

          // glow
          const glow = isSel ? "drop-shadow(0px 0px 8px rgba(0,245,196,0.6))" : "none";
          const thickness = isSel ? Math.max(2.5, baseThickness) : baseThickness;

          return (
            <g key={i}>
              <line
                x1={xL + 10}
                y1={y}
                x2={xR - neuronR}
                y2={yNeuron}
                stroke={color}
                strokeWidth={thickness}
                strokeOpacity={isSel ? 0.95 : 0.45}
                style={{ filter: glow, transition: "stroke-opacity .2s ease, stroke-width .2s ease" }}
              />
            </g>
          );
        })}

        {/* Neurona */}
        <g>
          <circle
            cx={xR}
            cy={yNeuron}
            r={neuronR}
            fill={a0 > 0 ? "rgba(168,85,247,0.35)" : theme.borderDark}
            stroke={theme.textOnDark}
            strokeWidth="2"
          />
          <text x={xR} y={yNeuron + 5} textAnchor="middle" fontSize="12" fill={theme.textOnDark} style={{ fontWeight: 800 }}>
            N{neurona + 1}
          </text>

          {/* bias */}
          <text x={xR} y={yNeuron + 44} textAnchor="middle" fontSize="11" fill={theme.mutedOnDark}>
            b={biases[neurona].toFixed(3)}
          </text>
        </g>

      </svg>
    );
  };

  const Gauge = ({ title, z, a }) => {
    // “termómetro” de z y burbuja ReLU
    const h = 220;
    const w = 160;
    const centerX = 50;

    // escala z alrededor de 0 para comparar antes y despues
    const zMax = zGaugeMax;
    const clamp = (v) => Math.max(-zMax, Math.min(zMax, v));
    const zn = clamp(z);
    const t = (zn + zMax) / (2 * zMax); // 0..1
    const y = 30 + (1 - t) * (h - 40);

    const active = a > 0;

    return (
      <svg width={w} height={h} style={{ display: "block", width: "100%", maxWidth: w, height: "auto" }}>
        <rect x="0" y="0" width={w} height={h} rx="16" fill={theme.surface} stroke={theme.border} />
        <text x="14" y="24" fontSize="12" fill={theme.textPrimary} style={{ fontWeight: 800 }}>{title}</text>

        {/* Eje */}
        <line x1={centerX} y1={40} x2={centerX} y2={h - 24} stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        {/* 0 marker */}
        {(() => {
          const t0 = (0 + zMax) / (2 * zMax);
          const y0 = 30 + (1 - t0) * (h - 40);
          return (
            <>
              <line x1={centerX - 18} y1={y0} x2={centerX + 18} y2={y0} stroke={theme.textOnDark} strokeWidth="2" opacity="0.35" />
              <text x={centerX + 26} y={y0 + 4} fontSize="10" fill={theme.mutedOnDark}>0</text>
            </>
          );
        })()}

        {/* Punto z */}
        <circle
          cx={centerX}
          cy={y}
          r={10}
          fill={zn >= 0 ? accentGood : accentBad}
          style={{ filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.12))", transition: "all .25s ease" }}
        />

        {/* Etiquetas */}
        <text x={96} y={86} fontSize="11" fill={theme.mutedOnDark}>z</text>
        <text x={96} y={104} fontSize="13" fill={theme.textOnDark} style={{ fontWeight: 800 }}>{z.toFixed(3)}</text>

        {/* ReLU gate */}
        <rect x="14" y={h - 74} width={w - 28} height="44" rx="12" fill={active ? "rgba(0,245,196,0.12)" : "rgba(255,77,109,0.12)"} stroke={theme.borderDark} />
        <text x="26" y={h - 48} fontSize="12" fill={theme.textOnDark} style={{ fontWeight: 800 }}>
          ReLU
        </text>
        <text x="26" y={h - 32} fontSize="12" fill={theme.textOnDark}>
          {active ? "Activa" : "Apagada"}
        </text>
        <text x={w - 26} y={h - 36} textAnchor="end" fontSize="13" fill={theme.textOnDark} style={{ fontWeight: 900 }}>
          {a.toFixed(3)}
        </text>
      </svg>
    );
  };

  // =========================
  // Render
  // =========================
  return (
    <div style={{ marginTop: "12px" }}>
      {/* CSS pequeño para “wow” */}
      <style>{`
        .pulse {
          animation: pulse 1.4s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 0.95; }
        }
        .softIn {
          animation: softIn .35s ease;
        }
        @keyframes softIn {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0px); opacity: 1; }
        }
      `}</style>

      {/* ===================== PRIMERA FILA ===================== */}
      <div style={{ display: "flex", gap: 18, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* Heatmap */}
        <div style={{ ...LightPanel, flex: "1 1 450px", minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontWeight: 900 }}>Mapa de pesos</div>
            <div style={{ fontSize: 13, color: theme.mutedOnLight }}>cyan + / magenta −</div>
          </div>

          <svg width={388} height={310} style={{ marginTop: 10, display: "block", width: "100%", maxWidth: 388, height: "auto" }}>
            {/* grid */}
            {weights.map((fila, i) =>
              fila.map((w, j) => {
                const intensidad = Math.abs(w) / (maxAbsWeight || 1);
                const base = w >= 0 ? [0, 245, 196] : [255, 77, 109];
                const fill = `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${0.18 + intensidad * 0.82})`;

                const x = 110 + j * 60;
                const y = 24 + i * 32;

                const isFocus = (i === varIdx && j === neurona);

                return (
                  <g
                    key={`${i}-${j}`}
                    onMouseEnter={() => setHoverCell({ i, j, w, x: x + 22, y: y + 16 })}
                    onMouseLeave={() => setHoverCell(null)}
                    style={{ cursor: "default" }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={46}
                      height={26}
                      rx="8"
                      fill={fill}
                      stroke={isFocus ? accentViolet : theme.borderLight}
                      strokeWidth={isFocus ? 3 : 1}
                      style={{
                        filter: isFocus ? "drop-shadow(0px 0px 12px rgba(0,245,196,0.35))" : "none",
                        transition: "all .18s ease"
                      }}
                    />
                    <text x={x + 23} y={y + 17} textAnchor="middle" fontSize="11" fill={theme.textOnLight} style={{ fontWeight: 700 }}>
                      {w.toFixed(3)}
                    </text>
                  </g>
                );
              })
            )}

            {/* row labels */}
            {inputLabels.map((lab, i) => (
              <text key={lab} x={96} y={42 + i * 32} textAnchor="end" fontSize="13" fill={theme.textOnLight}>
                {lab}
              </text>
            ))}

            {/* col labels */}
            {[1, 2, 3, 4].map((n, j) => (
              <text key={n} x={133 + j * 60} y={16} textAnchor="middle" fontSize="13" fill={theme.textOnLight} style={{ fontWeight: 800 }}>
                N{n}
              </text>
            ))}

            {/* tooltip */}
            {hoverCell && (
              <g className="softIn">
                <rect
                  x={Math.min(250, hoverCell.x + 14)}
                  y={Math.max(8, hoverCell.y - 24)}
                  width="130"
                  height="44"
                  rx="12"
                  fill={theme.textPrimary}
                  opacity="0.95"
                />
                <text x={Math.min(250, hoverCell.x + 14) + 10} y={Math.max(8, hoverCell.y - 24) + 18} fontSize="12" fill="#FFFFFF">
                  {inputLabels[hoverCell.i]} → N{hoverCell.j + 1}
                </text>
                <text x={Math.min(250, hoverCell.x + 14) + 10} y={Math.max(8, hoverCell.y - 24) + 34} fontSize="13" fill="#FFFFFF" style={{ fontWeight: 800 }}>
                  w = {hoverCell.w.toFixed(3)}
                </text>
              </g>
            )}
          </svg>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <div style={{ fontSize: 13, color: theme.textOnLight }}>
              <strong>Variables mas influyentes:</strong> {top3.map(v => v.name).join(", ")}
            </div>
            <div style={{ fontSize: 13, color: theme.mutedOnLight }}>
              Conexion mas fuerte: <strong style={{ color: theme.textOnLight }}>{inputLabels[maxGlobal.i]}→N{maxGlobal.j + 1}</strong>
            </div>
          </div>
        </div>

        {/* Barras influencia */}
        <div style={{ ...card, flex: "1 1 450px", minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontWeight: 900 }}>Influencia global</div>
            <div style={{ fontSize: 13, color: theme.mutedOnDark }}>comparacion por variable</div>
          </div>

          <svg width={388} height={310} style={{ marginTop: 10, display: "block", width: "100%", maxWidth: 388, height: "auto" }}>
            {varsInfluence.map((v, i) => {
              const h = (v.sumAbs / (maxInfluence || 1)) * 200;
              const x = 22 + i * 44;
              const y = 250 - h;

              const isTop = top3.some(t => t.name === v.name);

              return (
                <g key={v.name}>
                  <rect
                    x={x}
                    y={y}
                    width={30}
                    height={h}
                    rx="10"
                    fill={isTop ? accentGood : accentPurple}
                    opacity={isTop ? 0.95 : 0.7}
                    style={{ transition: "all .2s ease" }}
                  />
                  <text x={x + 15} y={270} textAnchor="middle" fontSize="12" fill={theme.textOnDark}>
                    {v.name}
                  </text>
                  <text x={x + 15} y={y - 6} textAnchor="middle" fontSize="11" fill={theme.mutedOnDark}>
                    {v.sumAbs.toFixed(3)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

      </div>

      {/* ===================== SEGUNDA FILA ===================== */}
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap", marginTop: 20 }}>
        {/* Panel control */}
        <div style={{ ...card, flex: "1 1 390px", minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <div style={{ fontWeight: 900 }}>Control del experimento</div>
            <div style={{ fontSize: 13, color: theme.mutedOnDark }}>Nota: siempre se modifica el registro R3.</div>
          </div>

          <div style={{ marginBottom: 12, color: theme.textOnDark, fontSize: 17, fontWeight: 900 }}>
            Variable modificada: {inputLabels[varIdx]}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            {[0, 1, 2, 3].map(j => (
              <button key={j} onClick={() => setNeurona(j)} style={chip(neurona === j)}>
                N{j + 1}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button onClick={() => setModo("dominante")} style={chip(modo === "dominante")}>
              Dominante
            </button>
            <button onClick={() => setModo("debil")} style={chip(modo === "debil")}>
              Débil
            </button>
          </div>

          <div style={{ ...LightPanel, borderRadius: 14, padding: "12px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontWeight: 800, color: theme.textOnLight }}>Δ (cambio aplicado)</div>
              <div style={{ fontSize: 13, color: theme.mutedOnLight }}>x → x + Δ</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
              <input
                type="range"
                min="0"
                max="200"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <div style={{
                minWidth: 68,
                textAlign: "center",
                padding: "8px 10px",
                borderRadius: 12,
                background: theme.surfaceLight,
                border: `1px solid ${theme.borderLight}`,
                fontWeight: 900
              }}>
                +{delta}
              </div>
            </div>

            <div style={{ marginTop: 10, fontSize: 13, color: theme.mutedOnLight }}>
              En el heatmap y la red se resalta la celda y arista de la variable modificada.
            </div>
          </div>
        </div>

        {/* Mini red */}
        <div style={{ ...card, flex: "1 1 430px", minWidth: 320 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Qué entra a la neurona seleccionada</div>
          <MiniNetwork />
        </div>

        {/* Gauges */}
        <div style={{ ...card, flex: "1 1 320px", minWidth: 280 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Salida de la neurona</div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div className="softIn">
              <Gauge title="Antes" z={z0} a={a0} />
            </div>
            <div className="softIn">
              <Gauge title="Después" z={z1} a={a1} />
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 14, color: theme.textOnDark }}>
            <strong>Resultado:</strong>{" "}
            <span style={{ fontWeight: 900 }}>
              Δz = {(z1 - z0).toFixed(3)}
            </span>{" "}
            y{" "}
            <span style={{ fontWeight: 900 }}>
              ΔReLU = {(a1 - a0).toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* ===================== 3(d) WOW ===================== */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontWeight: 900, marginBottom: 10, fontSize: 18, color: theme.textOnDark }}>
          Comparación R3 vs R5 (activaciones muy distintas)
        </div>
        <div style={{ ...card }}>
          <div style={{ display: "grid", gap: 14 }}>
            {/* Neuronas (solo guía de selección) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(160px, 1fr))", gap: 12 }}>
              {[0, 1, 2, 3].map((j) => {
                const deltaA = actR3.a[j] - actR5.a[j];
                const isBest = j === bestDiffNeuron.j;
                const isSelected = j === selectedComp;
                return (
                  <button
                    key={j}
                    onClick={() => setNeuronaComparada(j)}
                    style={{
                      ...LightPanel,
                      border: isSelected
                        ? `2px solid ${accentGood}`
                        : isBest
                          ? `2px solid ${accentPurple}`
                          : `1px solid ${theme.borderLight}`,
                      borderRadius: 14,
                      padding: "12px 14px",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontWeight: 900, color: theme.textOnLight }}>N{j + 1}</div>
                    <div style={{ fontSize: 13, color: theme.mutedOnLight, marginTop: 6 }}>
                      R3 a: <strong style={{ color: theme.textOnLight }}>{actR3.a[j].toFixed(3)}</strong>
                    </div>
                    <div style={{ fontSize: 13, color: theme.mutedOnLight }}>
                      R5 a: <strong style={{ color: theme.textOnLight }}>{actR5.a[j].toFixed(3)}</strong>
                    </div>
                    <div style={{ fontSize: 13, color: theme.textOnLight, marginTop: 6 }}>
                      Δa: <strong style={{ color: deltaA >= 0 ? accentGood : accentBad }}>{deltaA.toFixed(3)}</strong>
                    </div>
                    {isBest && (
                      <div style={{ marginTop: 8, fontSize: 12, color: theme.accentDeepPurple, fontWeight: 800 }}>
                        mayor |Δa|
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {/* z pre-ReLU + activación */}
              <div style={{ ...LightPanel }}>
                <div style={{ fontWeight: 900, color: theme.textOnLight }}>
                  z pre‑ReLU (N{selectedComp + 1})
                </div>
                <div style={{ marginTop: 8, display: "grid", gap: 6, fontSize: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: theme.textOnLight }}>
                    <span>R3: z = <strong>{zR3.toFixed(3)}</strong></span>
                    <span>a = <strong>{aR3.toFixed(3)}</strong></span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: theme.textOnLight }}>
                    <span>R5: z = <strong>{zR5.toFixed(3)}</strong></span>
                    <span>a = <strong>{aR5.toFixed(3)}</strong></span>
                  </div>
                  <div style={{ color: theme.mutedOnLight }}>
                    Δz = <strong style={{ color: (zR3 - zR5) >= 0 ? accentGood : accentBad }}>{(zR3 - zR5).toFixed(3)}</strong>
                  </div>
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: theme.mutedOnLight }}>
                  {crossLabel}. Si z &lt; 0, ReLU = 0 (se apaga).
                </div>
              </div>

              {/* Top 5 contribuciones con signo */}
              <div style={{ ...LightPanel }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ fontWeight: 900, color: theme.textOnLight }}>Top 5 contribuciones Δz</div>
                  <button
                    onClick={() => setShowAbs((v) => !v)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: `1px solid ${theme.borderLight}`,
                      background: "#ffffff",
                      color: theme.accentBlue,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    {showAbs ? "Ver con signo" : "Ver magnitud |Δz|"}
                  </button>
                </div>
                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  {contrib.top5.map((c) => {
                    const val = showAbs ? Math.abs(c.dz) : c.dz;
                    return (
                      <div key={c.i} style={{ display: "grid", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.textOnLight }}>
                          <span style={{ fontWeight: 800 }}>{c.label}</span>
                          <span style={{ color: c.dz >= 0 ? accentGood : accentBad }}>
                            {val.toFixed(3)}
                          </span>
                        </div>
                        {renderSignedBar(c.dz, maxAbsContrib)}
                      </div>
                    );
                  })}
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.textOnLight }}>
                      <span style={{ fontWeight: 800 }}>Otros</span>
                      <span style={{ color: contrib.others >= 0 ? accentGood : accentBad }}>
                        {(showAbs ? Math.abs(contrib.others) : contrib.others).toFixed(3)}
                      </span>
                    </div>
                    {renderSignedBar(contrib.others, maxAbsContrib)}
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: theme.mutedOnLight }}>
                  Δz_i = (x_i(R3) − x_i(R5)) · w_i  (con signo).
                </div>
              </div>

              {/* Waterfall simple */}
              <div style={{ ...LightPanel }}>
                <div style={{ fontWeight: 900, color: theme.textOnLight }}>Waterfall z(R5) → z(R3)</div>
                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 13, color: theme.mutedOnLight }}>Base z(R5)</div>
                    {renderSignedBar(zR5, Math.max(Math.abs(zR5), Math.abs(zR3), maxAbsContrib))}
                  </div>
                  {contrib.top5.map((c) => (
                    <div key={`wf-${c.i}`} style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontSize: 13, color: theme.mutedOnLight }}>
                        {c.label} ({c.dz >= 0 ? "+" : "−"}Δz)
                      </div>
                      {renderSignedBar(c.dz, maxAbsContrib)}
                    </div>
                  ))}
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 13, color: theme.mutedOnLight }}>Otros</div>
                    {renderSignedBar(contrib.others, maxAbsContrib)}
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 13, color: theme.mutedOnLight }}>Resultado z(R3)</div>
                    {renderSignedBar(zR3, Math.max(Math.abs(zR5), Math.abs(zR3), maxAbsContrib))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separación final */}
      <div style={{ height: 30 }} />
    </div>
  );
}
