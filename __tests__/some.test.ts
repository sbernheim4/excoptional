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

    test("static map", () => {
        const multiplyByTen = (val: number): number => val * 10;
        const optMultiplyByTen = Option.map(multiplyByTen);
        const myOpt = Some(3);

        expect(optMultiplyByTen(myOpt)).toStrictEqual(Some(30));
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
    });

    test("contains", () => {
        expect(
            Some({ name: "Sam" })
            .contains(
                { name: "Sam" },
                (a, b) => a.name === b.name
            )
        ).toBe(true)
    });

    test("contains", () => {
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
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const myOpt = Some(30);

        myOpt.log();

        expect(consoleLogSpy).toHaveBeenCalled();

        consoleLogSpy.mockClear();
    });

    test("static of", () => {
        expect(Option.of(30)).toStrictEqual(Some(30));
    });

});

