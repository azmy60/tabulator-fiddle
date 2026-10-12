<template>
  <iframe
    :key="runCount"
    class="preview-frame"
    title="Preview"
    sandbox="allow-scripts allow-modals allow-downloads allow-popups"
    :srcdoc="html"
  ></iframe>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PreviewFrame",

  props: {
    html: {
      type: String,
      required: true,
    },
    runCount: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style scoped>
.preview-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #fff;
}
</style>
