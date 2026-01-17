.PHONY: install install-dev format lint type-check test clean venv

# Create virtual environment
venv:
	python -m venv venv

# Install production dependencies only
install:
	pip install --upgrade pip
	pip install -r requirements.txt

# Install all dependencies (production + dev)
install-dev:
	pip install --upgrade pip
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	pre-commit install

# Format code
format:
	black app/
	ruff check --fix app/

# Lint code
lint:
	ruff check app/
	black --check app/

# Type check
type-check:
	mypy app/

# Run tests
test:
	pytest

# Clean cache
clean:
	find . -type d -name __pycache__ -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -r {} +
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf .ruff_cache

# Run all checks
check: lint type-check test
