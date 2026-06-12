/* ---------------------------------------------------------------
   Type playground — drives the CSS custom properties on :root and
   persists choices to localStorage so a refresh keeps your tweaks.
   --------------------------------------------------------------- */

const FONTS = [
  { name: "Bangers", css: '"Bangers", "Arial Narrow", sans-serif' },
  { name: "Londrina Solid", css: '"Londrina Solid", "Arial Narrow", sans-serif' },
  { name: "Permanent Marker", css: '"Permanent Marker", sans-serif' },
  { name: "Cabin Sketch", css: '"Cabin Sketch", sans-serif' },
  { name: "Patrick Hand", css: '"Patrick Hand", sans-serif' },
];

// Defaults mirror the values in styles.css :root.
const DEFAULTS = {
  font: FONTS[0].css,
  weight: "400",
  size: 22, // cqi
  kern: 0.08, // em
  lead: 1.05, // unitless
  stroke: 9, // px
  pink: "#ff2d87",
  red: "#ff1f23",
  borderColor: "#000000",
  borderW: 9, // px
};

const STORAGE_KEY = "better-life-type";
const root = document.documentElement;

const els = {
  font: document.getElementById("c-font"),
  weight: document.getElementById("c-weight"),
  size: document.getElementById("c-size"),
  kern: document.getElementById("c-kern"),
  lead: document.getElementById("c-lead"),
  stroke: document.getElementById("c-stroke"),
  pink: document.getElementById("c-pink"),
  red: document.getElementById("c-red"),
  borderColor: document.getElementById("c-border-color"),
  borderW: document.getElementById("c-border-w"),
  vSize: document.getElementById("v-size"),
  vKern: document.getElementById("v-kern"),
  vLead: document.getElementById("v-lead"),
  vStroke: document.getElementById("v-stroke"),
  vBorderW: document.getElementById("v-border-w"),
  copy: document.getElementById("c-copy"),
  reset: document.getElementById("c-reset"),
  panel: document.getElementById("panel"),
  toggle: document.getElementById("panel-toggle"),
};

// Populate the font dropdown.
for (const f of FONTS) {
  const opt = document.createElement("option");
  opt.value = f.css;
  opt.textContent = f.name;
  els.font.appendChild(opt);
}

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Push the current state into CSS variables + the readout labels.
function apply(state) {
  root.style.setProperty("--font", state.font);
  root.style.setProperty("--weight", state.weight);
  root.style.setProperty("--fs", state.size + "cqi");
  root.style.setProperty("--tracking", state.kern + "em");
  root.style.setProperty("--leading", state.lead);
  root.style.setProperty("--stroke", state.stroke + "px");
  root.style.setProperty("--pink", state.pink);
  root.style.setProperty("--red", state.red);
  root.style.setProperty("--border-color", state.borderColor);
  root.style.setProperty("--border-w", state.borderW + "px");

  els.font.value = state.font;
  els.weight.value = state.weight;
  els.size.value = state.size;
  els.kern.value = state.kern;
  els.lead.value = state.lead;
  els.stroke.value = state.stroke;
  els.pink.value = state.pink;
  els.red.value = state.red;
  els.borderColor.value = state.borderColor;
  els.borderW.value = state.borderW;

  els.vSize.textContent = state.size + "cqi";
  els.vKern.textContent = Number(state.kern).toFixed(3).replace(/0+$/, "").replace(/\.$/, "") + "em";
  els.vLead.textContent = Number(state.lead).toFixed(2);
  els.vStroke.textContent = state.stroke + "px";
  els.vBorderW.textContent = state.borderW + "px";
}

// The dev aid is hidden by default. Reveal it by adding ?edit (or #edit) to
// the URL — e.g. http://localhost:3000/?edit. When hidden, the art renders
// straight from the CSS :root values and the saved tweaks are left untouched.
const EDIT = /(?:[?&#])edit\b/.test(location.search + location.hash);
let state = load();
if (EDIT) apply(state);

function update(key, value) {
  state[key] = value;
  apply(state);
  save(state);
}

els.font.addEventListener("change", (e) => update("font", e.target.value));
els.weight.addEventListener("change", (e) => update("weight", e.target.value));
els.size.addEventListener("input", (e) => update("size", Number(e.target.value)));
els.kern.addEventListener("input", (e) => update("kern", Number(e.target.value)));
els.lead.addEventListener("input", (e) => update("lead", Number(e.target.value)));
els.stroke.addEventListener("input", (e) => update("stroke", Number(e.target.value)));
els.pink.addEventListener("input", (e) => update("pink", e.target.value));
els.red.addEventListener("input", (e) => update("red", e.target.value));
els.borderColor.addEventListener("input", (e) => update("borderColor", e.target.value));
els.borderW.addEventListener("input", (e) => update("borderW", Number(e.target.value)));

// Copy a ready-to-paste :root block of the current settings.
els.copy.addEventListener("click", async () => {
  const css = [
    "  --font: " + state.font + ";",
    "  --weight: " + state.weight + ";",
    "  --fs: " + state.size + "cqi;",
    "  --tracking: " + state.kern + "em;",
    "  --leading: " + state.lead + ";",
    "  --stroke: " + state.stroke + "px;",
    "  --pink: " + state.pink + ";",
    "  --red: " + state.red + ";",
    "  --border-color: " + state.borderColor + ";",
    "  --border-w: " + state.borderW + "px;",
  ].join("\n");
  try {
    await navigator.clipboard.writeText(css);
    els.copy.textContent = "Copied!";
  } catch {
    els.copy.textContent = "Copy failed";
  }
  setTimeout(() => (els.copy.textContent = "Copy CSS"), 1200);
});

els.reset.addEventListener("click", () => {
  state = { ...DEFAULTS };
  apply(state);
  save(state);
});

// Show/hide the panel.
els.toggle.addEventListener("click", () => {
  els.panel.hidden = !els.panel.hidden;
});

// Gear shows only in edit mode; the panel itself starts collapsed until tapped.
els.toggle.hidden = !EDIT;
els.panel.hidden = true;
