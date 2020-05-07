type Key = string | number | symbol
type AnyObject = { [key in Key]: any }
type PropsWithTheme<T> = { theme: T } & AnyObject

type Select<T, Props, ExtraProps> = {
    <U extends keyof T, W extends AnyObject>(key: U, additionalProps?: W): Select<T[U], Props, Merge<ExtraProps, W>>;
    (componentProps: Props): T;
    <U>(cb: (current: T, componentProps: Props, additionalProps: ExtraProps) => U): (
        componentProps: Props
    ) => U;
}

type ThemeObject = {
    [key in Key]: ThemeObject | any
}

type Callback<T, U, W> = (current: T, componentProps: U, additionalProps: W) => unknown

type Merge<T, U> = T extends undefined
    ? U extends undefined
      ? {}
      : U
    : U extends undefined
      ? T
      : T & U

const isCallback = <T, U, W>(thing: any): thing is Callback<T, U, W> => {
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

const wrapper = <T, ComponentProps, AdditionalProps extends AnyObject>(keys: Key[], additionalProps: AdditionalProps) => {
    function select<U extends keyof T, W extends AnyObject>(next: U, nextProps?: W): Select<T[U], ComponentProps, Merge<AdditionalProps, W>>
    function select(next: ComponentProps): T
    function select<U>(
        next: (current: T, componentProps: ComponentProps, additionalProps: AdditionalProps) => U
    ): (componentProps: ComponentProps) => U
    function select<U extends ComponentProps | keyof T, W extends AnyObject>(next: U,  nextProps?: W) {
        if (isCallback<T, ComponentProps, AdditionalProps>(next)) {
            return (componentProps: ComponentProps) => next(access<T>(keys, componentProps), componentProps, additionalProps)
        }
        if (isThemeObjectKey<T>(next)) {
            type NextProps = Merge<AdditionalProps, W>
            return wrapper<T[typeof next], ComponentProps, NextProps>([...keys, next], (nextProps ? {...additionalProps, ...nextProps} : additionalProps) as NextProps)
        }
        return access<T>(keys, next)
    }
    return select
}


export const baseSelector = <T extends ThemeObject>(): Select<
    T,
    PropsWithTheme<T>,
    {}
> => wrapper<T, PropsWithTheme<T>, {}>(['theme'], {})
