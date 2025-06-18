# Currency & Number Formatting

## Overview

This document outlines the implementation of currency and number formatting features in the Kurzora trading platform, ensuring consistent display of monetary values and numerical data across all supported languages and regions.

## Table of Contents

1. Currency Formatting
2. Number Formatting
3. Percentage Formatting
4. Price Formatting
5. Implementation Examples
6. Testing Procedures
7. Performance Considerations
8. Integration Checklist
9. Next Steps
10. References

## 1. Currency Formatting

### Currency Configuration

```typescript
interface CurrencyConfig {
  // Currency settings
  code: string;
  symbol: string;
  position: "before" | "after";
  decimalSeparator: string;
  thousandSeparator: string;
  decimalPlaces: number;
  format: string;
}

class CurrencyFormatter {
  private config: CurrencyConfig;

  constructor(config: CurrencyConfig) {
    this.config = config;
  }

  format(value: number): string {
    // Format currency value
    const formatted = this.formatNumber(value);
    return this.config.position === "before"
      ? `${this.config.symbol}${formatted}`
      : `${formatted}${this.config.symbol}`;
  }

  private formatNumber(value: number): string {
    // Format number with separators
    const parts = value.toFixed(this.config.decimalPlaces).split(".");
    parts[0] = parts[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this.config.thousandSeparator
    );
    return parts.join(this.config.decimalSeparator);
  }
}
```

### Currency Registry

```typescript
interface CurrencyRegistry {
  // Currency registry settings
  currencies: Map<string, CurrencyConfig>;
  defaultCurrency: string;
}

class CurrencyRegistryManager {
  private registry: CurrencyRegistry;

  constructor() {
    this.registry = {
      currencies: new Map(),
      defaultCurrency: "USD",
    };
  }

  registerCurrency(code: string, config: CurrencyConfig): void {
    // Register currency configuration
    this.registry.currencies.set(code, config);
  }

  getCurrencyConfig(code: string): CurrencyConfig {
    // Get currency configuration
    return (
      this.registry.currencies.get(code) ||
      this.registry.currencies.get(this.registry.defaultCurrency)
    );
  }
}
```

## 2. Number Formatting

### Number Configuration

```typescript
interface NumberConfig {
  // Number settings
  decimalSeparator: string;
  thousandSeparator: string;
  decimalPlaces: number;
  format: string;
}

class NumberFormatter {
  private config: NumberConfig;

  constructor(config: NumberConfig) {
    this.config = config;
  }

  format(value: number): string {
    // Format number value
    const parts = value.toFixed(this.config.decimalPlaces).split(".");
    parts[0] = parts[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this.config.thousandSeparator
    );
    return parts.join(this.config.decimalSeparator);
  }

  parse(value: string): number {
    // Parse formatted number
    const clean = value.replace(
      new RegExp(`[^\\d${this.config.decimalSeparator}]`, "g"),
      ""
    );
    return parseFloat(clean.replace(this.config.decimalSeparator, "."));
  }
}
```

### Number Registry

```typescript
interface NumberRegistry {
  // Number registry settings
  formats: Map<string, NumberConfig>;
  defaultFormat: string;
}

class NumberRegistryManager {
  private registry: NumberRegistry;

  constructor() {
    this.registry = {
      formats: new Map(),
      defaultFormat: "standard",
    };
  }

  registerFormat(name: string, config: NumberConfig): void {
    // Register number format
    this.registry.formats.set(name, config);
  }

  getFormatConfig(name: string): NumberConfig {
    // Get number format configuration
    return (
      this.registry.formats.get(name) ||
      this.registry.formats.get(this.registry.defaultFormat)
    );
  }
}
```

## 3. Percentage Formatting

### Percentage Configuration

