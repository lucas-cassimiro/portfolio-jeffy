const fs = require('fs');
const data = JSON.parse(fs.readFileSync('figma-contact.json', 'utf8'));
const node = data.nodes['43:157'].document;

function findByName(n, name, acc = []) {
  if (n.name === name) acc.push(n);
  (n.children || []).forEach((c) => findByName(c, name, acc));
  return acc;
}

const container = node.children.find((c) => c.name === 'Container');
console.log('container layout', {
  layoutMode: container.layoutMode,
  layoutWrap: container.layoutWrap,
  itemSpacing: container.itemSpacing,
  counterAxisSpacing: container.counterAxisSpacing,
  gridChildHorizontalSizing: container.layoutGrids,
  strokes: container.strokes,
  strokeWeight: container.strokeWeight,
});
console.log('gridStyle', JSON.stringify(container.layoutGrids, null, 2));
console.log('container style', {
  layoutMode: container.layoutMode,
  primaryAxisAlignItems: container.primaryAxisAlignItems,
  counterAxisAlignItems: container.counterAxisAlignItems,
  itemSpacing: container.itemSpacing,
  padding: [container.paddingTop, container.paddingRight, container.paddingBottom, container.paddingLeft],
  children: container.children.map((c) => ({
    name: c.name,
    id: c.id,
    w: c.absoluteBoundingBox.width,
    h: c.absoluteBoundingBox.height,
    x: c.absoluteBoundingBox.x,
    y: c.absoluteBoundingBox.y,
    fills: c.fills,
    strokes: c.strokes,
    strokeWeight: c.strokeWeight,
    cornerRadius: c.cornerRadius,
    effects: c.effects,
  })),
});

console.log('section', {
  id: node.id,
  fills: node.fills,
  strokes: node.strokes,
  strokeWeight: node.strokeWeight,
  itemSpacing: node.itemSpacing,
  padding: [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft],
  effects: node.effects,
});

function dumpSvgs(n, path = '') {
  if (n.name === 'SVG') {
    console.log('SVG', n.id, path, n.absoluteBoundingBox, JSON.stringify(n, null, 0).slice(0, 400));
  }
  (n.children || []).forEach((c) => dumpSvgs(c, path + '/' + n.name));
}
dumpSvgs(node);

function collectIds(n, acc = []) {
  if (['SVG', 'VECTOR', 'ContactSection'].includes(n.name) || n.name === 'Mapa do Google Incorporado') {
    acc.push({ id: n.id, name: n.name, type: n.type });
  }
  (n.children || []).forEach((c) => collectIds(c, acc));
  return acc;
}
console.log('ids', collectIds(node));

const map = container.children.find((c) => c.name.includes('Mapa'));
console.log('map full keys', Object.keys(map));
console.log('map strokes', JSON.stringify(map.strokes));
console.log('map effects', JSON.stringify(map.effects));
console.log('map fills', JSON.stringify(map.fills));
