# Internationalization Database Schema

## Overview

This document outlines the database schema for internationalization features in the Kurzora trading platform, providing a structured approach to storing and managing multi-language content.

## Table of Contents

1. Schema Overview
2. Translation Tables
3. Language Tables
4. Content Tables
5. User Preferences
6. Format Settings
7. RTL Settings
8. Indexes
9. Constraints
10. Migrations
11. Backup Strategy
12. Performance Optimization

## 1. Schema Overview

### Database Structure

```sql
-- Database creation
CREATE DATABASE kurzora_internationalization;

-- Schema creation
CREATE SCHEMA internationalization;

-- Extension setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Schema Version

```sql
-- Version tracking
CREATE TABLE internationalization.schema_version (
  version_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_number VARCHAR(10) NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT
);
```

## 2. Translation Tables

### Translations

```sql
-- Main translations table
CREATE TABLE internationalization.translations (
  translation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  value TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(key, language_code)
);

-- Translation metadata
CREATE TABLE internationalization.translation_metadata (
  metadata_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  translation_id UUID REFERENCES internationalization.translations(translation_id),
  metadata_key VARCHAR(255) NOT NULL,
  metadata_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Translation Categories

```sql
-- Translation categories
CREATE TABLE internationalization.translation_categories (
  category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES internationalization.translation_categories(category_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Category translations
CREATE TABLE internationalization.category_translations (
  category_translation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES internationalization.translation_categories(category_id),
  language_code VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, language_code)
);
```

## 3. Language Tables

### Languages

```sql
-- Supported languages
CREATE TABLE internationalization.languages (
  language_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  native_name VARCHAR(255) NOT NULL,
  is_rtl BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Language settings
CREATE TABLE internationalization.language_settings (
  setting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_id UUID REFERENCES internationalization.languages(language_id),
  setting_key VARCHAR(255) NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language_id, setting_key)
);
```

### Language Pairs

```sql
-- Language pairs for translation
CREATE TABLE internationalization.language_pairs (
  pair_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_language_id UUID REFERENCES internationalization.languages(language_id),
  target_language_id UUID REFERENCES internationalization.languages(language_id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_language_id, target_language_id)
);
```

## 4. Content Tables

### Content Types

```sql
-- Content types
CREATE TABLE internationalization.content_types (
  content_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  schema JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Content items
CREATE TABLE internationalization.content_items (
  content_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type_id UUID REFERENCES internationalization.content_types(content_type_id),
  language_code VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  is_active BOOLEAN DEFAULT true
);
```

### Content Versions

```sql
-- Content versions
CREATE TABLE internationalization.content_versions (
  version_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES internationalization.content_items(content_id),
  version_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  UNIQUE(content_id, version_number)
);
```

## 5. User Preferences

### User Language Preferences

```sql
-- User language preferences
CREATE TABLE internationalization.user_language_preferences (
  preference_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  language_id UUID REFERENCES internationalization.languages(language_id),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, language_id)
);

-- User format preferences
CREATE TABLE internationalization.user_format_preferences (
  preference_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  date_format VARCHAR(50),
  time_format VARCHAR(50),
  number_format VARCHAR(50),
  currency_format VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
```

## 6. Format Settings

### Format Templates

```sql
-- Format templates
CREATE TABLE internationalization.format_templates (
  template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  template TEXT NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(name, type, language_code)
);

-- Format rules
CREATE TABLE internationalization.format_rules (
  rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES internationalization.format_templates(template_id),
  rule_key VARCHAR(255) NOT NULL,
  rule_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(template_id, rule_key)
);
```

## 7. RTL Settings

### RTL Configurations

```sql
-- RTL configurations
CREATE TABLE internationalization.rtl_configurations (
  config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_id UUID REFERENCES internationalization.languages(language_id),
  component_id VARCHAR(255) NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(language_id, component_id)
);

-- RTL overrides
CREATE TABLE internationalization.rtl_overrides (
  override_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_id UUID REFERENCES internationalization.rtl_configurations(config_id),
  override_key VARCHAR(255) NOT NULL,
  override_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(config_id, override_key)
);
```

## 8. Indexes

### Performance Indexes

```sql
-- Translation indexes
CREATE INDEX idx_translations_key ON internationalization.translations(key);
CREATE INDEX idx_translations_language ON internationalization.translations(language_code);
CREATE INDEX idx_translations_active ON internationalization.translations(is_active);

-- Content indexes
CREATE INDEX idx_content_type ON internationalization.content_items(content_type_id);
CREATE INDEX idx_content_language ON internationalization.content_items(language_code);
CREATE INDEX idx_content_active ON internationalization.content_items(is_active);

-- User preference indexes
CREATE INDEX idx_user_language ON internationalization.user_language_preferences(user_id);
CREATE INDEX idx_user_format ON internationalization.user_format_preferences(user_id);
```

## 9. Constraints

### Data Integrity

```sql
-- Translation constraints
ALTER TABLE internationalization.translations
  ADD CONSTRAINT fk_language_code
  FOREIGN KEY (language_code)
  REFERENCES internationalization.languages(code);

-- Content constraints
ALTER TABLE internationalization.content_items
  ADD CONSTRAINT fk_content_language
  FOREIGN KEY (language_code)
  REFERENCES internationalization.languages(code);

-- User preference constraints
ALTER TABLE internationalization.user_language_preferences
  ADD CONSTRAINT fk_user_language
  FOREIGN KEY (language_id)
  REFERENCES internationalization.languages(language_id);
```

## 10. Migrations

### Migration Management

```sql
-- Migration tracking
CREATE TABLE internationalization.migrations (
  migration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  checksum VARCHAR(64) NOT NULL,
  UNIQUE(name)
);

-- Migration logs
CREATE TABLE internationalization.migration_logs (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  migration_id UUID REFERENCES internationalization.migrations(migration_id),
  status VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 11. Backup Strategy

### Backup Configuration

```sql
-- Backup configuration
CREATE TABLE internationalization.backup_config (
  config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule VARCHAR(50) NOT NULL,
  retention_days INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Backup history
CREATE TABLE internationalization.backup_history (
  backup_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_id UUID REFERENCES internationalization.backup_config(config_id),
  status VARCHAR(50) NOT NULL,
  size_bytes BIGINT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);
```

## 12. Performance Optimization

### Caching Configuration

```sql
-- Cache configuration
CREATE TABLE internationalization.cache_config (
  config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key VARCHAR(255) NOT NULL,
  ttl_seconds INTEGER NOT NULL,
  invalidation_rules JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Cache statistics
CREATE TABLE internationalization.cache_stats (
  stat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_id UUID REFERENCES internationalization.cache_config(config_id),
  hits BIGINT DEFAULT 0,
  misses BIGINT DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## References

- [Database Design Best Practices](https://database.kurzora.com)
- [Performance Guide](https://performance.kurzora.com)
- [Migration Guide](https://migration.kurzora.com)
- [Backup Guide](https://backup.kurzora.com)
- [Optimization Guide](https://optimization.kurzora.com)
