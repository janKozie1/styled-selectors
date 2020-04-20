import { base } from '..'

const theme = {
    colors: {
        main: {
            blue: {
                dark: {
                    1: '00008B',
                },
            },
            red: {
                light: {
                    2: 'F8665E'
                }
            }
        },
    },
    size: 5
};

type Theme = typeof theme;

describe('base', () => {
    const baseSelector = base<Theme>()
    it('can access nested properities', () => {
        const darkBlueMainColor = baseSelector('colors')('main')('blue')('dark')(1)({theme})

        expect(darkBlueMainColor).toBe('00008B')
    })

    it('works for shallow properities', () => {
       const size =  baseSelector('size')({theme})

       expect(size).toBe(5)
    })

    it('can branch off' , () => {
        const colorSelector = baseSelector('colors')('main')
        const red = colorSelector('red')('light')(2)({theme})
        const blue = colorSelector('blue')('dark')(1)({theme})

        expect(blue).toBe('00008B')
        expect(red).toBe('F8665E')
    })
})
