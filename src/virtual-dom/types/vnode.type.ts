import { On } from "./module.type";
import { Hooks } from "./hooks.type";

export interface IPlainObject {
	[key: string]: any
}

export interface IVNode {
	tag?: string
	data?: IVNodeData
	children?: IVNode[]
	text?: string
	elm?: Node
	key?: string | number
}

export interface IVNodeData {
	key?: string | number
	class?: { [key: string]: boolean }
	style?: { [key: string]: string }
	props?: IPlainObject
	attrs?: IPlainObject
	on?: On
	ns?: string
	hook?: Hooks
}
