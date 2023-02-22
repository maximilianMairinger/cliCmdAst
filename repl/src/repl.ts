import { toAst, toCmd } from "../../app/src/cliCmdAst"
//const testElem = document.querySelector("#test")

console.log(toAst(`npm "--org  google" cmd --flag --option1 val -v=1.1`))
