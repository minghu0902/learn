export function createElement(tag) {
    return document.createElement(tag);
}
export function createElementNs(ns, tag) {
    return document.createElementNS(ns, tag);
}
export function createTextNode(text) {
    return document.createTextNode(text);
}
export function setTextContent(node, text) {
    return node.textContent = text;
}
export function insertBefore(parentNode, newNode, refNode) {
    return parentNode.insertBefore(newNode, refNode);
}
export function appendChild(node, childNode) {
    return node.appendChild(childNode);
}
export function removeChild(node, childNode) {
    return node.removeChild(childNode);
}
export function parentNode(node) {
    return node.parentNode;
}
export function nextSibling(node) {
    return node.nextSibling;
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
};
