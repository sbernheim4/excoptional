/**
 * Creates and returns a None. Takes no arguments.
 */
export const None = (): None => {
    // @ts-ignore
    return new Option(undefined);
}
/**
 * Creates and returns a Some using the provided argument as the
 * underlying value.
 *
 * @remarks Do not pass undefined as the argument to this function.
 * Doing so will create a Some that will behave like a None.
 */
export const Some = <T>(val: T): Some<T> => {
    // @ts-ignore
    return new Option(val);
}

export type Some<A> = Option<A>;
export type None = Option<never>;

/**
 * The Option class
 *
 * Construct instances of Options through the provided `Some` and `None`
 * functions or the class's static `of` method.
 */
export class Option<A> {
    private val: A;

    /**
     * Construct an instance of an Option.
     */
    private constructor(val: A) {
        this.val = val;
    }

    /**
     * Returns true if the instance is a None. Returns false otherwise
     */
    isNone(): boolean {
        return this.val === undefined;
    }

    /**
     * Returns true if the instance is a Some. Returns false otherwise
     */
    isSome(): boolean {
        return this.val !== undefined;
    }

    /**
     * An alias for isSome
     * Returns true if the instance is a Some. Returns false otherwise
     */
    exists(): boolean {
        return this.isSome();
    }

    /**
     * An alias for isSome
     * Returns true if the instance is a Some. Returns false otherwise
     */
    nonEmpty(): boolean {
        return this.isSome();
    }

    /**
     * Returns the underlying value if the instance is a Some. Returns a
     * None otherwise
     */
    get(): A | None {
        return this.isSome() ?
            this.val :
            None();
    }

    /**
     * @remarks Do not call this method. It is meant for internal use
     * only.
     *
     * @remarks This method should ONLY be invoked AFTER validating the
     * current option is a Some.
     */
    private internalGet(): A {
        if (this.isSome()) {
            return this.val;
        }

        throw new Error(
            `Attempted to get a None. If you're seeing this something internal went wrong.
Please file a minimal working example in a Github Issue.
This error should never be thrown.`
        );
    }

    /**
     * Returns the underlying value if it's a Some. Returns the provided
     * argument otherwise.
     */
    getOrElse<B>(otherVal: B): A | B {
        return this.isSome() ?
            this.internalGet() :
            otherVal;
    }

    /**
     * Returns the current instance if it's a Some. Returns the provided
     * Option argument otherwise.
     *
     * @remarks Useful for chaining successive calls to return the first
     * Some in the chain of orElses.
     *
     * @example
     * ```
     * const firstSuccessfulOptionValue = fnReturnsOption
     *     .orElse(fn2ReturnsOption())
     *     .orElse(fn3ReturnsOption())
     *     .orElse(fn4ReturnsOption())
     * ```
     */
    orElse<B>(otherOption: Option<B>): Option<A> | Option<B> {
        return this.isSome() ?
            this :
            otherOption;
    }

    /**
     * Transforms the underlying value if the instance is a Some by
     * applying the provided function to the underlying value, returning
     * the transformed value in an Option.
     * Returns a None otherwise.
     *
     * @remarks Prefer this to `flatMap` when the provided function does
     * not return an Option.
     */
    map<B>(fn: (val: A) => B): Option<B> {
        return this.isSome() ?
            Some(fn(this.internalGet())) :
            None();
    }

    /**
     * A static version of map. Useful for lifting functions of type
     * (val: A) => B to be a function of type
     * (val: Option<A>) => Option<B>.
     *
     * A curried version of map. First accepts the transformation
     * function, and returns a function that accepts the Option.
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
    static map<B, A>(fn: (val: A) => B): (opt: Option<A>) => Option<B> {
        return (opt: Option<A>) => opt.map(fn);
    }

    /**
     * An alias for Option.map. Perhaps a more accurate or descriptive
     * name.
     *
     * Lifts a function of type (val: A) => B
     * to be a function of type (val: Option<A>) => Option<B>.
     *
     * @example
     * // Working with number
     * const addFive = (val: number) => val + 5;
     * const eight = addFive(3);
     *
     * // Working with Option<number>
     * const addFiveToOption = Option.lift(addFive);
     * const maybeEight = addFiveToOption(Some(3));
     */
    static lift<B, A>(fn: (
        val: A
    ) => B): (
        opt: Option<A>
    ) => Option<B> {
        return Option.map(fn)
    }

