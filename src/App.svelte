<script lang="ts">
  import GraphView from './components/GraphView.svelte';
    import { confetti } from './lib/confetti';
    import { delaunay } from './lib/delaunay';
  import { generateDelaunay, generate_triangulated } from './lib/generator';
  import { segmentsIntersect, type Point } from './lib/geometry';
  import { tabulate } from './lib/util';

  const output = generateDelaunay(8); 
  let edges = $state(output.edges);
  let solution = $state(output.solution);
  
  let nodes: Point[] = $state(tabulate(8, i => ({
    x: 0.5 + 0.4 * Math.sin(2 * i * Math.PI / 8),
    y: 0.5 + 0.4 * Math.cos(2 * i * Math.PI / 8),
  })));

  let solved = $state(false);
  let history: Point[][] = $state([nodes.map(n => ({...n}))]);

  let nodeCount = $derived(nodes.length);

  let intersects = $derived(edges.map(([u, v], i) =>
    edges.some(([w, t], j) => i !== j && segmentsIntersect(nodes[u], nodes[v], nodes[w], nodes[t]))
  ))

  let isGameFinished = $state(false);

  function moveNode(i: number, p: Point) {
    nodes[i] = p;
    solved = false;
  }

  function checkPlanarity() {
    history.push(nodes.map(n => ({...n})));
    if (intersects.every(x => !x)) {
      isGameFinished = true;
    }
  }

  function solve() {
    nodes = solution.map(n => ({...n}));
    solved = true;
    history.push(nodes.map(n => ({...n})));
  }

  function undo() {
    if (history.length >= 2) {
      history.pop();
      nodes = history.at(-1)!.map(n => ({...n}));
      solved = false;
    }
  }

  function restart() {
    history.length = 1;
    nodes = history[0].map(n => ({...n}));
    solved = false;
  }



</script>

<div class="game-container">
  <div>
    <button onclick={undo}>Annuler</button>
    <button onclick={restart}>Recommencer</button>
    <button onclick={solve}>Solution</button>
  </div>
  <main>
    <GraphView {nodes} {edges} {solved} {intersects} {moveNode} {checkPlanarity} />
  </main>
</div>
{#if isGameFinished}
  <div class="confetti-container">
    <div use:confetti={{stageHeight: "100vh", stageWidth: "100vw"}}></div>
  </div>
{/if}

<style>
  .game-container {
    width: 100vw;
    margin: 0 auto;
    text-align: center;
    border-inline: 1px solid var(--border);
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    align-items: center;
    gap: 2rem;
  }

  main {
    width: 85vmin;
    height: 85vmin;
    border: solid;
  }

  .confetti-container {
    position: fixed;
    top: 15vh;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    justify-content: center;
    z-index: 400;
  }
</style>

