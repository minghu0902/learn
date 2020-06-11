
export interface INodeApi {
  createElement: (tag: string) => HTMLElement
  insertBefore: (parent: Node, node: Node, refNode: Node | null) => Node
  removeChild: (node: Node, childNode: Node) => Node
  parentNode: (node: Node) => Node
  nextSibling: (node: Node) => Node | null
}