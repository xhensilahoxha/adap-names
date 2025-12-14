import { Equality } from '../common/Equality';
import { Printable } from '../common/Printable';
import { Cloneable } from '../common/Cloneable';

//Immutable value type for Name
export interface Name extends Cloneable<Name>, Printable, Equality<Name>{
  
  isEmpty(): boolean;
  getNoComponents(): number;

  //returns the (masked) component at i  
  getComponent(i: number): string;

  //returns a NEW Name where i is replaced by c
  withComponent(i: number, c: string): Name;


  //returns a NEW Name with c inserted at i
  withInserted(i: number, c: string): Name;

  //returns a NEW Name with c appended
  withAppended(c: string): Name;

  //returns a NEW Name which is this + other  
  withConcatenated(other: Name): Name;


  //returns a NEW Name with i removed  
  withRemoved(i: number): Name;

}
