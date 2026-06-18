# Zara Phones Challenge — CLAUDE.md

## Descripción del proyecto y objetivo

Aplicación web de catálogo de teléfonos móviles para la prueba técnica de Inditex/Zara.
Permite visualizar, buscar y gestionar un catálogo de smartphones con carrito de compras persistente.

**Figma diseño:** https://www.figma.com/design/Nuic7ePgOfUQ0hcBrUUQrb/Labs---Zara-Web-Challenge--Smartphones-?node-id=0-1
**Figma prototipo:** https://www.figma.com/proto/Nuic7ePgOfUQ0hcBrUUQrb/Labs---Zara-Web-Challenge--Smartphones-?page-id=1%3A121&node-id=20620-406

---

## Vistas requeridas

### 1. Vista Listado de Teléfonos (`/`)

- Cuadrícula con las primeras **20 tarjetas** de teléfonos devueltos por la API
- Cada tarjeta muestra: imagen, nombre, marca y precio base
- Buscador en tiempo real que filtra por nombre o marca **vía API** (no filtrado local)
- Indicador con el número de resultados encontrados debajo del buscador
- Al hacer clic en una tarjeta, navega a la vista de detalle

### 2. Vista Detalle de Teléfono (`/phone/:id`)

- Nombre y marca del dispositivo
- Imagen grande que cambia dinámicamente según el color seleccionado
- Selector de **almacenamiento** y selector de **color** (actualización del precio en tiempo real)
- Especificaciones técnicas detalladas + precio base + variaciones por almacenamiento
- Botón "Añadir al carrito" **deshabilitado** hasta seleccionar color y almacenamiento
- Sección "Productos similares" al pie de la página

### 3. Vista Carrito (`/cart`)

- Listado de productos añadidos: imagen, nombre, almacenamiento, color y precio individual
- Botón para eliminar cada producto del carrito
- Precio total de la compra
- Botón "Continuar comprando" que redirige a `/`

### Navbar (componente global)

- Icono/logo con enlace a `/`
- Icono de carrito con badge que muestra el número de ítems
- El contador del carrito se actualiza en tiempo real desde Context

---

## Stack tecnológico

### Obligatorio

| Categoría | Elección |
|-----------|----------|
| Framework | React 19 (ya instalado) |
| Routing | React Router DOM v7 (ya instalado) |
| Estilos | SASS (ya instalado) |
| Estado global | React Context API + `useReducer` |
| Node | 18+ |

### Instalaciones pendientes

```bash
# Testing
npm install --save-dev jest-environment-jsdom @testing-library/user-event

# Linting / Formatting (ya instalados: eslint, prettier)
npm install --save-dev eslint-config-prettier eslint-plugin-jsx-a11y
```

### Opcional (no implementar salvo decisión explícita)

- SSR con Next.js
- Despliegue (Vercel, Netlify…)

---

## API

### Base URL

```
https://prueba-tecnica-api-tienda-moviles.onrender.com
```

Endpoints:
- `GET /products` — lista de teléfonos (acepta `?search=query`)
- `GET /products/{id}` — detalle de un teléfono

### Autenticación

Todas las peticiones deben incluir el header:

```
x-api-key: 87909682e6cd74208f41a6ef39fe4191
```

### Wrapper centralizado

Crear `src/services/api.js`:

```js
const BASE_URL = 'https://prueba-tecnica-api-tienda-moviles.onrender.com';
const HEADERS = { 'x-api-key': '87909682e6cd74208f41a6ef39fe4191' };

export const fetchPhones = (search = '') =>
  fetch(`${BASE_URL}/products${search ? `?search=${search}` : ''}`, { headers: HEADERS })
    .then(res => res.json());

export const fetchPhone = id =>
  fetch(`${BASE_URL}/products/${id}`, { headers: HEADERS })
    .then(res => res.json());
```

---

## Design System

> Extraído directamente de la API de Figma — archivo *Labs / Zara Web Challenge (Smartphones)*
> File key: `Nuic7ePgOfUQ0hcBrUUQrb` · Última modificación: 2024-09-18
> Páginas: Cover · Proto · **Design** · Resources

### Tipografía

La fuente del diseño en Figma es **Helvetica Neue** (con la variante licenciada "Neue Helvetica for Zara"). El enunciado indica usar:

```css
font-family: Helvetica, Arial, sans-serif;
```

