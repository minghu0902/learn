import { VNode, VNodeData } from '../vnode';

export type On = {};

function invokeHandle(handle: any, vnode?: VNode, event?: Event) {
    if(typeof handle === 'function') {
        handle.call(vnode, event, vnode);
    } else if(typeof handle === 'object') {
        if(typeof handle[0] === 'function') {
            let args = handle.slice(1);;
            args.push(event);
            args.push(vnode);
            handle[0].apply(vnode, args);
        } else {
            for(let i = 0; i < handle.length; i++) {
                invokeHandle(handle[i], vnode, event);
            }
        }
    }

}

function handleEvent(event: Event, vnode: VNode) {
    let on = (vnode as VNodeData).on;
    if(on && on[event.type]) {
        invokeHandle(on[event.type], vnode, event);
    }
}

function createListener() {
    return function handler(event: Event) {
        handleEvent(event, (handler as any).vnode);
    }
}

function updateEventListeners(oldVnode: VNode, vnode: VNode) {
    let key: string,
        oldOn = (oldVnode as VNodeData).on,
        on = (vnode as VNodeData).on,
        oldElm = oldVnode.elm,
        elm = vnode.elm,
        oldListener = (oldVnode as any).listener;

    if(oldOn === on) return;

    if(oldOn && oldListener) {
        if(on) {
            for(key in oldOn) {
                if(!on[key]) {
                    oldElm.removeEventListener(key, oldListener, false);
                }
            }
        } else {
            for(key in oldOn) {
                oldElm.removeEventListener(key, oldListener, false);
            }
        }
    }

    if(on) {
        let listener = (vnode as any).listener = oldListener || createListener();
        listener.vnode = vnode;

        if(oldOn) {
            for(key in on) {
                if(!oldOn[key]) {
                    elm.addEventListener(key, listener, false);
                }
            }
        } else {
            for(key in on) {
                elm.addEventListener(key, listener, false);
            }
        }
    }
}