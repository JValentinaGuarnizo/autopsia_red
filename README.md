# Autopsia Red Neuronal (Prototipo Mínimo)

Este es un **prototipo mínimo funcional** de la sección "Radiografía del script `deep.py`" para una red neuronal, desarrollado para explorar visualmente una simulación inicial de estructura y pesos con **Next.js** y **React**.

## Características de la Prueba de Concepto

1. **Red Neuronal:** Representación SVG interactiva de 3 entradas, 4 nodos ocultos y 1 nodo de salida.
2. **Heatmap de Pesos Iniciales:** Matriz simulada 3x4 que colorea rojo para valores positivos y azul para negativos, con opacidad proporcional a su magnitud.

> **Nota aclaratoria:** Los datos aquí representados (*pesos y arquitectura*) son completamente **simulados** en este prototipo, y tampoco hay animaciones complejas ni cálculos en vivo. Servirá como esquema para luego integrar datos exportados (`JSON` o imágenes) por el notebook.

## Estructura del Proyecto

```text
autopsia-red/
├── public/                 # Imágenes y assets estáticos
├── src/
│   ├── components/         # Componentes core
│   │   ├── RedNeuronal.js  # Componente de la Red (Círculos SVG)
│   │   └── Heatmap.js      # Matriz simulada de los pesos
│   ├── pages/
│   │   ├── _app.js         # Entrada global
│   │   └── index.js        # Página principal
│   └── styles/
│       └── globals.css     # Estilos base (Background Oscuro / Modo Oscuro)
├── package.json            # Dependencias del proyecto
└── README.md               # Este archivo
```

## Instrucciones para ejecutarlo localmente

1. Navega a la carpeta del proyecto en tu terminal:
   ```bash
   cd autopsia_red
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador y dirígete a `http://localhost:3000`. Deberías ver el dashboard inicial.

## Instrucciones para conectar a GitHub y Desplegar en Vercel

### 1. Subir tu código a GitHub

Primero sube tu proyecto local recién creado a un nuevo repositorio de GitHub:

```bash
git init
git add .
git commit -m "Inicializar prototipo de autopsia-red"
git branch -M main
git remote add origin https://github.com/tu-usuario/autopsia-red.git
git push -u origin main
```

*(Recuerda crear primero el repositorio vacío en GitHub desde la web)*

### 2. Desplegar en Vercel

Vercel está optimizado para Next.js. El proceso más sencillo es conectar tu cuenta de GitHub a Vercel:

1. Ve a [Vercel](https://vercel.com/) y entra o crea tu cuenta.
2. En tu dashboard, haz clic en **"Add New..."** -> **"Project"**.
3. Te pedirá importar un repositorio de Git. Elige y autoriza tu repositorio `autopsia-red` recién creado de GitHub.
4. El framework preset, `Next.js`, será detectado automáticamente.
5. Haz clic en **"Deploy"**.

Tardará aproximadamente uno o dos minutos, ¡y luego tendrás un enlace público y funcional!