Todos los textos de la interfaz usan `text-transform: uppercase` o `text-transform: capitalize`.

| Uso | Size | Weight | Line-height | Letter-spacing | Case |
|-----|------|--------|-------------|----------------|------|
| Nombre teléfono (detalle) | 24px | 300 | 29px | 0 | UPPER |
| Precio (detalle) | 20px | 300 | 24px | 0 | TITLE |
| Badge carrito / search input | 16px | 300 | 16–19px | 0 | UPPER |
| Total / precio checkout | 14px | 400 | 17px | 0 | UPPER |
| Precio (tarjeta) | 12px | 300 | 15px | 0 | TITLE |
| Resultados ("20 RESULTS") | 12px | 300 | 15px | 0 | UPPER |
| Botón ("Añadir") | 12px | 300 | 16px | 0.96px | UPPER |
| Nombre/marca (tarjeta) | 12px | 300 | 15px | 0 | UPPER |
| Info carrito (nombre/specs) | 12px | 300 | 15px | 0 | UPPER |
| "Eliminar" (carrito) | 12px | 300 | 15px | 0 | — |

### Paleta de colores

Valores extraídos directamente de los fills y strokes del Figma:

```scss
// ---- CSS custom properties (:root) ----

--color-black:        #000000;   // texto principal, bordes tarjeta, iconos, stroke búsqueda
--color-black-soft:   #1b1a18;   // fondo botón "Añadir al carrito" (near-black)
--color-white:        #ffffff;   // fondo página, fondo navbar, texto en botón
--color-gray-medium:  #aaaaaa;   // placeholder del buscador
--color-gray-light:   #cccccc;   // separadores
--color-gray-lighter: #d9d9d9;   // fondos muy sutiles
--color-error:        #df0000;   // botón "Eliminar" en carrito
--color-badge:        #ec1d24;   // badge contador del carrito
```

### Espaciados (valores exactos del Figma)

```scss
// Basados en los padding y gaps reales de los componentes
--space-xs:   4px;
--space-sm:   8px;
--space-md:  11px;   // gap title+price en detalle
--space-lg:  16px;   // padding tarjeta, padding horizontal mobile
--space-xl:  20px;   // padding vertical botón
--space-2xl: 24px;   // gap imagen→info en tarjeta, header vertical (desktop)
--space-3xl: 32px;   // padding horizontal botón
--space-4xl: 40px;   // gap en cart item, gap selectores
--space-5xl: 64px;   // gap entre grupos en detalle
--space-6xl: 100px;  // padding horizontal header/search (desktop)
```

### Layout y Grid

```
Frames reales del Figma:
  Desktop: 1920px  (padding horizontal: 100px)
  Tablet:   834px
  Mobile:   393px

Grid de tarjetas:
  Desktop: 4 columnas · tarjeta 344×344px · border 0.5px #000000
  Tablet:  3 columnas · tarjeta ~253px
  Mobile:  1 columna  · tarjeta 361×344px

Sin max-width explícito en el Figma — el grid ocupa todo el ancho del viewport.
```

### Navbar / Header

```
height:           80px
background:       #ffffff
padding:          24px 100px  (desktop)
padding mobile:   16px  16px  (inferido del resto del layout)
position:         sticky, top: 0

Elementos:
  — Logo/icono izquierda (SVG negro)
  — Texto "CHALLENGE" centro (20px, w:500)
  — Inditex logo derecha
  — Icono bolsa (bag): 33×26px
      badge: background #ec1d24, 16px w:300, #000000
```

### Tarjeta de teléfono

```
Tamaño:     344×344px (desktop) / 361×344px (mobile)
Padding:    16px (todos los lados)
Border:     0.5px solid #000000
Gap:        24px (imagen → info)
Background: #ffffff

Área imagen: 312×257px (desktop), object-fit: contain
Área info:   312×31px
  — Brand + name (flex column, gap 4px)
  — Price: 12px w:300, #000000, text-transform: capitalize
```

### Buscador

```
Wrapper desktop:  padding 12px 100px · background #ffffff · height 87px
Wrapper mobile:   padding 12px  16px · background #ffffff · height 87px
Gap interno:      12px

Input:
  border:           none
  border-bottom:    1px solid #000000  (stroke visible en mobile)
  font-size:        16px
  font-weight:      300
  placeholder:      "Search for a smartphone..." · color #aaaaaa
  outline:          none
  text-transform:   none (solo el placeholder es lowercase)

Results count:
  font-size:        12px · weight 300 · color #000000 · UPPERCASE
  ejemplo:          "20 RESULTS"
```

