<script lang="ts">
  import GraphView from './components/GraphView.svelte';
    import NewGame from './components/NewGame.svelte';
  import { confetti } from './lib/confetti';
  import { generateDelaunay, generateTriangulated } from './lib/generator';
  import { segmentsIntersect, type Point } from './lib/geometry';
  import { tabulate } from './lib/util';

  const output = generateDelaunay(8); 
  let generation = $state("delaunay");
  let edges = $state(output.edges);
  let solution = $state(output.solution);
  
  let nodes: Point[] = $state(tabulate(8, i => ({
    x: 0.5 + 0.4 * Math.sin(2 * i * Math.PI / 8),
    y: 0.5 + 0.4 * Math.cos(2 * i * Math.PI / 8),
  })));

  let solved = $state(false);
  let history: Point[][] = $state([nodes.map(n => ({...n}))]);

  let dialogEl: HTMLDialogElement = $state()!;

  let nodeCount = $derived(nodes.length);

  let intersects = $derived(edges.map(([u, v], i) =>
    edges.some(([w, t]) => 
      u !== w 
      && u !== t 
      && v !== w
      && v !== t
      && segmentsIntersect(nodes[u], nodes[v], nodes[w], nodes[t])
    )
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

  function openNewGame() {
    dialogEl.showModal();
  }

  function newGame(gen: string, nCount: number) {
    generation = gen;
    const output =
      generation === "delaunay"
      ? generateDelaunay(nCount)
      : generateTriangulated(nCount);
    edges = output.edges;
    solution = output.solution;
  
    nodes = tabulate(nCount, i => ({
      x: 0.5 + 0.4 * Math.sin(2 * i * Math.PI / nCount),
      y: 0.5 + 0.4 * Math.cos(2 * i * Math.PI / nCount),
    }));

    solved = false;
    history = [nodes.map(n => ({...n}))];
    dialogEl.close();
  }

  function newGameCancel() {
    dialogEl.close();
  }


</script>

<div class="game-container">
  <div>
    <button onclick={undo}>Annuler</button>
    <button onclick={restart}>Recommencer</button>
    <button onclick={solve}>Solution</button>
    <button onclick={openNewGame}>Nouvelle partie</button>
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
<dialog bind:this={dialogEl}>
  <NewGame {generation} {nodeCount} {newGame} cancel={newGameCancel} />
</dialog>

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

  dialog {
    display: block;
    border: none;
    background-image: var(--bg-board);
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 
                0 1px 2px -1px rgb(0 0 0 / 0.1);

    &::backdrop {
      background-color: rgba(107, 114, 128, 0.7);
    }
    
    &:not([open]) {
      pointer-events: none;
      opacity: 0;
    }

    &[open] {
      animation: flip-y 1s both;
    }
  }

  @keyframes flip-y {
    0% { 
      opacity: 0;
      transform: rotateY(180deg);
    }
    100% { 
      opacity: 1;
      transform: rotateY(0);
    }
  }
</style>