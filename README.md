# Excoptional

A fully typed, zero-dependency implementation of the functional programming Option object for JavaScript and TypeScript.

Options are incredibly useful for functions that may or may not return a value (ie, succeed or fail) and help avoid tedious and repetitive checks to determine if a value is `null` or `undefined` before manipulating them.

Code Coverage is 100% across statements, branches, functions, and lines.

This library is simple and provides the best possible TypeScript support for autocomplete, type hints and more.

### Benefits of Options (and this specific pacakge)

> All the code examples below are runnable in a TypeScript environment with this package installed.

Without options, `null` and `undefined` checks are often necessary before manipulating a function's argument (even in TS codebases).
```ts
const uppercaseStrOne = (value: string): string => {
    if (value !== null && value !== undefined) {
        return value.toUpperCase();
    }

    return null;
}

const myInputOne = "hello world";

// parsedInput could be null (or whatever the author of uppercaseStrOne
// function decides when the condition is false).
const parsedInput = uppercaseStrOne(myInputOne);
```

With options, no `null` and `undefined` checks are needed before manipulating the value.
```ts
import { Option } from "excoptional";

const uppercaseStrTwo = (value: Option<string>): Option<string> => {
    value.map(str => str.toUpperCase());
}

const myInputTwo = Some("hello world");
const myParsedString = uppercaseStrTwo(myInputTwo).getOrElse("whatever we want");
```

* The argument and return type of the function changes from a `string` to an `Option<string>` explicitly indicating that this function may succeed or fail.
* The caller of `uppercaseStrTwo` is forced to eventually handle both scenarios, but can continue to safely manipulate the underlying value via `map` and other available methods.
* The caller avoids additional `null` and `undefined` checks of the returned value.
* The caller, instead of the function author, determines the fallback value if the Option does not contain a value (via the `getOrElse` method).

This package provides a mechanism to seamlessly transform functions like `uppercaseStrOne` into `uppercaseStrTwo`; That is, functions that work on non `Option` values to functions that do work on `Option` values without rewriting all your functions. This way, you can reuse as much of your existing code as possible.

```ts
import { Option } from "excoptional";

// Using the original function uppercaseStrOne and the static version of map
// from this package, we create a upper case function that works
// on Option<string>.
const optionUpperCaseStr = Option.map(uppercaseStrOne);

// Invoke the new function passing in an Option as the argument
const parsedVal = optionUpperCaseStr(myInputTwo); // => Some("HELLO WORLD"); | None;
```

## Getting Started

### Install the Module
`npm install --save excoptional`

### Use the Module
Instances of an `Option` can be created using the `Some()` and `None()` functions, or the static `of` method off the `Option` class. These can all be imported off the module.
```ts
import { Some, None, Option } from "excoptional";

const myFirstOption = Some(42);
const mySecondOption = None();
const myThridOption = Option.of("Hello World") // Equivalent to Some("Hello World");
const myFourthOption = Option.of() // Equivalent to None();
```
`Some` takes one argument (the value) while `None` takes no arguments. The value to `Some` or `Option.of` can be anything, a primitive, javascript object, etc.

> Avoid using the `new` keyword to instantiate instances of an `Option`. In fact, the constructor is intentially declared as private for TypeScript users to avoid this possibility.

```ts
import { Some, None, Option } from "excoptional";

const appendIfValid = (val: string): Option<string> => {
   if (val.length > 2) {
        return Some(val);
    } else {
        return None();
    }
}

const myOption = appendIfValid("Hello World");
const myOtherOption = appendIfValid("Hi");

myOption.map(val => val.toUpperCase()); // => Some("HELLO WORLD");
myOtherOption.map(val => val.toUpperCase()); // None();


// Instantiate an instance of an Option via the static of method
const yetAnotherOption = Option.of(); // => None();
const ourFinalOption = Option.of("wow"); // => Some("wow");

// and use them as any other option
const result = yetAnotherOption
    .flatMap(val => {
        if (val.length > 2) {
            return Some("success");
        } else {
            return None();
        }
    })
    .orElse(ourFinalOption) //=> Some('wow');
```

### Notes and Best Practices

#### Typing Functions that Return Options
When writing a function that retuns an `Option`, it's best to always explicitly type that function's return type as an `Option<T>` rather than `Some<T> | None`. This helps the compiler provide better type inference and provides a better experience.

```ts
// Bad ❌
const myFunc = (): Some<number> | None => {
    return Math.random() * 100 > 50 ? Some("Success") : None();
}

// Good ✅
const myFunc = (): Option<number> => {
    return Math.random() * 100 > 50 ? Some("Success") : None();
}
```

#### Logging Options
When doing `console.log(myOpt);` it's best to do `console.log(myOpt.toString())`. This provides better output. JavaScript does not automatically invoke an object's `toString` method by default.

For convenience, there is a shorter named equivalent `.toStr` method.

Additionally, there is a convenience `.log` method which will call `console.log` and the `toString` method for you.

```ts
const myOpt = Some("Hello World");

// The below are all equivalent
console.log(myOpt.toString());
console.log(myOpt.toStr();
myOpt.log();
```

#### map vs flatMap vs then
If unsure of which method to use to transform the underlying value, then should always work and be suitable.

* Use `map` when the provided function **does not** return an Option.
* Use `flatMap` when the provided function **does** return an Option.
* `then` can be used regardless if the provided function returns an Option or not.

#### `flatten` Method Behavior
When calling the `flatten` method
* if the current `Option` is a `None`, a `None` will be returned.
* if the current `Option` is a `Some` but the underlying value is not an `Option`, the instance is returned.
* if and only if, the instance is a `Some` **and the underlying value is an `Option`**, will the underlying value be returned.

