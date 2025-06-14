<script>import ink from "ink-mde";
import { onMount, createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
export let value = void 0;
export let editor = void 0;
export let options = void 0;
let divRef;
onMount(() => {
  editor = ink(divRef, {
    doc: value,
    ...options,
    hooks: {
      afterUpdate: (doc) => {
        value = doc;
        options?.hooks?.afterUpdate?.(doc);
        dispatch("afterUpdate", doc);
      },
      beforeUpdate: (doc) => {
        options?.hooks?.beforeUpdate?.(doc);
        dispatch("beforeUpdate", doc);
      }
    }
  });
});
$: {
  if (editor && options) {
    editor.reconfigure(options);
  }
}
$: {
  if (editor && value && editor.getDoc() !== value) {
    editor.update(value);
  }
}
</script>

<div bind:this={divRef} />
