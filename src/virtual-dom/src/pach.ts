import { IVNode } from "../types/vnode.types";
import { isEquality, isDef, isUndef, isArray, isPrimitive } from "./util";
import { IModule } from "../types/module.type";
import { INodeApi } from "../types/nodeApi.type";


function isSameVnode(a: IVNode, b: IVNode): boolean {
	return (
		a.tag === b.tag &&
		isEquality(a.data, b.data)
	)
}


function patchVnode(oldVnode: IVNode, vnode: IVNode) {

}

export function createPatchFunction(modules: IModule, nodeApi: INodeApi) {

	function createElm(vnode: IVNode, parentElm?: Element) {
		const tag = vnode.tag
		const children = vnode.children
		
		if (isDef(tag)) {
			vnode.elm = nodeApi.createElement(tag as string)

			if (parentElm) {
				insert(vnode.elm, parentElm)
			}

			if (isArray(children)) {
				createChildren(vnode, children)
			} else if (isPrimitive(vnode.text)) {
				nodeApi.appendChild(vnode.elm, nodeApi.createTextNode(String(vnode.text)))
			}
		} else {
			if (isPrimitive(vnode.text)) {
				vnode.elm = nodeApi.createTextNode(String(vnode.text))
			}
		}

	}

	function insert(elm: Element, parentElm: Element, refElm?: Element) {
		if (refElm) {
			nodeApi.insertBefore(parentElm, elm, refElm)
		} else {
			nodeApi.appendChild(elm, parentElm)
		}
	}

	function createChildren(vnode: IVNode, children: IVNode[]) {
		if (isArray(children)) {
			for (const child of children) {
				createElm(child, vnode.elm as Element)
			}
		}
	}

	return function patch(oldVnode: IVNode, vnode: IVNode) {

		if (isUndef(oldVnode)) {
			// 首次挂载
			createElm(vnode)
		} else {
			if (isSameVnode(oldVnode, vnode)) {
				patchVnode(oldVnode, vnode)
			} else {
				const oldElm = oldVnode.elm as Node
				const parentElm = nodeApi.parentNode(oldElm)
				createElm(vnode)
				nodeApi.insertBefore(parentElm, vnode.elm as Node, nodeApi.nextSibling(oldElm))
				nodeApi.removeChild(parentElm, oldElm)
			} 
		}
		
		return vnode
	}
}
