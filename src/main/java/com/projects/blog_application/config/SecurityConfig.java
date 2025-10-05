package com.projects.blog_application.config;


import com.projects.blog_application.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain  securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(auth->auth
                        .requestMatchers(HttpMethod.GET,"/api/v1/categories").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/categories").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/v1/posts").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/posts").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/tags").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/v1/tags").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/auth/**").permitAll()

                .anyRequest().authenticated()
        );

        //session stop
        http.sessionManagement(session->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // Apply JWT filter before UsernamePasswordAuthenticationFilter
        .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }


    @Bean
    public PasswordEncoder passwordEncoder(){
        return  new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }


//    @Bean
//    public CorsFilter  corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.addAllowedOrigin("http://localhost:5173");
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*"); // GET, POST, PUT, DELETE, OPTIONS
//        source.registerCorsConfiguration("/**", config);
//        return new CorsFilter(source);
//    }

}