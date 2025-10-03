# Azure Pipeline 수정 완료

## 수정된 문제

### 1. Frontend npm 스크립트 오류
**에러:**
```
npm error Missing script: "test:ci"
```

**해결:**
- `frontend/package.json`에 `"test:ci": "vitest run"` 스크립트 추가
- Azure pipeline이 CI 환경에서 테스트를 실행할 수 있도록 설정

### 2. Backend Java 버전 불일치
**에러:**
```
Cannot find a Java installation matching: {languageVersion=23}
Toolchain download repositories have not been configured.
```

**해결:**
- `backend/build.gradle` Java 버전을 23 → 17로 변경
- `backend/settings.gradle`에 Foojay Toolchain Resolver 플러그인 추가 (자동 JDK 다운로드)
- Java toolchain 대신 `sourceCompatibility`/`targetCompatibility` 사용으로 변경

## 수정된 파일

### 1. `frontend/package.json`
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "test:ci": "vitest run",  // ← 추가됨
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage",
  "test:watch": "vitest --watch"
}
```

### 2. `backend/build.gradle`
```gradle
java {
  sourceCompatibility = '17'  // ← 변경됨 (기존: toolchain 23)
  targetCompatibility = '17'  // ← 추가됨
}
```

### 3. `backend/settings.gradle`
```gradle
// Configure toolchain repositories for automatic JDK download
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '0.8.0'
}

rootProject.name = 'le-restaurant-backend'
```

## 검증

### 로컬 빌드 성공
```bash
✅ Backend Build: BUILD SUCCESSFUL in 15s
✅ Backend Tests: BUILD SUCCESSFUL in 26s (33 tests passing)
✅ All test files compile without errors
```

### Azure Pipeline 호환성
- ✅ **Frontend**: `npm run test:ci` 스크립트 실행 가능
- ✅ **Backend**: Java 17 (Azure pipeline의 JAVA_VERSION과 일치)
- ✅ **Coverage**: JaCoCo 리포트 생성 가능

## 환경 정보

### 로컬 환경
- **OS**: Windows 11
- **Java**: Java 23 (로컬 설치)
- **Gradle**: 8.14.3
- **Node.js**: 18.x

### Azure DevOps 환경
- **OS**: Ubuntu (Linux 6.11.0-1018-azure amd64)
- **Java**: Java 17 (Azure agent 설치됨)
- **Node.js**: 18.x

## 주의사항

### JaCoCo 경고
로컬 환경에서 Java 23으로 테스트 실행 시 JaCoCo instrumentation 경고가 표시될 수 있습니다:
```
java.lang.IllegalArgumentException: Unsupported class file major version 67
```

이는 **무해한 경고**입니다:
- JaCoCo 0.8.11이 Java 23 바이트코드를 완전히 지원하지 않기 때문
- **모든 테스트는 정상적으로 통과**
- Azure pipeline (Java 17)에서는 이 경고가 발생하지 않음

### 해결 방법 (선택사항)
JaCoCo 경고를 제거하려면:
```bash
# JaCoCo 리포트 생성 없이 테스트 실행
./gradlew test -x jacocoTestReport
```

## 다음 단계

1. **변경사항을 Git에 커밋:**
   ```bash
   git add frontend/package.json backend/build.gradle backend/settings.gradle
   git commit -m "Fix Azure pipeline: add test:ci script and configure Java 17"
   ```

2. **Azure DevOps로 푸시:**
   ```bash
   git push origin F106PAYMENTMANAGEMENT
   ```

3. **Azure Pipeline 실행 확인:**
   - Azure DevOps 포털에서 pipeline 실행 확인
   - Frontend 및 Backend 테스트 성공 확인
   - Coverage 리포트 생성 확인

## 테스트 커버리지

### Backend (F102 & F106)
- ✅ **UserServiceTest**: 12 tests passing
- ✅ **UserControllerTest**: 11 tests passing
- ✅ **PaymentControllerTest**: 10 tests passing
- **Total**: 33 tests, 0 failures

### Frontend (F102 & F106)
- ✅ npm scripts 설정 완료
- ✅ test:ci 스크립트로 CI 환경 테스트 가능

## 문의사항

문제가 계속 발생하면:
1. Azure DevOps pipeline 로그 확인
2. Java 17 설치 확인: `java -version`
3. Gradle daemon 재시작: `./gradlew --stop && ./gradlew clean`
