export const pipelineSteps = [
    {
        id: 1,
        shortLabel: "Problema",
        title: "1. Entendimiento del Problema",
        objective: "Definir el objetivo del modelo y entender la naturaleza de los datos médicos.",
        bullets: [
            "Problema de clasificación binaria: predecir si un paciente tendrá diabetes o no.",
            "Dataset: Pima Indians Diabetes de la Universidad de California Irvine.",
            "Uso de 8 variables predictoras (embarazos, glucosa, presión, etc.).",
            "Variable objetivo: 'Outcome' o 'Target' (0 para negativo, 1 para positivo)."
        ],
        tags: ["Definición", "Contexto"]
    },
    {
        id: 2,
        shortLabel: "EDA",
        title: "2. Análisis Exploratorio de Datos (EDA)",
        objective: "Explorar la distribución de las variables y la relación entre ellas.",
        bullets: [
            "Carga de datos y revisión de estadísticas descriptivas (media, desviación, etc.).",
            "Visualización de distribuciones mediante histogramas y diagramas de densidad.",
            "Análisis de desbalance de clases (más casos negativos que positivos en el dataset).",
            "Identificación de correlaciones iniciales entre variables."
        ],
        images: [
            { src: "/images/pipeline/eda_histograms.png", alt: "Distribución de variables (Histogramas)" },
            { src: "/images/pipeline/eda_boxplots.png", alt: "Análisis de Outliers y Target (Boxplots)" }
        ],
        tags: ["EDA", "Estadística"]
    },
    {
        id: 3,
        shortLabel: "Ceros→NaN",
        title: "3. Identificación de Valores Imposibles",
        objective: "Detectar y marcar datos que son biológicamente imposibles como nulos.",
        bullets: [
            "Identificación de valores '0' en columnas críticas como Glucosa, Presión, Piel, Insulina e IMC.",
            "Conversión de estos ceros a NaN (Not a Number) para evitar sesgos en el entrenamiento.",
            "Cuantificación del impacto: algunas columnas tienen más del 40% de datos faltantes.",
            "Decisión: No eliminar filas, sino prepararlas para imputación inteligente."
        ],
        tags: ["Limpieza", "Calidad"]
    },
    {
        id: 4,
        shortLabel: "Split",
        title: "4. Split Estratificado",
        objective: "Dividir los datos para entrenamiento y validación manteniendo la proporción de clases.",
        bullets: [
            "Separación del dataset en conjunto de Entrenamiento (80%) y Prueba (20%).",
            "Uso de 'Stratify' para asegurar que la tasa de diabetes sea igual en ambos conjuntos.",
            "Garantiza que el modelo se evalúe con una muestra representativa de la realidad.",
            "Evita el 'Data Leakage' al separar antes de realizar imputaciones complejas."
        ],
        tags: ["Muestreo", "Split"]
    },
    {
        id: 5,
        shortLabel: "Imputación",
        title: "5. Imputación de Datos",
        objective: "Rellenar los valores nulos con estrategias estadísticas avanzadas.",
        bullets: [
            "SimpleImputer (Mediana) para variables con pocos faltantes como Glucosa y Presión.",
            "IterativeImputer (Regresión) con RandomForest para variables complejas como Insulina y Piel.",
            "La imputación multivariable usa las otras columnas para predecir el valor más probable.",
            "Asegura una base de datos completa sin destruir la variabilidad natural."
        ],
        tags: ["Imputación", "RandomForest"]
    },
    {
        id: 6,
        shortLabel: "Outliers",
        title: "6. Manejo de Outliers",
        objective: "Identificar y tratar valores extremos que puedan confundir al modelo.",
        bullets: [
            "Uso de Isolation Forest para detectar registros anómalos de forma automática.",
            "Estrategia de Winsorization: recortar valores fuera de los percentiles 5 y 95.",
            "Ajuste de límites basado únicamente en los datos de entrenamiento (Inliers).",
            "Mejora la robustez del modelo frente a lecturas médicas extremas o erróneas."
        ],
        tags: ["Outliers", "Winsor"]
    },
    {
        id: 7,
        shortLabel: "Escalado",
        title: "7. Escalado de Características",
        objective: "Normalizar las variables para que todas tengan el mismo peso relativo.",
        bullets: [
            "Uso de StandardScaler para centrar la media en 0 y la desviación estándar en 1.",
            "Crucial para redes neuronales y algoritmos basados en distancias (como KNN).",
            "Aplica el escalador entrenado en 'Train' a los datos de 'Test' para evitar sesgos.",
            "Transforma unidades dispares (años, mg/dL, mmHg) a una escala comparable."
        ],
        tags: ["Escalado", "Estandarización"]
    },
    {
        id: 8,
        shortLabel: "MLP",
        title: "8. Arquitectura MLP y Entrenamiento",
        objective: "Construir y entrenar la Red Neuronal multicapa (Multi-Layer Perceptron).",
        bullets: [
            "Arquitectura: 32 -> 16 -> 8 neuronas con activación ReLU.",
            "Uso de BatchNormalization y Dropout para evitar el sobreentrenamiento (overfitting).",
            "Configuración de pesos de clase (Class Weights) para manejar el desbalance.",
            "Implementación de Early Stopping para detener el entrenamiento en el punto óptimo."
        ],
        tags: ["Deep Learning", "MLP"]
    },
    {
        id: 9,
        shortLabel: "Test",
        title: "9. Evaluación Final",
        objective: "Medir el rendimiento real del modelo con datos que nunca ha visto.",
        bullets: [
            "Evaluación con métricas de Accuracy (Precisión total) y Recall (Sensibilidad).",
            "Análisis de la Matriz de Confusión para ver Falsos Positivos vs Falsos Negativos.",
            "Comparativa de resultados con y sin validación cruzada (Cross-Validation).",
            "Asegura un modelo confiable para diagnóstico médico preliminar."
        ],
        metrics: {
            testAccuracy: "0.74 (Aproximado)",
            testRecall: "0.74 (Aproximado)",
            cvAccuracy: "0.73 (+/- 0.02)",
            cvRecall: "0.70 (+/- 0.04)"
        },
        tags: ["Evaluación", "Métricas"]
    }
];
