'use client'
import React, { useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as neo4j from  'neo4j-driver';

type mySet={
    source: string;
    target: string;
}

function GraphData({ driver}:{driver:neo4j.Driver}) {
  const [query, setQuery] = useState(`
    MATCH (n:Character)-[:INTERACTS1]->(m:Character) 
    RETURN n.name as source, m.name as target
  `);
  const [data, setData] = useState({ nodes: [{ name: "Joe" }, { name: "Jane" }], links: [{ source: "Joe", target: "Jane" }] });

  const handleChange = (event:any) => {
    setQuery(event.target.value);
  }

  const loadData = async () => {
    let session = await driver.session({ database: "gameofthrones" });
    let res = await session.run(JSON.parse(JSON.stringify(query)));
    session.close();
    console.log(res);
    let nodes = new Set();
    let links = res.records.map(r => {
      let source = r.get("source");''
      let target = r.get("target");
      nodes.add(source);
      nodes.add(target);
      return { source, target }
    });
    nodes = Array.from(nodes).map(name => { return { name } });
    setData({ nodes, links });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <textarea style={{ display: "block", width: "800px", height: "100px" }}
        value={query}
        onChange={handleChange} />
      <button onClick={loadData}>Reload</button>
      <ForceGraph2D graphData={data} nodeId="name"
        linkCurvature={0.2} linkDirectionalArrowRelPos={1} linkDirectionalArrowLength={10} />
    </div>
  );
}

export default GraphData;

