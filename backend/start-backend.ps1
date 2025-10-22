# Le Restaurant Backend Startup Script
# This script sets Java 17 and starts the Spring Boot backend

Write-Host "Setting JAVA_HOME to Java 17..." -ForegroundColor Cyan
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

Write-Host "Starting backend with Java 17..." -ForegroundColor Green
java -version

Write-Host "`nRunning Gradle bootRun..." -ForegroundColor Yellow
./gradlew bootRun