    /**
     * Like Option.lift but for functions with an arbitrary number of
     * arguments instead of just one.
     *
     * Lifts a function, with an arbitrary number of arguments, where
     * each argument is not an Option, to be a function that works on
     * Option versions of those arguments.
     *
     * @remarks This function has very weak type support and strict
     * requirements to work correctly. Use with caution.
     * @remarks The provided function **must** be completely curried.
     * @remarks If any of the provided Option arguments are a None, a
     * None will be returned.
     * @remarks Each argument in the provided curried function must have
     * the same type as its corresponding Option type. See the 2nd
     * example below.
     * @remarks All of the Option arguments for the provided function
     * must be passed when liftN is invoked.
     *
     * @example
     * ```
     * Option.liftN<number>(
     *     (a: number) => (b: number) => (c: number) => a + b + c,
     *     Some(18),
     *     Some(4),
     *     Some(6)
     * ); // => Some(28)
     *
     * // Since the 2nd argument (b) is defined as an object with a
     * // property age whose type is a number, the 2nd Option must be
     * // an Option whose underlying value is an Object with a property
     * // called age whose value is a number. This required relationship
     * // is **not** enforced by the type system.
     * Option.liftN<number>(
     *     (a: number) => (b: { age: number }) => a + b.age,
     *     Some(78),
     *     Some({ age: 22 })
     * ); // => Some(100)
     * ```
     */
    static liftN<T>(
        // @ts-ignore
        fn,
        ...args: [Option<unknown>, ...Option<unknown>[]]
    ): Option<T> {

        const recurse = (
            opt: Option<unknown | T>,
            shadowArgs: Option<unknown>[]
        ): Option<T> => {

            if (shadowArgs.length === 0) {
                return opt as Option<T>;
            }

            const updatedValue = opt.ap(
                shadowArgs[0] as Option<unknown>
            );

            return recurse(
                updatedValue,
                shadowArgs.slice(1)
            )
        };

        const initialValue = args[0].map(() => fn);

        return recurse(initialValue, args);
    }

    /**
     * Applies the function, wrapped in the current Option instance, to
     * the provided Option returning, the result.
     *
     * @remarks This should only be used when the instance contains a
     * function of the type (val: A) => B.
     * @remarks Useful when the function to apply to another Option is
     * itself wrapped in an Option.
     *
     * @example
     * ```
     * const getFunctionToUse = (): Option<(val: number) => number> => {
     *     return Math.random() > .5 ?
     *         Some((val) => val + 2) :
     *         None();
     * }
     *
     * // functionToUse is Option<(val: number) => number>
     * const functionToUse = getFunctionToUse();
     *
     * const some8 = Some(8);
     * const maybe10 = functionToUse.ap(some8); // => Some(10)
     * ```
     */
    ap<B, C>(opt: Option<B>): Option<C> {

        // If the instance is a None, return a None.
        if (this.isNone()) {
            return None();
        }

        // At this point, this.get() must return a value of type A since
        // we've validated that this a Some.

        // If the underlying value's type is not a function, return a
        // None.
        if (typeof this.get() !== 'function') {
            return None();
        }

        // At this point, the instance is a Some and the underlying
        // value is a function.
        const underlyingFunction = this.get() as unknown as (v: B) => C;

        // Apply the function to the passed Option with map.
        return opt.map(underlyingFunction);

    }

    /**
     * Equivalent to map but returns the underlying value instead of an
     * Option. Returns one of alternativeVal (if provided) or undefined
     * if the instance is a None.
     */
    fold<B>(fn: (val: A) => B, alternativeVal?: B): B | undefined {
        return this.map(fn)
            .getOrElse(alternativeVal);
    }

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
    flatMap<B>(fn: (val: A) => Option<B>): Option<B> {
        return this.isSome() ?
            fn(this.internalGet()) :
            None();
    }

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
     * const appendIfValid = (val: string): Option<string> => {
     *    if (val.length > 2) {
     *         const newVal = val + "@gmail.com";
     *         return Some(newVal);
     *     } else {
     *         return None();
     *     }
     * }
     *
     * // Options (possibly returned by other parts of your code base)
     * const opt = Some("johnsmith");
     * const otherOpt = None();
     *
     * // Create a version of appendIfValid that works on Option<string>
     * const appendToOptionStrIfValid = Option.flatMap(appendIfValid);
     *
     * const maybeAnEmailAddress = appendToOptionStrIfValid(opt);
     * // maybeAnEmailAddress => Some("johnsmith@gmail.com")
     *
     * const maybeAnEmailAddress2 = appendToOptionStrIfValid(otherOpt);
     * // maybeAnEmailAddress2 => None()
     *
     * // This next line is equivalent to the above.
     * const maybeAnEmailAddress3 = Option.flatMap(appendIfValid)(opt);
     * ```
     */
    static flatMap<B, A>(
        fn: (val: A) => Option<B>
    ): (opt: Option<A>) => Option<B> {
        return (opt: Option<A>) => opt.flatMap(fn);
    }

    /**
     * Usable in place of both map and flatMap.
     * Accepts a function that returns either an Option or non Option
     * value.
     *
     * Always returns an Option.
     *
     * Makes the Option class into a thenable.
     *
     * If the instance is a None, a None is returned.
     * If the provided function returns an Option, the result of
     * applying the function to the underlying value is returned.
     * If the provided function returns a non Option, the result of
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
     * const maybeOptDoubledOrQuadrupled = myOpt.then(maybeDouble)
     *                                          .then(alwaysDouble);
     * ```
     */
    then<B>(fn: (val: A) => B | Option<B>): Option<B> {

        if (this.isSome()) {
            const result = fn(this.internalGet());

            return result instanceof Option ?
                result :
                Some(result);
        }

        return None();

    }

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
    flatten<B>(): Option<B> {
        if (this.isNone()) {
            return None();
        }

        if (this.isSome() && this.get() instanceof Option) {
            return this.internalGet() as unknown as Option<B>;
        }

        // `this` is guaranteed at this point to be a Some whose
        // underlying value is not an Option.
        return this as unknown as Option<B>;
    }

