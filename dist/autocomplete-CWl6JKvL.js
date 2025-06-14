import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { p as partitionPlugins, f as filterPlugins, pluginTypes } from './index.js';

const autocomplete = (options) => {
  const [_lazyCompletions, completions] = partitionPlugins(filterPlugins(pluginTypes.completion, options));
  return [
    autocompletion({
      defaultKeymap: true,
      icons: false,
      override: completions,
      optionClass: () => "ink-tooltip-option"
    }),
    closeBrackets()
  ];
};

export { autocomplete };
//# sourceMappingURL=autocomplete-CWl6JKvL.js.map
