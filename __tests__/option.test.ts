import { Option, None, Some } from './../src';

describe("Option static methods", () => {

    test("of", () => {

        // Treat 0 as Somes
        expect(Option.of(0)).toStrictEqual(Some(0));
        expect(Option.of(-0)).toStrictEqual(Some(-0));

        // Option.of a value should produce a some of that value
        expect(Option.of(30)).toStrictEqual(Some(30));

        // But null and undefiend as Nones
        expect(Option.of(null)).toStrictEqual(None());
        expect(Option.of(undefined)).toStrictEqual(None());
        expect(Option.of()).toStrictEqual(None());


    });

});
