// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    collectCoverage: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    }
};

export default config;
