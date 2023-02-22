// This is a copy of json-decycle. 
// Cannot import via npm because it uses nullish coalescing operator which webpack 4 doesnt support. Ts-compiler will fix this if target is at or below es2019



/**
 * @param {any} value 
 */
const isObject = (value) => typeof value === 'object'
&& value != null
&& !(value instanceof Boolean)
&& !(value instanceof Date)
&& !(value instanceof Number)
&& !(value instanceof RegExp)
&& !(value instanceof String)

/**
* @param {string[]} parts 
*/
const toPointer = (parts) => '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/')

const sym = Symbol('$ref')

/**
* @returns (key: string | symbol, value: any) => any
*/
export const decycle = () => {
 const paths = new WeakMap()

 /**
   * @param {string | symbol} key
   * @param {any} value
   * @this object
   */
 return function replacer(key, value) {
   if (key === '$ref' && (typeof value === "string" || (value instanceof String && !value[sym])) && value.startsWith("#")) return "#" + value
   if (isObject(value)) {
     const seen = paths.has(value)

     if (seen) {
       const $ref = new String(toPointer(paths.get(value)))
       $ref[sym] = true
       return { $ref }
     } else {
       paths.set(value, [...paths.get(this) ?? [], key])
     }
   }

   return value
 }
}

/**
* @returns (key: string | symbol, value: any) => any
*/
export function retrocycle() {
const parents = new WeakMap()
const keys = new WeakMap()
const refs = new Set()

/**
 * @param {{ $ref: string }} ref
 * @this object
 */
function dereference(ref) {
  const parts = ref.$ref.slice(1).split('/')
  let key, parent, value = this

  for (var i = 0; i < parts.length; i++) {
    key = parts[i].replace(/~1/g, '/').replace(/~0/g, '~')
    value = value[key]
  }

  parent = parents.get(ref)
  parent[keys.get(ref)] = value
}

/**
 * @param {string | symbol} key
 * @param {any} value
 * @this object
 */
 return function reviver(key, value) {
   if (key === '$ref' && typeof value === "string") {
     if (value.startsWith("##")) return value.slice(1)
     else if (value.startsWith("#")) {
       refs.add(this)
       return value
     }
   } 
   if (isObject(value)) {
     var isRoot = key === '' && Object.keys(this).length === 1
     if (isRoot) {
       refs.forEach(dereference, this)
     } else {
       parents.set(value, this)
       keys.set(value, key)
     }
   }

   return value
 }
}



export function parse(str: string) {
 if (str === undefined) return undefined
 return JSON.parse(str, retrocycle())
}

export function stringify(obj: any, space?: string | number) {
 return JSON.stringify(obj, decycle(), space)
}