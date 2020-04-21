type Key = string | number | symbol

type Select<Theme, W> = {
  <U extends keyof W>(key: U): Select<Theme, W[U]>
  (theme: Theme): W
  <T>(cb: (curent:W) => T): (theme: Theme) => T 
}

type ThemeObject = {
    [key in Key]: ThemeObject | any
}

type Callback<W> = (arg: W) => unknown

const isCallback = <W>(thing: any): thing is Callback<W> => {
    return thing && typeof thing === 'function'
}

const isThemeObjectKey = <T>(thing: any): thing is keyof T => {
    return thing && (
      typeof thing === 'number'
      || typeof thing === 'string'
      || typeof thing === 'symbol'
    )
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
    const keys: Key[] = ['theme', key] 
    type Theme = {theme: T}

    const wrapper = <W>(keys: Key[]) => {
        function select(next: keyof W): Select<Theme,W[typeof next]>
        function select(next: Theme): W
        function select<Z>(next: (current: W) => Z): (theme: Theme) => Z
        function select<U extends Theme | keyof W>(next: U) {
            if (isCallback<W>(next)){
                return (theme: Theme) => next(access<W>(keys, theme))
            }
            if (isThemeObjectKey<W>(next)) {
                return wrapper<W[typeof next]>([...keys, next]) as Select<Theme,W[typeof next]>
            }
            return access<W>(keys, next)
        }
        return select
    }
    return wrapper<T[U]>(keys)
}
