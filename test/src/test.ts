import { toAst, toCmd } from "../../app/src/cliCmdAst"
import "./extend"

describe("example", () => {
  
  test("to ast", () => {
    expect(toAst(`npm "--org  google" cmd --flag --option1 val -v=1.1`)).eq({
      cmds: [ 'npm', '--org  google', 'cmd' ],
      args: { flag: true, option1: 'val', v: 1.1 }
    })
  })
  test("to cmd", () => {
    expect(toCmd({
      cmds: [ 'npm', '--org  google', 'cmd' ],
      args: { flag: true, option1: 'val', v: 1.1 }
    })).toBe(`npm "--org  google" cmd --flag --option1 val -v 1.1`)
  })
  
})