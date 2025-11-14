# 백엔드 서버 시작 스크립트
Write-Host "=== Le Restaurant Backend Server ===" -ForegroundColor Cyan
Write-Host "서버를 시작합니다..." -ForegroundColor Yellow
Write-Host ""

# 현재 디렉토리 확인
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Gradle로 서버 시작
Write-Host "Gradle bootRun 실행 중..." -ForegroundColor Cyan
Write-Host "서버가 시작되는데 약 20-30초가 소요됩니다." -ForegroundColor Yellow
Write-Host ""

.\gradlew.bat bootRun

