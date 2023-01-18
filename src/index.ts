// just a dummy file to satisfy tsc

interface Bar {
  prop1: number;
}
interface ParamOne {
  foo: string;
  bar: Bar;
  bax?: string;
}

function one(param: ParamOne) {
  console.log(param.bar);
}

export default one;