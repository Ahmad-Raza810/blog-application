package com.projects.blog_application.util;

import com.projects.blog_application.exception.InvalidCursorException;

import java.nio.charset.StandardCharsets;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.Base64;

public class CursorDecoder {
    public static LocalDateTime cursorDecoder(String encodedCursor) {

        if (encodedCursor == null || encodedCursor.isBlank()) {
            throw new InvalidCursorException("Cursor is null or empty");
        }

        try {
            String decodedCursor = new String(
                    Base64.getDecoder().decode(encodedCursor),
                    StandardCharsets.UTF_8
            );

            return LocalDateTime.parse(decodedCursor);

        } catch (IllegalArgumentException e) {
            // Base64 decoding issue
            throw new InvalidCursorException("Invalid cursor encoding");

        } catch (DateTimeException e) {
            // LocalDateTime parsing issue
            throw new InvalidCursorException("Invalid cursor value");
        }
    }
}