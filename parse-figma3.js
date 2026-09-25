const fs = require('fs');
const data = JSON.parse(fs.readFileSync('figma-contact.json', 'utf8'));
const node = data.nodes['43:157'].document;

function walk(n) {
  if (n.interactions && n.interactions.length) {
    console.log('INTERACT', n.name, n.id, JSON.stringify(n.interactions));
  }
  if (n.style && n.style.hyperlink) {
    console.log('HYPER', n.name, n.characters, n.style.hyperlink);
  }
  (n.children || []).forEach(walk);
}
walk(node);

function dumpLinkText(n) {
  if (n.type === 'TEXT' && n.characters) {
    console.log('TEXT', JSON.stringify(n.characters), n.style && n.style.textDecoration, n.fills);
  }
  (n.children || []).forEach(dumpLinkText);
}
dumpLinkText(node);
