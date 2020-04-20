type Key = string | number
type Select<W> = (key: keyof W) => any
type ThemeObject = {
    [key in Key]: ThemeObject | any
}
type Next<T> = T extends ThemeObject ? keyof T : undefined

const isThemeObjectKey = <T>(thing: any): thing is keyof T => {
    return thing && (typeof thing === 'number' || typeof thing === 'string')
}

const access = <T>(keys: any, obj: any): T => {
    const key = keys[0]
    return obj && key
        ? keys.length === 1
            ? obj[key]
            : access(keys.slice(1), obj[key])
        : obj
}

export const base = <T extends ThemeObject>() => <U extends keyof T>(
    key: U
) => {
    const keys = ['theme', key] as any[]
    type Theme = {theme: T}

    const wrapper = <W>() => {
        function select(next: keyof W): Select<W[typeof next]>
        function select(next: Theme): W
        function select(next?: undefined): Select<W>
        function select(next?: Theme | keyof W | undefined) {
            if (!next) return wrapper<W>() as Select<W>
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
