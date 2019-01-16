import { VNode, VNodeData } from '../vnode';

export type Classes = Record<string, boolean>;

function updateClass(oldVnode: VNode, vnode: VNode): void {
    let cur: any,
        key: string,
        elm: Element = vnode.elm as Element,
        oldClass = (oldVnode.data as VNodeData).class,
        klass = (oldVnode.data as VNodeData).class;
    
    if(!oldClass && !klass) return;
    if(oldClass === klass) return;
    oldClass = oldClass || {};
    klass = klass || {};

    for(key in klass) {
        cur = klass[key];
        if(cur !== oldClass[key]) {
            elm.classList[cur ? 'add' : 'remove'](key);
        }
    }

    for(key in oldClass) {
        if(!klass[key]) {
            elm.classList.remove(key);
        }
    }
}

export default updateClass;