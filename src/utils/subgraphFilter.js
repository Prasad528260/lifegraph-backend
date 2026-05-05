export const filterSubgraph = (graph, domains) => {

  const allowedNodes = graph.nodes.filter((node) =>
    node.domain && domains.includes(node.domain) // ← add node.domain check
  );

  const allowedNodeIds = new Set(allowedNodes.map((n) => n.id));

  const allowedEdges = graph.edges.filter(
    (edge) =>
      allowedNodeIds.has(edge.from) &&
      allowedNodeIds.has(edge.to)
  );

  return {
    nodes: allowedNodes,
    edges: allowedEdges,
    allowedDomains: domains,
  };
};