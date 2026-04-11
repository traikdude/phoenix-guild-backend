# phoenix-guild-backend

> Google Apps Script project deployed with Clasp

## 🚀 Live Deployment
**Web App URL:** https://script.google.com/macros/s/AKfycbyHgpV_S0sCOfWazIdkjLEOawcZW1aMsVPyFkTifvedvGWJGu9wxBGIWi2G5bheEbFEIg/exec

## 📋 Project Information
- **Script ID:** 10--G3ohx8TQm8-tSB3w6C62zXKGyQ0q-ChJNukIhHaVVlc8v1P15PlqB
- **Container Type:** Standalone
- **Container URL:** Not applicable (Standalone script)

## 🛠️ Development Setup

### Prerequisites
- Node.js ≥14.x
- Clasp CLI: `npm install -g @google/clasp`
- Git

### Local Development
```bash
# Clone this repository
git clone https://github.com/traikdude/phoenix-guild-backend.git
cd phoenix-guild-backend

# Login to Clasp
clasp login

# Pull latest from Apps Script
clasp pull

# Push changes to Apps Script
clasp push
```

## 🔄 CI/CD Pipeline
This project uses GitHub Actions for automated deployment.

### Deployment Triggers
- **Push to main:** Automatically deploys to production
- **Pull Request:** Runs tests and validation

## 📊 Monitoring
Integrated with Google Jules CLI for continuous monitoring.

## 📄 License
MIT

---
**Last Updated:** 2026-04-10
