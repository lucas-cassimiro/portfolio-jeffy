const fs = require('fs');
const data = JSON.parse(fs.readFileSync('figma-footer.json', 'utf8'));
const node = data.nodes['43:239'].document;

function hex(c, opacity) {
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  const a = opacity != null ? opacity : c.a;
  const rgb = [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return a < 1 ? `#${rgb}${Math.round(a * 255).toString(16).padStart(2, '0')}` : `#${rgb}`;
}

function walk(n, depth = 0) {
  const pad = '  '.repeat(depth);
  const size = n.absoluteBoundingBox
    ? `${Math.round(n.absoluteBoundingBox.width)}x${Math.round(n.absoluteBoundingBox.height)} @${Math.round(n.absoluteBoundingBox.x)},${Math.round(n.absoluteBoundingBox.y)}`
    : '';
  const chars = n.characters ? JSON.stringify(n.characters) : '';
  const fills = (n.fills || [])
    .filter((f) => f.visible !== false)
    .map((f) => {
      if (f.type === 'SOLID' && f.color) return `solid(${hex(f.color, f.opacity)})`;
      if (f.type === 'IMAGE') return `IMAGE(${f.imageRef})`;
      return f.type;
    })
    .join(',');
  const font = n.style
    ? [n.style.fontFamily, n.style.fontWeight, n.style.fontSize, 'lh:' + n.style.lineHeightPx, n.style.letterSpacing ? 'ls:' + n.style.letterSpacing : '', n.style.textAlignHorizontal, n.style.textDecoration]
        .filter(Boolean)
        .join(' ')
    : '';
  const layout = [
    n.layoutMode,
    n.primaryAxisAlignItems,
    n.counterAxisAlignItems,
    n.itemSpacing != null ? 'gap:' + n.itemSpacing : '',
    n.paddingTop != null ? `p:${n.paddingTop}/${n.paddingRight}/${n.paddingBottom}/${n.paddingLeft}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const extras = [
    (n.strokes || []).length ? 'stroke:' + (n.strokes[0].color ? hex(n.strokes[0].color, n.strokes[0].opacity) : '') : '',
    n.strokeWeight != null ? 'sw:' + n.strokeWeight : '',
    n.cornerRadius != null ? 'r:' + n.cornerRadius : '',
    n.effects && n.effects.length ? 'fx' : '',
    n.id,
  ]
    .filter(Boolean)
    .join(' ');
  console.log(`${pad}${n.type} "${n.name}" ${size} ${chars} ${font} ${fills} ${layout} ${extras}`.trim());
  (n.children || []).forEach((c) => walk(c, depth + 1));
}

walk(node);
