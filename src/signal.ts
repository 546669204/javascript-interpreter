
declare type SignalType = "return" | "break" | "continue" | "normal";

export class Signal {
  type: SignalType = "normal";
  value: any = undefined;
  target: string | undefined = undefined;
  constructor(o: any) {
    Object.assign(this, o);
  }
}
