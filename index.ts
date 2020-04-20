const theme: Theme = {
    sizes: {
        toolbar: {
            big: 4,
            small: 2,
        },
        button: {
            big: 7,
            small: 7,
        },
    },
}

type Theme = {
    sizes: {
        toolbar: {
            big: number
            small: number
        }
        button: {
            big: number
            small: number
        }
    }
}

type Key = string | number

type ThemeObject = {
    [key in Key]: ThemeObject | number | string
}

const isThemeObjectKey = <T>(thing: any): thing is keyof T => {
    return thing && (typeof thing === 'number' || typeof thing === 'string')
}

type Next<T> = T extends ThemeObject ? keyof T : undefined

const access = <T>(keys: any, obj: any): T => {
    const key = keys[0]
    return obj && key
        ? keys.length === 1
            ? obj[key]
            : access(keys.slice(1), obj[key])
        : obj
}

type Select<W> = (key: keyof W) => any

const base = <T extends ThemeObject>() => <U extends keyof T>(key: U) => {
    const keys = ['theme', key] as any[]

    const wrapper = <W>() => {
        function select(next: keyof W): Select<W[typeof next]>
        function select(next: T): W
        function select(next: T | keyof W) {
            if (isThemeObjectKey<W>(next)) {
                keys.push(next)
                return wrapper<W[typeof next]>() as Select<W[typeof next]>
            }
            return access<W>(keys, next)
        }
        return select
    }
    return wrapper<T[U]>()
}

const a = base<Theme>()('sizes')('button')('big')({ theme })
console.log(a)
