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
    const computedType = isPasswordType && showPassword ? 'text' : type;

    const renderEndAdornment = () => {
      if (isPasswordType) {
        return (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              className="text-text-secondary hover:text-text-primary"
              aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
          </InputAdornment>
        );
      }

      if (rightIcon) {
        return (
          <InputAdornment position="end" className="text-text-secondary">
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
        error={Boolean(error)}
        helperText={error || helperText}
        fullWidth={fullWidth}
        variant="outlined"
        size="small"
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            startAdornment: leftIcon ? (
              <InputAdornment position="start" className="text-text-secondary">
                {leftIcon}
              </InputAdornment>
            ) : undefined,
            endAdornment: renderEndAdornment(),
          },
        }}
        className={`
          [&_.MuiOutlinedInput-input]:text-text-primary
          [&_.MuiOutlinedInput-input]:text-sm
          [&_.MuiInputLabel-root]:text-text-secondary
          [&_.MuiInputLabel-root.Mui-focused]:text-primary
          [&_.MuiFormHelperText-root]:text-xs
          [&_.MuiFormHelperText-root.Mui-error]:text-status-error
          ${className}
        `}
        {...rest}
      />
    );
  },
);

Input.displayName = 'Input';
