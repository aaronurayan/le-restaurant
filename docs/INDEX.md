# Documentation Index

![Version](https://img.shields.io/badge/version-2.1-blue)
![Numbering](https://img.shields.io/badge/numbering-00--99-blue)
![Languages](https://img.shields.io/badge/lang-4-orange)

> **Last Updated**: December 17, 2024

---

## Document Catalog by Number

### Getting Started (01–09)

| # | Document | Description |
|---|----------|-------------|
| 00 | [Master Index](./00-MASTER-INDEX.md) | Complete documentation map |
| 01 | [Project Overview](./design/01-project-overview.md) | Project introduction |
| 02 | [System Architecture](./design/02-system-architecture.md) | Technical architecture |
| 03 | [Documentation README](./README.md) | This folder overview |
| 04 | [Documentation Index](./INDEX.md) | This file |
| 05 | [Quick Start](./QUICK_START.md) | Role-based navigation |
| 08 | [Improvements Summary](./DOCUMENTATION_IMPROVEMENTS_SUMMARY.md) | What changed |
| 09 | [Changelog](./CHANGELOG.md) | Version history |

### Deployment (10–19)

| # | Document | Description |
|---|----------|-------------|
| 10 | [Azure Deployment](./10-AZURE-DEPLOYMENT-GUIDE.md) | Full deployment guide |
| 11 | [Deployment Checklist](./11-DEPLOYMENT-CHECKLIST.md) | Pre-deploy verification |
| 12 | [Pipeline Setup](./pipeline_guide/AZURE_PIPELINE_SETUP.md) | CI/CD configuration |
| 13 | [Pipeline Fix](./13-AZURE-PIPELINE-FIX.md) | Troubleshooting |

### Architecture & Design (20–29)

| # | Document | Description |
|---|----------|-------------|
| 20 | [System Architecture](./design/02-system-architecture.md) | Backend + Frontend design |
| 21 | [API Specification](./design/04-api-specification.md) | REST API endpoints |
| 22 | [Frontend Design](./design/05-frontend-design.md) | React component architecture |
| 23 | [Pipeline Design](./design/03-azure-devops-pipeline.md) | CI/CD architecture |

### Feature Documentation (30–39)

| # | Document | Description |
|---|----------|-------------|
| 30 | [F100-F101 Merge Review](./30-MERGE-REVIEW-F100-F101.md) | Authentication merge |
| 31 | [Connectivity Report](./31-CONNECTIVITY-REPORT.md) | Frontend-Backend integration |
| 32 | [Iteration Summary](./32-ITERATION-SUMMARY.md) | Development sprints |

### Testing (40–49)

| # | Document | Description |
|---|----------|-------------|
| 40 | [Test Strategy](./testing/TEST_STRATEGY.md) | Testing approach |
| 41 | [Execution Guide](./testing/TEST_EXECUTION_GUIDE.md) | How to run tests |
| 42 | [Quick Start Testing](./testing/QUICK_START_TESTING.md) | Fast setup |
| 43 | [F108 Test Guide](./testing/F108_QUICK_TEST_GUIDE.md) | Reservation tests |
| 44 | [F109 Test Guide](./testing/F109_QUICK_TEST_GUIDE.md) | Manager feature tests |
| 49 | [Test Results](./testing/results.md) | Execution results |

### Reports & Status (50–59)

| # | Document | Description |
|---|----------|-------------|
| 50 | [Documentation Status](./50-DOCUMENTATION-STATUS.md) | Completeness tracking |
| 51 | [English Reports](./en/reports/INDEX.md) | All technical reports |
| 52 | [Backend Improvements](./en/reports/backend-final-improvements.md) | Backend changes |
| 54 | [Frontend Review](./en/reports/frontend-architecture-review.md) | Frontend analysis |
| 56 | [Feature Verification](./en/reports/feature-verification.md) | Feature status |

### User Guides (60–69)

| # | Document | Description |
|---|----------|-------------|
| 60 | [Guides Index](./guides/README.md) | All user guides |
| 61 | [Admin Dashboard](./guides/01-admin-dashboard-access.md) | Admin access |
| 62 | [Routing Verification](./guides/02-routing-verification.md) | URL routing |
| 63 | [UX Improvements](./guides/03-ux-navigation-improvements.md) | Navigation UX |
| 64 | [Pipeline Improvements](./guides/04-pipeline-improvements.md) | CI/CD updates |
| 65 | [Pipeline Review](./guides/05-azure-pipeline-review.md) | Full review |

---

## Multilingual Access

| Language | Master Index | Reports | Guides |
|----------|--------------|---------|--------|
| 🇬🇧 English | [Master Index](./00-MASTER-INDEX.md) | [Reports](./en/reports/INDEX.md) | [Guides](./guides/README.md) |
| 🇰🇷 한국어 | [마스터 인덱스](./00-MASTER-INDEX-ko.md) | [보고서](./ko/reports/INDEX.md) | [가이드](./ko/guides/README.md) |
| 🇯🇵 日本語 | [マスターインデックス](./00-MASTER-INDEX-ja.md) | [レポート](./ja/reports/INDEX.md) | [ガイド](./ja/guides/README.md) |
| 🇷🇺 Русский | [Мастер-индекс](./00-MASTER-INDEX-ru.md) | [Отчеты](./ru/reports/INDEX.md) | [Руководства](./ru/guides/README.md) |

---

## Find by Feature

| Feature Code | Description | Primary Docs |
|--------------|-------------|--------------|
| F100–F101 | User Authentication | [#30 Merge Review](./30-MERGE-REVIEW-F100-F101.md) |
| F102 | User Management | [Security Issues](./Identified_security_issues/) |
| F103–F104 | Menu Management | [#21 API Spec](./design/04-api-specification.md) |
| F105–F106 | Order & Payment | [#21 API Spec](./design/04-api-specification.md) |
| F107 | Delivery | [#56 Feature Verification](./en/reports/feature-verification.md) |
| F108–F109 | Reservation | [#43-44 Test Guides](./testing/) |

---

## Directory Layout

```
docs/
├── design/           # Architecture & API
├── testing/          # Test documentation
├── requirements/     # Requirements specs
├── pipeline_guide/   # CI/CD guides
├── guides/           # User guides
├── en/ ko/ ja/ ru/   # Language-specific
└── Identified_security_issues/
```

---

**Need full navigation?** → [Master Index](./00-MASTER-INDEX.md)
