"use client";

import React from "react";
import { colors } from "../../common/Colors";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  className = "",
  style,
  variant = "primary",
  disabled,
  ...props
}: Props) {
  const getVariantStyle = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: colors.neutral[900],
          color: colors.white,
        };
      case "danger":
        return {
          backgroundColor: colors.danger,
          color: colors.white,
        };
      default:
        return {
          backgroundColor: colors.primary,
          color: colors.white,
        };
    }
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold transition ${className}`}
      style={{
        ...getVariantStyle(),
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    />
  );
}