# Git Setup Instructions

## If Git is Not Installed

1. **Install Git:**
   - Download from: https://git-scm.com/download/win
   - Follow installation wizard
   - Restart your terminal after installation

2. **Configure Git (first time only):**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Initialize Repository

Run these commands in your project directory:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ChicCart e-commerce platform with full authentication and fixes"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/ChicCart.git

# Rename branch to main
git branch -M main

# Push to remote
git push -u origin main
```

## If Repository Already Exists

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Fix: Complete authentication system, protected routes, and navigation fixes"

# Push to remote
git push
```

## Files to Commit

✅ All source code
✅ Configuration files (package.json, vite.config.js, etc.)
✅ Database schema files
✅ Documentation files
✅ netlify.toml

❌ DO NOT commit:
- `.env` file (contains secrets)
- `node_modules/` (already in .gitignore)
- `dist/` folder (build output)

