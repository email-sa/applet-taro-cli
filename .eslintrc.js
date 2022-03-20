module.exports = {
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 2015
    },
    rules: {
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-this-alias': 'off',
        camelcase: 'off',
        // noUnusedParameters: 1,
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'off',
        'vue/html-indent': 'off',
        'no-use-before-define': 2,
        'comma-dangle': ['error', 'never'],
        quotes: ['error', 'single'],
        eqeqeq: ['error', 'always'], //强制全等
        curly: 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-alert': 'error',
        'no-delete-var': 'error',
        'stylusSupremacy.insertNewLineAroundImports': 'off',
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/html-closing-bracket-newline': [
            'error',
            {
                singleline: 'never',
                multiline: 'always'
            }
        ],
        'vue/html-closing-bracket-spacing': [
            'error',
            {
                startTag: 'never',
                endTag: 'never',
                selfClosingTag: 'always'
            }
        ],
        'vue/max-attributes-per-line': 0,
        indent: 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        'vue/no-v-html': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-explicit-emits': 'off',
        'vue/multi-word-component-names': 'off'
    },
    overrides: [
        {
            files: ['*.ts', '*.vue'],
            rules: {
                'no-undef': 'off'
            }
        }
    ],
    globals: {
        process: true,
        window: true
    }
};
