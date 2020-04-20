import { base } from '..'

const theme = {
    colors: {
        main: {
            blue: {
                dark: {
                    1: '00008B',
                },
            },
        },
    },
};

type Theme = typeof theme;

describe('base', () => {
    it('can access nested properities', () => {
        const baseSelector = base<Theme>()

        const color = baseSelector('colors')('main')('blue')('dark')(1)({
            theme,
        })
        expect(color).toBe('00008B')
    })
})
