type EnumType<T> = T extends Record<string | number, infer U> ? U : T;
export type Enum<T extends Record<string | number, any>> = T | EnumType<T>;

export function createEnum<T extends Record<string | number, U>, U>(value: T) {
    return Object.freeze(value);
}

export function lookupValue<T>(_enum: Record<string | number, T>, value: any, defaultValue: T, ignoreCase?: boolean): T;
export function lookupValue<T>(_enum: Record<string | number, T>, value: any, defaultValue: undefined, ignoreCase?: boolean): T | undefined;
export function lookupValue<T>(_enum: Record<string | number, T>, value: any, defaultValue?: T, ignoreCase = false) {
    const enumValues = Object.values(_enum);
    if (typeof value === 'string' && ignoreCase) {
        const lowerValue = value.toLowerCase();
        const result = enumValues.find(enumValue => {
            return typeof enumValue === 'string' && enumValue.toLowerCase() === lowerValue;
        });
        return result || defaultValue;
    } else {
        const index = enumValues.indexOf(value);
        if (index >= 0) {
            return enumValues[index];
        } else {
            return defaultValue;
        }
    }
}

export function getValues<T>(_enum: Record<string | number, T>) {
    return Object.values(_enum);
}
