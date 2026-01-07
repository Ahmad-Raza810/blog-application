package com.projects.blog_application.util;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;

public class CursorEncoder {

    public static String encodeCursor(LocalDateTime cursor) {
        return Base64.getUrlEncoder()
                .encodeToString(
                        cursor.toString()
                                .getBytes(StandardCharsets.UTF_8)
                );
    }
}
