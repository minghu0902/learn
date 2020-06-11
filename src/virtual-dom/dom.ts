
export function createElement(tag: string) {
	return document.createElement(tag)
}

export function interBefore(parentNode: Node, newNode: Node, refNode: Node) {
	return parentNode.insertBefore(newNode, refNode)
}

export function removeChild(node: Node, childNode: Node) {
	return node.removeChild(childNode)
}