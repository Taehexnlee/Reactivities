import type { ComponentProps } from "react";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers";

type PickerProps = ComponentProps<typeof DateTimePicker>;

type Props<T extends FieldValues> =
  UseControllerProps<T> &
  Omit<PickerProps, "value" | "onChange" | "slotProps">;

export default function DateTimeInput<T extends FieldValues>({
  control,
  name,
  rules,
  shouldUnregister,
  defaultValue,
  ...pickerProps
}: Props<T>) {
  const { field, fieldState } = useController({
    control,
    name,
    rules,
    shouldUnregister,
    defaultValue,
  });

  const { slotProps, ...restPickerProps } = pickerProps;

  // Normalize the RHF field value for the picker.
  const rawValue = field.value as Date | string | number | null | undefined;
  const value =
    rawValue == null
      ? null
      : rawValue instanceof Date
      ? rawValue
      : new Date(rawValue);

  return (
    <DateTimePicker
      {...restPickerProps}
      value={value}
      onChange={(val) => field.onChange(val ?? null)}
      slotProps={{
        ...slotProps,
        textField: {
          ...slotProps?.textField,
          onBlur: field.onBlur,
          fullWidth: true,
          variant: "outlined",
          error: !!fieldState.error,
          helperText: fieldState.error?.message,
        },
      }}
    />
  );
}
