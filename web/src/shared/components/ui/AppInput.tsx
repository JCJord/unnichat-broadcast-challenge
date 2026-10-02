import React, { forwardRef } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export interface AppInputProps extends Omit<TextFieldProps, 'error'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      slotProps,
      ...rest
    },
    ref,
  ) => {
    const hasError = Boolean(error);

    return (
      <TextField
        inputRef={ref}
        label={label}
        error={hasError}
        helperText={error || helperText}
        fullWidth={fullWidth}
        variant="outlined"
        size="small"
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            startAdornment: leftIcon ? (
              <InputAdornment position="start" className="!text-slate-400">
                {leftIcon}
              </InputAdornment>
            ) : undefined,
            endAdornment: rightIcon ? (
              <InputAdornment position="end" className="!text-slate-400">
                {rightIcon}
              </InputAdornment>
            ) : undefined,
          },
        }}
        className={`
          ${className}
          [&_.MuiOutlinedInput-root]:!bg-[#070b0b]
          [&_.MuiOutlinedInput-root]:!rounded-lg
          [&_.MuiOutlinedInput-input]:!text-white
          [&_.MuiOutlinedInput-input]:!text-sm
          [&_.MuiInputLabel-root]:!text-slate-400
          [&_.MuiInputLabel-root.Mui-focused]:!text-primary
          [&_.MuiFormHelperText-root]:!text-xs
          [&_.MuiFormHelperText-root.Mui-error]:!text-rose-400
        `}
        {...rest}
      />
    );
  },
);

AppInput.displayName = 'AppInput';
