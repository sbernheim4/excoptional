import { None, Some } from "./../src";

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

    test("getOrElse", () => {
        expect(None().getOrElse(3)).toBe(3);
    });

    test("orElse", () => {
        expect(None().orElse(Some(3))).toStrictEqual(Some(3));
    });

    test("map", () => {
        expect(None().map(val => val + "5")).toStrictEqual(None());
    });

    test("fold", () => {
        expect(None().fold(val => val + "5")).toBeUndefined();
    });

    test("flatMap", () => {
        expect(None().flatMap(val => Some(val + "10"))).toStrictEqual(None());
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
        expect(None().toString()).toBe("None()");
    });
});
