import React, { useMemo, useState } from "react";
import { theme, DarkCard, LightPanel } from "../styles/theme";

export default function AnalisisPesosAntesDespuesMejorado() {
  const inputLabels = ["Preg", "Gluc", "Pres", "Plieg", "Insul", "IMC", "Pedig", "Edad"];
  const h1Labels = ["N1", "N2", "N3", "N4"];
  const h2Labels = ["H1", "H2"];
  const outLabels = ["O1"];

  // ==================== PESOS Y SESGOS (ANTES vs DESPUÉS) ====================
  const W1_before = [
    [0.0089908, -0.903843, 0.05888554, 0.46141556],
    [-0.01216873, 0.06711774, -0.00318203, -0.0823064],
    [-0.02683203, 0.5853077, -0.22790733, 0.06818139],
    [0.4540369, -0.7764386, -0.30975458, -0.07408736],
    [0.18428768, 0.13714834, 0.7871793, 0.5319509],
    [0.549542, -0.73598486, -0.29959017, 0.55642337],
    [0.50345755, 0.41924262, -0.6453232, -1.0868423],
    [0.6922084, -0.6189911, -0.30122826, 0.4758887]
  ];

  const W1_after = [
    [-0.16139945, -0.62433326, -0.04223842, 0.13126098],
    [0.46537235, -0.29361084, -0.60242856, 0.5252675],
    [-0.02884118, 0.45421892, -0.26369917, -0.20380513],
    [0.11620278, -0.5893649, -0.24052233, -0.62186086],
    [0.2955946, 0.30955124, 0.5497323, 0.46467063],
    [0.5039663, -0.8880986, -0.2792889, 0.28231946],
    [0.666122, 0.40894002, -0.5660965, -0.9346113],
    [0.4219358, -0.79326355, -0.37209475, -0.05634119]
  ];

  const W2_before = [
    [0.01271491, -1.278227],
    [0.08327673, 0.65254015],
    [-0.01720918, 0.09491881],
    [-0.00450007, -0.11639883]
  ];

  const W2_after = [
    [-0.03858793, -1.3908931],
    [0.02857971, 0.425188],
    [0.08346922, 0.20941724],
    [-0.0585599, -0.28768224]
  ];

  const Wout_before = [[-0.21333015], [-0.20117033]];
  const Wout_after = [[-0.67387855], [-0.59220254]];

  const b1_before = [0.0, 0.0, 0.0, 0.0];
  const b1_after = [0.3004001, -0.47274107, -0.16322827, 0.58526754];
  const b2_before = [0.0, 0.0];
  const b2_after = [0.17435011, 0.04571007];
  const bout_before = [0.0];
  const bout_after = [-0.17964701];

  const [highlightMax, setHighlightMax] = useState(true);

  const layers = useMemo(() => {
    const delta = (after, before) =>
      after.map((row, i) => row.map((v, j) => v - before[i][j]));
    return [
      {
        name: "Oculta 1",
        rows: inputLabels,
        cols: h1Labels,
        before: W1_before,
        after: W1_after,
        diff: delta(W1_after, W1_before),
      },
      {
        name: "Oculta 2",
        rows: h1Labels,
        cols: h2Labels,
        before: W2_before,
        after: W2_after,
        diff: delta(W2_after, W2_before),
      },
      {
        name: "Salida",
        rows: h2Labels,
        cols: outLabels,
        before: Wout_before,
        after: Wout_after,
        diff: delta(Wout_after, Wout_before),
      },
    ];
  }, []);

  const fmt = (v) => Number(v).toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  const fmt2 = (v) => Number(v).toFixed(4);
  const maxAbs = (m) => Math.max(...m.flat().map((v) => Math.abs(v)), 1e-9);
  const frob = (m) => Math.sqrt(m.flat().reduce((acc, v) => acc + v * v, 0));
  const meanAbs = (m) => m.flat().reduce((acc, v) => acc + Math.abs(v), 0) / m.flat().length;

  const chip = (active) => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.borderDark}`,
    background: active ? theme.accentPos : theme.borderDark,
    color: active ? theme.textOnLight : theme.mutedOnDark,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 800,
  });

  const BiasRow = ({ name, before, after }) => {
    const diffs = before.map((v, i) => after[i] - v);
    const hasChange = diffs.some((d) => Math.abs(d) > 1e-9);
    return (
      <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
        <div style={{ fontWeight: 800, color: theme.textOnLight }}>{name}</div>
        <div style={{ color: theme.mutedOnLight }}>
          before [{before.map(fmt).join(", ")}]
        </div>
        <div style={{ color: theme.mutedOnLight }}>
          after  [{after.map(fmt).join(", ")}]
        </div>
        <div style={{ color: hasChange ? theme.textOnLight : theme.mutedOnLight, fontWeight: 700 }}>
          Δ [{diffs.map(fmt).join(", ")}]
        </div>
      </div>
    );
  };

  const Heatmap = ({ title, matrix, rows, cols, highlight }) => {
    const scale = maxAbs(matrix);
    const cell = 56;
    const rowLabel = 96;
    const gap = 6;
    const gridStyle = {
      display: "grid",
      gridTemplateColumns: `${rowLabel}px repeat(${cols.length}, ${cell}px)`,
      columnGap: gap,
      rowGap: gap,
      alignItems: "center",
      fontSize: 14,
    };

    return (
      <div style={{ ...LightPanel, padding: "12px 14px" }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: theme.textOnLight }}>{title}</div>
        <div style={gridStyle}>
          <div />
          {cols.map((c) => (
            <div key={`c-${c}`} style={{ fontWeight: 700, textAlign: "center", color: theme.textOnLight }}>
              {c}
            </div>
          ))}
          {rows.map((r, i) => (
            <React.Fragment key={`r-${r}`}>
              <div style={{ fontWeight: 700, textAlign: "right", paddingRight: 4, color: theme.textOnLight }}>{r}</div>
              {cols.map((c, j) => {
                const v = matrix[i][j];
                const intensity = Math.min(1, Math.abs(v) / scale);
                const neutral = Math.abs(v) < 1e-9;
                const base = v >= 0 ? [0, 194, 168] : [229, 72, 77]; // Nuevos tokens accentPos/Neg en RGB aproximado
                const fill = neutral
                  ? theme.surfaceAlt
                  : `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${0.18 + intensity * 0.72})`;
                const isHighlight = highlight && highlight.i === i && highlight.j === j;
                const textColor = neutral ? theme.textSecondary : theme.textPrimary;

                return (
                  <div
                    key={`${i}-${j}`}
                    title={fmt(v)}
                    style={{
                      width: cell,
                      height: cell,
                      borderRadius: 8,
                      background: fill,
                      border: isHighlight ? `2px solid ${theme.accentPos}` : `1px solid ${theme.borderLight}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: textColor,
                      fontWeight: 700,
                    }}
                  >
                    {fmt2(v)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ ...DarkCard }}>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8 }}>
          Comparación visual de pesos (antes vs después)
        </div>
        <div style={{ color: theme.mutedOnDark, fontSize: 14 }}>
          Una fila por capa con heatmaps: Antes, Después y Delta (Δ).
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={chip(highlightMax)} onClick={() => setHighlightMax((v) => !v)}>
            {highlightMax ? "Ocultar max Δ" : "Resaltar max Δ"}
          </button>
        </div>
      </div>

      {layers.map((layer) => {
        const maxDelta = maxAbs(layer.diff);
        let maxCell = null;
        if (highlightMax && maxDelta > 0) {
          let best = { i: 0, j: 0, v: 0 };
          layer.diff.forEach((row, i) => {
            row.forEach((v, j) => {
              if (Math.abs(v) > Math.abs(best.v)) best = { i, j, v };
            });
          });
          maxCell = best;
        }

        return (
          <div key={layer.name} style={{ ...DarkCard }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontWeight: 900 }}>{layer.name}</div>
              <div style={{ fontSize: 13, color: theme.mutedOnDark }}>
                ||ΔW||F = {fmt(frob(layer.diff))} · mean|ΔW| = {fmt(meanAbs(layer.diff))}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
                marginTop: 12,
              }}
            >
              <Heatmap title="Antes" matrix={layer.before} rows={layer.rows} cols={layer.cols} />
              <Heatmap title="Después" matrix={layer.after} rows={layer.rows} cols={layer.cols} />
              <Heatmap title="Δ (Después - Antes)" matrix={layer.diff} rows={layer.rows} cols={layer.cols} highlight={maxCell} />
            </div>
          </div>
        );
      })}

      <div style={{ ...DarkCard }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Cambios en sesgos</div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div style={{ ...LightPanel }}>
            <BiasRow name="b1 (Oculta 1)" before={b1_before} after={b1_after} />
          </div>
          <div style={{ ...LightPanel }}>
            <BiasRow name="b2 (Oculta 2)" before={b2_before} after={b2_after} />
          </div>
          <div style={{ ...LightPanel }}>
            <BiasRow name="b_out (Salida)" before={bout_before} after={bout_after} />
          </div>
        </div>
      </div>
    </div>
  );
}
