"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import cn from "clsx";
import css from "./Button.module.css";

type Variant = "primary" | "secondary" | "icon";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: Variant;
  withCaret?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "secondary", withCaret = false, className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        css.btn,
        css[variant],
        { [css.withCaret]: withCaret },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
