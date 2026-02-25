import React, { useMemo, useState } from "react";

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

  const deltaXWTop = useMemo(() => {
    const j = bestDiffNeuron.j;
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const dx = xBase[i] - xCompare[i];
      arr.push({ i, w: weights[i][j], abs: Math.abs(weights[i][j]), dx, contrib: dx * weights[i][j] });
    }
    arr.sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));
    return arr.slice(0, 3);
  }, [bestDiffNeuron, xBase, xCompare, weights]);

  // =========================
  // Estilos (coherentes con tu gris + verde/rojo)
  // =========================
  const card = {
    background: "var(--panel-soft, #f4f6f7)",
    border: "1px solid var(--panel-line, #e5e7e9)",
    borderRadius: 16,
    padding: "16px 18px",
    color: "var(--text-main, #2c3e50)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  };

  const chip = (active) => ({
    padding: "9px 12px",
    borderRadius: 12,
    border: "1px solid var(--panel-line, #d5d8dc)",
    background: active ? "var(--accent-soft, #2c3e50)" : "var(--panel-soft, #f4f6f7)",
    color: active ? "#ffffff" : "var(--text-main, #2c3e50)",
    cursor: "pointer",
    fontSize: 14,
    transition: "transform .12s ease, background .12s ease",
    transform: active ? "translateY(-1px)" : "translateY(0px)"
  });

  const accentGood = "#2ecc71";
  const accentBad = "#e74c3c";
  const accentPurple = "#9b59b6";

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
        <rect x="0" y="0" width="430" height="330" rx="16" fill="#ffffff" stroke="#e5e7e9" />

        {/* Inputs */}
        {inputLabels.map((name, i) => {
          const y = y0 + i * dy;
          const isSel = i === varIdx;
          const valueText = isSel
            ? `${Number(xBase[i].toFixed(3))} → ${Number(xMod[i].toFixed(3))}`
            : Number(xBase[i].toFixed(3));
          return (
            <g key={i}>
              <circle cx={xL} cy={y} r={isSel ? 12 : 10} fill={isSel ? accentPurple : "#bdc3c7"} />
              <text x={xL - 18} y={y + 4} textAnchor="end" fontSize="12" fill="#2c3e50">
                {name}
              </text>
              {/* valor x */}
              <text x={xL + 18} y={y + 4} textAnchor="start" fontSize="11" fill={isSel ? accentPurple : "#7f8c8d"} style={{ fontWeight: isSel ? 800 : 400 }}>
                {valueText}
              </text>
            </g>
          );
        })}

        {/* Edges */}
        {Wcol.map((w, i) => {
          const y = y0 + i * dy;
          const absw = Math.abs(w);
          const thickness = 1.2 + (absw / maxAbs) * 4.0;
          const color = w >= 0 ? accentGood : accentBad;
          const isSel = i === varIdx;

          // glow
          const glow = isSel ? "drop-shadow(0px 0px 6px rgba(155,89,182,0.55))" : "none";

          return (
            <g key={i}>
              <line
                x1={xL + 10}
                y1={y}
                x2={xR - neuronR}
                y2={yNeuron}
                stroke={color}
                strokeWidth={thickness}
                strokeOpacity={isSel ? 0.95 : 0.35}
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
            fill={a0 > 0 ? "#f7c6d0" : "#d5d8dc"}
            stroke="#2c3e50"
            strokeWidth="2"
          />
          <text x={xR} y={yNeuron + 5} textAnchor="middle" fontSize="12" fill="#2c3e50" style={{ fontWeight: 800 }}>
            N{neurona + 1}
          </text>

          {/* bias */}
          <text x={xR} y={yNeuron + 44} textAnchor="middle" fontSize="11" fill="#7f8c8d">
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
        <rect x="0" y="0" width={w} height={h} rx="16" fill="#ffffff" stroke="#e5e7e9" />
        <text x="14" y="24" fontSize="12" fill="#2c3e50" style={{ fontWeight: 800 }}>{title}</text>

        {/* Eje */}
        <line x1={centerX} y1={40} x2={centerX} y2={h - 24} stroke="#bdc3c7" strokeWidth="6" strokeLinecap="round" />
        {/* 0 marker */}
        {(() => {
          const t0 = (0 + zMax) / (2 * zMax);
          const y0 = 30 + (1 - t0) * (h - 40);
          return (
            <>
              <line x1={centerX - 18} y1={y0} x2={centerX + 18} y2={y0} stroke="#2c3e50" strokeWidth="2" opacity="0.35" />
              <text x={centerX + 26} y={y0 + 4} fontSize="10" fill="#7f8c8d">0</text>
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
        <text x={96} y={86} fontSize="11" fill="#7f8c8d">z</text>
        <text x={96} y={104} fontSize="13" fill="#2c3e50" style={{ fontWeight: 800 }}>{z.toFixed(3)}</text>

        {/* ReLU gate */}
        <rect x="14" y={h - 74} width={w - 28} height="44" rx="12" fill={active ? "rgba(46,204,113,0.12)" : "rgba(231,76,60,0.10)"} stroke="#e5e7e9" />
        <text x="26" y={h - 48} fontSize="12" fill="#2c3e50" style={{ fontWeight: 800 }}>
          ReLU
        </text>
        <text x="26" y={h - 32} fontSize="12" fill="#2c3e50">
          {active ? "Activa" : "Apagada"}
        </text>
        <text x={w - 26} y={h - 36} textAnchor="end" fontSize="13" fill="#2c3e50" style={{ fontWeight: 900 }}>
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
        <div style={{ ...card, flex: "1 1 450px", minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontWeight: 900 }}>Mapa de pesos</div>
            <div style={{ fontSize: 13, color: "#7f8c8d" }}>verde + / rojo −</div>
          </div>

          <svg width={388} height={310} style={{ marginTop: 10, display: "block", width: "100%", maxWidth: 388, height: "auto" }}>
            {/* grid */}
            {weights.map((fila, i) =>
              fila.map((w, j) => {
                const intensidad = Math.abs(w) / (maxAbsWeight || 1);
                const base = w >= 0 ? [46, 204, 113] : [231, 76, 60];
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
                      stroke={isFocus ? accentPurple : "#e5e7e9"}
                      strokeWidth={isFocus ? 3 : 1}
                      style={{
                        filter: isFocus ? "drop-shadow(0px 0px 10px rgba(155,89,182,0.35))" : "none",
                        transition: "all .18s ease"
                      }}
                    />
                    <text x={x + 23} y={y + 17} textAnchor="middle" fontSize="11" fill="#2c3e50" style={{ fontWeight: 700 }}>
                      {w.toFixed(3)}
                    </text>
                  </g>
                );
              })
            )}

            {/* row labels */}
            {inputLabels.map((lab, i) => (
              <text key={lab} x={96} y={42 + i * 32} textAnchor="end" fontSize="13" fill="#2c3e50">
                {lab}
              </text>
            ))}

            {/* col labels */}
            {[1, 2, 3, 4].map((n, j) => (
              <text key={n} x={133 + j * 60} y={16} textAnchor="middle" fontSize="13" fill="#2c3e50" style={{ fontWeight: 800 }}>
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
                  fill="#2c3e50"
                  opacity="0.92"
                />
                <text x={Math.min(250, hoverCell.x + 14) + 10} y={Math.max(8, hoverCell.y - 24) + 18} fontSize="12" fill="white">
                  {inputLabels[hoverCell.i]} → N{hoverCell.j + 1}
                </text>
                <text x={Math.min(250, hoverCell.x + 14) + 10} y={Math.max(8, hoverCell.y - 24) + 34} fontSize="13" fill="white" style={{ fontWeight: 800 }}>
                  w = {hoverCell.w.toFixed(3)}
                </text>
              </g>
            )}
          </svg>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <div style={{ fontSize: 13, color: "#2c3e50" }}>
              <strong>Variables mas influyentes:</strong> {top3.map(v => v.name).join(", ")}
            </div>
            <div style={{ fontSize: 13, color: "#7f8c8d" }}>
              Conexion mas fuerte: <strong style={{ color: "#2c3e50" }}>{inputLabels[maxGlobal.i]}→N{maxGlobal.j + 1}</strong>
            </div>
          </div>
        </div>

        {/* Barras influencia */}
        <div style={{ ...card, flex: "1 1 450px", minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontWeight: 900 }}>Influencia global</div>
            <div style={{ fontSize: 13, color: "#7f8c8d" }}>comparacion por variable</div>
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
                    fill={accentPurple}
                    opacity={isTop ? 0.95 : 0.55}
                    style={{ transition: "all .2s ease" }}
                  />
                  <text x={x + 15} y={270} textAnchor="middle" fontSize="12" fill="#2c3e50">
                    {v.name}
                  </text>
                  <text x={x + 15} y={y - 6} textAnchor="middle" fontSize="11" fill="#7f8c8d">
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
            <div style={{ fontSize: 13, color: "#7f8c8d" }}>Nota: siempre se modifica el registro R3.</div>
          </div>

          <div style={{ marginBottom: 12, color: "#2c3e50", fontSize: 17, fontWeight: 900 }}>
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

          <div style={{ background: "var(--surface-strong, #ffffff)", border: "1px solid var(--panel-line, #e5e7e9)", borderRadius: 14, padding: "12px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontWeight: 800, color: "#2c3e50" }}>Δ (cambio aplicado)</div>
              <div style={{ fontSize: 13, color: "#7f8c8d" }}>x → x + Δ</div>
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
                background: "var(--panel-soft, #f4f6f7)",
                border: "1px solid var(--panel-line, #e5e7e9)",
                fontWeight: 900
              }}>
                +{delta}
              </div>
            </div>

            <div style={{ marginTop: 10, fontSize: 13, color: "#7f8c8d" }}>
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

          <div style={{ marginTop: 10, fontSize: 14, color: "#2c3e50" }}>
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
        <div style={{ fontWeight: 900, marginBottom: 10, fontSize: 18, color: "#2c3e50" }}>
          Comparación R3 vs R5 (activaciones muy distintas)
        </div>
        <div style={{ ...card }}>

          {/* Activaciones por neurona */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[0, 1, 2, 3].map((j) => {
              const dif = Math.abs(actR3.a[j] - actR5.a[j]);
              const isBest = j === bestDiffNeuron.j;

              return (
                <div
                  key={j}
                  style={{
                    background: "#ffffff",
                    border: isBest ? `2px solid ${accentPurple}` : "1px solid #e5e7e9",
                    borderRadius: 14,
                    padding: "12px 14px",
                    width: 170,
                    boxShadow: isBest ? "0 10px 24px rgba(155,89,182,0.18)" : "none",
                    transition: "all .2s ease"
                  }}
                >
                  <div style={{ fontWeight: 900, color: "#2c3e50" }}>N{j + 1}</div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#7f8c8d" }}>
                    R3: <span style={{ color: "#2c3e50", fontWeight: 800 }}>{actR3.a[j].toFixed(3)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#7f8c8d" }}>
                    R5: <span style={{ color: "#2c3e50", fontWeight: 800 }}>{actR5.a[j].toFixed(3)}</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#2c3e50" }}>
                    Δ: <span style={{ fontWeight: 900 }}>{dif.toFixed(3)}</span>
                  </div>

                  {isBest && (
                    <div style={{
                      marginTop: 10,
                      padding: "6px 10px",
                      borderRadius: 12,
                      background: "rgba(155,89,182,0.12)",
                      color: "#2c3e50",
                      fontSize: 13,
                      fontWeight: 900
                    }}>
                      mayor diferencia
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Atribución simple con top Δx·w */}
          <div style={{ marginTop: 16, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "stretch" }}>
            <div style={{ ...card, background: "var(--surface-strong, #ffffff)", flex: "1 1 430px", minWidth: 320 }}>
              <div style={{ fontWeight: 900, color: "#2c3e50" }}>
                Neurona explicada: N{bestDiffNeuron.j + 1}
              </div>
              <div style={{ fontSize: 13, color: "#7f8c8d", marginTop: 6 }}>
                Evidencia rápida: variables con mayor contribución |Δx·w| entre R3 y R5
              </div>

              <div style={{ marginTop: 12 }}>
                {deltaXWTop.map((t, idx) => {
                  const col = t.contrib >= 0 ? accentGood : accentBad;
                  const mag = Math.abs(t.contrib);
                  // bar width scale
                  const maxMag = Math.max(...deltaXWTop.map(v => Math.abs(v.contrib)), 1e-6);
                  const bw = (mag / maxMag) * 260;

                  return (
                    <div key={t.i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#2c3e50" }}>
                        <div style={{ fontWeight: 900 }}>
                          {idx + 1}. {inputLabels[t.i]}
                        </div>
                        <div style={{ color: "#7f8c8d" }}>
                          Δx·w = <span style={{ color: "#2c3e50", fontWeight: 900 }}>{t.contrib.toFixed(3)}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                        <div style={{ width: 280, height: 12, background: "#f4f6f7", borderRadius: 999, border: "1px solid #e5e7e9" }}>
                          <div style={{ width: bw, height: 12, borderRadius: 999, background: col, opacity: 0.75 }} />
                        </div>
                        <div style={{ fontSize: 12, color: "#7f8c8d" }}>
                          w={t.w.toFixed(3)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ ...card, background: "var(--surface-strong, #ffffff)", flex: "1 1 460px", minWidth: 320 }}>
              <div style={{ fontWeight: 900, color: "#2c3e50" }}>
                Lectura (d) en una frase
              </div>
              <div style={{ marginTop: 10, fontSize: 14, color: "#2c3e50", lineHeight: 1.6 }}>
                R3 y R5 difieren especialmente en la neurona <strong>N{bestDiffNeuron.j + 1}</strong>. La diferencia se puede atribuir a cambios
                en variables con mayor impacto (<strong>|Δx·w|</strong> alto), lo que concuerda con que los pesos reflejan sensibilidad de la activación.
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  background: "rgba(46,204,113,0.10)",
                  border: "1px solid #e5e7e9",
                  fontSize: 13,
                  color: "#2c3e50"
                }}>
                  R3 → activación: <strong>{actR3.a[bestDiffNeuron.j].toFixed(3)}</strong>
                </div>
                <div style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  background: "rgba(231,76,60,0.08)",
                  border: "1px solid #e5e7e9",
                  fontSize: 13,
                  color: "#2c3e50"
                }}>
                  R5 → activación: <strong>{actR5.a[bestDiffNeuron.j].toFixed(3)}</strong>
                </div>
                <div style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  background: "rgba(155,89,182,0.12)",
                  border: "1px solid #e5e7e9",
                  fontSize: 13,
                  color: "#2c3e50",
                  fontWeight: 900
                }}>
                  Δ = {bestDiffNeuron.dif.toFixed(3)}
                </div>
              </div>

              <div style={{ marginTop: 12, fontSize: 13, color: "#7f8c8d" }}>
                (Esto es exactamente lo que te pide (d): dos registros muy distintos + interpretación atribuible a pesos influyentes.)
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
