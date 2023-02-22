import expectOrdered from "jest-expect-ordered"
import { stringify } from "./serialize"
import { circularDeepEqual } from "fast-equals"
import clone from "./clone"
import { toOrdinal } from "number-to-words"

declare global {
  namespace jest {
    interface Matchers<R, T> {
      eq(got: any): CustomMatcherResult
    }
  }
}


function eq(exp, got) {
  return {
    pass: exp === got || circularDeepEqual(clone(exp), clone(got)),
    message: () => `Expected ${this.utils.printReceived(clone(exp))} to be depply equal to ${this.utils.printExpected(clone(got))}`,
  }
}


expect.extend({
  ...expectOrdered,
  eq,
  inOrder(exp: any[], got) {
    if (exp[sym] === undefined) {
      exp[sym] = {arr: [...exp], counter: 0}
      expect.assertions(exp.length)
    }
    const { arr } = exp[sym]
    const empty = exp.length === 0
    const curVal = exp.shift()
    
    const counterIndex = exp[sym].counter
    exp[sym].counter++
    const counter = exp[sym].counter
    
    return {
      pass: !empty && circularDeepEqual(clone(curVal), clone(got)),
      message: () => `Expected checks in the following succession [${arr.map((e, i) => i < counterIndex ? this.utils.printExpected(e) : i === counterIndex ? this.utils.printReceived(got) : stringify(e)).join(", ")}].\nInstead of \n${this.utils.printReceived(got)}\n${this.utils.printExpected(curVal)}\nwas expected at the ${toOrdinal(counter)} invocation.`,
    }
  }
  
})

const sym = Symbol()