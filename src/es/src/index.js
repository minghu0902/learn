import { VNode } from "./vnode";
import { createPatchFunction } from "./pach";
import nodeApi from "./nodeApi";
export function patch() {
    return createPatchFunction([], nodeApi);
}
export function h(tag, data, children, text) {
    return new VNode(tag, data, children, text);
}
export default h;
