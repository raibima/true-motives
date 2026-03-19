'use client';
import React from 'react';
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  TextArea as AriaTextArea,
  ValidationResult,
} from 'react-aria-components';
import {tv} from 'tailwind-variants';
import {Description, FieldError, Label, fieldBorderStyles} from '@/components/ui/Field';
import {composeTailwindRenderProps, focusRing} from '@/client/react-aria-utils';

const textAreaStyles = tv({
  extend: focusRing,
  base: 'w-full border-1 rounded-lg font-sans text-sm p-3 box-border transition resize-none bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-600 dark:placeholder:text-neutral-400 disabled:text-neutral-200 dark:disabled:text-neutral-600',
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
});

export interface TextAreaFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextAreaField({
  label,
  description,
  errorMessage,
  placeholder,
  rows = 3,
  ...props
}: TextAreaFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(props.className, 'flex flex-col gap-1 font-sans')}
    >
      {label && <Label>{label}</Label>}
      {description && <Description>{description}</Description>}
      <AriaTextArea className={textAreaStyles} placeholder={placeholder} rows={rows} />
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
