type Key = string | number | symbol
type AnyObject = { [key in Key]: any }
type PropsWithTheme<T> = { theme: T } & AnyObject

type Select<T, Props> = {
    <U extends keyof T>(key: U): Select<T[U], Props>
    (componentProps: Props): T
    <U>(cb: (curent: T, componentProps: Props) => U): (
        componentProps: Props
    ) => U
}

type ThemeObject = {
    [key in Key]: ThemeObject | any
}

type Callback<T, U> = (current: T, componentProps: U) => unknown

const isCallback = <T, U>(thing: any): thing is Callback<T, U> => {
    return thing && typeof thing === 'function' && thing.call && thing.apply
}

const isThemeObjectKey = <T>(thing: any): thing is keyof T => {
    return (
        thing &&
        (typeof thing === 'number' ||
            typeof thing === 'string' ||
            typeof thing === 'symbol')
    )
}

export const access = <T>(keys: Key[], obj: any): T => {
    const key = keys[0]

    if (!obj || typeof obj !== 'object') {
        throw new Error(
            `Encountered '${obj}' but expected object with key '${String(key)}'`
        )
    }

    if (!obj.hasOwnProperty(key)) {
        throw new Error(
            `Encountered object with keys: [${Object.keys(
                obj
            )}] but expected object with key '${String(key)}'`
        )
    }

    return keys.length === 1 ? obj[key] : access(keys.slice(1), obj[key])
}

type Merge<T, U> = T extends undefined
    ? U extends undefined
        ? {}
        : U
    : U extends undefined
    ? T
    : T & U

type NonUndefined<T> = T extends undefined ? {} : T

const wrapper = <T, ComponentProps>(keys: Key[]) => {
    function select<U extends keyof T>(next: U): Select<T[U], ComponentProps>
    function select(next: ComponentProps): T
    function select<U>(
        next: (current: T, componentProps: ComponentProps) => U
    ): (componentProps: ComponentProps) => U
    function select<U extends ComponentProps | keyof T>(next: U) {
        if (isCallback<T, ComponentProps>(next)) {
            return (componentProps: ComponentProps) =>
                next(access<T>(keys, componentProps), componentProps)
        }
        if (isThemeObjectKey<T>(next)) {
            return wrapper<T[typeof next], ComponentProps>([...keys, next])
        }
        return access<T>(keys, next)
    }
    return select
}

export const baseSelector = <T extends ThemeObject>(): Select<
    T,
    PropsWithTheme<T>
> => wrapper<T, PropsWithTheme<T>>(['theme'])
