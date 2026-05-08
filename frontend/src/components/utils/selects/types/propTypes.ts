export interface SelectOption {
    label: string;
    value: string;
}

export type SelectProps = {
    label: string;
    labelWidth?: string;
    modelValue: string;
    options: SelectOption[];
}
