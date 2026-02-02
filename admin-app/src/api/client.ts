import axios from 'axios';
import { SERVICE_URLS, GET_USER_BY_ID_QUERY, getAccessToken } from '@3asoftwares/utils/client';

const GRAPHQL_URL = process.env.VITE_GRAPHQL_URL || SERVICE_URLS.GRAPHQL_GATEWAY;

export const graphqlClient = axios.create({
  baseURL: GRAPHQL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

graphqlClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const graphqlRequest = async (query: string, variables?: any) => {
  const response = await graphqlClient.post('', {
    query,
    variables,
  });
  return response.data.data;
};

export const getUserById = async (userId: string) => {
  const response = await graphqlClient.post('', {
    query: GET_USER_BY_ID_QUERY,
    variables: { id: userId },
  });
  return response.data.data?.getUserById;
};
