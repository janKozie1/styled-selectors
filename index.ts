type Key = string | number | symbol
type AnyObject =  {[key in Key]: any}
type PropsWithTheme<T> = {theme: T} & AnyObject
type Select<Props, W> = {
  <U extends keyof W>(key: U): Select<Props, W[U]>
  (theme: Props): W
  <T>(cb: (curent:W, allProps: Props & AnyObject) => T): (allProps: Props) => T 
}
type ThemeObject = {
    [key in Key]: ThemeObject | any
}
type Callback<W, R> = (arg: W, arg2: R) => unknown

const isCallback = <W, R>(thing: any): thing is Callback<W, R> => {
    return thing && typeof thing === 'function'
}

const isThemeObjectKey = <T>(thing: any): thing is keyof T => {
    return thing && (
      typeof thing === 'number'
      || typeof thing === 'string'
      || typeof thing === 'symbol'
    )
}

export const access = <T>(keys: Key[], obj: any): T => {
    const key = keys[0]

    if(!obj || typeof obj !== 'object') {
        throw new Error(`Encountered '${obj}' but expected object with key '${String(key)}'`);
    }

    if(!obj.hasOwnProperty(key)) {
        throw new Error(`Encountered object with keys: [${Object.keys(obj)}] but expected object with key '${String(key)}'`);
    }

    return keys.length === 1
        ? obj[key]
        : access(keys.slice(1), obj[key])
}

export const baseSelector = <T extends ThemeObject>() => <U extends keyof T>(
    key: U
) => {
    const keys: Key[] = ['theme', key] 
    type Props = PropsWithTheme<T>

    const wrapper = <W>(keys: Key[]) => {
        function select<U extends keyof W>(next: U): Select<Props, W[U]>
        function select(next: Props): W
        function select<U>(next: (current: W, allProps: Props) => U): (allProps: Props) => U
        function select<U extends Props | keyof W>(next: U) {
            if (isCallback<W, Props>(next)){
                return (allProps: Props) => next(access<W>(keys, allProps), allProps)
            }
            if (isThemeObjectKey<W>(next)) {
                return wrapper<W[typeof next]>([...keys, next])
            }
            return access<W>(keys, next)
        }
        return select
    }
    return wrapper<T[U]>(keys)
}