### Vista Detalle — layout y componentes

```
Frame desktop: 1920×2364px

Área producto (Product info + Img):
  width:   1200px centrado
  gap:     170px entre imagen e info
  Imagen:  510×630px
  Info:    380×459px

Info panel (gaps internos):
  Title + price:   gap 11px
  Selectores:      gap 40px entre storage y color
  Botón:           al final del panel

Título del teléfono:  24px w:300 UPPER #000000 · line-height 29px
Precio:               20px w:300 TITLE #000000 · line-height 24px
```

### Selectores (storage / color)

```
Área selectores:  144×211px · gap 40px entre storage y color

Storage (144×106px, gap 24px):
  Label:   17px de alto (text pequeño, etiqueta de sección)
  Options: 144×65px (flex wrap, gap inferido)

Color options (144×65px, gap 16px entre swatches):
  Swatch:  24×24px (círculo)
  Gap:     16px entre swatches

(Los estados activo/hover de swatches no tienen valores explícitos en el Figma
 — usar border 2px solid #000000 para seleccionado, border 2px solid transparent para default)
```

### Botón "Añadir al carrito"

```
Width:          380px (detalle) / 260px (checkout cart)
Height:         56px
Background:     #1b1a18
Padding:        20px 32px
Border:         none

Text:           12px · w:300 · letter-spacing 0.96px · UPPERCASE · #ffffff

Disabled (sin color+storage seleccionado):
  background:   #d9d9d9   (gray-lighter)
  color:        #aaaaaa
  cursor:       not-allowed
```

### Vista Carrito — layout

```
Cart item:      548×324px · gap 40px · flex row
  Imagen:       262×324px
  Info + delete: 246×324px · padding 40px top/bottom · gap 40px

Texto ítem:     12px w:300 UPPER #000000
  Nombre:       "galaxy s24 ultra"
  Specs:        "512 GB | violeta titanium"
  Precio:       "1199 EUR"

"Eliminar":     12px w:300 #df0000

Footer (Total + CTA):
  Width:        1460px · gap 80px · height 56px
  "Total":      14px w:400 UPPER #000000
  Importe:      14px w:400 UPPER #000000
  Botón:        mismos estilos que "Añadir al carrito"
```

### Estados interactivos

| Elemento | Normal | Hover | Seleccionado | Disabled |
|----------|--------|-------|--------------|----------|
| Tarjeta | border 0.5px #000 | cursor pointer (sin cambio visual explícito en Figma) | — | — |
| Swatch color | border 2px transparent | — | border 2px #000000 | opacity 0.3 |
| Chip storage | border light | border #000000 | bg #000000, text #fff | — |
| Botón añadir | bg #1b1a18 | bg #000000 | — | bg #d9d9d9, text #aaa |
| "Eliminar" | text #df0000 | opacity 0.7 | — | — |
| Badge carrito | bg #ec1d24 | — | — | oculto si count=0 |

---

## Decisiones técnicas

### Caché de peticiones

- **sessionStorage** para cachear las respuestas de la API durante la sesión
- Clave: `phones_cache_<query>` para la lista, `phone_cache_<id>` para el detalle
- TTL: hasta que se cierre la pestaña (comportamiento nativo del sessionStorage)
- Implementar en `src/hooks/usePhones.js` y `src/hooks/usePhone.js`

### Carrito persistente

- **localStorage** bajo la clave `zara_cart`
- El estado se hidrata al iniciar la app desde `CartContext`
- Cada ítem almacena: `{ id, name, brand, imageUrl, color, storage, price }`

### Búsqueda con debounce

- Debounce de **300 ms** antes de lanzar la petición a la API
- Implementar con `useRef` + `clearTimeout` (sin librerías externas)
- El indicador de resultados se actualiza tras recibir la respuesta

### Context API con useReducer

```js
// src/context/CartContext.jsx
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':    // añade o incrementa
    case 'REMOVE_ITEM': // elimina por id+color+storage
    case 'LOAD_CART':   // hidrata desde localStorage
    default: return state;
  }
};
```

### Llamadas a la API

