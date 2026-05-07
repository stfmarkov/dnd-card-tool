export interface SelectOption {
    label: string;
    value: string;
}

export type SelectProps = {
    label: string;
    modelValue: string;
    options: SelectOption[];
}
