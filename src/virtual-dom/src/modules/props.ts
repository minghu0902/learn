import { VNode, VNodeData } from '../vnode';

export type Props = Record<string, any>;

function updateProps(oldVnode: VNode, vnode: VNode): void {
    let cur: any,
        old: any,
        key: string,
        elm = vnode.elm,
        oldProps = (oldVnode.data as VNodeData).props,
        props = (vnode.data as VNodeData).props;
    
    if(!oldProps && !props) return;
    if(oldProps === props) return;
    oldProps = oldProps || {};
    props = props || {};
    
    for(key in oldProps) {
        if(!props[key]) {
            delete elm[key];
        }
    }

    for(key in props) {
        cur = props[key];
        old = oldProps[key];
        if(old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur
        }
    }
}

export default updateProps;