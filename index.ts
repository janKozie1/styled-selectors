type Key = string | number | symbol

type Select<T,W> = {
  <U extends keyof W>(key: U):
    W[U] extends ThemeObject
      ? Select<T,W[U]>
      : ({theme}: {theme: T}) => W[U]
  ({theme}: {theme: T}): W
}

type ThemeObject = {
    [key in Key]: ThemeObject | any
}

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
    const keys: Key[] = ['theme', key] 
    type Theme = {theme: T}

    const wrapper = <W>(keys: Key[]) => {
        function select(next: keyof W): Select<T,W[typeof next]>
        function select(next: Theme): W
        function select<U extends Theme | keyof W>(next: U) {
            if (isThemeObjectKey<W>(next)) {
                return wrapper<W[typeof next]>([...keys, next]) as Select<T,W[typeof next]>
            }
            return access<W>(keys, next)
        }
        return select
    }
    return wrapper<T[U]>(keys)
}
