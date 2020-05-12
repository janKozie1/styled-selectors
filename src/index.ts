
type Key = string | number | symbol
type AnyObject = { [key in Key]: any }
type PropsWithTheme<T> = { theme: T } & AnyObject
type Merge<T extends AnyObject, U extends AnyObject> = U & Pick<T, Exclude<keyof T, keyof U>> 

type Select<T, Props, ExtraProps> = {
    <U extends keyof T>(key: U): Select<T[U], Props, ExtraProps>;
    (componentProps: Props): T;
    <U>(cb: (current: T, componentProps: Props, additionalProps: ExtraProps) => U): (componentProps: Props) => U;
    <U extends AnyObject>(additionalProps: U): Select<T, Props, Merge<ExtraProps, U>>;
}

type ThemeObject = {
    [key in Key]: ThemeObject | any
}

type Callback<T, U, W> = (current: T, componentProps: U, additionalProps: W) => unknown

const isCallback = <T, U, W>(thing: any): thing is Callback<T, U, W> => {
    return thing && typeof thing === 'function' && thing.call && thing.apply
}

const isThemeObjectKey = <T>(thing: any): thing is keyof T => 
    thing && (typeof thing === 'number' || typeof thing === 'string' || typeof thing === 'symbol')

const isAdditionalProps = (thing: any): thing is AnyObject =>
    thing && typeof thing === 'object' && !thing.hasOwnProperty('theme')

export const access = <T>(keys: Key[], obj: any): T => {
    const key = keys[0]

    if (!obj || typeof obj !== 'object') {
        throw new Error(`Encountered '${obj}' but expected object with key '${String(key)}'`)
    }

    if (!obj.hasOwnProperty(key)) {
        throw new Error(`Encountered object with keys: [${Object.keys(obj)}] but expected object with key '${String(key)}'`)
    }

    return keys.length === 1 ? obj[key] : access(keys.slice(1), obj[key])
}

const wrapper = <T, ComponentProps, AdditionalProps extends AnyObject>(keys: Key[], additionalProps: AdditionalProps) => {
    function select<U extends keyof T>(next: U): Select<T[U], ComponentProps, AdditionalProps>
    function select<U extends AnyObject>(next: U): Select<T, ComponentProps, AdditionalProps & U>
    function select<U>(next: (current: T, componentProps: ComponentProps, additionalProps: AdditionalProps) => U): (componentProps: ComponentProps) => U
    function select(next: ComponentProps): T
    function select<U extends ComponentProps | keyof T | AnyObject>(next: U) {
        if (isCallback<T, ComponentProps, AdditionalProps>(next)) {
            return (componentProps: ComponentProps) => next(access<T>(keys, componentProps), componentProps, additionalProps)
        }
        if (isThemeObjectKey<T>(next)) {
            return wrapper<T[typeof next], ComponentProps, AdditionalProps>([...keys, next], additionalProps)
        }
        if (isAdditionalProps(next)) {
            type NextProps = Merge<AdditionalProps, Extract<U, AnyObject>>
            return wrapper<T, ComponentProps, Merge<AdditionalProps, NextProps>>(keys, Object.assign({}, additionalProps, next) as NextProps)
        }
        return access<T>(keys, next)
    }
    return select
}


export const baseSelector = <T extends ThemeObject>(): Select<T, PropsWithTheme<T>, {}> => wrapper<T, PropsWithTheme<T>, {}>(['theme'], {})
