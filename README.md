# Cli cmd ast

CLI command ast parser manipulate program bash powershell generic agnostic.

> Please note that Cli cmd ast is currently under development and not yet suited for production

## Installation

```shell
 $ npm i cli-cmd-ast
```

## Usage



```ts
import { toAst, toCmd } from "cli-cmd-ast"

let yieldsAst = toAst(`npm "--org  google" cmd --flag --option1 val -v=1.1`)

yieldsAst = {
  cmds: [ 'npm', '--org  google', 'cmd' ],
  args: { flag: true, option1: 'val', v: 1.1 }
}
```

> Note that the order of commands is not preserved, if one command is after a flag, as this information is not part of the ast. 

```ts
let yieldsCmd = toCmd(yieldsAst)

yieldsCmd = `npm "--org  google" cmd --flag --option1 val -v=1.1`
```

## Contribute

All feedback is appreciated. Create a pull request or write an issue.
