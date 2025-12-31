FROM eclipse-temurin:21

WORKDIR /app

COPY target/blog-application-0.0.1-SNAPSHOT.jar blog-app.jar

ENTRYPOINT ["java","-jar","blog-app.jar"]

EXPOSE 8080
