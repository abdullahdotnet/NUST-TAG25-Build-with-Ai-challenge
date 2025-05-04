@echo off
echo Starting script execution pipeline...
echo =======================================

:: Path to Python executable
set PYTHON_PATH=C:\Users\abdul\AppData\Local\Programs\Python\Python312\python.exe

:: Script 1: API Pipeline
echo Running API Pipeline...
echo -----------------------
call "%PYTHON_PATH%" "E:\University\NUST-TAG25-Build-with-Ai-challenge\scripts\apipipeline.py"
if errorlevel 1 (
    echo Error: API Pipeline failed
    exit /b 1
)
echo API Pipeline completed successfully.
echo.

:: Script 2: Web Scrape Pipeline
echo Running Web Scrape Pipeline...
echo -----------------------------
call "%PYTHON_PATH%" "E:\University\NUST-TAG25-Build-with-Ai-challenge\scripts\webscrapepipeline.py"
if errorlevel 1 (
    echo Error: Web Scrape Pipeline failed
    exit /b 1
)
echo Web Scrape Pipeline completed successfully.
echo.

:: Script 3: Video Generation
echo Running Video Generation...
echo --------------------------
call "%PYTHON_PATH%" "E:\University\NUST-TAG25-Build-with-Ai-challenge\Avatar\work3.py"
if errorlevel 1 (
    echo Error: Video Generation failed
    exit /b 1
)
echo Video Generation completed successfully.
echo.

echo =======================================
echo All scripts completed successfully!
echo Pipeline execution finished at %date% %time%

:: Optional: Keep window open for debugging
timeout /t 10