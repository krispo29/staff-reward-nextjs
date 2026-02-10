/* eslint-disable @next/next/no-img-element */
import React from "react";

// Using FlagCDN (flagcdn.com)
// Thai: https://flagcdn.com/w40/th.png
// Myanmar: https://flagcdn.com/w40/mm.png

export function FlagThai({ className = "w-6 h-auto" }: { className?: string }) {
  return (
    <img
      src="https://flagcdn.com/w40/th.png"
      srcSet="https://flagcdn.com/w80/th.png 2x"
      alt="Thailand Flag"
      className={`${className} object-cover`}
    />
  );
}

export function FlagMyanmar({ className = "w-6 h-auto" }: { className?: string }) {
  return (
    <img
      src="https://flagcdn.com/w40/mm.png"
      srcSet="https://flagcdn.com/w80/mm.png 2x"
      alt="Myanmar Flag"
      className={`${className} object-cover`}
    />
  );
}
