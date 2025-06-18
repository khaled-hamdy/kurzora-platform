# Language Detection & Switching Implementation Guide

## Overview

This document outlines the technical implementation of automatic language detection and user language switching for the Kurzora trading platform.

## Table of Contents

1. Browser Language Detection
2. User Preference Storage
3. Language Switching Component
4. URL Routing
5. Session Persistence
6. Fallback Handling
7. Implementation Examples

## 1. Browser Language Detection

### Implementation

```typescript
// src/utils/languageDetection.ts
export const detectBrowserLanguage = (): string => {
  // Get browser language
  const browserLang = navigator.language || navigator.languages[0];

  // Map to supported languages
  const supportedLanguages = ["en", "de", "ar"];
  const detectedLang = browserLang.split("-")[0];

  return supportedLanguages.includes(detectedLang) ? detectedLang : "en";
};
```

### Usage

```typescript
// src/contexts/LanguageContext.tsx
import { detectBrowserLanguage } from "../utils/languageDetection";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang) return savedLang;

    // Fallback to browser detection
    return detectBrowserLanguage();
  });

  // ... rest of the implementation
};
```

## 2. User Preference Storage

### Implementation

```typescript
// src/utils/languageStorage.ts
export const saveLanguagePreference = (lang: string): void => {
  localStorage.setItem("preferredLanguage", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
};

export const getLanguagePreference = (): string | null => {
  return localStorage.getItem("preferredLanguage");
};
```

## 3. Language Switching Component

### Implementation

```typescript
// src/components/LanguageToggle.tsx
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { saveLanguagePreference } from "../utils/languageStorage";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    saveLanguagePreference(newLang);
    // Trigger any necessary UI updates
    window.location.reload(); // Only if needed
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-2 py-1 rounded ${
          language === "en" ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("de")}
        className={`px-2 py-1 rounded ${
          language === "de" ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        DE
      </button>
      <button
        onClick={() => handleLanguageChange("ar")}
        className={`px-2 py-1 rounded ${
          language === "ar" ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        AR
      </button>
    </div>
  );
};
```

## 4. URL Routing

### Implementation

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Language-specific routes */}
        <Route path="/:lang/*" element={<LanguageRoute />} />
        {/* Default route */}
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// src/components/LanguageRoute.tsx
const LanguageRoute: React.FC = () => {
  const { language } = useLanguage();
  const { lang } = useParams();

  useEffect(() => {
    if (lang && lang !== language) {
      setLanguage(lang);
      saveLanguagePreference(lang);
    }
  }, [lang, language]);

  return <Outlet />;
};
```

## 5. Session Persistence

### Implementation

```typescript
// src/contexts/LanguageContext.tsx
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState(() => {
    // Check session storage first
    const sessionLang = sessionStorage.getItem("currentLanguage");
    if (sessionLang) return sessionLang;

    // Then check localStorage
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang) return savedLang;

    // Finally, detect from browser
    return detectBrowserLanguage();
  });

  useEffect(() => {
    // Save to session storage
    sessionStorage.setItem("currentLanguage", language);
  }, [language]);

  // ... rest of the implementation
};
```

## 6. Fallback Handling

### Implementation

```typescript
// src/utils/fallbackLanguage.ts
export const getFallbackLanguage = (requestedLang: string): string => {
  const supportedLanguages = ["en", "de", "ar"];
  const defaultLanguage = "en";

  if (supportedLanguages.includes(requestedLang)) {
    return requestedLang;
  }

  // Try to find closest match
  const browserLang = navigator.language.split("-")[0];
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }

  return defaultLanguage;
};
```

## 7. Testing Procedures

### Unit Tests

```typescript
// src/utils/__tests__/languageDetection.test.ts
import { detectBrowserLanguage } from "../languageDetection";

describe("Language Detection", () => {
  it("should detect browser language correctly", () => {
    // Mock navigator.language
    Object.defineProperty(navigator, "language", {
      value: "de-DE",
      configurable: true,
    });

    expect(detectBrowserLanguage()).toBe("de");
  });

  it("should fallback to English for unsupported languages", () => {
    Object.defineProperty(navigator, "language", {
      value: "fr-FR",
      configurable: true,
    });

    expect(detectBrowserLanguage()).toBe("en");
  });
});
```

## Performance Considerations

1. **Caching**

   - Cache language preferences in localStorage
   - Use sessionStorage for current session
   - Implement service worker for offline support

2. **Bundle Size**

   - Lazy load language files
   - Split translations by route
   - Use dynamic imports for language-specific components

3. **Rendering Performance**
   - Minimize re-renders during language switches
   - Use React.memo for language-dependent components
   - Implement virtualization for long lists

## Integration Checklist

- [ ] Implement browser language detection
- [ ] Set up language preference storage
- [ ] Create language switching component
- [ ] Configure URL routing
- [ ] Implement session persistence
- [ ] Add fallback handling
- [ ] Write unit tests
- [ ] Test performance
- [ ] Document implementation

## Next Steps

1. Implement currency formatting system
2. Set up date/time localization
3. Configure database schema for translations
4. Create translation management system
5. Develop testing procedures

## References

- [MDN Web Docs - Navigator.language](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language)
- [React Router Documentation](https://reactrouter.com/)
- [i18next Documentation](https://www.i18next.com/)
