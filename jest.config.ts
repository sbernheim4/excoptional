// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    collectCoverage: true,
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    }
};

export default config;
