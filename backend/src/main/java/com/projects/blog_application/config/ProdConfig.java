package com.projects.blog_application.config;

import com.projects.blog_application.security.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@Profile("prod")
public class ProdConfig {
    private final JwtFilter jwtFilter;

    public ProdConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/api/v1/categories").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/categories/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/categories/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/categories/**").hasAuthority("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/v1/posts/drafts").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/v1/posts/user").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/v1/posts", "/api/v1/posts/*").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/v1/posts").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/v1/posts/*").authenticated()


                .requestMatchers(HttpMethod.GET, "/api/v1/posts/user").authenticated()

                .requestMatchers(HttpMethod.POST, "/api/v1/tags/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/tags/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/tags/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/v1/tags").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/v1/auth/logout").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login","/api/v1/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST,"/api/v1/auth/refresh-token").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/user").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/v1/posts/*/comments").permitAll()

                .anyRequest().authenticated()
        );

        http.exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                })
        );


        //session stop
        http.sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Apply JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
