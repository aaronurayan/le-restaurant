# TESTING Documentation Index

| Document Information | |
|---------------------|------------------------|
| **Document ID** | TST-000-Index |
| **Version** | 2.0 |
| **Status** | Current |
| **Last Updated** | 2025-12-24 |
| **Maintainer** | QA Team |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Document Catalog](#2-document-catalog)
3. [Quick Reference](#3-quick-reference)
4. [Usage Guide](#4-usage-guide)
5. [Related Documents](#5-related-documents)

---

## 1. Overview

### 1.1 Purpose

This index provides organized access to all testing documentation for the Le Restaurant project. Documents are categorized by function and follow the `TST-<NUMBER>-<Title>.md` naming convention.

### 1.2 Scope

This directory contains:
- Test strategy and planning documents
- Test execution guides
- Feature-specific test documentation
- Test results and reports

---

## 2. Document Catalog

### 2.1 Strategy and Planning

| Document ID | Title | Description |
|-------------|-------|-------------|
| TST-001 | [Test Cases](./TST-001-Test-Cases.md) | Comprehensive test cases for all features |
| TST-002 | [Test Strategy](./TST-002-Test-Strategy.md) | Overall testing approach and methodology |
| TST-003 | [Test Execution Guide](./TST-003-Test-Execution-Guide.md) | Step-by-step test execution instructions |

### 2.2 Quick Start Guides

| Document ID | Title | Description |
|-------------|-------|-------------|
| TST-004 | [Quick Start Testing](./TST-004-Quick-Start-Testing.md) | General quick start testing guide |
| TST-008 | [F108 Quick Test Guide](./TST-008-F108-Quick-Test-Guide.md) | Reservation feature quick testing |
| TST-009 | [F109 Quick Test Guide](./TST-009-F109-Quick-Test-Guide.md) | Manager dashboard quick testing |
| TST-010 | [F108 Quick Start](./TST-010-F108-Quick-Start-Testing.md) | F108-specific quick start guide |

### 2.3 Status and Results

| Document ID | Title | Description |
|-------------|-------|-------------|
| TST-005 | [Testing Summary](./TST-005-Testing-Summary.md) | Summary of all testing activities |
| TST-006 | [Testing Complete](./TST-006-Testing-Complete.md) | Testing completion documentation |
| TST-007 | [Test Results](./TST-007-Test-Results.md) | Detailed test execution results |
| TST-011 | [F108 Implementation Status](./TST-011-F108-Implementation-Status.md) | F108 implementation and testing status |

---

## 3. Quick Reference

### 3.1 By Testing Phase

| Phase | Recommended Documents |
|-------|----------------------|
| Planning | TST-001, TST-002 |
| Execution | TST-003, TST-004 |
| Feature Testing | TST-008, TST-009, TST-010 |
| Reporting | TST-005, TST-006, TST-007 |

### 3.2 By Feature

| Feature | Test Documents |
|---------|----------------|
| F108 (Reservations) | TST-008, TST-010, TST-011 |
| F109 (Manager Dashboard) | TST-009 |
| General | TST-001, TST-002, TST-003 |

---

## 4. Usage Guide

### 4.1 Getting Started

1. **New to Testing?**
   - Start with [TST-002 Test Strategy](./TST-002-Test-Strategy.md)
   - Then review [TST-004 Quick Start Testing](./TST-004-Quick-Start-Testing.md)

2. **Executing Tests?**
   - Follow [TST-003 Test Execution Guide](./TST-003-Test-Execution-Guide.md)

3. **Testing Specific Features?**
   - Reservations: [TST-008](./TST-008-F108-Quick-Test-Guide.md)
   - Manager Dashboard: [TST-009](./TST-009-F109-Quick-Test-Guide.md)

4. **Reviewing Results?**
   - Check [TST-007 Test Results](./TST-007-Test-Results.md)
   - Review [TST-005 Testing Summary](./TST-005-Testing-Summary.md)

### 4.2 Document Naming Convention

All testing documents follow this format:

```
TST-<NUMBER>-<Title>.md
```

| Component | Description |
|-----------|-------------|
| TST | Document type prefix (Testing) |
| NUMBER | Three-digit sequential number |
| Title | Descriptive title with hyphens |

---

## 5. Related Documents

### 5.1 Design Documentation

| Document ID | Title | Location |
|-------------|-------|----------|
| DES-001 | Project Overview | [../DESIGN/DES-001-Project-Overview.md](../DESIGN/DES-001-Project-Overview.md) |
| API-001 | REST Specification | [../DESIGN/API-001-REST-Specification.md](../DESIGN/API-001-REST-Specification.md) |

### 5.2 Requirements Documentation

| Document ID | Title | Location |
|-------------|-------|----------|
| REQ-001 | Functional Requirements | [../REQUIREMENTS/Actual-design-plan/REQ-001-Functional-Requirements.md](../REQUIREMENTS/Actual-design-plan/REQ-001-Functional-Requirements.md) |

### 5.3 Master Index

For complete project documentation, see:
- [00-MASTER-INDEX.md](../00-MASTER-INDEX.md)

---

**End of Document**

