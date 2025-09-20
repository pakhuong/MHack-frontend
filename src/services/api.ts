import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com',
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
    }),
    getPost: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
    getUser: builder.query<User, number>({
      query: (id) => `/users/${id}`,
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetUsersQuery,
  useGetUserQuery,
} = api;
