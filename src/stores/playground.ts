import { defineStore } from "pinia";
import { examples } from "../examples";
import type { FiddleFiles, FileName } from "../examples";
import { buildPreviewHtml } from "../preview";

const shareHashPrefix = "#code=";
const exampleHashPrefix = "#example=";

function encodeFiles(files: FiddleFiles): string {
  const bytes = new TextEncoder().encode(JSON.stringify(files));
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeFiles(encoded: string): FiddleFiles {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function readSharedFiles(): FiddleFiles | null {
  if (!location.hash.startsWith(shareHashPrefix)) {
    return null;
  }

  try {
    return decodeFiles(location.hash.slice(shareHashPrefix.length));
  } catch {
    return null;
  }
}

function readExampleId(): string | null {
  if (!location.hash.startsWith(exampleHashPrefix)) {
    return null;
  }

  const id = location.hash.slice(exampleHashPrefix.length);
  if (!examples.some((example) => example.id === id)) {
    return null;
  }

  return id;
}

export const usePlaygroundStore = defineStore("playground", {
  state: () => ({
    files: {
      "index.js": "",
      "index.html": "",
      "style.css": "",
    } as FiddleFiles,
    activeFileName: "index.js" as FileName,
    selectedExampleId: "",
    previewHtml: "",
    runCount: 0,
    shareMessage: "",
  }),

  actions: {
    init() {
      const sharedFiles = readSharedFiles();
      if (sharedFiles === null) {
        const exampleId = readExampleId() ?? examples[0].id;
        this.selectExample(exampleId);
        return;
      }

      this.files = sharedFiles;
      this.selectedExampleId = "";
      this.run();
    },

    setFile(name: FileName, content: string) {
      this.files[name] = content;
    },

    selectFile(name: FileName) {
      this.activeFileName = name;
    },

    selectExample(id: string) {
      const example = examples.find((item) => item.id === id);
      if (!example) {
        return;
      }

      this.selectedExampleId = example.id;
      this.files = { ...example.files };
      const url = new URL(location.href);
      url.hash = exampleHashPrefix + example.id;
      history.replaceState(null, "", url.href);
      this.run();
    },

    run() {
      this.previewHtml = buildPreviewHtml(this.files);
      this.runCount++;
    },

    async share() {
      const url = new URL(location.href);
      url.hash = shareHashPrefix + encodeFiles(this.files);
      history.replaceState(null, "", url.href);

      try {
        await navigator.clipboard.writeText(url.href);
        this.shareMessage = "Link copied to clipboard";
      } catch {
        this.shareMessage = "Link is in the address bar";
      }
    },

    clearShareMessage() {
      this.shareMessage = "";
    },
  },
});
