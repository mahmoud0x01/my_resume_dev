---
title: "Setting Up CI/CD with GitHub Actions for Python Projects"
date: 2025-01-10T10:00:00+00:00
draft: false
author: "Mahmoud"
tags:
  - DevOps
  - CI/CD
  - Python
  - GitHub Actions
image: /images/post.jpg
description: "A practical guide to automating your Python project workflow with GitHub Actions - from testing to deployment"
toc: true
---

## Introduction

Continuous Integration and Continuous Deployment (CI/CD) are essential practices in modern software development. In this guide, I'll walk you through setting up a complete CI/CD pipeline for a Python project using GitHub Actions.

## Why GitHub Actions?

GitHub Actions is a powerful, free (for public repositories) automation platform that integrates seamlessly with your GitHub workflow. Key benefits include:

- **Native GitHub integration** — no external services needed
- **Matrix builds** — test across multiple Python versions simultaneously
- **Extensive marketplace** — pre-built actions for common tasks
- **Free for open source** — generous free tier for public repos

## Basic Workflow Structure

Create a `.github/workflows/ci.yml` file in your repository:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.10', '3.11', '3.12']

    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-cov flake8
      
      - name: Lint with flake8
        run: flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
      
      - name: Run tests
        run: pytest --cov=./ --cov-report=xml
```

## Adding Docker Build

For projects that use Docker, extend your workflow:

```yaml
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
      
      - name: Run container tests
        run: |
          docker run --rm myapp:${{ github.sha }} python -m pytest
```

## Deployment Stage

Add automatic deployment to your server or cloud provider:

```yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app
            docker-compose pull
            docker-compose up -d
```

## Secrets Management

Store sensitive data in GitHub Secrets:

1. Go to Repository → Settings → Secrets and variables → Actions
2. Add secrets like `SSH_KEY`, `HOST`, `USERNAME`
3. Reference in workflow as `${{ secrets.SECRET_NAME }}`

## Best Practices

1. **Fail fast** — run linting before time-consuming tests
2. **Cache dependencies** — speed up builds with pip caching
3. **Use matrix builds** — ensure compatibility across Python versions
4. **Separate concerns** — use different jobs for test, build, deploy
5. **Protect main branch** — require passing CI before merge

## Conclusion

A well-configured CI/CD pipeline saves hours of manual work and catches issues early. Start with basic testing, then gradually add linting, Docker builds, and automated deployment as your project grows.

---

*This workflow is used in my projects like [TicketPro](https://github.com/mahmoud0x01/Ticket_Support_full_stack) and [News Bot](https://github.com/mahmoud0x01/news_bot_telegram).*