    /**
     * Returns the instance if the underlying value passes the provided
     * filter function. Returns a None otherwise.
     */
    filter(filterFn: (val: A) => boolean): Option<A> {
        return this.isSome() && filterFn(this.internalGet()) ?
            this :
            None();
    }

    /**
     * Returns the instance if the underlying value **fails** the
     * provided filter function. Returns a None otherwise.
     */
    filterNot(filterFn: (val: A) => boolean): Option<A> {
        return this.isSome() && filterFn(this.internalGet()) ?
            None() :
            this;
    }

    /**
     * Returns true if the instance's underlying value equals the
     * provided argument. Returns false otherwise.
     *
     * @remarks Accepts an optional equality function for comparing two
     * values for when the underlying value is not a primitive. By
     * default this equality function is JavaScript's ===.
     */
    contains(
        val: A,
        equalityFn: (
            valOne: A,
            valTwo: A
        ) => boolean = (
            valOne,
            valTwo
        ) => valOne === valTwo
    ): boolean {
        return this.isSome() && equalityFn(this.internalGet(), val) ?
            true :
            false;
    }

    /**
     * Returns an Array with the underlying value when the instance is a
     * Some. Returns an empty Array otherwise.
     */
    toArray(): [A] | [] {
        return this.isSome() ?
            [this.internalGet()] :
            [];
    }

    /**
     * Returns a Set containing the underlying value when the instance
     * is a Some. Returns an empty Set otherwise.
     */
    toSet(): Set<A> {
        return this.isSome() ?
            new Set<A>().add(this.internalGet()) :
            new Set();
    }

    /**
     * Returns a string representation of the Option.
     * Useful for console logging an instance.
     *
     * @example
     * ```
     * console.log(Some(3)); // => "Some(3)"
     * console.log(None()); // => "None"
     * ```
     */
    toString(): string {
        return this.isSome() ?
            `Some(${this.internalGet()})` :
            "None";
    }

    /**
     * An alias for toString();
     */
    toStr(): string {
        return this.toString();
    }

    /**
     * Logs the Option to the console invoking both console.log and
     * toString for you.
     *
     * Accepts an optional function (customToString) as an argument.
     * customToString is a function you implement that returns a string.
     * The string returned by customToString will be used in place of
     * the string returned by toString method.
     * customToString will have access to the Option instance as well
     * but should **not** mutate the instance in any way (by calling
     * map, flatMap, then, filter, etc).
     *
     * @example
     * ```
     * Some(3).log(); // => "Some(3)"
     * None().log(); // => "None"
     *
     * const customLogger = (opt: Option<number>): string => {
     *     return ~~~~~~~~~~~ " + opt.toStr() + " ~~~~~~~~~~";
     * }
     *
     * Some(3).log(customLogger) // => "~~~~~~~~~~ Some(3) ~~~~~~~~~~"
     * // Or defined inline and not even using the instance
     * Some(3).log(() => "-- I AM HERE --"); // => "-- I AM HERE --"
     * ```
     */
    log(customToString?: (opt: this) => string): void {
        const stringToLog = customToString ?
            customToString(this) :
            this.toStr();

        console.log(stringToLog);
    }

    /**
     * Returns the instance after logging it to the console.
     *
     * Convenient to see the value of the Option in a sequence of method
     * calls for debugging without having to split up the method calls.
     *
     * Accepts an optional function (customToString) as an argument.
     * customToString is a function you implement that returns a string.
     * The string returned by customToString will be used in place of
     * the string returned by toString method.
     * customToString will have access to the Option instance as well
     * but should **not** mutate the instance in any way (by calling
     * map, flatMap, then, filter, etc).
     *
     * @example
     * const customLogger = <T>(opt: Option<T>): string => {
     *     return "!!!!!!!! " + opt.toStr() + " !!!!!!!!";
     * }
     * Some(3)
     *     .map(val => val + 5)
     *     .logAndContinue() // => "Some(8)"
     *     .map(val => val + 2)
     *     .filter(val => val > 10)
     *     .logAndContinue(customLogger) // => "!!!!!!!! None !!!!!!!!"
     *     .getOrElse(-1);
     * ```
     */
    logAndContinue(customToString?: (opt: this) => string): Option<A> {
        this.log(customToString);
        return this;
    }

    /**
     * Returns an instance of an Option using the value passed to it (if
     * provided). Equivalent to using the Some() or None() functions.
     */
    static of<A>(val?: A): Option<A> {
        return val ?
            Some(val) :
            None();
    }
}
