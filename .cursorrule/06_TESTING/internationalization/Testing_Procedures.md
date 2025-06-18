# Internationalization Testing Procedures

## Overview

This document outlines the testing procedures for the Kurzora trading platform's internationalization features, ensuring proper functionality across all supported languages and regions.

## Table of Contents

1. Unit Testing
2. Integration Testing
3. Visual Testing
4. Performance Testing
5. Accessibility Testing
6. Implementation Examples

## 1. Unit Testing

### Implementation

```typescript
// src/i18n/__tests__/language.test.ts
import { detectLanguage, getSupportedLanguage } from "../language";

describe("Language Detection", () => {
  it("detects browser language correctly", () => {
    const mockNavigator = {
      language: "en-US",
      languages: ["en-US", "en", "de"],
    };

    Object.defineProperty(window, "navigator", {
      value: mockNavigator,
      writable: true,
    });

    expect(detectLanguage()).toBe("en");
  });

  it("falls back to English for unsupported languages", () => {
    const mockNavigator = {
      language: "fr-FR",
      languages: ["fr-FR", "fr"],
    };

    Object.defineProperty(window, "navigator", {
      value: mockNavigator,
      writable: true,
    });

    expect(getSupportedLanguage()).toBe("en");
  });
});

// src/utils/__tests__/formatting.test.ts
import { formatCurrency, formatDate, formatNumber } from "../formatting";

describe("Formatting Functions", () => {
  it("formats currency correctly for each locale", () => {
    expect(formatCurrency(1234.56, "USD", "en")).toBe("$1,234.56");
    expect(formatCurrency(1234.56, "EUR", "de")).toBe("1.234,56 €");
    expect(formatCurrency(1234.56, "SAR", "ar")).toBe("١٬٢٣٤٫٥٦ ر.س");
  });

  it("formats dates correctly for each locale", () => {
    const date = new Date("2024-01-01");
    expect(formatDate(date, "en")).toBe("1/1/2024");
    expect(formatDate(date, "de")).toBe("1.1.2024");
    expect(formatDate(date, "ar")).toBe("١/١/٢٠٢٤");
  });
});
```

## 2. Integration Testing

### Implementation

```typescript
// src/__tests__/integration/language-switching.test.tsx
import { render, fireEvent, screen } from "@testing-library/react";
import { LanguageProvider } from "../../contexts/LanguageContext";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

describe("Language Switching", () => {
  it("switches language correctly", () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "de" } });

    expect(screen.getByText("Wird geladen...")).toBeInTheDocument();
  });

  it("persists language preference", () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "ar" } });

    // Reload component
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    expect(select).toHaveValue("ar");
  });
});
```

## 3. Visual Testing

### Implementation

```typescript
// src/__tests__/visual/rtl-layout.test.tsx
import { render } from "@testing-library/react";
import { RTLProvider } from "../../components/RTLProvider";
import { TradingView } from "../../components/TradingView";

describe("RTL Layout", () => {
  it("applies RTL styles correctly", () => {
    const { container } = render(
      <RTLProvider>
        <TradingView />
      </RTLProvider>
    );

    const element = container.firstChild;
    expect(element).toHaveStyle({
      direction: "rtl",
      textAlign: "right",
    });
  });

  it("reverses flex direction in RTL mode", () => {
    const { container } = render(
      <RTLProvider>
        <div className="flex-row">
          <span>Left</span>
          <span>Right</span>
        </div>
      </RTLProvider>
    );

    const flexContainer = container.querySelector(".flex-row");
    expect(flexContainer).toHaveStyle({
      flexDirection: "row-reverse",
    });
  });
});
```

## 4. Performance Testing

### Implementation

```typescript
// src/__tests__/performance/translation-loading.test.ts
import { measurePerformance } from "../utils/performance";

describe("Translation Loading Performance", () => {
  it("loads translations within acceptable time", async () => {
    const result = await measurePerformance(async () => {
      const { getTranslation } = await import("../../i18n");
      return getTranslation("ar");
    });

    expect(result.duration).toBeLessThan(100); // 100ms threshold
  });

  it("caches translations for subsequent loads", async () => {
    const firstLoad = await measurePerformance(async () => {
      const { getTranslation } = await import("../../i18n");
      return getTranslation("de");
    });

    const secondLoad = await measurePerformance(async () => {
      const { getTranslation } = await import("../../i18n");
      return getTranslation("de");
    });

    expect(secondLoad.duration).toBeLessThan(firstLoad.duration);
  });
});
```

## 5. Accessibility Testing

### Implementation

```typescript
// src/__tests__/accessibility/language-announcements.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { LanguageProvider } from "../../contexts/LanguageContext";

expect.extend(toHaveNoViolations);

describe("Language Accessibility", () => {
  it("announces language changes correctly", async () => {
    const { container } = render(
      <LanguageProvider>
        <div lang="ar" dir="rtl">
          <h1>مرحبا</h1>
        </div>
      </LanguageProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("maintains proper reading order in RTL", async () => {
    const { container } = render(
      <LanguageProvider>
        <div dir="rtl">
          <nav>
            <a href="#1">First</a>
            <a href="#2">Second</a>
          </nav>
        </div>
      </LanguageProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## 6. Test Coverage Requirements

### Implementation

```typescript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/index.{ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// src/__tests__/coverage/i18n-coverage.test.ts
import { getTranslation } from "../../i18n";

describe("Translation Coverage", () => {
  it("has translations for all required keys", () => {
    const languages = ["en", "de", "ar"];
    const requiredKeys = [
      "common.loading",
      "common.error",
      "trading.buy",
      "trading.sell",
    ];

    languages.forEach((lang) => {
      const translation = getTranslation(lang);
      requiredKeys.forEach((key) => {
        expect(translation).toHaveProperty(key);
      });
    });
  });
});
```

## Performance Considerations

1. **Test Execution**

   - Run tests in parallel
   - Use test caching
   - Implement test sharding

2. **Coverage Analysis**

   - Track coverage trends
   - Set minimum thresholds
   - Monitor critical paths

3. **CI/CD Integration**
   - Run tests on every PR
   - Generate coverage reports
   - Block merges on failures

## Integration Checklist

- [ ] Set up unit tests
- [ ] Implement integration tests
- [ ] Create visual tests
- [ ] Add performance tests
- [ ] Configure accessibility tests
- [ ] Set up coverage reporting
- [ ] Document test procedures
- [ ] Create CI/CD pipeline

## Next Steps

1. Implement currency formatting
2. Set up date/time localization
3. Create translation management
4. Implement Arabic typography
5. Set up database schema

## References

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Axe](https://github.com/nickcolley/jest-axe)
- [Jest Performance](https://jestjs.io/docs/performance)
