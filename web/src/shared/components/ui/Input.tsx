import React, { forwardRef, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends Omit<TextFieldProps, 'error'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = 'text',
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
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const computedType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
    const hasError = Boolean(error);

    const renderEndAdornment = () => {
      if (isPasswordType) {
        return (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              className="!text-slate-400 hover:!text-white"
              aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
          </InputAdornment>
        );
      }

      if (rightIcon) {
        return (
          <InputAdornment position="end" className="!text-slate-400">
            {rightIcon}
          </InputAdornment>
        );
      }

      return undefined;
    };

    return (
      <TextField
        inputRef={ref}
        type={computedType}
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
            endAdornment: renderEndAdornment(),
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

Input.displayName = 'Input';
