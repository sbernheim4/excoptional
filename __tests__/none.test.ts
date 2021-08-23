import { None, Option, Some } from "./../src";

describe("None", () => {

    test("isNone", () => {
        expect(None().isNone()).toBe(true);
    });

    test("isSome", () => {
        expect(None().isSome()).toBe(false);
    });

    test("exists", () => {
        expect(None().exists()).toBe(false);
    });

    test("nonEmpty", () => {
        expect(None().nonEmpty()).toBe(false);
    });

    test("get", () => {
        expect(None().get()).toStrictEqual(None());
    });

    test("internalGet", () => {
        // @ts-ignore
        expect(() => None().internalGet()).toThrow();
    });

    test("getOrElse", () => {
        expect(None().getOrElse(3)).toBe(3);
    });

    test("orElse", () => {
        expect(None().orElse(Some(3))).toStrictEqual(Some(3));
    });

    test("map", () => {
        // @ts-ignore
        expect(None().map(val => val + "5")).toStrictEqual(None());
    });

    test("ap", () => {
        const functionToUse = None();
        const maybe8 = Some(8);
        const maybe10 = functionToUse.ap(maybe8);

        expect(maybe10).toStrictEqual(None());

        // When the underlying value is not a function, None should be returned.
        const shouldBeNone = Some({name: 'sam'}).ap(Some(3));
        expect(shouldBeNone).toStrictEqual(None());
    });

    test("fold", () => {
        // @ts-ignore
        expect(None().fold(val => val + "5")).toBeUndefined();
        //
        // @ts-ignore
        expect(None().fold(val => val + "5", "ruh roh")).toBe("ruh roh");
    });

    test("flatMap", () => {
        // @ts-ignore
        expect(None().flatMap(val => Some(val + "10"))).toStrictEqual(None());
    });

    test("then", () => {
        const myOpt = None();

        const maybeDouble = (val: number): Option<number> => Math.random() > .5 ?
            Some(val * 2) :
            None();

        const alwaysDouble = (val: number): number => val * 2;

        const maybeMyOptDoubled = myOpt.then(maybeDouble).then(alwaysDouble);

        expect(maybeMyOptDoubled).toStrictEqual(None())
    });

    test("flatten", () => {
        expect(None().flatten()).toStrictEqual(None());
    });

    test("filter", () => {
        // @ts-ignore
        expect(None().filter(val => val > 5)).toStrictEqual(None());
    });

    test("filterNot", () => {
        // @ts-ignore
        expect(None().filterNot(val => val > 5)).toStrictEqual(None());
    });

    test("contains", () => {
        // @ts-ignore
        expect(None().contains(5)).toBe(false);
    });

    test("toArray", () => {
        expect(None().toArray()).toStrictEqual([]);
    });

    test("toSet", () => {
        expect(None().toSet()).toStrictEqual(new Set());
    });

    test("toString", () => {
        expect(None().toString()).toBe("None");
    });

    test("toStr", () => {
        expect(None().toStr()).toBe("None");
    });

    test("log", () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        const myOpt = None();

        myOpt.log();

        expect(consoleLogSpy).toHaveBeenCalled();

        consoleLogSpy.mockReset();
    });

    test("log with custom logging function", () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        const customLoggerMock = jest.fn().mockImplementation((
            opt: Option<number>
        ): string => {
            return "~~~~~~~~~~~~~ " + opt.toStr() + " ~~~~~~~~~~~~~";
        });

        None().log(customLoggerMock);

        expect(customLoggerMock).toHaveBeenCalledTimes(1)
        expect(customLoggerMock).toHaveLastReturnedWith("~~~~~~~~~~~~~ None ~~~~~~~~~~~~~")


        consoleLogSpy.mockReset();
        customLoggerMock.mockReset()
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

        const result = None()
            // @ts-ignore
            .map(val => val + 5)
            .logAndContinue(customLoggerMockOne)
            // @ts-ignore
            .map(val => val + 2)
            .logAndContinue(customLoggerMockTwo)
            .getOrElse(-1);

        expect(result).toBe(-1)
        expect(customLoggerMockOne).toHaveNthReturnedWith(1, "~~~~~~~~~~~~~ None ~~~~~~~~~~~~~")
        expect(customLoggerMockTwo).toHaveNthReturnedWith(1, "I AM HERE")

        consoleLogSpy.mockReset();
        customLoggerMockOne.mockReset()
        customLoggerMockTwo.mockReset()
    });

    test("static of", () => {
        expect(Option.of()).toStrictEqual(None());
    });

});
