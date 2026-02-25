import React, { useMemo } from "react";

export default function PipelineDiagram({ steps, activeIndex, onNodeClick, isMobile }) {
    // Configuración de layout
    const nodeRadius = 38;
    const padding = 60;

    // Dimensiones según el modo
    const width = isMobile ? 300 : 800;
    const height = isMobile ? 950 : 650;

    // Calculamos posiciones de los nodos basados en el flujo "Snake"
    const nodes = useMemo(() => {
        if (isMobile) {
            // Flujo vertical simple
            return steps.map((s, i) => ({
                ...s,
                x: width / 2,
                y: padding + i * 100
            }));
        } else {
            // Flujo serpenteante (3x3)
            const colWidth = (width - 2 * padding) / 2;
            const rowHeight = (height - 2 * padding) / 2;

            const getCoords = (id) => {
                // Fila 1: 1, 2, 3 (Izquierda a Derecha)
                if (id <= 3) return { x: padding + (id - 1) * colWidth, y: padding };
                // Fila 2: 6, 5, 4 (Derecha a Izquierda para el snake)
                // Pero el orden lógico es 4, 5, 6.
                // Mapeo: 4 -> C1, 5 -> C2, 6 -> C3
                // El snake dice 3 -> 6, luego 6 -> 5 -> 4, luego 4 -> 7
                if (id === 6) return { x: padding + 2 * colWidth, y: padding + rowHeight };
                if (id === 5) return { x: padding + 1 * colWidth, y: padding + rowHeight };
                if (id === 4) return { x: padding + 0 * colWidth, y: padding + rowHeight };
                // Fila 3: 7, 8, 9 (Izquierda a Derecha)
                if (id >= 7) return { x: padding + (id - 7) * colWidth, y: padding + 2 * rowHeight };
                return { x: 0, y: 0 };
            };

            return steps.map(s => ({
                ...s,
                ...getCoords(s.id)
            }));
        }
    }, [steps, isMobile, width, height, padding]);

    // Generamos los paths de conexión
    const paths = useMemo(() => {
        const result = [];
        for (let i = 0; i < nodes.length - 1; i++) {
            const start = nodes.find(n => n.id === i + 1);
            const end = nodes.find(n => n.id === i + 2);
            if (!start || !end) continue;

            let d = "";
            const isActivePath = i + 2 <= activeIndex;

            if (isMobile) {
                d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
            } else {
                // Lógica de curvas para el snake en Desktop
                if (start.id === 3 && end.id === 4) {
                    // No hay conexión directa 3->4 en el dibujo, el dibujo es 3->6
                    // Pero el usuario pidió orden lógico 1..9 resalte.
                    // Entonces el path lógico 3->4 sigue el dibujo 3->6->5->4? 
                    // RE-READ: "el 'snake' es visual, pero el progreso es 1..9"
                    // "3->6 por la derecha y 4->7 por la izquierda"
                    // Esto significa que las líneas físicas van 1-2, 2-3, 3-6, 6-5, 5-4, 4-7, 7-8, 8-9.
                    // Si el usuario llega al paso 4, se resalta hasta el 4.
                    // El orden de las líneas en el array para resaltar debe ser:
                    // L1: 1-2, L2: 2-3, L3: 3-6, L4: 6-5, L5: 5-4, L6: 4-7, L7: 7-8, L8: 8-9.
                }
            }
        }
        return result;
    }, [nodes, activeIndex, isMobile]);

    // Definimos las líneas físicas del diagrama
    const connections = useMemo(() => {
        const connList = [];
        const getActive = (targetId) => targetId <= activeIndex;

        const createPath = (sId, eId, type = "line") => {
            const s = nodes.find(n => n.id === sId);
            const e = nodes.find(n => n.id === eId);
            if (!s || !e) return null;

            let d = "";
            if (type === "curve-right") {
                const cp1x = s.x + 100;
                const cp1y = s.y;
                const cp2x = e.x + 100;
                const cp2y = e.y;
                d = `M ${s.x} ${s.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${e.x} ${e.y}`;
            } else if (type === "curve-left") {
                const cp1x = s.x - 100;
                const cp1y = s.y;
                const cp2x = e.x - 100;
                const cp2y = e.y;
                d = `M ${s.x} ${s.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${e.x} ${e.y}`;
            } else {
                d = `M ${s.x} ${s.y} L ${e.x} ${e.y}`;
            }

            // La lógica de resalte es: si el nodo destino está completado
            // Pero el flujo es 1-2-3-6-5-4-7-8-9.
            return { d, id: `${sId}-${eId}`, active: getActive(eId) };
        };

        if (isMobile) {
            for (let i = 1; i < 9; i++) {
                const s = nodes[i - 1];
                const e = nodes[i];
                connList.push({ d: `M ${s.x} ${s.y} L ${e.x} ${e.y}`, id: i, active: getActive(e.id) });
            }
        } else {
            // Desktop snake
            connList.push({ ...createPath(1, 2), active: getActive(2) });
            connList.push({ ...createPath(2, 3), active: getActive(3) });
            connList.push({ ...createPath(3, 6, "curve-right"), active: getActive(6) });
            connList.push({ ...createPath(6, 5), active: getActive(5) });
            connList.push({ ...createPath(5, 4), active: getActive(4) });
            connList.push({ ...createPath(4, 7, "curve-left"), active: getActive(7) });
            connList.push({ ...createPath(7, 8), active: getActive(8) });
            connList.push({ ...createPath(8, 9), active: getActive(9) });
        }
        return connList;
    }, [nodes, activeIndex, isMobile]);

    return (
        <div className="pipeline-container">
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="pipeline-svg"
            >
                {/* Marcadores de flecha para las líneas */}
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="var(--panel-line)" />
                    </marker>
                    <marker
                        id="arrowhead-active"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)" />
                    </marker>
                </defs>

                {/* Líneas de conexión */}
                {connections.map((conn) => (
                    <path
                        key={conn.id}
                        d={conn.d}
                        className={`pipeline-path ${conn.active ? "highlight" : ""}`}
                        markerEnd={conn.active ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                    />
                ))}

                {/* Nodos */}
                {nodes.map((node) => (
                    <g
                        key={node.id}
                        className={`pipeline-node ${activeIndex === node.id ? "active" : ""}`}
                        onClick={() => onNodeClick(node.id)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onNodeClick(node.id)}
                        tabIndex="0"
                        role="button"
                        aria-label={`Paso ${node.id}: ${node.shortLabel}`}
                        aria-current={activeIndex === node.id ? "step" : undefined}
                    >
                        <circle cx={node.x} cy={node.y} r={nodeRadius} />
                        <text x={node.x} y={node.y} className="pipeline-label">
                            {node.shortLabel}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
