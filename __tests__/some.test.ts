import { None, Option, Some } from "./../src";

describe("Some", () => {

    test("isNone", () => {
        expect(Some(3).isNone()).toBe(false);
    });

    test("isSome", () => {
        expect(Some(3).isSome()).toBe(true);
    });

    test("exists", () => {
        expect(Some(3).exists()).toBe(true);
    });

    test("nonEmpty", () => {
        expect(Some(3).nonEmpty()).toBe(true);
    });

    test("get", () => {
        expect(Some(3).get()).toBe(3);
    });

    test("internalGet", () => {
        // @ts-ignore
        expect(Some(3).internalGet()).toBe(3);
    });

    test("internalGet2", () => {
        // @ts-ignore
        expect(Some(Some(3)).internalGet()).toStrictEqual(Some(3));
    });

    test("getOrElse", () => {
        expect(Some(3).getOrElse(3)).toBe(3);
    });

    test("orElse", () => {
        expect(Some(3).orElse(Some(3))).toStrictEqual(Some(3));
    });

    test("map", () => {
        expect(Some(3).map(val => val + "5")).toStrictEqual(Some("35"));
    });

    test("static map/lift", () => {
        const multiplyByTen = (val: number): number => val * 10;

        const optMultiplyByTen = Option.map(multiplyByTen);
        const alsoOptMultiplyByTen = Option.lift(multiplyByTen);

        const myOpt = Some(3);

        expect(optMultiplyByTen(myOpt)).toStrictEqual(Some(30));
        expect(alsoOptMultiplyByTen(myOpt)).toStrictEqual(Some(30));
    });

    test("static liftN", () => {
        const resOne = Option.liftN<number>(
            (a: number) => (b: number) => (c: number) => a + b + c,
                Some(18),
            Some(4),
            Some(6)
        );

        expect(resOne).toStrictEqual(Some(28))

        const resTwo = Option.liftN<number>(
            (a: number) => (b: { age: number }) => a + b.age,
            Some(78),
            Some({ age: 22 })
        );

        expect(resTwo).toStrictEqual(Some(100));
    });

    test("ap", () => {
        const getFunctionToUse = (): Option<(val: number) => number> => {
            return Math.random() > .5 ?
                Some((val) => val + 2) :
                Some((val) => val + 5)
        }

        const functionToUse = getFunctionToUse();

        const some8 = Some(8);
        const maybe10 = functionToUse.ap(some8);

        expect(maybe10.get()).toBeGreaterThanOrEqual(10);
        expect(maybe10.get()).toBeLessThanOrEqual(13);
    });

    test("fold", () => {
        expect(Some(3).fold(val => val + "5")).toBe("35");
    });

    test("flatMap", () => {
        expect(Some(3).flatMap(val => Some(val + "10"))).toStrictEqual(Some("310"));
    });

    test("static flatMap", () => {
        const multiplyByTen = (val: number): Option<number> => Some(val * 10);

        const optMultiplyByTen = Option.flatMap(multiplyByTen);

        const myOpt = Some(3);

        expect(optMultiplyByTen(myOpt)).toStrictEqual(Some(30));
    });


    test("then", () => {
        const myOpt = Some(10);

        const maybeDouble = (val: number): Option<number> => Math.random() > .5 ?
            Some(val * 2) :
            None();

        const alwaysDouble = (val: number): number => val * 2;

        const maybeMyOptDoubled = myOpt.then(maybeDouble).then(alwaysDouble);

        expect(maybeMyOptDoubled).toBeInstanceOf(Option);
    });

    test("then 2", () => {
        const maybeDoubleMaybeTriple = (val: number): Option<number> => Math.random() > .5 ?
            Some(val * 2) :
            Some(val * 3)

        const alwaysHalve = (val: number) => val/2;

        const myOpt = Some(10);

        const someNumber = myOpt.then(maybeDoubleMaybeTriple)
                                .then(alwaysHalve);

        expect(someNumber).toBeInstanceOf(Option);
        expect(someNumber.get()).toBeGreaterThanOrEqual(10);
        expect(someNumber.get()).toBeLessThanOrEqual(15);
    });

    test("then 3", () => {
        const myOpt = Some(10);

        const maybeDouble = (val: number): number => Math.random() > .5 ?
            val * 2 :
            val * 10

        const someNum = myOpt.then(maybeDouble);

        expect(someNum).toBeInstanceOf(Option);
        expect(someNum.get()).toBeGreaterThanOrEqual(20);
        expect(someNum.get()).toBeLessThanOrEqual(100);
    });

    test("flatten", () => {
        expect(Some(3).flatten()).toStrictEqual(Some(3));
    });

    test("flatten", () => {
        expect(Some(Some(3)).flatten()).toStrictEqual(Some(3));
    });

    test("filter", () => {
        expect(Some(3).filter(val => val > 5)).toStrictEqual(None());
    });

    test("filter", () => {
        expect(Some(10).filter(val => val > 5)).toStrictEqual(Some(10));
    });

    test("filterNot", () => {
        expect(Some(3).filterNot(val => val > 5)).toStrictEqual(Some(3));
    });

    test("filterNot", () => {
        expect(Some(3).filterNot(val => val < 5)).toStrictEqual(None());
    });

    test("contains", () => {
        expect(Some(3).contains(5)).toBe(false);

        expect(
            Some({ name: "Sam" })
                .contains(
                    { name: "Sam" },
                    (a, b) => a.name === b.name
                )
        ).toBe(true)

        expect(Some(3).contains(3)).toBe(true);
    });

    test("toArray", () => {
        expect(Some(3).toArray()).toStrictEqual([3]);
    });

    test("toSet", () => {
        expect(Some(3).toSet()).toStrictEqual(new Set().add(3));
    });

    test("toString", () => {
        expect(Some(3).toString()).toBe("Some(3)");
    });

    test("toStr", () => {
        expect(Some(3).toStr()).toBe("Some(3)");
    });

    test("log", () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        const myOpt = Some(30);

        myOpt.log();

        expect(consoleLogSpy).toHaveBeenCalled();

        consoleLogSpy.mockReset();
    });

    test("log with custom logging function", () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        const customLoggerSpy = jest.fn().mockImplementation((
            opt: Option<number>
        ): string => {
            return "~~~~~~~~~~~~~ " + opt.toStr() + " ~~~~~~~~~~~~~";
        });

        Some(3).log(customLoggerSpy);

        expect(customLoggerSpy).toHaveBeenCalledTimes(1)
        expect(customLoggerSpy).toHaveLastReturnedWith("~~~~~~~~~~~~~ Some(3) ~~~~~~~~~~~~~")


        consoleLogSpy.mockReset();
    });

    test("logAndContinue", () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => { });

        const customLoggerMockOne = jest.fn().mockImplementation((
            opt: Option<number>
        ): string => {
            return "~~~~~~~~~~~~~ " + opt.toStr() + " ~~~~~~~~~~~~~";
        });

        const customLoggerMockTwo = jest.fn().mockImplementation((): string => {
            return "I AM HERE";
        });

        const result = Some(3)
            .map(val => val + 5)
            .logAndContinue(customLoggerMockOne)
            .map(val => val + 2)
            .logAndContinue(customLoggerMockTwo)
            .getOrElse(-1);

        expect(result).toBe(10)
        expect(customLoggerMockOne).toHaveNthReturnedWith(1, "~~~~~~~~~~~~~ Some(8) ~~~~~~~~~~~~~")
        expect(customLoggerMockTwo).toHaveNthReturnedWith(1, "I AM HERE")


        consoleLogSpy.mockReset();
        customLoggerMockOne.mockReset();
        customLoggerMockTwo.mockReset();
    });

    test("static of", () => {
        expect(Option.of(30)).toStrictEqual(Some(30));
    });

});

