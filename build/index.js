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
     * Returns the underlying value if the instance is a Some. Otherwise returns
     * a None
     */
    Option.prototype.get = function () {
        return this.isSome() ?
            this.val :
            exports.None();
    };
    /**
     * @note This method should ONLY be invoked AFTER validating the current
     * option is a Some.
     * @note Do not call this method. It is meant for internal use only.
     */
    Option.prototype.internalGet = function () {
        if (this.isSome()) {
            return this.val;
        }
        throw new Error("Attempted to get a None. If you're seeing this something internal went wrong.\nPlease file a minimal working example in a Github Issue.\nThis error should never be thrown.");
    };
    /**
     * Returns the underlying value if it's a Some. Otherwise returns the
     * provided argument.
     */
    Option.prototype.getOrElse = function (otherVal) {
        return this.isSome() ?
            this.internalGet() :
            otherVal;
    };
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
    Option.prototype.orElse = function (otherOption) {
        return this.isSome() ?
            this :
            otherOption;
    };
    /**
     * Transforms and returns the underlying value if the instance is a Some by
     * applying the provided function to the underlying value. Otherwise returns
     * a None.
     */
    Option.prototype.map = function (fn) {
        return this.isSome() ?
            exports.Some(fn(this.internalGet())) :
            exports.None();
    };
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
     * // Options (possibly returned by other parts of your codebase):
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
    Option.map = function (fn) {
        return function (opt) { return opt.map(fn); };
    };
    /**
     * Equivalent to map but returns the underlying value instead of a new
     * Option. Returns undefined if the instance is a None.
     */
    Option.prototype.fold = function (fn) {
        return this.map(fn)
            .getOrElse(undefined);
    };
    /**
     * Transforms and returns the underlying value if the instance is a Some by
     * applying the provided function to the underlying value. Otherwise returns
     * a None. Prefer this to map when the provided function returns an Option.
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
     * A curried version of flatMap. First accepts the transformation function,
     * then the option.
     *
     * @example
     * ```
     * const appendIfValid = (stringToValidate: string) => {
     *     if (stringToValidate.length > 5) {
     *         return Some(stringToValidate)
     *     } else {
     *         return None();
     *     }
     * }
     *
     * // Options (possibly returned by other parts of your code base):
     * const opt = Some("johnsmith");
     * const otherOpt = None();
     *
     * // Create a version of appendIfValid that works on values that are Options
     * const appendToOptionStringIfValid = Option.flatMap(appendIfValid);
     *
     * const possiblyAnEmailAddress = appendToOptionStringIfValid(opt); // => Some("johnsmith@gmail.com") const anotherPossibleEmailAddress = appendToOptionStringIfValid(otherOpt); // => None();
     * // OR
     * const possiblyAnEmailAddress2 = Option.flatMap(appendIfValid)(opt)
     * ```
     */
    Option.flatMap = function (fn) {
        return function (opt) { return opt.flatMap(fn); };
    };
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
    Option.prototype.flatten = function () {
        if (this.isNone()) {
            return exports.None();
        }
        if (this.isSome() && this.get() instanceof Option) {
            return this.internalGet();
        }
        // `this` is guaranteed at this point to be a Some whose underlying
        // value is *not* an Option.
        return this;
    };
    /**
     * Returns the instance if the underlying value passes the provided filter
     * function. Returns a None otherwise.
     */
    Option.prototype.filter = function (filterFn) {
        return this.isSome() && filterFn(this.internalGet()) ?
            this :
            exports.None();
    };
    /**
     * Returns the instance if the underlying value *fails* the provided filter
     * function. Returns a None otherwise.
     *
     */
    Option.prototype.filterNot = function (filterFn) {
        return this.isSome() && filterFn(this.internalGet()) ?
            exports.None() :
            this;
    };
    /**
     * Returns a true if the underlying value contains the provided argument.
     * Returns false otherwise.
     *
     * @remarks Accepts an optional equality function for comparing two values
     * when the underlying value is not a primitive. By default this equality
     * function is JavaScript's ===.
     */
    Option.prototype.contains = function (val, equalityFn) {
        if (equalityFn === void 0) { equalityFn = function (valOne, valTwo) { return valOne === valTwo; }; }
        return this.isSome() && equalityFn(this.internalGet(), val) ?
            true :
            false;
    };
    /**
     * Returns an Array with the underlying value when the instance is a Some.
     * Returns an empty Array otherwise.
     */
    Option.prototype.toArray = function () {
        return this.isSome() ?
            [this.internalGet()] :
            [];
    };
    /**
     * Returns a Set containing the underlying value when the instance is a
     * Some. Returns an empty Set otherwise.
     */
    Option.prototype.toSet = function () {
        return this.isSome() ?
            new Set().add(this.internalGet()) :
            new Set();
    };
    /**
     * Logs the instance for easy debugging
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
     * Logs the option to the console.
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
     * Returns an instance of an Option using the value passed to it
     * (if provided). Equivalent to using Some() or None() functions.
     */
    Option.of = function (val) {
        return val ?
            exports.Some(val) :
            exports.None();
    };
    return Option;
}());
exports.Option = Option;
