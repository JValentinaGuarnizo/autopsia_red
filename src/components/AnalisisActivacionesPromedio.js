import React, { useMemo } from "react";

export default function AnalisisActivacionesPromedio() {
  const layers = [
    {
      name: "Oculta 1",
      neurons: ["N1", "N2", "N3", "N4"],
      avg: [0.0, 0.058151, 5.982931, 0.00092372],
      max: [0.0, 2.1383815, 9.6762905, 0.63340956],
      min: [0.0, 0.0, 1.3298079, 0.0],
    },
    {
      name: "Oculta 2",
      neurons: ["H1", "H2"],
      avg: [0.0, 0.0],
      max: [0.0, 0.0],
      min: [0.0, 0.0],
    },
    {
      name: "Salida",
      neurons: ["O1"],
      avg: [0.37748864],
      max: [0.3774887],
      min: [0.3774887],
    },
  ];

  const fmt = (v) => Number(v).toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  const isNearZero = (v) => Math.abs(v) < 1e-3;

  const summary = useMemo(() => {
    const oc2 = layers.find((l) => l.name === "Oculta 2");
    const oc2AllZero = oc2 && oc2.avg.every(isNearZero) && oc2.max.every(isNearZero);
    const oc1 = layers.find((l) => l.name === "Oculta 1");
    const oc1Dominant = oc1 ? oc1.avg.findIndex((v) => v === Math.max(...oc1.avg)) : -1;
    return { oc2AllZero, oc1Dominant };
  }, []);

  const card = {
    background: "var(--panel-soft, #f4f6f7)",
    border: "1px solid var(--panel-line, #e5e7e9)",
    borderRadius: 16,
    padding: "16px 18px",
    color: "var(--text-main, #2c3e50)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  };

  const pill = (tone) => ({
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid var(--panel-line, #e5e7e9)",
    background:
      tone === "good"
        ? "rgba(15, 127, 134, 0.12)"
        : tone === "warn"
        ? "rgba(231, 76, 60, 0.10)"
        : "rgba(15, 95, 153, 0.10)",
    color: "var(--text-main, #2c3e50)",
    fontSize: 13,
    fontWeight: 700,
  });

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ ...card }}>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8 }}>
          Reporte de activaciones promedio por neurona
        </div>
        <div style={{ color: "var(--text-muted, #7f8c8d)", fontSize: 14 }}>
          Resumen con promedio, máximo y mínimo de activación por capa.
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={pill("good")}>
            Oculta 1 domina en N{summary.oc1Dominant + 1}
          </div>
          <div style={pill(summary.oc2AllZero ? "warn" : "info")}>
            Oculta 2 {summary.oc2AllZero ? "sin activación" : "con actividad"}
          </div>
          <div style={pill("info")}>Salida estable</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {layers.map((layer) => {
          const scale = Math.max(...layer.avg, 1e-6);
          return (
            <div key={layer.name} style={{ ...card }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>{layer.name}</div>

              <div style={{ display: "grid", gap: 10 }}>
                {layer.neurons.map((label, idx) => {
                  const avg = layer.avg[idx];
                  const max = layer.max[idx];
                  const min = layer.min[idx];
                  const width = Math.min(100, (avg / scale) * 100);
                  const muted = isNearZero(avg);

                  return (
                    <div key={label} style={{ display: "grid", gap: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <div style={{ fontWeight: 700, color: muted ? "#a0a8b0" : "#2c3e50" }}>
                          {label}
                        </div>
                        <div style={{ color: muted ? "#a0a8b0" : "#2c3e50" }}>
                          avg {fmt(avg)}
                        </div>
                      </div>
                      <div
                        style={{
                          height: 10,
                          borderRadius: 999,
                          background: "var(--panel-line, #e5e7e9)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${width}%`,
                            height: "100%",
                            background: muted ? "#cbd5e1" : "var(--accent, #0d7f86)",
                            transition: "width 0.2s ease",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text-muted, #7f8c8d)" }}>
                        <span>min {fmt(min)}</span>
                        <span>max {fmt(max)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
