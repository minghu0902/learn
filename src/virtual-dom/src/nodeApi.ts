import { INodeApi } from "../types/nodeApi.type";

export function createElement(tag: string) {
	return document.createElement(tag)
}

export function createElementNs(ns: string, tag: string) {
	return document.createElementNS(ns, tag)
}

export function createTextNode(text: string) {
	return document.createTextNode(text)
}

export function setTextContent(node: Node, text: string) {
	return node.textContent = text
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
	createElementNs,
	createTextNode,
	setTextContent,
	insertBefore,
	appendChild,
	removeChild,
	parentNode,
	nextSibling
} as INodeApi