- Siempre a través de `src/services/api.js`
- El header `x-api-key` nunca debe hardcodearse fuera de ese fichero
- Gestión de errores con try/catch en cada hook, estado `error` expuesto al componente

---

## Estructura de carpetas

```
zara-phones/
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.scss
│   │   ├── PhoneCard/
│   │   │   ├── PhoneCard.jsx
│   │   │   └── PhoneCard.scss
│   │   ├── PhoneGrid/
│   │   │   ├── PhoneGrid.jsx
│   │   │   └── PhoneGrid.scss
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.jsx
│   │   │   └── SearchBar.scss
│   │   ├── ColorSelector/
│   │   │   ├── ColorSelector.jsx
│   │   │   └── ColorSelector.scss
│   │   ├── StorageSelector/
│   │   │   ├── StorageSelector.jsx
│   │   │   └── StorageSelector.scss
│   │   ├── CartItem/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartItem.scss
│   │   └── SimilarPhones/
│   │       ├── SimilarPhones.jsx
│   │       └── SimilarPhones.scss
│   ├── context/
│   │   └── CartContext.jsx
│   ├── hooks/
│   │   ├── usePhones.js       # lista + búsqueda + caché sessionStorage
│   │   ├── usePhone.js        # detalle + caché sessionStorage
│   │   └── useDebounce.js
│   ├── pages/
│   │   ├── PhoneListPage/
│   │   │   ├── PhoneListPage.jsx
│   │   │   └── PhoneListPage.scss
│   │   ├── PhoneDetailPage/
│   │   │   ├── PhoneDetailPage.jsx
│   │   │   └── PhoneDetailPage.scss
│   │   └── CartPage/
│   │       ├── CartPage.jsx
│   │       └── CartPage.scss
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── _variables.scss    # CSS custom properties + SASS vars
│   │   ├── _reset.scss
│   │   └── main.scss
│   ├── App.jsx
│   └── index.js
├── public/
│   └── index.html
├── __tests__/                 # o junto a cada componente como *.test.jsx
├── .eslintrc.json
├── .prettierrc
├── babel.config.js
├── jest.config.js
├── webpack.config.js          # dev + prod modes
├── CLAUDE.md
├── README.md
└── package.json
```

---

## Convención de commits (Conventional Commits)

```
feat:     nueva funcionalidad
fix:      corrección de bug
test:     añadir o modificar tests
chore:    configuración, dependencias, build
docs:     cambios en documentación
style:    cambios de formato/SASS sin lógica
refactor: refactorización sin cambio funcional
```

Ejemplos:

```
feat: add phone list page with grid and search bar
feat: implement cart context with localStorage persistence
feat: add phone detail page with color and storage selectors
fix: disable add-to-cart button until both options selected
test: add unit tests for CartContext reducer
chore: configure webpack dev and prod modes
docs: add README with setup instructions
```

---

## Scripts npm

Añadir al `package.json`:

```json
{
  "scripts": {
    "start":  "webpack serve --mode development",
    "build":  "webpack --mode production",
    "test":   "jest --coverage",
    "lint":   "eslint src --ext .js,.jsx",
    "format": "prettier --write src/**/*.{js,jsx,scss}"
  }
}
```

- **`start`** — webpack-dev-server sin minimizar (modo desarrollo)
- **`build`** — assets concatenados y minimizados (modo producción)
- **`test`** — Jest con coverage report
- **`lint`** — ESLint sobre `src/`
- **`format`** — Prettier sobre JS, JSX y SCSS

---

## Requisitos no funcionales

### Responsive

- Breakpoints: 768px (tablet), 1024px (desktop)
- Grid de tarjetas: 2 cols mobile → 3 cols tablet → 4 cols desktop
- Vista detalle: 1 col mobile → 2 cols desktop
- Navbar: siempre visible, sticky

### Accesibilidad

- Todos los `<img>` con `alt` descriptivo
- Botones con texto visible o `aria-label`
- Swatches de color con `aria-label="Color: {nombre}"`
- Chips de almacenamiento con `role="radio"` dentro de `role="radiogroup"`
- Navegación por teclado funcional (foco visible)
- Contraste mínimo WCAG AA (negro sobre blanco ✓)
- `<nav>` con `aria-label` en el Navbar
- `<main>` como landmark principal

### Consola libre de errores

- Sin `console.error` ni warnings de React en ninguna vista
- Sin prop-types warnings (usar PropTypes o TypeScript)
- Sin peticiones fallidas sin gestión de error

