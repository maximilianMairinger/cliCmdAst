export const cloneKeysButKeepSym = (() => {
  let known: WeakMap<any, any>
  return function cloneKeysButKeepSym(ob: any) {
    known = new WeakMap()
    return cloneKeysButKeepSymRec(ob)
  }
  function cloneKeysButKeepSymRec(ob: any) {
    if (ob instanceof Object) {
      if (known.has(ob)) return known.get(ob)
      const cloned = new ob.constructor()
      known.set(ob, cloned)
      for (const key of Object.keys(ob)) cloned[key] = cloneKeysButKeepSymRec(ob[key])
      for (const sym of Object.getOwnPropertySymbols(ob)) cloned[sym] = ob[sym]
      return cloned
    }
    else return ob
  }
})()

export function mergeDeepButNotRecursive(from, into) {
  for (const key of Object.keys(from)) {
    if (into[key] instanceof Object && from[key] instanceof Object) {
      mergeDeepButNotRecursive(from[key], into[key])
    }
    else {
      into[key] = from[key]
    }
  }
  return into
}

export const mergeDeep = (() => {
  let known: WeakMap<any, any>
  return function mergeDeep(from, into) {
    known = new WeakMap()
    return mergeDeepRec(from, into)
  }
  function mergeDeepRec(from, into) {
    if (from instanceof Object) {
      if (known.has(from)) return known.get(from)
      known.set(from, into)
      for (const key of Object.keys(from)) {
        if (into[key] instanceof Object && from[key] instanceof Object) {
          mergeDeepRec(from[key], into[key])
        }
        else {
          into[key] = from[key]
        }
      }
      return into
    }
    else return from
  }
})()



export const cloneKeys = (() => {
  let known: WeakMap<any, any>
  return function cloneKeys(ob: any) {
    known = new WeakMap()
    return cloneKeysRec(ob)
  }
  function cloneKeysRec(ob: any) {
    if (ob instanceof Object) {
      if (known.has(ob)) return known.get(ob)
      const cloned = new ob.constructor()
      known.set(ob, cloned)
      for (const key of Object.keys(ob)) cloned[key] = cloneKeysRec(ob[key])
      return cloned
    }
    else return ob
  }
})()

export default cloneKeys