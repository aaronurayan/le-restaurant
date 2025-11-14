# 백엔드 서버 연결 테스트 스크립트
Write-Host "`n=== 백엔드 서버 연결 테스트 ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080"
$endpoints = @(
    @{ Path = "/api/health"; Name = "Health Check" },
    @{ Path = "/api/menu-items"; Name = "Menu Items" },
    @{ Path = "/api/users"; Name = "Users" },
    @{ Path = "/api/orders"; Name = "Orders" }
)

$successCount = 0
$totalCount = $endpoints.Count

foreach ($endpoint in $endpoints) {
    $url = "$baseUrl$($endpoint.Path)"
    Write-Host "[테스트] $($endpoint.Name): $url" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "  ✅ 성공! (Status: $($response.StatusCode))" -ForegroundColor Green
        $successCount++
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 401 -or $statusCode -eq 403) {
            Write-Host "  ✅ 엔드포인트 접근 가능 (인증 필요: $statusCode)" -ForegroundColor Yellow
            $successCount++
        }
        elseif ($statusCode) {
            Write-Host "  ⚠️  응답: $statusCode" -ForegroundColor Yellow
        }
        else {
            Write-Host "  ❌ 연결 실패: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n=== 테스트 결과 ===" -ForegroundColor Cyan
Write-Host "성공: $successCount / $totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($successCount -eq $totalCount) {
    Write-Host "`n✅ 모든 테스트 통과! 백엔드 서버가 정상적으로 실행 중입니다." -ForegroundColor Green
}
elseif ($successCount -gt 0) {
    Write-Host "`n⚠️  일부 엔드포인트에 연결할 수 없습니다. 서버가 완전히 시작되지 않았을 수 있습니다." -ForegroundColor Yellow
}
else {
    Write-Host "`n❌ 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요." -ForegroundColor Red
    Write-Host "   서버 시작: .\start-server.ps1 또는 .\gradlew.bat bootRun" -ForegroundColor Yellow
}

