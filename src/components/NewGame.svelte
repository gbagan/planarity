<script lang="ts">
  import Button from "./Button.svelte";

  type Props = {
    generation: string;
    nodeCount: number;
    newGame: (gen: string, ncount: number) => void;
  }
  let { generation: gen, nodeCount: ncount, newGame }: Props = $props();

  let generation = $derived(gen);
  let nodeCount = $derived(ncount);

  const generationTitles = [["delaunay", "Delaunay"], ["triangulated", "Triangulé"]];
</script>


<div class="title">
  Nouvelle partie
</div>
<div class="body">
  <div class="container">
    <div class="menu-title">Adversaire</div>
    <div class="menu-buttons">
      {#each generationTitles as [name, fullname]}
        <button
          class={["menu-button", {toggled: name === generation}]}
          onclick={() => generation = name}
        > 
          {fullname}
        </button>
      {/each}
    </div>
    <div class="menu-title">Nombre de sommets</div>
    <div class="menu-buttons2">
      {#each [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 25, 30, 35, 40, 45, 50, 60] as v}
        <button
          class={["menu-button", {toggled: v == nodeCount}]}
          onclick={() => nodeCount = v}
        >
          {v}
        </button>
      {/each}
    </div>
  </div> 
</div>
<div class="buttons">
  <Button onclick={() => {}}>Précédent</Button>
  <Button onclick={() => newGame(generation, nodeCount)}>Ok</Button>
</div>

<style>
  .menu-button {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;

    color: rgb(55, 65, 81);
    background-color: transparent;

    border: 1px solid rgb(31, 41, 55);
    &.toggled {
      background-color: rgba(253, 224, 71, 0.5);
    }
  }

  .container {
    display: grid;
    grid-template-columns: 25% 75%;
    gap: 2rem;
  }

  .menu-title {
    font-weight: bold;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .menu-buttons {
    display: flex;
    gap: 1rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .menu-buttons2 {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }


  .title {
    padding: 1rem;
    min-height: 2rem;
    border-bottom-width: 2px;
    border-bottom-color: black;
    border-bottom-style: solid; 
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: 500;
  }

  .body {
    padding: 2.5rem;
    border-bottom-width: 2px;
    border-bottom-color: black;
    border-bottom-style: solid; 
  }

  .buttons {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
</style>