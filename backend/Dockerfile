# Stage 1: Build the Spring Boot JAR
FROM gradle:8-jdk17-alpine AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
COPY src ./src
RUN chmod +x gradlew && ./gradlew bootJar -x test --no-daemon

# Stage 2: Minimal runtime image
FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
