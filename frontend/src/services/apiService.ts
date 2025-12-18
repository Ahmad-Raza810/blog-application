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
  expiresIn: number;
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
  publishedPostCount?: number;
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
  coverImage?: string;
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
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
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
  public async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response: AxiosResponse<RegisterResponse> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);

    // ✅ Immediately refresh UI
    window.location.href = '/';  // redirect to homepage

    return response.data;
  }

  public logout(): void {
    localStorage.removeItem('token');
  }

  public async getPosts(params: {
    categoryId?: string;
    tagId?: string;
    authorId?: string; // Add authorId to filter posts by user
  }): Promise<Post[]> {
    const response = await this.api.get('/posts', { params });
    return response.data.data; // ✅ inner data
  }

  public async getPost(id: string): Promise<Post> {
    const response = await this.api.get(`/posts/${id}`);
    return response.data.data; // ✅ inner data
  }

  public async createPost(post: CreatePostRequest): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post('/posts', post);
    return response.data;
  }

  public async updatePost(post: UpdatePostRequest): Promise<Post> {
    const response: AxiosResponse<{ message: string; data: Post; status: number; success: boolean; dateTime: string }> = await this.api.put('/posts', post);
    return response.data.data; // Extract post from ApiResponse wrapper
  }

  public async deletePost(id: string): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }

  public async getDrafts(params: { page?: number; size?: number; sort?: string; }): Promise<Post[]> {
    const response: AxiosResponse<{ message: string; data: Post[]; status: number; success: boolean; dateTime: string }> =
      await this.api.get('/posts/drafts', { params });
    return response.data.data; // <-- only the posts array
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
}

// Export a singleton instance
export const apiService = ApiService.getInstance();