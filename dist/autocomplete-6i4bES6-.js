import { autocompletion as e, closeBrackets as i } from "@codemirror/autocomplete";
import { p, f as s, a as l } from "./index-CnraD7yL.js";
const m = (o) => {
  const [n, t] = p(s(l.completion, o));
  return [
    e({
      defaultKeymap: !0,
      icons: !1,
      override: t,
      optionClass: () => "ink-tooltip-option"
    }),
    i()
  ];
};
export {
  m as autocomplete
};
//# sourceMappingURL=autocomplete-6i4bES6-.js.map
