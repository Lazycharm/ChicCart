@echo off
echo ========================================
echo ChicCart - Netlify Deployment
echo ========================================
echo.

REM Check if dist folder exists
if not exist dist (
    echo Building project...
    call npm run build
    echo.
)

echo Deploying to Netlify...
echo.
echo You will be prompted to:
echo 1. Login to Netlify (opens browser)
echo 2. Authorize the CLI
echo.
echo After deployment, remember to:
echo - Add environment variables in Netlify dashboard
echo - Set up database in Supabase
echo.

netlify deploy --prod --dir=dist

echo.
echo ========================================
echo Deployment complete!
echo.
echo IMPORTANT: Add environment variables in Netlify dashboard:
echo - VITE_SUPABASE_URL
echo - VITE_SUPABASE_ANON_KEY
echo ========================================
pause

