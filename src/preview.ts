import tabulatorJsUrl from "tabulator-tables/dist/js/tabulator_esm.js?url";
import tabulatorCssUrl from "tabulator-tables/dist/css/tabulator.css?url";
import type { FiddleFiles } from "./examples";

// srcdoc iframes resolve relative URLs against about:srcdoc, not this page.
const scriptSrc = new URL(tabulatorJsUrl, location.href).href;
const styleHref = new URL(tabulatorCssUrl, location.href).href;

const errorReporter = `
window.addEventListener("error", (event) => {
  const pre = document.createElement("pre");
  pre.className = "playground-error";
  pre.textContent = event.message;
  document.body.appendChild(pre);
});
`;

export function buildPreviewHtml(files: FiddleFiles): string {
  // A literal "</script" in user code would close the script tag early.
  const safeJs = files["index.js"].replace(/<\/script/gi, "<\\/script");
  const safeCss = files["style.css"].replace(/<\/style/gi, "<\\/style");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${styleHref}">
<style>
  html, body { height: 100%; }
  body {
    margin: 0;
    padding: 12px;
    box-sizing: border-box;
    font-family: system-ui, sans-serif;
  }
  .tabulator-ranges .tabulator-cell:not(.tabulator-editing)::selection {
    background: transparent;
  }
  .playground-error {
    color: #b00020;
    background: #fdecee;
    padding: 8px 12px;
    border-radius: 4px;
    white-space: pre-wrap;
  }
</style>
<style>${safeCss}</style>
<script>${errorReporter}</script>
<script type="module">
  import { TabulatorFull } from "${scriptSrc}";
  window.Tabulator = TabulatorFull;
</script>
</head>
<body>
${files["index.html"]}
<script type="module">${safeJs}</script>
</body>
</html>`;
}
