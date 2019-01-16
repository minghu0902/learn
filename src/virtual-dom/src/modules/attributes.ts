import { VNode, VNodeData } from "../vnode";

export type Attrs = Record<string, string | number | boolean>;

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58; // :
const xChar = 120; // x

function updateAttrs(oldVnode: VNode, vnode: VNode): void {
    let cur: any,
        key: string,
        elm: Element = vnode.elm as Element,
        oldAttrs = (oldVnode.data as VNodeData).attrs,
        attrs = (vnode.data as VNodeData).attrs;
    
    if(!oldAttrs && !attrs) return;
    if(oldAttrs === attrs) return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};

    for(key in attrs) {
        cur = attrs[key];
        if(cur === true) {
            elm.setAttribute(key, '');
        } else if(cur === false){
            elm.removeAttribute(key);
        } else {
            if(key.charCodeAt(0) !== xChar) {
                // 属性值不以 x 开头
                elm.setAttribute(key, cur);
            } else if(key.charCodeAt(3) === colonChar) {
                // xml namespace
                elm.setAttributeNS(xmlNS, key, cur);
            } else if(key.charCodeAt(5) === colonChar) {
                // xlink namespace
                elm.setAttributeNS(xlinkNS, key, cur);
            } else {
                elm.setAttribute(key, cur);
            }
        }
    }

    for(key in oldAttrs) {
        if(!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}

export default updateAttrs;