
export interface INodeApi {
  createElement: (tag: string) => HTMLElement
  createTextNode: (text: string) => Text
  insertBefore: (parent: Node, node: Node, refNode: Node | null) => Node
  appendChild: (node: Node, childNode: Node) => Node
  removeChild: (node: Node, childNode: Node) => Node
  parentNode: (node: Node) => Node
  nextSibling: (node: Node) => Node | null
}