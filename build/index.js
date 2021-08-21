"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = exports.Some = exports.None = void 0;
// @ts-ignore
var None = function () { return new Option(undefined); };
exports.None = None;
// @ts-ignore
var Some = function (val) { return new Option(val); };
exports.Some = Some;
var Option = /** @class */ (function () {
    /**
     * Construct an instance of an Option.
     */
    function Option(val) {
        this.val = val;
    }
    /**
     * Returns true if the instance is a None. Returns false otherwise
     */
    Option.prototype.isNone = function () {
        return this.val === undefined;
    };
    /**
     * Returns true if the instance is a Some. Returns false otherwise
     */
    Option.prototype.isSome = function () {
        return this.val !== undefined;
    };
    /**
     * An alias for isSome
     * Returns true if the instance is a Some. Returns false otherwise
     */
    Option.prototype.exists = function () {
        return this.isSome();
    };
    /**
     * An alias for isSome
     * Returns true if the instance is a Some. Returns false otherwise
     */
    Option.prototype.nonEmpty = function () {
        return this.isSome();
    };
    /**
     * Returns the underlying value if the instance is a Some. Returns a
     * None otherwise
     */
    Option.prototype.get = function () {
        return this.isSome() ?
            this.val :
            exports.None();
    };
    /**
     * @remarks Do not call this method. It is meant for internal use
     * only.
     *
     * @remarks This method should ONLY be invoked AFTER validating the
     * current option is a Some.
     */
    Option.prototype.internalGet = function () {
        if (this.isSome()) {
            return this.val;
        }
        throw new Error("Attempted to get a None. If you're seeing this something internal went wrong.\nPlease file a minimal working example in a Github Issue.\nThis error should never be thrown.");
    };
    /**
     * Returns the underlying value if it's a Some. Returns the provided
     * argument otherwise.
     */
    Option.prototype.getOrElse = function (otherVal) {
        return this.isSome() ?
            this.internalGet() :
            otherVal;
    };
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
    Option.prototype.orElse = function (otherOption) {
        return this.isSome() ?
            this :
            otherOption;
    };
    /**
     * Transforms the underlying value if the instance is a Some by
     * applying the provided function to the underlying value, returning
     * the transformed value in an Option.
     * Returns a None otherwise.
     *
     * @remarks Prefer this to `flatMap` when the provided function does not
     * return an Option.
     */
    Option.prototype.map = function (fn) {
        return this.isSome() ?
            exports.Some(fn(this.internalGet())) :
            exports.None();
    };
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
    Option.map = function (fn) {
        return function (opt) { return opt.map(fn); };
    };
    /**
     * Equivalent to map but returns the underlying value instead of an
     * Option. Returns one of alternativeVal (if provided) or undefined
     * if the instance is a None.
     */
    Option.prototype.fold = function (fn, alternativeVal) {
        return this.map(fn)
            .getOrElse(alternativeVal);
    };
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
    Option.prototype.flatMap = function (fn) {
        return this.isSome() ?
            fn(this.internalGet()) :
            exports.None();
    };
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
     * const getIfValid = (val: string): Option<string> => {
     *    if (val.length > 2) {
     *         return Some(val);
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
    Option.flatMap = function (fn) {
        return function (opt) { return opt.flatMap(fn); };
    };
    /**
     * Usable in place of both map and flatMap.
     * Accepts a function that returns either an Option or non Option value.
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
     * const maybeOptDoubledOrQuadrupled = myOpt.then(maybeDouble)
     *                                          .then(alwaysDouble);
     * ```
     */
    Option.prototype.then = function (fn) {
        if (this.isSome()) {
            var result = fn(this.internalGet());
            return result instanceof Option ?
                result :
                exports.Some(result);
        }
        return exports.None();
    };
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
    Option.prototype.flatten = function () {
        if (this.isNone()) {
            return exports.None();
        }
        if (this.isSome() && this.get() instanceof Option) {
            return this.internalGet();
        }
        // `this` is guaranteed at this point to be a Some whose
        // underlying value is not an Option.
        return this;
    };
    /**
     * Returns the instance if the underlying value passes the provided
     * filter function. Returns a None otherwise.
     */
    Option.prototype.filter = function (filterFn) {
        return this.isSome() && filterFn(this.internalGet()) ?
            this :
            exports.None();
    };
    /**
     * Returns the instance if the underlying value **fails** the
     * provided filter function. Returns a None otherwise.
     */
    Option.prototype.filterNot = function (filterFn) {
        return this.isSome() && filterFn(this.internalGet()) ?
            exports.None() :
            this;
    };
    /**
     * Returns true if the underlying value contains the provided
     * argument. Returns false otherwise.
     *
     * @remarks Accepts an optional equality function for comparing two
     * values for when the underlying value is not a primitive. By
     * default this equality function is JavaScript's ===.
     */
    Option.prototype.contains = function (val, equalityFn) {
        if (equalityFn === void 0) { equalityFn = function (valOne, valTwo) { return valOne === valTwo; }; }
        return this.isSome() && equalityFn(this.internalGet(), val) ?
            true :
            false;
    };
    /**
     * Returns an Array with the underlying value when the instance is a
     * Some. Returns an empty Array otherwise.
     */
    Option.prototype.toArray = function () {
        return this.isSome() ?
            [this.internalGet()] :
            [];
    };
    /**
     * Returns a Set containing the underlying value when the instance
     * is a Some. Returns an empty Set otherwise.
     */
    Option.prototype.toSet = function () {
        return this.isSome() ?
            new Set().add(this.internalGet()) :
            new Set();
    };
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
    Option.prototype.toString = function () {
        return this.isSome() ?
            "Some(" + this.internalGet() + ")" :
            "None";
    };
    /**
     * An alias for toString();
     */
    Option.prototype.toStr = function () {
        return this.toString();
    };
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
    Option.prototype.log = function () {
        console.log(this.toString());
    };
    /**
     * Returns an instance of an Option using the value passed to it (if
     * provided). Equivalent to using the Some() or None() functions.
     */
    Option.of = function (val) {
        return val ?
            exports.Some(val) :
            exports.None();
    };
    return Option;
}());
exports.Option = Option;
