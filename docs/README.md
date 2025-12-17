# Le Restaurant - Documentation Hub

![Documentation](https://img.shields.io/badge/docs-v2.1-blue)
![Languages](https://img.shields.io/badge/lang-EN%20|%20KO%20|%20JA%20|%20RU-orange)
![Status](https://img.shields.io/badge/status-active-brightgreen)

> **Last Updated**: December 17, 2024

---

## Quick Navigation

| Audience | Start Here |
|----------|------------|
| **New Users** | [Master Index](./00-MASTER-INDEX.md) |
| **Developers** | [API Specification](./design/04-api-specification.md) • [Frontend Design](./design/05-frontend-design.md) |
| **DevOps** | [Azure Deployment](./10-AZURE-DEPLOYMENT-GUIDE.md) • [Pipeline Setup](./pipeline_guide/AZURE_PIPELINE_SETUP.md) |
| **Testers** | [Test Strategy](./testing/TEST_STRATEGY.md) • [Execution Guide](./testing/TEST_EXECUTION_GUIDE.md) |

---

## Documentation Structure

```
docs/
├── 00-MASTER-INDEX.md          # Complete documentation index
├── design/                      # Architecture & API specs
│   ├── 01-project-overview.md
│   ├── 02-system-architecture.md
│   ├── 04-api-specification.md
│   └── 05-frontend-design.md
├── testing/                     # Test documentation
│   ├── TEST_STRATEGY.md
│   ├── TEST_EXECUTION_GUIDE.md
│   └── F108_QUICK_TEST_GUIDE.md
├── requirements/                # Functional & non-functional requirements
├── pipeline_guide/              # CI/CD documentation
├── guides/                      # User guides (multilingual)
├── en/ ko/ ja/ ru/             # Language-specific content
└── Identified_security_issues/  # Security analysis
```

---

## Multilingual Support

| Language | Master Index | Status |
|----------|--------------|--------|
| 🇬🇧 **English** | [00-MASTER-INDEX.md](./00-MASTER-INDEX.md) | Primary |
| 🇰🇷 **한국어** | [00-MASTER-INDEX-ko.md](./00-MASTER-INDEX-ko.md) | Complete |
| 🇯🇵 **日本語** | [00-MASTER-INDEX-ja.md](./00-MASTER-INDEX-ja.md) | Complete |
| 🇷🇺 **Русский** | [00-MASTER-INDEX-ru.md](./00-MASTER-INDEX-ru.md) | Complete |

---

## Key Documents

### Getting Started (01–09)
- [Project Overview](./design/01-project-overview.md)
- [System Architecture](./design/02-system-architecture.md)
- [Quick Start](./QUICK_START.md)

### Deployment (10–19)
- [Azure Deployment Guide](./10-AZURE-DEPLOYMENT-GUIDE.md)
- [Deployment Checklist](./11-DEPLOYMENT-CHECKLIST.md)
- [Pipeline Troubleshooting](./13-AZURE-PIPELINE-FIX.md)

### Architecture (20–29)
- [API Specification](./design/04-api-specification.md)
- [Frontend Design](./design/05-frontend-design.md)
- [Azure Pipeline Design](./design/03-azure-devops-pipeline.md)

### Testing (40–49)
- [Test Strategy](./testing/TEST_STRATEGY.md)
- [Test Execution Guide](./testing/TEST_EXECUTION_GUIDE.md)
- [Feature Test Guides](./testing/)

---

## Document Numbering

| Range | Category |
|-------|----------|
| 00 | Master Index |
| 01–09 | Getting Started |
| 10–19 | Deployment |
| 20–29 | Architecture & Design |
| 30–39 | Feature Documentation |
| 40–49 | Testing |
| 50–59 | Reports & Status |
| 60–69 | User Guides |
| 70–79 | Requirements |
| 80–89 | Security |
| 90–99 | Frontend & Backend |

---

## Maintenance

- All documents use Markdown format
- Keep synchronized with code changes
- Follow numbering conventions
- Update [CHANGELOG.md](./CHANGELOG.md) for significant changes

---

**Need Help?** → [Master Index](./00-MASTER-INDEX.md) | **Main README** → [../README.md](../README.md)
