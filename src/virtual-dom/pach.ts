import { IVNode } from "./types/vnode.types";
import { isEquality, isUndef } from "./util";

function isSameVnode(a: IVNode, b: IVNode) {
	return (
		a.tag === b.tag &&
		isEquality(a.data, b.data)
	)
}

function createElement(vnode: IVNode) {

}

function patchVnode(oldVnode: IVNode, vnode: IVNode) {
	
}
