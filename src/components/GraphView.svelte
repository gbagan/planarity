<script lang="ts">
  import type { Point } from '../lib/geometry';

  type Props = {
    nodes: Point[];
    edges: [number, number][];
    solved: boolean;
    intersects: boolean[];
    moveNode: (idx: number, pos: Point) => void;
    checkPlanarity: () => void;
  }

  let {nodes, edges, solved, intersects, moveNode, checkPlanarity}: Props = $props();
  let selectedNode: number | null = $state(null);

  function getPointerPosition(e: MouseEvent): Point {
    const el = e.currentTarget as Element;
    const { left, top, width, height } = el.getBoundingClientRect();
    return { x: (e.clientX - left) / width, y: (e.clientY - top) / height };
  }

  function move(ev: MouseEvent) {
    if (selectedNode !== null) {
      const pos = getPointerPosition(ev);   
      moveNode(selectedNode, pos);
    }
  }

  function pointerDown(idx: number, e: PointerEvent) {
    if (e.currentTarget) {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    }
    selectedNode = idx;
  }

  function pointerUp() {
    selectedNode = null;
    checkPlanarity();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg viewBox="0 0 100 100" onpointermove={move} class={{solved}}>
  {#each edges as [u, v], i}
    {@const p1 = nodes[u]}
    {@const p2 = nodes[v]}
    <path
      d="M{100*p1.x} {100*p1.y}L{100*p2.x} {100*p2.y}"
      stroke-width="0.5"
      stroke={intersects[i] ? "red" : "blue"}
    />
  {/each}
  {#each nodes as {x, y}, i}
    <circle
      cx={100*x} cy={100*y}
      r="2.5"
      fill="grey"
      onpointerdown={ev => pointerDown(i, ev)}
      onpointerup={pointerUp}
    />
  {/each}
</svg>

<style>
  .solved circle {
    transition: cx 1s linear, cy 1s linear;
  }

  .solved path {
    transition: d 1s linear;
  }
</style>