@echo off
echo ========================================
echo ChicCart - Git Setup Script
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed or not in PATH.
    echo Please install Git from: https://git-scm.com/download/win
    echo After installation, restart this script.
    pause
    exit /b 1
)

echo Git is installed. Proceeding...
echo.

REM Initialize git if not already initialized
if not exist .git (
    echo Initializing git repository...
    git init
    echo.
)

REM Add all files
echo Adding files to git...
git add .
echo.

REM Check if there are changes to commit
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo No changes to commit.
) else (
    echo Creating initial commit...
    git commit -m "Initial commit: ChicCart e-commerce platform with complete authentication system"
    echo.
)

echo ========================================
echo Git setup complete!
echo.
echo Next steps:
echo 1. Create a repository on GitHub/GitLab/Bitbucket
echo 2. Add remote: git remote add origin YOUR_REPO_URL
echo 3. Push: git push -u origin main
echo.
echo Or use: git remote add origin YOUR_REPO_URL
echo         git branch -M main
echo         git push -u origin main
echo ========================================
pause

