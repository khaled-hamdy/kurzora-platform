# Arabic Typography Implementation Guide

## Overview

This document outlines the implementation of Arabic typography for the Kurzora trading platform, ensuring proper text rendering and layout for Arabic content.

## Table of Contents

1. Font Selection
2. Text Direction
3. Character Spacing
4. Line Height
5. Implementation Examples
6. Testing Procedures

## 1. Font Selection

### Implementation

```typescript
// src/styles/typography.ts
export const arabicFonts = {
  primary: 'Cairo, sans-serif',
  secondary: 'Tajawal, sans-serif',
  monospace: 'IBM Plex Mono Arabic, monospace'
};

// src/styles/globals.css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono+Arabic&display=swap');

.arabic-text {
  font-family: var(--arabic-primary-font);
  font-feature-settings: 'arab';
  text-rendering: optimizeLegibility;
}
```

## 2. Text Direction

### Implementation

```typescript
// src/components/RTLProvider.tsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface RTLProviderProps {
  children: React.ReactNode;
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ children }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
};

// src/styles/rtl.css
.rtl {
  text-align: right;
}

.rtl .flex-row {
  flex-direction: row-reverse;
}

.rtl .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}

.rtl .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}
```

## 3. Character Spacing

### Implementation

```typescript
// src/styles/typography.ts
export const arabicTypography = {
  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
  },
  wordSpacing: {
    tight: "-0.05em",
    normal: "0",
    wide: "0.05em",
  },
};

// src/components/ArabicText.tsx
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface ArabicTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ArabicText: React.FC<ArabicTextProps> = ({
  children,
  className,
}) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <span
      className={`${className} ${isArabic ? "arabic-text" : ""}`}
      style={{
        letterSpacing: isArabic
          ? arabicTypography.letterSpacing.normal
          : undefined,
        wordSpacing: isArabic ? arabicTypography.wordSpacing.normal : undefined,
      }}
    >
      {children}
    </span>
  );
};
```

## 4. Line Height

### Implementation

```typescript
// src/styles/typography.ts
export const arabicLineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// src/components/ArabicParagraph.tsx
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface ArabicParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export const ArabicParagraph: React.FC<ArabicParagraphProps> = ({
  children,
  className,
}) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <p
      className={`${className} ${isArabic ? "arabic-text" : ""}`}
      style={{
        lineHeight: isArabic ? arabicLineHeight.normal : undefined,
      }}
    >
      {children}
    </p>
  );
};
```

## 5. React Components

### Implementation

```typescript
// src/components/ArabicContainer.tsx
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface ArabicContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ArabicContainer: React.FC<ArabicContainerProps> = ({
  children,
  className,
}) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div
      className={`${className} ${isArabic ? "arabic-container" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
};

// src/components/ArabicInput.tsx
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface ArabicInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const ArabicInput: React.FC<ArabicInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${className} ${isArabic ? "arabic-text" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    />
  );
};
```

## 6. Testing Procedures

### Unit Tests

```typescript
// src/components/__tests__/ArabicText.test.tsx
import { render } from "@testing-library/react";
import { ArabicText } from "../ArabicText";
import { LanguageProvider } from "../../contexts/LanguageContext";

describe("ArabicText", () => {
  it("applies Arabic styles when language is Arabic", () => {
    const { container } = render(
      <LanguageProvider>
        <ArabicText>Test</ArabicText>
      </LanguageProvider>
    );

    const element = container.firstChild;
    expect(element).toHaveClass("arabic-text");
  });

  it("does not apply Arabic styles for other languages", () => {
    const { container } = render(
      <LanguageProvider>
        <ArabicText>Test</ArabicText>
      </LanguageProvider>
    );

    const element = container.firstChild;
    expect(element).not.toHaveClass("arabic-text");
  });
});
```

## Performance Considerations

1. **Font Loading**

   - Preload critical fonts
   - Use font-display: swap
   - Implement font subsetting

2. **Rendering Performance**

   - Use CSS transforms for animations
   - Implement text virtualization
   - Optimize RTL layout calculations

3. **Bundle Size**
   - Lazy load Arabic fonts
   - Tree-shake unused styles
   - Use dynamic imports for RTL components

## Integration Checklist

- [ ] Set up Arabic fonts
- [ ] Implement RTL support
- [ ] Configure character spacing
- [ ] Set up line height
- [ ] Create React components
- [ ] Write unit tests
- [ ] Test performance
- [ ] Document implementation

## Next Steps

1. Implement currency formatting
2. Set up date/time localization
3. Create translation management
4. Develop testing procedures
5. Set up database schema

## References

- [Google Fonts - Arabic](https://fonts.google.com/?subset=arabic)
- [MDN Web Docs - RTL](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
- [CSS Writing Modes](https://www.w3.org/TR/css-writing-modes-3/)
