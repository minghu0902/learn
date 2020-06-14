
export interface INodeApi {
  createElement: (tag: string) => HTMLElement
  createElementNs: (ns: string, tag: string) => Element
  createTextNode: (text: string) => Text
  setTextContent: (node: Node, text: string | null) => string | null
  insertBefore: (parent: Node, node: Node, refNode: Node | null) => Node
  appendChild: (node: Node, childNode: Node) => Node
  removeChild: (node: Node, childNode: Node) => Node
  parentNode: (node: Node) => Node
  nextSibling: (node: Node) => Node | null
}