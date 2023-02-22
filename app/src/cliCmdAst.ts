const stoke = require("stoke")

type StokeAst = ({
  type: "unquoted" | "single-quoted" | "double-quoted" | "back-quoted",
  body: StokeAst
} | string)[] | string

function reduce(ast: string[]) {
  return ast.join(" ")
}

function simplifyAst(ast: StokeAst): SimpleAst {
  if (typeof ast === "string") return [ast]
  const newAst = ast.map((a) => {
    if (typeof a === "string") return a
    let s = reduce(simplifyAst(a.body))
    if (a.type === "unquoted") return s
    else return `"${s}"`
    
    return s
  })

  return newAst
}

type SimpleAst = string[]
type ArgAst = {
  cmds: string[],
  args: {
    [key: string]: string | number | boolean
  }
}


function parseArgs<Args extends {[key in string]: string | number | boolean}>(ast: SimpleAst): ArgAst & {args: Args} {
  const cmds: string[] = []
  const args: {
    [key: string]: string | number | boolean
  } = {} 

  for (let i = 0; i < ast.length; i++) {
    const arg = ast[i]
    if (arg[0] === "-") {
      const v = arg.slice(arg[1] === "-" ? 2 : 1)
      let [key, value] = v.split("=")
      if (args[key] !== undefined) throw new Error(`Duplicate argument: ${key}`)

      if (!value) {
        if (ast[i + 1] && ast[i + 1][0] !== "-") {
          value = ast[i + 1]
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, value.length - 1)
          i++
        }
      }

      if (value) {
        if (!isNaN(+value)) args[key] = +value
        else args[key] = value
      }
      else args[key] = true
    }
    else {
      cmds.push(arg[0] === '"' ? arg.slice(1, arg.length - 1) : arg)
    }
  }

  return {
    cmds,
    args: args as Args
  }
}

export function toAst(cmd: string) {
  const stokeAst = stoke(cmd)
  const simpleAst = simplifyAst(stokeAst)
  const parsedArgs = parseArgs(simpleAst)

  return parsedArgs
}

export function toCmd(ast: ArgAst) {
  const cmds = ast.cmds.map((cmd) => cmd.includes(" ") ? `"${cmd}"` : cmd).join(" ")
  const args = Object.entries(ast.args).map(([key, value]) => {
    const keyStr = key.length === 1 ? `-${key}` : `--${key}`
    if (value === true) return keyStr
    else return `${keyStr} ${(value + "").includes(" ") ? `"${value}"` : value}`
  }).join(" ")

  return `${cmds} ${args}`
}


