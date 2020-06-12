import { INodeApi } from "./types/nodeApi.type";

export function createElement(tag: string) {
	return document.createElement(tag)
}

export function createTextNode(text: string) {
	return document.createTextNode(text)
}

export function insertBefore(parentNode: Node, newNode: Node, refNode: Node) {
	return parentNode.insertBefore(newNode, refNode)
}

export function appendChild(node: Node, childNode: Node) {
	return node.appendChild(childNode)
}

export function removeChild(node: Node, childNode: Node) {
	return node.removeChild(childNode)
}

export function parentNode(node: Node) {
	return node.parentNode
}

export function nextSibling(node: Node) {
	return node.nextSibling
}

export default {
	createElement,
	createTextNode,
	insertBefore,
	appendChild,
	removeChild,
	parentNode,
	nextSibling
} as INodeApi