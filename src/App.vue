<template>
  <div class="playground">
    <header class="toolbar">
      <h1 class="title">Tabulator Fiddle</h1>

      <button type="button" class="run-button" @click="run">
        Run
        <kbd>{{ runShortcutLabel }}</kbd>
      </button>

      <label class="example-picker">
        Examples
        <select :value="selectedExampleId" @change="onExampleChange">
          <option value="" disabled>Choose an example</option>
          <option
            v-for="example in examples"
            :key="example.id"
            :value="example.id"
          >
            {{ example.name }}
          </option>
        </select>
      </label>

      <button type="button" @click="onShare">Share</button>
      <span class="share-message" aria-live="polite">{{ shareMessage }}</span>
    </header>

    <main class="panes">
      <section class="pane editor-pane">
        <div class="file-tabs" role="tablist">
          <button
            v-for="tab in fileTabs"
            :key="tab.name"
            type="button"
            role="tab"
            class="file-tab"
            :class="{ active: tab.name === activeFileName }"
            :aria-selected="tab.name === activeFileName"
            @click="selectFile(tab.name)"
          >
            {{ tab.name }}
          </button>
        </div>
        <div class="editor-body">
          <CodeEditor
            v-for="tab in fileTabs"
            v-show="tab.name === activeFileName"
            :key="tab.name"
            :model-value="files[tab.name]"
            :language="tab.language"
            @update:model-value="setFile(tab.name, $event)"
            @run="run"
          />
        </div>
      </section>
      <section class="pane preview-pane">
        <PreviewFrame :html="previewHtml" :run-count="runCount" />
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import CodeEditor from "./components/CodeEditor.vue";
import PreviewFrame from "./components/PreviewFrame.vue";
import { examples } from "./examples";
import { usePlaygroundStore } from "./stores/playground";

export default defineComponent({
  name: "App",

  components: { CodeEditor, PreviewFrame },

  data() {
    return {
      examples,
      fileTabs: [
        { name: "index.js", language: "javascript" },
        { name: "index.html", language: "html" },
        { name: "style.css", language: "css" },
      ] as const,
      shareMessageTimer: 0,
      runShortcutLabel: navigator.platform.startsWith("Mac")
        ? "⌘+Enter"
        : "Ctrl+Enter",
    };
  },

  computed: {
    ...mapState(usePlaygroundStore, [
      "files",
      "activeFileName",
      "selectedExampleId",
      "previewHtml",
      "runCount",
      "shareMessage",
    ]),
  },

  created() {
    this.init();
  },

  methods: {
    ...mapActions(usePlaygroundStore, [
      "init",
      "setFile",
      "selectFile",
      "selectExample",
      "run",
      "share",
      "clearShareMessage",
    ]),

    onExampleChange(event: Event) {
      const select = event.target as HTMLSelectElement;
      this.selectExample(select.value);
    },

    async onShare() {
      await this.share();
      clearTimeout(this.shareMessageTimer);
      this.shareMessageTimer = setTimeout(this.clearShareMessage, 2500);
    },
  },
});
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
}

body {
  font-family: system-ui, sans-serif;
  font-size: 14px;
  color: #222;
  background: #f4f4f4;
}
</style>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  background: #fff;
}

.title {
  margin: 0 8px 0 0;
  font-size: 16px;
}

button,
select {
  font: inherit;
  padding: 4px 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

button:hover {
  background: #f0f0f0;
}

.run-button {
  border-color: #2b6cb0;
  background: #2b6cb0;
  color: #fff;
}

.run-button:hover {
  background: #245a93;
}

.run-button kbd {
  margin-left: 6px;
  font-family: inherit;
  font-size: 11px;
  opacity: 0.8;
}

.example-picker {
  display: flex;
  align-items: center;
  gap: 6px;
}

.share-message {
  color: #2f855a;
}

.panes {
  display: flex;
  flex: 1;
  min-height: 0;
}

.pane {
  flex: 1;
  min-width: 0;
  background: #fff;
}

.editor-pane {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
}

.file-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  background: #f7f7f7;
}

.file-tab {
  padding: 6px 14px;
  border: 0;
  border-right: 1px solid #ddd;
  border-radius: 0;
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  color: #555;
}

.file-tab.active {
  background: #fff;
  color: #222;
  box-shadow: inset 0 -2px 0 #2b6cb0;
}

.editor-body {
  flex: 1;
  min-height: 0;
}

@media (max-width: 700px) {
  .panes {
    flex-direction: column;
  }

  .editor-pane {
    border-right: 0;
    border-bottom: 1px solid #ddd;
  }
}
</style>
