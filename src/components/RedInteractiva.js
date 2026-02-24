import { useState } from "react";

export default function RedInteractiva() {
    const [activeCell, setActiveCell] = useState(null);
    const [activeBias, setActiveBias] = useState(null);

    const [selectedNeuron, setSelectedNeuron] = useState(null);

    const [modoCalculo, setModoCalculo] = useState(null);
    const [showActivacion, setShowActivacion] = useState(false);


    const inputLabels = [
        "Preg", "Gluc", "Pres", "Plieg",
        "Insul", "IMC", "Pedig", "Edad"
    ];

    const hiddenLabels = ["N1", "N2", "N3", "N4"];

    const weights = [
        [-0.02175668, -0.00015831, 0.02154585, -0.0479798],
        [-0.04214019, 0.01265594, 0.02549983, -0.03267942],
        [-0.03712874, -0.04473295, 0.04425292, -0.02695481],
        [-0.00224584, -0.02534449, 0.0224576, 0.02690658],
        [0.00369109, -0.03312949, 0.00028085, -0.03000574],
        [-0.04647031, -0.01872196, -0.00256057, 0.00597994],
        [0.03235373, 0.00913667, -0.01797307, 0.02625214],
        [-0.03742474, 0.00980286, -0.01972204, 0.03528589]
    ];

    const biases = [-0.022, -0.000, 0.022, -0.048];

    const sumaSinSesgo = [-12.53151488, -2.36888706, 6.79207027, -4.14176706];
    const sumaConSesgo = [-12.55327156, -2.36904537, 6.81361613, -4.18974686];
    const activacion = [0, 0, 6.81361613, 0];

    const width = 900;
    const height = 560;

    const inputX = 112;
    const hiddenX = 630;

    const inputYSpacing = 50;
    const hiddenYSpacing = 110;

    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "40px" }}>

            {/* 🔵 RED GRANDE */}
            <div>

                <div style={{ display: "flex", justifyContent: "space-between", width: "650px" }}>
                    <h4 style={{ fontSize: "15px", color: "#2c3e50" }}>
                        Capa de Entrada
                    </h4>
                    <h4 style={{ fontSize: "15px", color: "#2c3e50" }}>
                        Capa 1
                    </h4>
                </div>

                <svg width={width} height={height}>

                    {/* ARISTAS */}
                    {weights.map((row, i) =>
                        row.map((value, j) => {
                            const x1 = inputX;
                            const y1 = 60 + i * inputYSpacing;
                            const x2 = hiddenX;
                            const y2 = 90 + j * hiddenYSpacing;

                            const isActive =
                                activeCell && activeCell.i === i && activeCell.j === j;

                            return (
                                <g key={`${i}-${j}`}>
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke={isActive ? "#ef5fb2" : "#064056"}
                                        strokeOpacity={isActive ? 1 : 0.25}
                                        strokeWidth={isActive ? 4 : 1}
                                    />
                                    {isActive && (
                                        <text
                                            x={(x1 + x2) / 2}
                                            y={(y1 + y2) / 2}
                                            fill="#ef5fb2"
                                            fontSize="13"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                        >
                                            {value.toFixed(3)}
                                        </text>
                                    )}
                                </g>
                            );
                        })
                    )}

                    {/* ENTRADA */}
                    {inputLabels.map((label, i) => {
                        const y = 60 + i * inputYSpacing;
                        return (
                            <g key={i}>
                                <circle cx={inputX} cy={y} r={20} fill="#84b6f4" />
                                <text
                                    x={inputX - 80}
                                    y={y + 4}
                                    fontSize="13"
                                    textAnchor="end"
                                    fill="#2c3e50"
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* CAPA 1 */}
                    {hiddenLabels.map((label, j) => {
                        const y = 90 + j * hiddenYSpacing;
                        const isBiasActive = activeBias === j;

                        return (
                            <g key={j}>
                                <circle cx={hiddenX} cy={y} r={24} fill="#bc409a" />
                                <text
                                    x={hiddenX}
                                    y={y + 5}
                                    fontSize="14"
                                    textAnchor="middle"
                                    fill="#fff"
                                >
                                    {label}
                                </text>

                                {selectedNeuron === j && modoCalculo && (
                                    <text
                                        x={hiddenX + 80}
                                        y={y}
                                        fill="#2c3e50"
                                        fontSize="14"
                                        fontWeight="600"
                                    >
                                        {modoCalculo === "sin" &&
                                            sumaSinSesgo[j].toFixed(3)
                                        }

                                        {modoCalculo === "bias" && (
                                            <>
                                                <tspan fill="#ef5fb2" fontWeight="bold">
                                                    + ({biases[j].toFixed(3)})
                                                </tspan>
                                            </>
                                        )}

                                        {modoCalculo === "con" && (
                                            <>
                                                <tspan fill="#2c3e50">
                                                    {sumaSinSesgo[j].toFixed(3)} + (
                                                </tspan>

                                                <tspan fill="#ef5fb2" fontWeight="bold">
                                                    {biases[j].toFixed(3)}
                                                </tspan>

                                                <tspan fill="#2c3e50">
                                                    ) = {sumaConSesgo[j].toFixed(3)}
                                                </tspan>
                                            </>
                                        )}
                                    </text>
                                )}


                                {selectedNeuron === j &&
                                    modoCalculo === "con" &&
                                    showActivacion && (
                                        <text
                                            x={hiddenX + 80}
                                            y={y + 22}
                                            fill={activacion[j] > 0 ? "#2ecc71" : "#999"}
                                            fontSize="16"
                                            fontWeight="bold"
                                        >
                                            → {activacion[j] > 0 ? "😃" : "😶"}
                                        </text>
                                    )}

                                {/* MOSTRAR SESGO AL HACER HOVER */}
                                {isBiasActive && (
                                    <text
                                        x={hiddenX + 60}
                                        y={y + 5}
                                        fill="#ef5fb2"
                                        fontSize="14"
                                        fontWeight="bold"
                                    >
                                        + ({biases[j].toFixed(3)})
                                    </text>
                                )}
                            </g>
                        );
                    })}

                </svg>
            </div>

            {/* 🟣 TABLAS MÁS PEQUEÑAS */}
            <div style={{ width: "350px" }}>

                <h3 style={{ color: "#2c3e50", marginBottom: "5px", fontSize: "16px" }}>
                    Función Detalles_capa
                </h3>

                <h4 style={{ color: "#0a607f", marginBottom: "15px", fontWeight: "600", fontSize: "14px" }}>
                    Valores de pesos (Capa 1)
                </h4>

                <table style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                    <tbody>
                        {weights.map((row, i) => (
                            <tr key={i}>
                                {row.map((value, j) => {
                                    const isActive =
                                        activeCell && activeCell.i === i && activeCell.j === j;

                                    return (
                                        <td
                                            key={j}
                                            onMouseEnter={() => setActiveCell({ i, j })}
                                            onMouseLeave={() => setActiveCell(null)}
                                            style={{
                                                padding: "4px 6px",
                                                fontSize: "12px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #eee",
                                                backgroundColor: isActive ? "#ef5fb2" : "#ffffff",
                                                color: isActive ? "#ffffff" : "#2c3e50",
                                                fontWeight: isActive ? "bold" : "500",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            {value.toFixed(3)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* TABLA SESGOS */}
                <h4 style={{ color: "#0a607f", marginTop: "25px", marginBottom: "10px", fontWeight: "600", fontSize: "14px" }}>
                    Valores de sesgos (Capa 1)
                </h4>
                <table style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                    <tbody>
                        <tr>
                            {biases.map((value, j) => {

                                return (
                                    <td
                                        key={j}
                                        onClick={() => {
                                            setSelectedNeuron(j);
                                            setModoCalculo("bias");
                                            setShowActivacion(false);
                                        }}
                                        style={{
                                            padding: "4px 6px",
                                            fontSize: "12px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            border: "1px solid #eee",
                                            backgroundColor:
                                                selectedNeuron === j &&
                                                    (modoCalculo === "bias" || modoCalculo === "con")
                                                    ? "#bc409a"
                                                    : "#ffffff",
                                            color:
                                                selectedNeuron === j &&
                                                    (modoCalculo === "bias" || modoCalculo === "con")
                                                    ? "#ffffff"
                                                    : "#2c3e50",
                                            fontWeight: "600",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        {value.toFixed(3)}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>

                <h3 style={{
                    color: "#2c3e50",
                    marginTop: "30px",
                    fontSize: "16px",
                    fontWeight: "600"
                }}>
                    Función Pasando_por_capa
                </h3>
                <h4 style={{
                    marginTop: "15px",
                    marginBottom: "10px",
                    color: "#0a607f",
                    fontSize: "14px",
                    fontWeight: "600"
                }}>
                    Suma ponderada sin sesgo
                </h4>

                <table style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                    <tbody>
                        <tr>
                            {sumaSinSesgo.map((value, j) => (
                                <td
                                    key={j}
                                    onClick={() => {
                                        setSelectedNeuron(j);
                                        setModoCalculo("sin");
                                        setShowActivacion(false);
                                    }}
                                    style={{
                                        padding: "7px 10px",
                                        fontSize: "13px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        border: "1px solid #eee",
                                        backgroundColor:
                                            selectedNeuron === j &&
                                                (modoCalculo === "sin" || modoCalculo === "con")
                                                ? "#ef5fb2"
                                                : "#ffffff",

                                        color:
                                            selectedNeuron === j &&
                                                (modoCalculo === "sin" || modoCalculo === "con")
                                                ? "#ffffff"
                                                : "#2c3e50",
                                        fontWeight: "600",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {value.toFixed(3)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>

                <h4 style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                    color: "#0a607f",
                    fontSize: "14px",
                    fontWeight: "600"
                }}>
                    Suma ponderada con sesgo
                </h4>

                <table style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                    <tbody>
                        <tr>
                            {sumaConSesgo.map((value, j) => (
                                <td
                                    key={j}
                                    onClick={() => {
                                        setSelectedNeuron(j);
                                        setModoCalculo("con");
                                        setShowActivacion(false);
                                    }}
                                    style={{
                                        padding: "7px 10px",
                                        fontSize: "13px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        border: "1px solid #eee",
                                        backgroundColor:
                                            selectedNeuron === j && modoCalculo === "con"
                                                ? "#bc409a"
                                                : "#ffffff",
                                        color:
                                            selectedNeuron === j && modoCalculo === "con"
                                                ? "#ffffff"
                                                : "#2c3e50",
                                        fontWeight: "600",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {value.toFixed(3)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <h4 style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                    color: "#0a607f",
                    fontSize: "14px",
                    fontWeight: "600"
                }}>
                    Activación (ReLU)
                </h4>

                <table style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                    <tbody>
                        <tr>
                            {activacion.map((value, j) => (
                                <td
                                    key={j}
                                    onClick={() => {
                                        if (modoCalculo === "con") {
                                            setSelectedNeuron(j);
                                            setShowActivacion(true);
                                        }
                                    }}
                                    style={{
                                        padding: "7px 10px",
                                        fontSize: "13px",
                                        textAlign: "center",
                                        cursor: modoCalculo === "con" ? "pointer" : "not-allowed",
                                        border: "1px solid #eee",
                                        backgroundColor:
                                            selectedNeuron === j && showActivacion
                                                ? "#84b6f4"
                                                : "#ffffff",
                                        color:
                                            selectedNeuron === j && showActivacion
                                                ? "#ffffff"
                                                : "#2c3e50",
                                        fontWeight: "600",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {value.toFixed(3)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>


            </div>
        </div>
    );
}