# Azure Pipeline Configuration Changes

## Overview
Updated `azure-pipelines.yml` to enable test execution on the **juna branch** and other feature branches when test-related changes are committed.

---

## Key Changes Made

### 1. **Branch Triggers** ✅
```yaml
trigger:
  branches:
    include:
      - main
      - juna          # ← YOUR CURRENT BRANCH
      - F102*         # Feature branches pattern
      - F106*
      - F109*
```

**What this does:**
- Pipeline now triggers on commits to `juna` branch
- Also triggers on feature branches matching patterns (F102*, F106*, F109*)
- Previously only triggered on `main` branch

---

### 2. **Path-Based Triggers** ✅
```yaml
trigger:
  paths:
    include:
      - backend/**              # Any backend changes
      - azure-pipelines.yml     # Pipeline config changes
```

**What this does:**
- Pipeline triggers when files in `backend/` directory change
- Includes test file changes: `backend/src/test/**/*.java`
- Pipeline only runs when relevant files change (saves resources)

---

### 3. **Pull Request Triggers** ✅
```yaml
pr:
  branches:
    include:
      - main
  paths:
    include:
      - backend/**
```

**What this does:**
- Automatically runs tests when PR is created to merge into main
- Validates code before merging

---

### 4. **Test Execution Stage** ✅
```yaml
stages:
  - stage: BackendTests
    displayName: 'Backend Unit Tests'
    jobs:
      - job: RunBackendTests
        steps:
          - Java 17 installation
          - Make gradlew executable
          - Run: ./gradlew clean test jacocoTestReport
          - Publish JUnit test results
          - Publish JaCoCo code coverage
```

**What this does:**
- **Stage 1**: Runs on ALL branches (including juna)
- Executes all 63 unit tests
- Publishes test results to Azure DevOps
- Generates code coverage report (JaCoCo)
- Shows test summary in pipeline logs

---

### 5. **Build Stage** ✅
```yaml
  - stage: Build
    displayName: 'Build Application'
    dependsOn: BackendTests
    condition: eq(variables['Build.SourceBranch'], 'refs/heads/main')
```

**What this does:**
- **Stage 2**: Only runs on `main` branch
- Runs AFTER tests pass
- Creates deployable JAR artifact
- Feature branches (like juna) only run tests, not full build

---

## How to Test the Pipeline

### Step 1: Commit Pipeline Changes
```powershell
git add azure-pipelines.yml PIPELINE_CONFIGURATION.md
git commit -m "ci: Enable pipeline tests for juna branch and feature branches"
git push origin juna
```

### Step 2: Check Azure DevOps
1. Go to Azure DevOps project
2. Navigate to **Pipelines** → **Pipelines**
3. Look for new pipeline run triggered by your commit
4. Should see **"Backend Unit Tests"** stage running

### Step 3: Verify Test Execution
You should see:
- ✅ Java 17 installation
- ✅ Gradle wrapper execution
- ✅ **63 tests** executed
- ✅ JUnit test results published
- ✅ Code coverage report generated
- ✅ Test summary displayed

---

## Expected Pipeline Behavior

### On `juna` Branch (Your Current Branch)
| Action | Pipeline Behavior |
|--------|-------------------|
| Commit test changes | ✅ Triggers pipeline |
| Run tests | ✅ Executes all 63 tests |
| Publish results | ✅ Shows in Azure DevOps |
| Build JAR | ❌ Skipped (only on main) |

### On `main` Branch
| Action | Pipeline Behavior |
|--------|-------------------|
| Merge PR | ✅ Triggers pipeline |
| Run tests | ✅ Executes all 63 tests |
| Publish results | ✅ Shows in Azure DevOps |
| Build JAR | ✅ Creates artifact |

---

## Test Execution Details

### Tests Included
- **PaymentControllerTest**: 19 tests
- **UserControllerTest**: 18 tests  
- **Service Layer Tests**: 26 tests
- **Total**: 63 tests

### Coverage Requirements
- **Minimum**: 80% code coverage (JaCoCo)
- **Report Location**: `backend/build/reports/jacoco/test/html/index.html`

---

## Troubleshooting

### Pipeline Doesn't Trigger
**Check:**
1. Pipeline is enabled in Azure DevOps
2. Branch name is exactly `juna` (case-sensitive)
3. Changes are in `backend/` directory

**Solution:**
```powershell
# Verify branch name
git branch --show-current

# Force trigger by changing backend file
echo "// trigger pipeline" >> backend/src/test/java/README.md
git add .
git commit -m "test: Trigger pipeline"
git push origin juna
```

### Tests Don't Run
**Check:**
1. Java 17 installation step succeeded
2. Gradle wrapper has execute permissions
3. Test files exist in `backend/src/test/`

**Solution:**
```powershell
# Test locally first
cd backend
./gradlew clean test --info
```

### Tests Fail in Pipeline
**Check:**
1. All dependencies resolved
2. No environment-specific issues
3. Test database configuration

**Solution:**
Review test logs in Azure DevOps:
- Click on failed test stage
- Expand "Run Gradle Tests" step
- Check error messages

---

## Next Steps

1. **Commit and push** the pipeline changes
2. **Monitor** Azure DevOps for pipeline execution
3. **Verify** all 63 tests pass in pipeline
4. **Check** code coverage report (should be >80%)
5. **Review** test results in Azure DevOps "Tests" tab

---

## Additional Configuration Options

### Add More Feature Branches
```yaml
trigger:
  branches:
    include:
      - juna
      - your-branch-name  # Add here
```

### Trigger on Specific Test Files Only
```yaml
trigger:
  paths:
    include:
      - backend/src/test/**/*.java  # Only test files
```

### Disable PR Triggers
```yaml
pr: none  # No automatic PR validation
```

---

## Summary

✅ **Pipeline now triggers on `juna` branch**  
✅ **Tests execute automatically on commit**  
✅ **Test results published to Azure DevOps**  
✅ **Code coverage reports generated**  
✅ **Build stage only runs on main (as intended)**

The pipeline is now configured to support your testing workflow on feature branches while maintaining production builds on main.
