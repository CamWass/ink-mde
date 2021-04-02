import { RangeSetBuilder } from '@codemirror/rangeset'
import { Extension } from '@codemirror/state'
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view'

const codeBlockBaseTheme = EditorView.baseTheme({
  '.cm-line': { fontFamily: 'var(--hybrid-mde-font-family, sans-serif)' },
  '.cm-line.cm-codeblock': { fontFamily: 'var(--hybrid-mde-font-family-mono, monospace)', },
})

const codeBlockSyntaxNodes = [
  'FencedCode',
]

const codeBlockDecoration = Decoration.line({
  attributes: { class: 'cm-codeblock' }
})

const codeBlockPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = decorate(view)
  }

  update(viewUpdate: ViewUpdate) {
    if (viewUpdate.docChanged || viewUpdate.viewportChanged) {
      this.decorations = decorate(viewUpdate.view)
    }
  }
}, { decorations: (plugin) => plugin.decorations })

const decorate = (view: EditorView) => {
  const builder = new RangeSetBuilder<Decoration>()

  for (const { from, to } of view.visibleRanges) {
    for (let position = from; position < to;) {
      const line = view.state.doc.lineAt(position)

      // @ts-ignore: state.tree not recognized
      view.state.tree.iterate({ enter: (type, _from, _to) => {
        if (type.name !== 'Document') {
          if (codeBlockSyntaxNodes.includes(type.name)) {
            builder.add(line.from, line.from, codeBlockDecoration)
          }

          return false
        }
      }, from: line.from, to: line.to })

      position = line.to + 1
    }
  }

  return builder.finish()
}

export const taggedCodeBlocks = (): Extension => {
  return [
    codeBlockBaseTheme,
    codeBlockPlugin,
  ]
}
