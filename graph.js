export function validateGraph(nodes, edges) {
  if (!Array.isArray(nodes) || !nodes.length || nodes.length > 40 || !Array.isArray(edges)) throw new Error('A workflow needs 1–40 nodes');
  const ids = new Set(nodes.map(n => n.id));
  if (ids.size !== nodes.length || nodes.some(n => !n.id || typeof n.data?.prompt !== 'string' || !n.data.prompt.trim())) throw new Error('Each node needs a unique ID and prompt');
  const routes = new Set();
  for (const e of edges) {
    if (!ids.has(e.source) || !ids.has(e.target) || !['YES', 'NO'].includes(e.label)) throw new Error('Each connection needs valid nodes and a YES or NO label');
    const key = `${e.source}:${e.label}`;
    if (routes.has(key)) throw new Error('A node can have only one edge per answer');
    routes.add(key);
  }
}

export function nextNode(edges, id, answer) {
  return edges.find(e => e.source === id && e.label === answer)?.target ?? null;
}
