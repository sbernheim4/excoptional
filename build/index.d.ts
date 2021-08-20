export declare const None: () => any;
export declare const Some: <T>(val: T) => Some<T>;
export declare type Some<A> = Option<A>;
export declare type None = Option<undefined>;
export declare class Option<A> {
    private val;
    /**
     * Construct an instance of an Option.
     */
    private constructor();
    /**
     * Returns true if the instance is a None. Returns false otherwise
     */
    isNone(): boolean;
    /**
     * Returns true if the instance is a Some. Returns false otherwise
     */
    isSome(): boolean;
    /**
     * An alias for isSome
     * Returns true if the instance is a Some. Returns false otherwise
     */
    exists(): boolean;
    /**
     * An alias for isSome
     * Returns true if the instance is a Some. Returns false otherwise
     */
    nonEmpty(): boolean;
    /**
     * Returns the underlying value if the instance is a Some. Returns a
     * None otherwise
     */
    get(): A | None;
    /**
     * @remarks Do not call this method. It is meant for internal use
     * only.
     *
     * @remarks This method should ONLY be invoked AFTER validating the
     * current option is a Some.
     */
    private internalGet;
    /**
     * Returns the underlying value if it's a Some. Returns the provided
     * argument otherwise.
     */
    getOrElse<B>(otherVal: B): A | B;
    /**
     * Returns the current instance if it's a Some. Returns the provided
     * Option argument otherwise.
     *
     * @remarks Useful for chaining successive function calls that each
     * return an option
     *
     * @example
     * ```
     * const firstSuccessfulOptionValue = fnReturnsOption
     *     .orElse(fn2ReturnsOption())
     *     .orElse(fn3ReturnsOption())
     *     .orElse(fn4ReturnsOption())
     * ```
     */
    orElse<B>(otherOption: Option<B>): Option<A> | Option<B>;
    /**
     * Transforms the underlying value if the instance is a Some by
     * applying the provided function to the underlying value, returning
     * the transformed value in an Option.
     * Returns a None otherwise.
     */
    map<B>(fn: (val: A) => B): Option<B>;
    /**
     * A static version of map. Useful for lifting functions of type
     * (val: A) => B to be a function of type
     * (val: Option<A>) => Option<B>.
     *
     * A curried version of map. First accepts the transformation
     * function, then the option.
     *
     * @example
     * ```
     * const appendToString = (val: string) => val + "@gmail.com";
     *
     * // Options (possibly returned by other functions):
     * const opt = Some("johnsmith");
     * const otherOpt = None();
     *
     * // Create a version of appendToString that works on values that
     * // are Options
     * const appendToOptionString = Option.map(appendToString);
     *
     * const maybeAnEmailAddress = appendToOptionString(opt);
     * // maybeAnEmailAddress => Some("johnsmith@gmail.com")
     *
     * const maybeAnEmailAddress2 = appendToOptionString(otherOpt);
     * // maybeAnEmailAddress2 => None();
     * ```
     */
    static map<B, A>(fn: (val: A) => B): (opt: Option<A>) => Option<B>;
    /**
     * Equivalent to map but returns the underlying value instead of an
     * Option. Returns one of alternativeVal (if provided) or undefined
     * if the instance is a None.
     */
    fold<B>(fn: (val: A) => B, alternativeVal?: B): B | undefined;
    /**
     * Transforms and returns the underlying value if the instance is a
     * Some by applying the provided function to the underlying value.
     * Returns a None otherwise.
     *
     * @remarks Prefer this to `map` when the provided function returns
     * an Option.
     *
     * @remarks If unsure of which method to use between `map`,
     * `flatMap`, and `then`, `then` should always work.
     */
    flatMap<B>(fn: (val: A) => Option<B>): Option<B>;
    /**
     * A static version of flatMap. Useful for lifting functions of type
     * (val: A) => Option<B> to be a function of type
     * (val: Option<A>) => Option<B>
     *
     * A curried version of flatMap. First accepts the transformation
     * function, then the Option.
     *
     * @example
     * ```
     * const getIfValid = (strToValidate: string): Option<string> => {
     *     if (strToValidate.length > 5) {
     *         return Some(strToValidate);
     *     } else {
     *         return None();
     *     }
     * }
     *
     * // Options (possibly returned by other parts of your code base)
     * const opt = Some("johnsmith");
     * const otherOpt = None();
     *
     * // Create a version of getIfValid that works on Option<string>
     * const appendToOptionStrIfValid = Option.flatMap(getIfValid);
     *
     * const maybeAnEmailAddress = appendToOptionStrIfValid(opt);
     * // maybeAnEmailAddress => Some("johnsmith@gmail.com")
     *
     * const maybeAnEmailAddress2 = appendToOptionStrIfValid(otherOpt);
     * // maybeAnEmailAddress2 => None();
     *
     * // This next line is equivalent to the above.
     * const maybeAnEmailAddress3 = Option.flatMap(getIfValid)(opt)
     * ```
     */
    static flatMap<B, A>(fn: (val: A) => Option<B>): (opt: Option<A>) => Option<B>;
    /**
     * A mix between map and flatMap. Accepts a function that returns
     * either an Option or non Optional value.
     *
     * Always returns an Option.
     *
     * Makes the Option class into a thenable.
     *
     * If the instance is a None, a None is returned.
     * If the provided function returns an Option, the result of
     * applying the function to the underlying value is returned.
     * If the provided function returns a non Optional, the result of
     * applying the function to the underlying value is lifted into an
     * Option and returned.
     *
     * @example
     * ```
     * const myOpt = Some(10);
     *
     * const maybeDouble = (val: number): Option<number> => {
     *     Math.random() > .5 ?
     *         Some(val * 2) :
     *         None();
     * }
     *
     * const alwaysDouble = (val: number): number => val * 2;
     *
     * // function calls can be chained with .then regarless if the
     * // functions passed to then return an Option or non Option.
     * const maybeOptDoubled = myOpt.then(maybeDouble)
     *                              .then(alwaysDouble);
     * ```
     */
    then<B>(fn: (val: A) => B | Option<B>): Option<B>;
    /**
     * Flattens and returns a wrapped Option.
     *
     * If the instance is a None, a None is returned.
     * If the underlying value is **not** an Option, the instance is
     * returned.
     * If the underlying value is an option, the underlying value is
     * returned.
     * In all cases, an Option is **always** returned (making the method
     * safe for chaining).
     *
     * @remarks It's impossible to automatically and definitively infer
     * the underlying value's type. If the caller knows the possible
     * type(s) of the underlying value, the possible type(s) can be
     * passed through the generic.
     *
     * @example
     * ```
     * // Assume myFunc is of the type () => number | string;
     * const wrappedOpt = Some(myFunc());
     *
     * // wrappedOpt's underlying value is of the type number | string.
     * // Pass that type through the generic for accurate typing.
     * const flattenedOption = wrappedOpt.flatten<number | string>();
     * ```
     */
    flatten<B>(): Option<B>;
    /**
     * Returns the instance if the underlying value passes the provided
     * filter function. Returns a None otherwise.
     */
    filter(filterFn: (val: A) => boolean): Option<A>;
    /**
     * Returns the instance if the underlying value **fails** the
     * provided filter function. Returns a None otherwise.
     */
    filterNot(filterFn: (val: A) => boolean): Option<A>;
    /**
     * Returns true if the underlying value contains the provided
     * argument. Returns false otherwise.
     *
     * @remarks Accepts an optional equality function for comparing two
     * values for when the underlying value is not a primitive. By
     * default this equality function is JavaScript's ===.
     */
    contains(val: A, equalityFn?: (valOne: A, valTwo: A) => boolean): boolean;
    /**
     * Returns an Array with the underlying value when the instance is a
     * Some. Returns an empty Array otherwise.
     */
    toArray(): [A] | [];
    /**
     * Returns a Set containing the underlying value when the instance
     * is a Some. Returns an empty Set otherwise.
     */
    toSet(): Set<A>;
    /**
     * Returns a string representation of the option.
     * Useful for console logging an instance.
     *
     * @example
     * ```
     * console.log(Some(3)); // => "Some(3)"
     * console.log(None); // => "None"
     * ```
     */
    toString(): string;
    /**
     * An alias for toString();
     */
    toStr(): string;
    /**
     * Logs the Option to the console invoking both console.log and
     * toString for you.
     *
     * @example
     * ```
     * Some(3).log(); // => "Some(3)"
     * None().log(); // => "None"
     * ```
     */
    log(): void;
    /**
     * Returns an instance of an Option using the value passed to it (if
     * provided). Equivalent to using the Some() or None() functions.
     */
    static of<A>(val?: A): Option<A>;
}
