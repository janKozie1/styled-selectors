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
    something: 'some value',
    size: {
        toolbar: {
            big: 5,
            small: 1
        }
    }
};

type Theme = typeof theme;

describe('base', () => {
    const baseSelector = base<Theme>()
    it('can access nested properities', () => {
        const darkBlueMainColor = baseSelector('colors')('main')('blue')('dark')(1)({theme})

        expect(darkBlueMainColor).toBe('00008B')
    })

    it('works for shallow properities', () => {
       const size =  baseSelector('something')({theme})

       expect(size).toBe('some value')
    })

    it('can branch off' , () => {
        const colorSelector = baseSelector('colors')('main')
        const red = colorSelector('red')('light')(2)({theme})
        const blue = colorSelector('blue')('dark')(1)({theme})

        expect(blue).toBe('00008B')
        expect(red).toBe('F8665E')
    })

    it('can accept theme object at any point', () => {
        const colors = baseSelector('colors')('main')({theme})

        expect(colors).toBe(theme.colors.main)
    })

    it('accepts callbacks', () => {
        const sizeWithRem = baseSelector('size')('toolbar')((sizes) => sizes.big + sizes.small + 'rem')({theme})
        
        expect(sizeWithRem).toBe('6rem')
    })
})
