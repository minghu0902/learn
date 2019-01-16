import { VNode, VNodeData } from '../vnode';

export type Dataset = Record<string, string>;

function updateDataset(oldVnode: VNode, vnode: VNode): void {
    let key: string,
        elm: HTMLElement = vnode.elm as HTMLElement,
        oldDataset = (oldVnode.data as VNodeData).dataset,
        dataset = (vnode.data as VNodeData).dataset;
    
    if(!oldDataset && !dataset) return;
    if(oldDataset === dataset) return;
    oldDataset = oldDataset || {};
    dataset = dataset || {};

    let d = elm.dataset;
    for(key in oldDataset) {
        if(!dataset[key]) {
            if(d) {
               if(key in d) {
                    delete d[key];
               }
            } else {
                elm.removeAttribute('data-' + key);
            }
        }
    }

    for(key in dataset) {
        if(dataset[key] !== oldDataset[key]) {
            if(d) {
                d[key] = dataset[key]
            } else {
                elm.setAttribute('data-' + key, dataset[key]);
            }
        }
    }
}