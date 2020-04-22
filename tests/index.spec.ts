import { access, baseSelector as base } from '..'

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

describe('baseSelector', () => {
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

    describe('callbacks', () => {
        it('accepts callbacks', () => {
            const sizeWithRem = baseSelector('size')('toolbar')((sizes) => sizes.big + sizes.small + 'rem')({theme})
            
            expect(sizeWithRem).toBe('6rem')
        })
    
        it('accepts callback on the last level', () => {
            const lastLevel = baseSelector('size')('toolbar')('big')((big) => big + 'px')({theme})

            expect(lastLevel).toBe('5px')
        })

        it('pases extra props to callbacks', () => {
            const spy = jest.fn()
            const props = {theme, reactProp: 5}
            baseSelector('size')('toolbar')('small')(spy)(props)

            expect(spy).toHaveBeenCalledWith(1, props)
        })
    })
})

describe('access', () => {
    it('throws on invalid path', () => {
        const obj = {one: {two: 3}}
        const invalidKeys = ['one', 'three'];
        expect(() => access(invalidKeys, obj)).toThrow(`Encountered object with keys: [two] but expected object with key 'three'`)
    })

    it('throws on invalid object', () => {
        const obj = {one: null}
        const keys = ['one', 'two'];
        expect(() => access(keys, obj)).toThrow(`Encountered 'null' but expected object with key 'two'`)
    })
})
