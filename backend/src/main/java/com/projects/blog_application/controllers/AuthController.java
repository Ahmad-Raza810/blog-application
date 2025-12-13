package com.projects.blog_application.controllers;


import com.projects.blog_application.domain.dtos.*;
import com.projects.blog_application.domain.entities.RefreshToken;
import com.projects.blog_application.security.JwtUtil;
import com.projects.blog_application.service.AuthService;
import com.projects.blog_application.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    //api endpoint for login user
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO requestDTO) {
        LoginResponseDTO responseDTO = authService.login(requestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);


    }

    //api endpoint for register a new user
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody @Valid RegisterRequestDTO requestDTO) {
        RegisterResponseDTO responseDTO = authService.register(requestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    //api endpoint for getting new Access token via refresh token
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> getAccessToken(@RequestBody @Valid RefreshTokenRequest request) {

        // 1. Validate refresh token
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());

        // 2. Delete old token (rotation step)
        refreshTokenService.deleteRefreshToken(refreshToken);

        // 3. Generate new access token
        String newAccessToken = jwtUtil.generateToken(refreshToken.getUser().getEmail());

        // 4. Generate new refresh token
        RefreshToken newRefreshToken = refreshTokenService.generateRefreshToken(refreshToken.getUser());


        // 5. Prepare response
        RefreshTokenResponse response = new RefreshTokenResponse(
                newRefreshToken.getToken(),
                newAccessToken,
                newRefreshToken.getExpDate(),
                jwtUtil.extractAllClaims(newAccessToken).getExpiration().toInstant()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponseDTO> logout(Authentication authentication){
        String response=authService.logout(authentication);

        if(!response.equals("refresh token deleted,successfully log out."))
            return  new ResponseEntity<>(new LogoutResponseDTO(response),HttpStatus.BAD_REQUEST);
        else
            return  new ResponseEntity<>(new LogoutResponseDTO(response),HttpStatus.OK);

    }



}
