import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  issuedAt: number;
  expiresAt: number;
  refreshToken: string;
  refExpiry: number;
}

export interface RefreshTokenResponse {
  refreshToken: string;
  accessToken: string;
  refreshExpTime: string;
  accessExpTime: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  userRole?: 'USER' | 'ADMIN';
  // Add more fields as available from backend
}

export interface Category {
  id: string;
  name: string;
  postCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  postCount?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string;
  author?: {
    id: string;
    name: string;
  };
  category: Category;
  tags: Tag[];
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
  status?: PostStatus;
}

export interface Comment {
  commentId: string;
  content: string;
  createdAt?: string; // Optional as backend might not return it
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  postId: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  status: PostStatus;
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: string;
}


// Matches backend ApiErrorResponse structure
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>; // Map<String, String> from backend - field name to error message
}

// Type guard to check if error is an ApiError
export function isApiError(error: any): error is ApiError {
  return error && typeof error === 'object' && 'status' in error && 'message' in error;
}

// Utility function to extract error message from various error types
export function extractErrorMessage(error: any, fallbackMessage: string = 'An unexpected error occurred'): string {
  if (isApiError(error)) {
    return error.message || fallbackMessage;
  }
  if (error?.response?.data && isApiError(error.response.data)) {
    return error.response.data.message || fallbackMessage;
  }
  if (error?.message) {
    return error.message;
  }
  return fallbackMessage;
}

