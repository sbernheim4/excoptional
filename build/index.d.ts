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
     * Returns the underlying value if the instance is a Some. Otherwise returns
     * a None
     */
    get(): A | Option<undefined>;
    /**
     * @remarks Do not call this method. It is meant for internal use only.
     * @remarks This method should ONLY be invoked AFTER validating the current
     * option is a Some.
     */
    private internalGet;
    /**
     * Returns the underlying value if it's a Some. Otherwise returns the
     * provided argument.
     */
    getOrElse<B>(otherVal: B): A | B;
    /**
     * Returns the current instance if it's a Some. Otherwise returns the
     * provided Option argument.
     *
     * @remarks Useful for chaining successive function calls that each return
     * an option
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
     * Transforms and returns the underlying value if the instance is a Some by
     * applying the provided function to the underlying value. Otherwise returns
     * a None.
     */
    map<B>(fn: (val: A) => B): Option<B>;
    /**
     * A static version of map. Useful for lifting functions of type
     * (val: A) => B to be a function of type (val: Option<A>) => Option<B>.
     *
     * A curried version of map. First accepts the transformation function,
     * then the option.
     *
     * @example
     * ```
     * const appendToString = (val: string) => val + "@gmail.com";
     *
     * // Options (possibly returned by other functions):
     * const opt = Some("johnsmith");
     * const otherOpt = None();
     *
     * // Create a version of appendToString that works on values that are
     * // Options
     * const appendToOptionString = Option.map(appendToString);
     *
     * const possiblyAnEmailAddress = appendToOptionString(opt); // => Some("johnsmith@gmail.com")
     * const anotherPossibleEmailAddress = appendToOptionString(otherOpt); // => None();
     * ```
     */
    static map<B, A>(fn: (val: A) => B): (opt: Option<A>) => Option<B>;
    /**
     * Equivalent to map but returns the underlying value instead of an Option.
     * Returns one of alternativeVal (if provided) or undefined if the instance
     * is a None.
     */
    fold<B>(fn: (val: A) => B, alternativeVal?: B): B | undefined;
    /**
     * Transforms and returns the underlying value if the instance is a Some by
     * applying the provided function to the underlying value. Otherwise returns
     * a None. Prefer this to map when the provided function returns an Option.
     */
    flatMap<B>(fn: (val: A) => Option<B>): Option<B>;
    /**
     * A static version of flatMap. Useful for lifting functions of type
     * (val: A) => Option<B> to be a function of type
     * (val: Option<A>) => Option<B>
     *
     * A curried version of flatMap. First accepts the transformation function,
     * then the option.
     *
     * @example
     * ```
     * const returnIfValid = (stringToValidate: string): Option<string> => {
     *     if (stringToValidate.length > 5) {
     *         return Some(stringToValidate);
     *     } else {
     *         return None();
     *     }
     * }
     *
     * // Options (possibly returned by other parts of your code base)
     * const opt = Some("johnsmith");
     * const otherOpt = None();
     *
     * // Create a version of returnIfValid that works on values that are
     * // Options
     * const appendToOptionStringIfValid = Option.flatMap(returnIfValid);
     *
     * const possiblyAnEmailAddress = appendToOptionStringIfValid(opt); // => Some("johnsmith@gmail.com")
     * const anotherPossibleEmailAddress = appendToOptionStringIfValid(otherOpt); // => None();
     * // or
     * const possiblyAnEmailAddress2 = Option.flatMap(returnIfValid)(opt)
     * ```
     */
    static flatMap<B, A>(fn: (val: A) => Option<B>): (opt: Option<A>) => Option<B>;
    /**
     * A mix between map and flatMap. Accepts a function that returns either an
     * Option or non Optional value.
     * Always returns an Option.
     *
     * Makes the Option class into a thenable.
     *
     * If the instance is a None, a None is returned.
     * If the provided function returns an Option, the result of applying the
     * function to the underlying value is returned.
     * If the provided function returns a non Optional, the result of applying
     * the function to the underlying value is lifted into an Option and
     * returned.
     *
     * @example
     * ```
     * const myOpt = Some(10);
     *
     * const maybeDouble = (val: number): Option<number> => Math.random() > .5 ?
     *     Some(val * 2) :
     *     None();
     *
     * const alwaysDouble = (val: number): number => val * 2;
     *
     * // function calls can be chained with .then regarless if the functions
     * // passed to then return an Option or non Option.
     * const maybeMyOptDoubled = myOpt.then(maybeDouble).then(alwaysDouble);
     * ```
     */
    then<B>(fn: (val: A) => B | Option<B>): Option<B>;
    /**
     * Flattens a wrapped Option.
     * If the instance is a None, a None is returned.
     * If the underlying value is not an Option, the instance is returned.
     * If the underlying value is an option, the underlying value is returned.
     * In all cases, an Option is **always** returned.
     *
     * @remarks It's impossible to automatically and definitively infer the
     * underlying value's type. If the caller knows the possible type(s) of the
     * underlying value, the possible type(s) can be passed through the generic.
     *
     * @example
     * ```
     * // myFunc is a function of the type () => Option<number | string>;
     * const wrappedOpt = Some(myFunc());
     *
     * // The underlying value's type (wrappedOpt) is number | string so we pass
     * // that through.
     * const flattenedOption = wrappedOpt.flatten<number | string>();
     * ```
     */
    flatten<B>(): Option<B>;
    /**
     * Returns the instance if the underlying value passes the provided filter
     * function. Returns a None otherwise.
     */
    filter(filterFn: (val: A) => boolean): Option<A>;
    /**
     * Returns the instance if the underlying value *fails* the provided filter
     * function. Returns a None otherwise.
     *
     */
    filterNot(filterFn: (val: A) => boolean): Option<A>;
    /**
     * Returns a true if the underlying value contains the provided argument.
     * Returns false otherwise.
     *
     * @remarks Accepts an optional equality function for comparing two values
     * when the underlying value is not a primitive. By default this equality
     * function is JavaScript's ===.
     */
    contains(val: A, equalityFn?: (valOne: A, valTwo: A) => boolean): boolean;
    /**
     * Returns an Array with the underlying value when the instance is a Some.
     * Returns an empty Array otherwise.
     */
    toArray(): [A] | [];
    /**
     * Returns a Set containing the underlying value when the instance is a
     * Some. Returns an empty Set otherwise.
     */
    toSet(): Set<A>;
    /**
     * Logs the instance for easy debugging
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
     * Logs the option to the console.
     *
     * @example
     * ```
     * Some(3).log(); // => "Some(3)"
     * None().log(); // => "None"
     * ```
     */
    log(): void;
    /**
     * Returns an instance of an Option using the value passed to it
     * (if provided). Equivalent to using Some() or None() functions.
     */
    static of<A>(val?: A): Option<A>;
}
