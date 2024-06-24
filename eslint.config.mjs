// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.js'],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        ignores: [
            '*.cjs',
            '*.mjs',
        ]
    },
    {
        rules: {
            '@typescript-eslint/no-confusing-void-expression': [
                'error',
                {
                    ignoreArrowShorthand: true,
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowBoolean: true,
                    allowNumber: true,
                },
            ],
            'no-console': 'error',
        }
    },
);
