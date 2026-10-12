<template>
  <div class="code-editor"></div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";
import type { PropType } from "vue";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import type { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

export default defineComponent({
  name: "CodeEditor",

  props: {
    modelValue: {
      type: String,
      required: true,
    },
    language: {
      type: String as PropType<"javascript" | "html" | "css">,
      required: true,
    },
  },

  emits: ["update:modelValue", "run"],

  data() {
    return {
      view: null as EditorView | null,
    };
  },

  watch: {
    modelValue(value: string) {
      if (!this.view || value === this.view.state.doc.toString()) {
        return;
      }

      this.view.dispatch({
        changes: { from: 0, to: this.view.state.doc.length, insert: value },
      });
    },
  },

  mounted() {
    const runKeymap = keymap.of([
      { key: "Mod-Enter", run: this.emitRun },
      { key: "Mod-s", run: this.emitRun },
    ]);

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        this.$emit("update:modelValue", update.state.doc.toString());
      }
    });

    let languageSupport: Extension;
    if (this.language === "html") {
      languageSupport = html();
    } else if (this.language === "css") {
      languageSupport = css();
    } else {
      languageSupport = javascript();
    }

    // CodeMirror breaks when its view is wrapped in Vue's reactive proxy.
    this.view = markRaw(
      new EditorView({
        doc: this.modelValue,
        parent: this.$el as HTMLElement,
        extensions: [
          Prec.highest(runKeymap),
          basicSetup,
          languageSupport,
          updateListener,
        ],
      }),
    );
  },

  beforeUnmount() {
    this.view?.destroy();
  },

  methods: {
    emitRun() {
      this.$emit("run");
      return true;
    },
  },
});
</script>

<style scoped>
.code-editor {
  height: 100%;
  overflow: hidden;
}

.code-editor :deep(.cm-editor) {
  height: 100%;
}

.code-editor :deep(.cm-scroller) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
}
</style>