### Linters y formatters

```jsonc
// .eslintrc.json — configuración base
{
  "extends": ["eslint:recommended", "plugin:react/recommended", "prettier"],
  "plugins": ["react", "jsx-a11y"],
  "rules": {
    "react/prop-types": "warn",
    "jsx-a11y/alt-text": "error",
    "no-console": "warn"
  }
}
```

```jsonc
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Testing

- Mínimo un test por componente crítico (PhoneCard, CartContext, SearchBar)
- Tests de integración para flujos principales:
  - Añadir teléfono al carrito desde detalle
  - Eliminar teléfono del carrito
  - Búsqueda filtra resultados correctamente
- Herramientas: **Jest** + **@testing-library/react**

---

## Git Workflow

### Estrategia de ramas

```
main        ← producción, siempre estable y desplegable
develop     ← integración, acumula features terminadas
feature/*   ← desarrollo de nueva funcionalidad
fix/*       ← corrección de bugs
chore/*     ← configuración, dependencias, build
test/*      ← añadir o mejorar tests en aislamiento
```

### Nomenclatura de ramas

| Prefijo | Cuándo usarlo |
|---------|---------------|
| `feature/` | Nueva funcionalidad (vista, componente, hook) |
| `fix/` | Corrección de bug |
| `chore/` | Webpack, ESLint, dependencias, CI |
| `test/` | Tests sin cambio funcional asociado |

Ejemplos:

```
feature/phone-list-page
feature/phone-detail-page
feature/cart-context
feature/search-debounce
fix/add-to-cart-button-disabled-state
fix/cart-total-calculation
chore/webpack-dev-prod-config
chore/eslint-prettier-setup
test/phone-card-unit-tests
test/cart-context-reducer
```

### Flujo de trabajo

```
1. Asegúrate de estar en develop actualizado
   git checkout develop && git pull origin develop

2. Crea la rama de trabajo
   git checkout -b feature/nombre-feature

3. Desarrolla y haz commits atómicos
   git add src/components/PhoneCard/
   git commit -m "feat: add PhoneCard component with image and price"

4. Cuando la feature está lista, merge a develop
   git checkout develop
   git merge --no-ff feature/nombre-feature
   git push origin develop

5. Elimina la rama local (opcional)
   git branch -d feature/nombre-feature

6. Cuando develop está estable y la entrega es inminente
   git checkout main
   git merge --no-ff develop
   git push origin main
```

### Convención de commits (Conventional Commits)

```
feat:      nueva funcionalidad visible para el usuario
fix:       corrección de bug
test:      añadir o modificar tests
chore:     configuración, dependencias, build, scripts
docs:      cambios en README, CLAUDE.md u otra documentación
style:     cambios de formato/SASS sin impacto en lógica
refactor:  refactorización sin cambio funcional ni fix
```

Formato: `<tipo>: <descripción en imperativo, minúsculas, sin punto final>`

### Ejemplos concretos para este proyecto

```bash
# Setup inicial
chore: setup webpack dev and prod configuration
chore: configure eslint with react and jsx-a11y plugins
chore: configure prettier and add format script

# Estructura base
feat: add app router with three main routes
feat: add navbar with cart icon and item count badge
feat: add cart context with useReducer and localStorage persistence

# Vista lista
feat: add phone list page with responsive grid
feat: add search bar with 300ms debounce
feat: add result count indicator below search bar
feat: add usePhones hook with sessionStorage cache

# Vista detalle
feat: add phone detail page layout desktop and mobile
feat: add color selector with dynamic image update
feat: add storage selector with real-time price update
feat: add similar phones section at bottom of detail page
fix: disable add-to-cart button until color and storage selected

# Carrito
feat: add cart page with item list and total price
feat: add remove item button per cart entry
feat: add continue shopping button linking to home

# Calidad
test: add PhoneCard unit tests
test: add cart context reducer tests
test: add search bar debounce integration test
fix: debounce search query to avoid redundant API calls
fix: cart total calculation on item removal
docs: add README with setup and architecture sections
```

### Regla fundamental

**Nunca commitear directamente a `main` ni a `develop`.** Siempre trabajar en una rama propia y mergear mediante pull request (en remoto) o `--no-ff merge` (en local). Esto garantiza historial limpio y revisión del código antes de integrar.
