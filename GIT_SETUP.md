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

## Fixing Remote URL Issues

If you need to update or change the remote repository URL:

```bash
# Check current remote URL
git remote -v

# Update existing remote URL
git remote set-url origin https://github.com/Lazycharm/ChicCart.git

# Or remove and re-add remote
git remote remove origin
git remote add origin https://github.com/Lazycharm/ChicCart.git

# Verify the change
git remote -v
```

## Handling "Remote Contains Work" Error

If you get an error that the remote contains work you don't have locally (common when GitHub creates a README):

**Option 1: Pull and merge (recommended)**
```bash
# Pull remote changes and merge
git pull origin main --allow-unrelated-histories

# Resolve any merge conflicts if they occur, then:
git add .
git commit -m "Merge remote-tracking branch 'origin/main'"

# Push your changes
git push -u origin main
```

**Option 2: Force push (⚠️ only if you're sure you want to overwrite remote)**
```bash
# WARNING: This will overwrite the remote repository
git push -u origin main --force
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

