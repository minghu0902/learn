import { IVNode } from "./types/vnode.types";
import { isEquality, isUndef } from "./util";
import { IModule } from "./types/module.type";
import { INodeApi } from "./types/nodeApi.type";


function isSameVnode(a: IVNode, b: IVNode): boolean {
	return (
		a.tag === b.tag &&
		isEquality(a.data, b.data)
	)
}

function createElement(vnode: IVNode) {

}

function patchVnode(oldVnode: IVNode, vnode: IVNode) {

}

export function createPatchFunction(modules: IModule, api: INodeApi) {

	return function patch(oldVnode: IVNode, vnode: IVNode) {
		
		if (oldVnode === vnode) {
			patchVnode(oldVnode, vnode)
		} else {
			const oldElm = oldVnode.elm as Node
			const parentElm = api.parentNode(oldElm)
			createElement(vnode)
			api.insertBefore(parentElm, vnode.elm as Node, api.nextSibling(oldElm))
			api.removeChild(parentElm, oldElm)
		} 

		return vnode
	}
}
