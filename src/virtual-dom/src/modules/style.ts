import { VNode, VNodeData } from '../vnode';

export type VNodeStyle = Record<string, string> & {
    delayed?: Record<string, string>
    remove?: Record<string, string>
}
                        
let raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
let nextFrame = function(fn) {raf(function() {raf(fn)})};

function setNextFrame(obj: any, prop: string, val: any) {
    nextFrame(function() { obj[prop] = val; })
}

function updateStyle(oldVnode: VNode, vnode: VNode): void {
    let cur: any,
        key: string,
        elm = vnode.elm,
        oldStyle = (oldVnode.data as VNodeData).style,
        style = (vnode.data as VNodeData).style;

    if(!oldStyle && !style) return;
    if(oldStyle === style) return;
    oldStyle = oldStyle || {};
    style = style || {};

    for(key in oldStyle) {
        if(!style[key]) {
            if(key[0] === '-' && key[1] === '-') {
                (elm as any).style.removeProperty(key);
            } else {
                (elm as any).style[key] = '';
            }
        }
    }

    for(key in style) {
        cur = style[key];
        if(key === 'delayed' && style.delayed) {
            for(let key2 in style.delayed) {
                cur = style.delayed[key2];
                if(!('delayed' in oldStyle) || cur !== oldStyle.delayed[key2]) {
                    setNextFrame((elm as any).style, key2, cur);
                }
            }
        } else if(key !== 'remove' && cur !== oldStyle[key]) {
            if(key[0] === '-' && key[1] === '-') {
                (elm as any).style.setProperty(key, cur);
            } else {
                (elm as any).style[key] = cur;
            }
        }
    }
}

function applyDestroyStyle(vnode: VNode): void {
    let key: string,
        elm = vnode.elm,
        style: any,
        s = (vnode.data as VNodeData).style;
    if(!s || !(style = s.destroy)) return;
    for(key in style) {
        (elm as any).style[key] = style[key];
    }
}

function applyRemoveStyle(vnode: VNode, rm: () => void): void {
    let key: string,
        style: any,
        amount = 0,
        elm = vnode.elm,
        s = (vnode.data as VNodeData).style,
        compStyle: CSSStyleDeclaration,
        applied: Array<string> = [],
        props: Array<string> = [];
    if(!s || !(style = s.remove)) {
        rm();
        return;
    }
    for(key in style) {
        applied.push(key);
        (elm as any).style[key] = style[key];
    }
    compStyle = getComputedStyle(elm as Element);
    props = compStyle['transition-property'].split(', ');
    for(let i = 0; i < props.length; i++) {
        if(applied.indexOf(props[i]) !== -1) {
            amount++;
        }
    }
    (elm as Element).addEventListener('transitionend', function(e) {
        if(e.target === elm) --amount;
        if(amount === 0) rm();
    })
}