```typescript
interface PercentageConfig {
  // Percentage settings
  symbol: string;
  position: "before" | "after";
  decimalPlaces: number;
  format: string;
}

class PercentageFormatter {
  private config: PercentageConfig;
  private numberFormatter: NumberFormatter;

  constructor(config: PercentageConfig, numberFormatter: NumberFormatter) {
    this.config = config;
    this.numberFormatter = numberFormatter;
  }

  format(value: number): string {
    // Format percentage value
    const formatted = this.numberFormatter.format(value);
    return this.config.position === "before"
      ? `${this.config.symbol}${formatted}`
      : `${formatted}${this.config.symbol}`;
  }

  parse(value: string): number {
    // Parse formatted percentage
    const clean = value.replace(this.config.symbol, "");
    return this.numberFormatter.parse(clean);
  }
}
```

### Percentage Registry

```typescript
interface PercentageRegistry {
  // Percentage registry settings
  formats: Map<string, PercentageConfig>;
  defaultFormat: string;
}

class PercentageRegistryManager {
  private registry: PercentageRegistry;

  constructor() {
    this.registry = {
      formats: new Map(),
      defaultFormat: "standard",
    };
  }

  registerFormat(name: string, config: PercentageConfig): void {
    // Register percentage format
    this.registry.formats.set(name, config);
  }

  getFormatConfig(name: string): PercentageConfig {
    // Get percentage format configuration
    return (
      this.registry.formats.get(name) ||
      this.registry.formats.get(this.registry.defaultFormat)
    );
  }
}
```

## 4. Price Formatting

### Price Configuration

```typescript
interface PriceConfig {
  // Price settings
  currency: CurrencyConfig;
  number: NumberConfig;
  format: string;
}

class PriceFormatter {
  private config: PriceConfig;
  private currencyFormatter: CurrencyFormatter;
  private numberFormatter: NumberFormatter;

  constructor(config: PriceConfig) {
    this.config = config;
    this.currencyFormatter = new CurrencyFormatter(config.currency);
    this.numberFormatter = new NumberFormatter(config.number);
  }

  format(value: number): string {
    // Format price value
    return this.currencyFormatter.format(value);
  }

  parse(value: string): number {
    // Parse formatted price
    const clean = value.replace(this.config.currency.symbol, "");
    return this.numberFormatter.parse(clean);
  }
}
```

### Price Registry

```typescript
interface PriceRegistry {
  // Price registry settings
  formats: Map<string, PriceConfig>;
  defaultFormat: string;
}

class PriceRegistryManager {
  private registry: PriceRegistry;

  constructor() {
    this.registry = {
      formats: new Map(),
      defaultFormat: "standard",
    };
  }

  registerFormat(name: string, config: PriceConfig): void {
    // Register price format
    this.registry.formats.set(name, config);
  }

  getFormatConfig(name: string): PriceConfig {
    // Get price format configuration
    return (
      this.registry.formats.get(name) ||
      this.registry.formats.get(this.registry.defaultFormat)
    );
  }
}
```

## 5. Implementation Examples

### React Components

```typescript
// Currency display component
interface CurrencyDisplayProps {
  value: number;
  currency: string;
  format?: string;
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  value,
  currency,
  format = "standard",
}) => {
  const formatter = useCurrencyFormatter(currency, format);
  return <span>{formatter.format(value)}</span>;
};

// Number display component
interface NumberDisplayProps {
  value: number;
  format?: string;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({
  value,
  format = "standard",
}) => {
  const formatter = useNumberFormatter(format);
  return <span>{formatter.format(value)}</span>;
};

// Percentage display component
interface PercentageDisplayProps {
  value: number;
  format?: string;
}

const PercentageDisplay: React.FC<PercentageDisplayProps> = ({
  value,
  format = "standard",
}) => {
  const formatter = usePercentageFormatter(format);
  return <span>{formatter.format(value)}</span>;
};
```

### Custom Hooks

