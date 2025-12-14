export interface Equality<T> {

    /**
     * Returns true if other object is of equal value to this one
    //  * @param other Object to compare with
     */
    isEqual(other: T): boolean;

    /**
     * Returns hashcode for this object, respecting equality contract
     */
    getHashCode(): number;
    
}
