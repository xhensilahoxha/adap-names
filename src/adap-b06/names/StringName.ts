import { DEFAULT_DELIMITER } from '../common/Printable';

import { Name } from './Name';
import { AbstractName } from './AbstractName';

import { IllegalArgumentException } from '../common/IllegalArgumentException';
import { InvalidStateException } from '../common/InvalidStateException';

 //immutable value object: Name
export class StringName extends AbstractName{

  protected name: string= '';
  protected noComponents: number= 0;

  constructor(source: string, delimiter: string= DEFAULT_DELIMITER, noComponentsOverride?: number){
    super(delimiter);

    // if number of components is provided,trust the caller
    if(noComponentsOverride!== undefined){
      this.name = source;
      this.noComponents= noComponentsOverride;
    }else{
      //compute component count from string
      this.name= source;
      this.noComponents =(source === '') ? 1 : this.name.split(this.delimiter).length;
    }

    this.assertClassInvariant();
  }

  // return: how many components 
  public getNoComponents(): number{
    return this.noComponents;
  }

  public getComponent(i: number): string{

    this.assertValidIndexAsPrecondition(i);
    const parts= this.getComponentsArray();
    return parts[i]; //masked component
  }

  //changed! required by Cloneable<Name>
  public clone(): Name{
    // returns: identical copy of the value object
    return new StringName(this.name, this.delimiter, this.noComponents);
  }

  public isEmpty(): boolean{
    return this.noComponents=== 0;
  }

  // -----------------------immutable operations
  //return a NEW Name instance and never change it

  protected doWithComponent(i: number, c: string): Name{
    this.assertValidIndexAsPrecondition(i);
    const parts= this.getComponentsArray();
    parts[i]= c; 
    return StringName.fromComponents(parts, this.delimiter);
  }

  protected doWithInserted(i: number, c: string): Name{
    this.assertValidInsertIndexAsPrecondition(i);
    const parts= this.getComponentsArray();
    parts.splice(i, 0, c);
    return StringName.fromComponents(parts, this.delimiter);
  }

  protected doWithAppended(c: string): Name{
    const parts= this.getComponentsArray();
    parts.push(c);
    return StringName.fromComponents(parts, this.delimiter);
  }

  protected doWithRemoved(i: number): Name{
    this.assertValidIndexAsPrecondition(i);
    const parts= this.getComponentsArray();
    parts.splice(i, 1);
    return StringName.fromComponents(parts, this.delimiter);
  }

  protected doWithConcatenated(other: Name): Name{
    IllegalArgumentException.assert(other !== null && other !== undefined, 
                                  'other name must not be null');

    const parts= this.getComponentsArray();
    for(let i=0; i<other.getNoComponents();i++){
      parts.push(other.getComponent(i)); // already masked
    }
    return StringName.fromComponents(parts, this.delimiter);
  }
  // -----------------------
  
  // -----------------------helpers

  protected static fromComponents(components: string[], delimiter: string): StringName{
    //no components means empty name
    if(components.length=== 0){
      return new StringName('', delimiter, 0);
    }
    //one empty component
    if(components.length=== 1 && components[0]=== ''){
      return new StringName('', delimiter, 1);
    }
    //normal case
    return new StringName(components.join(delimiter), delimiter, components.length);
  }

  //returns an array view of masked components
  protected getComponentsArray(): string[]{
    let components: string[];

    if(this.noComponents=== 0){
      components= [];
    } else if(this.noComponents=== 1 && this.name=== ''){
      components= [''];
    } else{
      components= this.name.split(this.delimiter);
    }
    
    //internal consistency check
    InvalidStateException.assert(
      components.length=== this.noComponents,
      'components length must match noComponents'
    );
    return components;
  }

  protected assertClassInvariant(): void{
    super.assertClassInvariant();

    InvalidStateException.assert(
      this.noComponents!== 0 || this.name=== '',
      'empty name must have 0 components'
    );
  }
}
