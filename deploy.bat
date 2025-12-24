@echo off
echo ========================================
echo   Deploying to GitHub Pages
echo   Repository: athoillah21.github.io
echo ========================================
echo.

cd /d "%~dp0"

REM Check if git is initialized
if not exist ".git" (
    echo Initializing git repository...
    git init
    git remote add origin https://github.com/Athoillah21/athoillah21.github.io.git
) else (
    echo Git repository already initialized.
)

REM Add all files
echo.
echo Adding files...
git add .

REM Commit with timestamp
set timestamp=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%
set timestamp=%timestamp: =0%
echo.
echo Committing changes...
git commit -m "Deploy portfolio - %timestamp%"

REM Push to main branch
echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   Deployment complete!
echo   Your site will be live at:
echo   https://athoillah21.github.io
echo ========================================
pause