```typescript
// Currency formatter hook
function useCurrencyFormatter(currency: string, format?: string) {
  const registry = useCurrencyRegistry();
  const config = registry.getCurrencyConfig(currency);
  return useMemo(() => new CurrencyFormatter(config), [config]);
}

// Number formatter hook
function useNumberFormatter(format?: string) {
  const registry = useNumberRegistry();
  const config = registry.getFormatConfig(format);
  return useMemo(() => new NumberFormatter(config), [config]);
}

// Percentage formatter hook
function usePercentageFormatter(format?: string) {
  const registry = usePercentageRegistry();
  const config = registry.getFormatConfig(format);
  const numberFormatter = useNumberFormatter();
  return useMemo(
    () => new PercentageFormatter(config, numberFormatter),
    [config, numberFormatter]
  );
}
```

## 6. Testing Procedures

### Unit Tests

```typescript
describe("CurrencyFormatter", () => {
  const config: CurrencyConfig = {
    code: "USD",
    symbol: "$",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimalPlaces: 2,
    format: "standard",
  };

  const formatter = new CurrencyFormatter(config);

  test("formats currency correctly", () => {
    expect(formatter.format(1234.56)).toBe("$1,234.56");
    expect(formatter.format(0)).toBe("$0.00");
    expect(formatter.format(-1234.56)).toBe("-$1,234.56");
  });
});

describe("NumberFormatter", () => {
  const config: NumberConfig = {
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimalPlaces: 2,
    format: "standard",
  };

  const formatter = new NumberFormatter(config);

  test("formats numbers correctly", () => {
    expect(formatter.format(1234.56)).toBe("1,234.56");
    expect(formatter.format(0)).toBe("0.00");
    expect(formatter.format(-1234.56)).toBe("-1,234.56");
  });

  test("parses formatted numbers correctly", () => {
    expect(formatter.parse("1,234.56")).toBe(1234.56);
    expect(formatter.parse("0.00")).toBe(0);
    expect(formatter.parse("-1,234.56")).toBe(-1234.56);
  });
});
```

### Integration Tests

```typescript
describe("Formatting Integration", () => {
  test("currency and number formatting work together", () => {
    const currencyConfig: CurrencyConfig = {
      code: "USD",
      symbol: "$",
      position: "before",
      decimalSeparator: ".",
      thousandSeparator: ",",
      decimalPlaces: 2,
      format: "standard",
    };

    const numberConfig: NumberConfig = {
      decimalSeparator: ".",
      thousandSeparator: ",",
      decimalPlaces: 2,
      format: "standard",
    };

    const priceConfig: PriceConfig = {
      currency: currencyConfig,
      number: numberConfig,
      format: "standard",
    };

    const formatter = new PriceFormatter(priceConfig);
    expect(formatter.format(1234.56)).toBe("$1,234.56");
  });
});
```

## 7. Performance Considerations

### Caching

```typescript
class FormattingCache {
  private cache: Map<string, string>;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}
```

### Optimization

```typescript
class OptimizedFormatter {
  private cache: FormattingCache;
  private formatter: CurrencyFormatter | NumberFormatter;

  constructor(formatter: CurrencyFormatter | NumberFormatter) {
    this.cache = new FormattingCache();
    this.formatter = formatter;
  }

  format(value: number): string {
    const key = value.toString();
    const cached = this.cache.get(key);
    if (cached) return cached;

    const formatted = this.formatter.format(value);
    this.cache.set(key, formatted);
    return formatted;
  }
}
```

## 8. Integration Checklist

- [ ] Set up currency configurations
- [ ] Implement number formatting
- [ ] Add percentage formatting
- [ ] Create price formatting
- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Implement caching
- [ ] Optimize performance
- [ ] Document usage
- [ ] Add examples

## 9. Next Steps

1. Implement locale-specific formatting
2. Add support for custom formats
3. Create format validation
4. Add format conversion
5. Implement format migration

## References

- [Number Formatting Guide](https://formatting.kurzora.com)
- [Currency Guide](https://currency.kurzora.com)
- [Performance Guide](https://performance.kurzora.com)
- [Testing Guide](https://testing.kurzora.com)
- [Integration Guide](https://integration.kurzora.com)
