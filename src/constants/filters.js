// NOTA: Lista de colores extraída en build-time desde GET /products/:id.
// El endpoint GET /products (listado) no devuelve colores, por eso se usó
// el detalle de cada producto una única vez (Promise.all sobre 24 productos)
// para construir este listado estático deduplicado por nombre (case-insensitive).
// En producción, el backend debería exponer un endpoint /filters o /colors.
// Deduplicado por hexCode — el nombre se conserva como aria-label para accesibilidad.
// Criterio de desempate: se prefiere el nombre en inglés; si hay empate de idioma, se conserva
// el primero en orden alfabético. Resultado: 29 colores únicos de los 43 originales.
// Top 4 por frecuencia en el catálogo (conteo vía Promise.all sobre GET /products/:id):
// Black ×14, Azul ×7, Titanium Yellow ×4, Matte Grey ×3
export const TOP_COLORS = [
  { name: 'Black',           hexCode: '#000000' },
  { name: 'Azul',            hexCode: '#0000FF' },
  { name: 'Titanium Yellow', hexCode: '#FFFF00' },
  { name: 'Matte Grey',      hexCode: '#808080' },
];

export const AVAILABLE_COLORS = [
  { name: '(PRODUCT)RED',    hexCode: '#BA0C2F' },
  { name: 'Amber Orange',    hexCode: '#FF7F00' },
  { name: 'Azul',            hexCode: '#0000FF' }, // Azul brillante eliminado (mismo hex)
  { name: 'Black',           hexCode: '#000000' }, // Midnight Black, Negro, Obsidiana, Titanium Black eliminados
  { name: 'Blanco',          hexCode: '#FFFFFF' },
  { name: 'Blanco estrella', hexCode: '#F9F6EF' },
  { name: 'Clover Green',    hexCode: '#228B22' },
  { name: 'Glacier White',   hexCode: '#F0F8FF' },
  { name: 'Graphite',        hexCode: '#4A4A4A' },
  { name: 'Light Blue',      hexCode: '#87CEEB' }, // Celeste, Sky Blue eliminados
  { name: 'Light Green',     hexCode: '#90EE90' },
  { name: 'Light Violet',    hexCode: '#E6E6FA' }, // Lavanda eliminada
  { name: 'Matte Grey',      hexCode: '#808080' }, // Gris, Titanium Gray eliminados
  { name: 'Medianoche',      hexCode: '#1C1C1E' },
  { name: 'Midnight Purple', hexCode: '#4B0082' },
  { name: 'Mint',            hexCode: '#98FF98' }, // Mint Green eliminado
  { name: 'Morado',          hexCode: '#800080' },
  { name: 'Navy Blue',       hexCode: '#000080' },
  { name: 'Porcelana',       hexCode: '#F5F5F5' },
  { name: 'Purple',          hexCode: '#8E6F96' }, // Titanium Violet eliminado
  { name: 'Ripple Blue',     hexCode: '#4169E1' },
  { name: 'Rosa',            hexCode: '#FEC2EB' },
  { name: 'Silver',          hexCode: '#C0C0C0' },
  { name: 'Titanio Azul',    hexCode: '#3A4A5A' },
  { name: 'Titanio Blanco',  hexCode: '#F0F0F0' },
  { name: 'Titanio Natural', hexCode: '#DBCEC3' },
  { name: 'Titanio Negro',   hexCode: '#2C2C2C' },
  { name: 'Titanium Yellow', hexCode: '#FFFF00' }, // Amarillo, Yellow eliminados
  { name: 'Verde',           hexCode: '#4E5851' },
];
