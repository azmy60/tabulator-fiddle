import basic from "./basic.js?raw";
import pagination from "./pagination.js?raw";
import beekeeperStudio from "./beekeeper-studio.js?raw";

export type FileName = "index.js" | "index.html" | "style.css";

export type FiddleFiles = Record<FileName, string>;

export interface Example {
  id: string;
  name: string;
  files: FiddleFiles;
}

export const examples: Example[] = [
  {
    id: "basic",
    name: "Basic table",
    files: {
      "index.js": basic,
      "index.html": '<div id="example-table"></div>\n',
      "style.css": "",
    },
  },
  {
    id: "pagination",
    name: "Pagination",
    files: {
      "index.js": pagination,
      "index.html": '<div id="example-table"></div>\n',
      "style.css": "",
    },
  },
  {
    id: "beekeeper-studio",
    name: "Beekeeper Studio",
    files: {
      "index.js": beekeeperStudio,
      "index.html": '<div id="example-table"></div>\n',
      "style.css": "",
    },
  },
];
