// make it work for generic implementation
export interface Cloneable<T> {

    /**
     * Returns shallow copy (clone) of this object
     */
    clone(): T; // @todo Clarify use of Objects vs object

}