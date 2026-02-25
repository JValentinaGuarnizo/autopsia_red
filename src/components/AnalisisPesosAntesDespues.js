import React, { useMemo, useState } from "react";
import { theme, DarkCard, LightPanel } from "../styles/theme";

export default function AnalisisPesosAntesDespues() {
  const inputLabels = ["Preg", "Gluc", "Pres", "Plieg", "Insul", "IMC", "Pedig", "Edad"];
  const h1Labels = ["N1", "N2", "N3", "N4"];
  const h2Labels = ["H1", "H2"];
  const outLabels = ["O1"];

  // ==================== PESOS Y SESGOS (ANTES vs DESPUÉS) ====================
  const W1_before = [
    [-0.02175668, -0.00015831, 0.02154585, -0.0479798],
    [-0.04214019, 0.01265594, 0.02549983, -0.03267942],
    [-0.03712874, -0.04473295, 0.04425292, -0.02695481],
    [-0.00224584, -0.02534449, 0.0224576, 0.02690658],
    [0.00369109, -0.03312949, 0.00028085, -0.03000574],
    [-0.04647031, -0.01872196, -0.00256057, 0.00597994],
    [0.03235373, 0.00913667, -0.01797307, 0.02625214],
    [-0.03742474, 0.00980286, -0.01972204, 0.03528589],
  ];

  const W1_after = [
    [-0.02175668, -0.00988065, -0.3175064, -0.05379025],
    [-0.04214019, -0.00496481, -0.11167107, -0.03267942],
    [-0.03712874, -0.04473295, 0.29952776, -0.03325341],
    [-0.00224584, -0.03042296, 0.15230004, 0.02062371],
    [0.00369109, -0.03312949, -0.03970124, -0.03000574],
    [-0.04647031, -0.03201645, 0.06163074, -0.00030806],
    [0.03235373, -0.00284468, -0.14360611, 0.0223425],
    [-0.03742474, -0.00794955, -0.01300016, 0.02900057],
  ];

  const W2_before = [
    [-0.02175668, -0.00015831],
    [0.02154585, -0.0479798],
    [-0.04214019, 0.01265594],
    [0.02549983, -0.03267942],
  ];

  const W2_after = [
    [-0.02175668, -0.00015831],
    [0.02154585, -0.02968187],
    [-0.04214019, 0.2013928],
    [0.02549983, -0.02659439],
  ];

  const Wout_before = [[-0.02175668], [-0.00015831]];
  const Wout_after = [[-0.02175668], [-0.19202235]];

  const b1_before = [-0.02175668, -0.00015831, 0.02154585, -0.0479798];
  const b1_after = [-0.02175668, -0.01665724, 0.4204217, -0.05379025];
  const b2_before = [0.0, 0.0];
  const b2_after = [0.0, 0.31476262];
  const bout_before = [0.0];
  const bout_after = [-0.23830743];

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
                const base = v >= 0 ? [0, 245, 196] : [255, 77, 109];
                const fill = neutral
                  ? "#1e293b"
                  : `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${0.18 + intensity * 0.72})`;
                const isHighlight = highlight && highlight.i === i && highlight.j === j;
                const textColor = neutral ? theme.textOnDark : theme.textOnLight;

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
