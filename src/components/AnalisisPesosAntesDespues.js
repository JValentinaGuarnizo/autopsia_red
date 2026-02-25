import React, { useMemo, useState } from "react";

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
    [-0.02175668, -0.00015831, 0.02154585, -0.0479798],
    [-0.04214019, 0.01265594, 0.02549983, -0.03267942],
    [-0.03712874, -0.04473295, 0.04425292, -0.02695481],
    [-0.00224584, -0.02534449, 0.0224576, 0.02690658],
    [0.00369109, -0.03312949, 0.00028085, -0.03000574],
    [-0.04647031, -0.01872196, -0.00256057, 0.00597994],
    [0.03235373, 0.00913667, -0.01797307, 0.02625214],
    [-0.03742474, 0.00980286, -0.01972204, 0.03528589],
  ];

  const W2_before = [
    [-0.9949689, -0.8087852],
    [-0.10447884, -0.9095397],
    [-0.1425693, -0.39454937],
    [-0.6364999, -0.13915944],
  ];

  const W2_after = [
    [-0.9949689, -0.8087852],
    [-0.10447884, -0.9095397],
    [-0.1425693, -0.39454937],
    [-0.6364999, -0.13915944],
  ];

  const Wout_before = [[0.11023283], [-0.80309635]];
  const Wout_after = [[0.11023283], [-0.80309635]];

  const b1_before = [-0.02175668, -0.00015831, 0.02154585, -0.0479798];
  const b1_after = [-0.02175668, -0.00015831, 0.02154585, -0.0479798];
  const b2_before = [0.0, 0.0];
  const b2_after = [0.0, 0.0];
  const bout_before = [0.0];
  const bout_after = [-0.50022095];

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
  const fmt2 = (v) => Number(v).toFixed(2);
  const maxAbs = (m) => Math.max(...m.flat().map((v) => Math.abs(v)), 1e-9);
  const frob = (m) => Math.sqrt(m.flat().reduce((acc, v) => acc + v * v, 0));
  const meanAbs = (m) => m.flat().reduce((acc, v) => acc + Math.abs(v), 0) / m.flat().length;

  const card = {
    background: "var(--panel-soft, #f4f6f7)",
    border: "1px solid var(--panel-line, #e5e7e9)",
    borderRadius: 16,
    padding: "16px 18px",
    color: "var(--text-main, #2c3e50)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  };

  const chip = (active) => ({
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid var(--panel-line, #d5d8dc)",
    background: active ? "var(--accent-soft, #2c3e50)" : "var(--panel-soft, #f4f6f7)",
    color: active ? "#ffffff" : "var(--text-main, #2c3e50)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
  });

  const BiasRow = ({ name, before, after }) => {
    const diffs = before.map((v, i) => after[i] - v);
    const hasChange = diffs.some((d) => Math.abs(d) > 1e-9);
    return (
      <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
        <div style={{ fontWeight: 800 }}>{name}</div>
        <div style={{ color: "var(--text-muted, #7f8c8d)" }}>
          before [{before.map(fmt).join(", ")}]
        </div>
        <div style={{ color: "var(--text-muted, #7f8c8d)" }}>
          after  [{after.map(fmt).join(", ")}]
        </div>
        <div style={{ color: hasChange ? "#2c3e50" : "#7f8c8d", fontWeight: 700 }}>
          Δ [{diffs.map(fmt).join(", ")}]
        </div>
      </div>
    );
  };

  const Heatmap = ({ title, matrix, rows, cols, highlight }) => {
    const scale = maxAbs(matrix);
    const cell = 34;
    const rowLabel = 78;
    const gap = 6;
    const gridStyle = {
      display: "grid",
      gridTemplateColumns: `${rowLabel}px repeat(${cols.length}, ${cell}px)`,
      columnGap: gap,
      rowGap: gap,
      alignItems: "center",
      fontSize: 12,
    };

    return (
      <div style={{ ...card, padding: "12px 14px" }}>
        <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>{title}</div>
        <div style={gridStyle}>
          <div />
          {cols.map((c) => (
            <div key={`c-${c}`} style={{ fontWeight: 700, textAlign: "center" }}>
              {c}
            </div>
          ))}
          {rows.map((r, i) => (
            <React.Fragment key={`r-${r}`}>
              <div style={{ fontWeight: 700, textAlign: "right", paddingRight: 4 }}>{r}</div>
              {cols.map((c, j) => {
                const v = matrix[i][j];
                const intensity = Math.min(1, Math.abs(v) / scale);
                const neutral = Math.abs(v) < 1e-9;
                const base = v >= 0 ? [46, 204, 113] : [231, 76, 60];
                const fill = neutral
                  ? "rgba(203, 213, 225, 0.45)"
                  : `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${0.15 + intensity * 0.75})`;
                const isHighlight = highlight && highlight.i === i && highlight.j === j;

                return (
                  <div
                    key={`${i}-${j}`}
                    title={fmt(v)}
                    style={{
                      width: cell,
                      height: cell,
                      borderRadius: 8,
                      background: fill,
                      border: isHighlight ? "2px solid var(--accent, #0d7f86)" : "1px solid var(--panel-line, #e5e7e9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: "#1f2937",
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
      <div style={{ ...card }}>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8 }}>
          Comparación visual de pesos (antes vs después)
        </div>
        <div style={{ color: "var(--text-muted, #7f8c8d)", fontSize: 14 }}>
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
          <div key={layer.name} style={{ ...card }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontWeight: 900 }}>{layer.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted, #7f8c8d)" }}>
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

      <div style={{ ...card }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Cambios en sesgos</div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <BiasRow name="b1 (Oculta 1)" before={b1_before} after={b1_after} />
          <BiasRow name="b2 (Oculta 2)" before={b2_before} after={b2_after} />
          <BiasRow name="b_out (Salida)" before={bout_before} after={bout_after} />
        </div>
      </div>
    </div>
  );
}