In essence, this method is guaranteed to always return an `Option` and never throw an error. In fact, this package should **never** throw an error.

If it does, please file an issue.

#### Types
* `None` and `Option<undefined>` are equivalent.
* `Some<T>` and `Option<T>` are equivalent (where T is anything but `undefined` or `null`).
* You should never need to create an `Option` to hold `null` or `undefined`. `None` should replace any instances of `null` and `undefined`.

### Methods

The methods availale for an Option in this package are similar to those in many FP languages and packages.

```ts
/**
 * Returns true if the instance is a None. Returns false otherwise.
 */
isNone(): boolean

/**
 * Returns true if the instance is a Some. Returns false otherwise.
 */
isSome(): boolean

/**
 * An alias for isSome
 * Returns true if the instance is a Some. Returns false otherwise.
 */
exists(): boolean

/**
 * An alias for isSome
 * Returns true if the instance is a Some. Returns false otherwise.
 */
nonEmpty(): boolean

/**
 * Returns the underlying value if the instance is a Some. Otherwise returns a
 * None.
 */
get(): A | Option<undefined>

/**
 * Returns the underlying value if it's a Some. Otherwise returns the provided
 * argument.
 */
getOrElse<B>(otherVal: B): A | B

/**
 * Returns the current instance if it's a Some. Otherwise returns the provided
 * Option argument.
 *
 * @remarks Useful for chaining successive function calls that each return an
 * option
 * @example
 * ```
 * const firstSuccessfulOptionValue = fnReturnsOption
 *     .orElse(fn2ReturnsOption())
 *     .orElse(fn3ReturnsOption())
 *     .orElse(fn4ReturnsOption())
 * ```
 */
orElse<B>(otherOption: Option<B>): Option<A> | Option<B>

/**
 * Transforms and returns the underlying value if the instance is a Some by
 * applying the provided function to the underlying value. Otherwise returns a
 * None.
 */
map<B>(fn: (val: A) => B): Some<B> | None

/**
 * A static version of map. Useful for lifting functions of type (val: A) => B
 * to be a function of type (val: Option<A>) => Option<B>.
 *
 * A curried version of map. First accepts the transformation function, then the
 * option.
 *
 * @example
 * ```
 * const appendToString = (val: string) => val + "@gmail.com";
 *
 * // Options (possibly returned by other functions):
 * const opt = Some("johnsmith");
 * const otherOpt = None();
 *
 * // Create a version of appendToString that works on values that are Options
 * const appendToOptionString = Option.map(appendToString);
 *
 * const possiblyAnEmailAddress = appendToOptionString(opt); // => Some("johnsmith@gmail.com")
 * const anotherPossibleEmailAddress = appendToOptionString(otherOpt); // => None();
 * ```
 */
static map<B, A>(fn: (val: A) => B)

/**
 * Equivalent to map but returns the underlying value instead of a new Option.
 * Returns undefined if the instance is a None.
 */
fold<B>(fn: (val: A) => B): B | undefined

/**
 * Transforms and returns the underlying value if the instance is a Some by
 * applying the provided function to the underlying value. Otherwise returns a
 * None. Prefer this to map when the provided function returns an Option.
 */
flatMap<B>(fn: (val: A) => Option<B>): Some<B> | None

/**
 * A static version of flatMap. Useful for lifting functions of type
 * (val: A) => Option<B> to be a function of type (val: Option<A>) => Option<B>
 *
 * A curried version of flatMap. First accepts the transformation function, then
 * the option.
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
static flatMap<B, A>(fn: (val: A) => Option<B>): (opt: Option<A>) => None | Some<B>

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
then<B>(fn: (val: A) => B | Option<B>): Option<B>

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
flatten<B>(): Option<B>

/**
 * Returns the instance if the underlying value passes the provided filter
 * function. Returns a None otherwise.
 */
filter(filterFn: (val: A) => boolean): Some<A> | None

/**
 * Returns the instance if the underlying value *fails* the provided filter
 * function. Returns a None otherwise.
 */
filterNot(filterFn: (val: A) => boolean): Some<A> | None

/**
 * Returns a true if the underlying value contains the provided argument.
 * Returns false otherwise.
 *
 * @remarks Accepts an optional equality function for comparing two values when
 * the underlying value is not a primitive. By default this equality function
 * is a simple === comparison. Suitable for primitives but not for objects.
 */
contains(
    val: A,
    equalityFn: (valOne: A, valTwo: A) => boolean = (valOne, valTwo) => valOne === valTwo
)

/**
 * Returns an Array with the underlying value when the instance is a Some.
 * Returns an empty Array otherwise.
 */
toArray(): [A] | []

/**
 * Returns a Set containing the underlying value when the instance is a Some.
 * Returns an empty Set otherwise.
 */
toSet(): Set<A>

/**
 * Logs the instance for easy debugging
 *
 * @example
 * ```
 * console.log(Some(3)); // => "Some(3)"
 * console.log(None()); // => "None()"
 * ```
 */
toString(): string

/**
 * An alias for toString();
 */
toStr(): string

/**
 * Logs the option to the console.
 *
 * @example
 * ```
 * Some(3).log(); // => "Some(3)"
 * None().log(); // => "None"
 * ```
 */
log(): void

/**
 * Returns an instance of an Option using the value passed to it (if provided).
 * Equivalent to using Some() or None() functions.
 */
static of<A>(val?: A): Option<A>
```

### Contributing
1. Fork this repo
2. Run an `npm install`
3. Make your changes
4. Run `tsc` to generate a build and validate your changes
5. Add tests - tests are built with jest
6. Open a PR

