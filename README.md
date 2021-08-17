# Option.ts

A fully typed, zero-dependency implementation of the functional programming Option object for JavaScript and Typescript.

Options are incredibly useful for functions that may or may not return a value (ie, succeed or fail) and help avoid tedious and repetitive checks to determine if a value is `null` or `undefined` before manipulating them.

> This library should never throw an error. If it does, something very interesting went wrong. Please file an issue.

### Quick Example
```ts
// Without options, null and undefined checks are often needed before
// manipulating the value.
const uppercaseStrOne = (value: string): string => {
    if (value !== null && value !== undefined) {
        return value.toUpperCase();
    }

    return null;
}

const myInputOne = "hello world";

// could be null (or whatever the author of this function decides when the
// condition is false).
const parsedInput = uppercaseStrOne(myInputOne);

// With options, no null and undefined checks are needed before manipulating the
// value.
const uppercaseStrTwo = (value: Option<string>): Option<string> => {
    value.map(str => str.toUpperCase());
}

const myInputTwo = Some("hello world");
const myParsedString = uppercaseStrTwo(myInputTwo).getOrElse("whatever we want");

// The argument and return type of the function changes from a `string` to an
// Option<string> indicating that this function may succeed or fail, forcing the
// caller to handle both situations. The caller avoids needing to perform an
// additional check of the returned value to see if it's also null (or whatever
// default value the author of the function chose) or a string since it's always
// an Option, no matter what's inside. The caller, instead of the author,
// decides what the value should be if there was no string via `getOrElse`.


// One last note. This library makes it seamless to transform functions like the
// uppercaseStrOne to uppercaseStrTwo so you can reuse your existing code as
// much as possible without having to rewrite all your functions and types. No
// conversion necessary

// Using the original function implementation.
const optionUpperCaseStr = Option.map(upperCaseStrOne);

// passing an Option as the argument yields => Some("HELLO WORLD");
const parsedVal = optionUpperCaseStr(myInputTwo);
```

## Getting Started

### Install the Module
`npm install --save option`

### Use the Module
Instances of an Option can be created using the `Some()` and `None()` functions as you saw above. These functions can be imported directly off the module.

`Some` takes one argument (the value) while `None` takes no arguments.

Another way of creating instances of an Option is via the static `of` method on the Option class. Import the class and call the static `of` method passing in a value if it exists.

All 3 approaches are demonstrated below:

Avoid using the `new` keyword to instantiate instances of an Option. In fact, the constructor is intentially declared as private for TypeScript users.

```ts
import { Some, None, option } from "option";

const appendIfValid = (val: string) => {
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
const yetAnotherOption = option.of(); // => None();
const ourFinalOption = option.of("wow"); // => Some("wow");

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

console.log(result); // => "Some('wow')"
```

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
 * // Options (possibly returned by other parts of your codebase):
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
 * const possiblyAnEmailAddress = appendToOptionStringIfValid(opt); // => Some("johnsmith@gmail.com")
 * const anotherPossibleEmailAddress = appendToOptionStringIfValid(otherOpt); // => None();
 * // OR
 * const possiblyAnEmailAddress2 = Option.flatMap(appendIfValid)(opt)
 * ```
 */
static flatMap<B, A>(fn: (val: A) => Option<B>): (opt: Option<A>) => None | Some<B>

/**
 * Flattens a wrapped Option if the outermost layer is a Some. If the instance
 * is a None, a None is returned. If the underlying value is not an Option, the
 * instance is returned.
 */
flatten(): None | A | Some<A>

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
toString()

/**
 * Returns an instance of an Option using the value passed to it (if provided).
 * Equivalent to using Some() or None() functions.
 */
static of<A>(val?: A): Some<A> | None
```

Static (aka curried) versions of map, and flatMap are also availale on the Option class.

A static `of` method is also availale for instantiating instances of an Option.

### Contributing
1. Fork this repo
2. Run an `npm install`
3. Make your changes
4. Run `tsc` to generate a build and validate your changes
5. Add tests - tests are built with jest
6. Open a PR