// Utility function to extract validation errors map
export function extractValidationErrors(error: any): Record<string, string> {
  if (isApiError(error)) {
    return error.errors || {};
  }
  if (error?.response?.data && isApiError(error.response.data)) {
    return error.response.data.errors || {};
  }
  return {};
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;
  private isRefreshing = false;
  private failedQueue: any[] = [];

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private constructor() {
    this.api = axios.create({
      baseURL: '/api/v1',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        console.log(`[Request] ${config.url} | Token exists: ${!!token}`);

        // valid token and NOT a refresh token request
        if (token && !config.url?.includes('/auth/refresh-token')) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log(`[Request] Attached Authorization header`);
        } else if (config.url?.includes('/auth/refresh-token')) {
          // Explicitly remove Authorizaton header for refresh requests
          if (typeof config.headers.delete === 'function') {
            config.headers.delete('Authorization');
          } else {
            delete config.headers['Authorization'];
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Prevent redirect loop if 401 happens during login or refresh
        const isLoginRequest = originalRequest.url?.includes('/auth/login');
        const isRefreshRequest = originalRequest.url?.includes('/auth/refresh-token');

        if (error.response?.status === 401) {
          console.log(`[Response] 401 Error for ${originalRequest.url} | Retry: ${originalRequest._retry} | IsRefreshing: ${this.isRefreshing}`);
        }

        if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRefreshRequest) {

          if (this.isRefreshing) {
            console.log('[Response] Queuing request...');
            return new Promise<AxiosResponse>((resolve, reject) => {
              this.failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers.Authorization = 'Bearer ' + token;
                  resolve(this.api(originalRequest));
                },
                reject: (err: any) => {
                  reject(err);
                }
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            try {
              console.log('[Response] Attempting refresh...');
              const { accessToken, refreshToken: newRefreshToken } = await this.refreshToken(refreshToken);
              console.log('[Response] Refresh success!');

              // Update tokens
              localStorage.setItem('token', accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);

              // Update authorization header for next requests
              this.api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

              // Process queue
              this.processQueue(null, accessToken);

              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            } catch (refreshError: any) {
              console.error('[Response] Refresh failed', refreshError);
              this.processQueue(refreshError, null);
              this.logout();
              window.location.href = '/login';
              return Promise.reject(refreshError);
            } finally {
              this.isRefreshing = false;
            }
          } else {
            console.log('[Response] No refresh token found');
            this.isRefreshing = false;
            this.logout();
            window.location.href = '/login';
          }
        }

        // Standard error handling
        if (error.response?.status === 401 && !originalRequest._retry) {
          // If we reach here, it means we didn't try to refresh
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response?.data && isApiError(error.response.data)) {
      return error.response.data;
    }
    // Fallback for network errors or unexpected response format
    const responseData = error.response?.data as any;
    return {
      status: error.response?.status || 500,
      message: responseData?.message || error.message || 'An unexpected error occurred'
    };
  }

  // Auth endpoints
  public setAuthToken(token: string | null) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  public async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response: AxiosResponse<RegisterResponse> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    // ✅ Immediately refresh UI
    // window.location.href = '/';  // REMOVED: Let the UI handle navigation


    return response.data;
  }

  public async refreshToken(token: string): Promise<RefreshTokenResponse> {
    const response: AxiosResponse<RefreshTokenResponse> = await this.api.post('/auth/refresh-token', { refreshToken: token });
    return response.data;
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  public async getPosts(params: {
    categoryId?: string;
    tagId?: string;
    authorId?: string;
    cursor?: string;
    pageSize?: number;
  }): Promise<{ posts: Post[]; cursor: string | null; hasMore: boolean }> {
    const response = await this.api.get('/posts', { params });
    // Assuming backend returns { data: { posts: [], cursor: "...", hasMore: true } }
    // Or if backend returns directly in data: { posts: [], cursor: "...", hasMore: true }
    // Based on "response:includes three fields private List<PostResponseDTO> posts; private String cursor; private boolean hasMore;"
    // Check if the response is wrapped in a generic ApiResponse or not.
    // Usually your backend wraps in { message, data, status, ... }

    // ADJUSTING to typical pattern seen in this file: response.data.data contains the payload
    const data = response.data.data;
    return {
      posts: data.posts,
      cursor: data.cursor,
      hasMore: data.hasMore
    };
  }

  public async getPost(id: string): Promise<Post> {
    const response = await this.api.get(`/posts/${id}`);
    return response.data.data; // ✅ inner data
  }

  public async createPost(post: CreatePostRequest, file?: File): Promise<Post> {
    const formData = new FormData();

    // Create a blob for the post data to satisfy @RequestPart
    const postBlob = new Blob([JSON.stringify(post)], { type: 'application/json' });
    formData.append('post', postBlob);

    if (file) {
      formData.append('file', file);
    }

    const response: AxiosResponse<{ message: string; data: Post; status: number; success: boolean; dateTime: string }> = await this.api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }

  public async updatePost(post: UpdatePostRequest, file?: File, removeCoverImage?: boolean): Promise<Post> {
    const formData = new FormData();

    // Create a blob for the post data to satisfy @RequestPart
    const postBlob = new Blob([JSON.stringify(post)], { type: 'application/json' });
    formData.append('post', postBlob);

    if (file) {
      formData.append('file', file);
    }

    if (removeCoverImage) {
      formData.append('removeCoverImage', String(removeCoverImage));
    }


    const response: AxiosResponse<{ message: string; data: Post; status: number; success: boolean; dateTime: string }> =
      await this.api.put('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    return response.data.data;
  }

  public async deletePost(id: string): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }

  public async getDrafts(params: { page?: number; size?: number; sort?: string; }): Promise<Post[]> {
    const response: AxiosResponse<{ message: string; data: Post[]; status: number; success: boolean; dateTime: string }> =
      await this.api.get('/posts/drafts', { params });
    return response.data.data; // <-- only the posts array
  }

  public async getFeaturedPosts(): Promise<Post[]> {
    const response: AxiosResponse<{ message: string; data: Post[]; status: number; success: boolean; dateTime: string }> =
      await this.api.get('/posts/featured');
    return response.data.data;
  }

  public async getTrendingPosts(): Promise<Post[]> {
    const response: AxiosResponse<{ message: string; data: Post[]; status: number; success: boolean; dateTime: string }> =
      await this.api.get('/posts/trending');
    return response.data.data;
  }


  //category
  public async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<{ data: Category[] }> = await this.api.get('/categories');
    return response.data.data; // extract the array from "data"
  }


  public async createCategory(name: string): Promise<Category> {
    const response: AxiosResponse<{ message: string; data: Category; status: number; success: boolean; dateTime: string }> = await this.api.post('/categories', { name });
    return response.data.data;
  }

  public async updateCategory(id: string, name: string): Promise<Category> {
    const response: AxiosResponse<Category> = await this.api.put(`/categories/${id}`, { id, name });
    return response.data;
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`/categories/${id}`);
  }

  // Tags endpoints
  public async getTags(): Promise<Tag[]> {
    const response: AxiosResponse<{ data: Tag[] }> = await this.api.get('/tags');
    return response.data.data; // extract the array from "data"
  }


  public async createTags(names: string[]): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await this.api.post('/tags', { names });
    return response.data;
  }

  public async deleteTag(id: string): Promise<void> {
    await this.api.delete(`/tags/${id}`);
  }

  // User endpoints
  /**
   * Get current user profile
   * Endpoint: GET /user
   * Returns: { id, name, email, createdAt, ... }
   */
  public async getUserProfile(): Promise<UserProfile> {
    const response: AxiosResponse<{ data: UserProfile }> = await this.api.get('/user');
    return response.data.data;
  }

  /**
   * Get all posts (draft + published) by the authenticated user
   * Endpoint: GET /posts/user
   */
  public async getUserPosts(): Promise<Post[]> {
    const response: AxiosResponse<{ data: any[] }> = await this.api.get('/posts/user');
    const posts = response.data.data || [];
    // Normalize postStatus to status to match our interface
    return posts.map((post: any) => ({
      ...post,
      status: post.postStatus || post.status, // Map postStatus to status
    }));
  }

  // Comment Endpoints

  public async getPostComments(postId: string): Promise<Comment[]> {
    const response: AxiosResponse<{ data: Comment[] }> = await this.api.get(`/posts/${postId}/comments`);
    // Handle potential wrapper differences, assuming strictly standard response for now or extracting data
    return response.data.data;
  }

  public async createComment(postId: string, content: string): Promise<Comment> {
    const response: AxiosResponse<{ data: Comment }> = await this.api.post(`/posts/${postId}/comments`, { content });
    return response.data.data;
  }

  public async deleteComment(commentId: string): Promise<void> {
    await this.api.delete(`/comments/${commentId}`);
  }
}

// Export a singleton instance
export const apiService = ApiService.getInstance();