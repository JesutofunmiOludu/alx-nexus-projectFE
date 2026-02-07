// Custom Hook for Authentication 

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCredentials, setUser, setLoading, setError, logout as logoutAction } from '@/store/slices/auth-slice';
import { authService } from '@/api/api-services';
import type { LoginCredentials, RegisterData } from '@/types';
import toast from 'react-hot-toast';

export function useAuth() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      dispatch(setLoading(true));
      const tokens = await authService.login(credentials);
      const user = await authService.getCurrentUser();
      return { tokens, user };
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('Login successful!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Login failed';
      dispatch(setError(message));
      toast.error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      dispatch(setLoading(true));
      return authService.register(data);
    },
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      dispatch(setLoading(false));
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Registration failed';
      dispatch(setError(message));
      toast.error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if API call fails, clear local state
      dispatch(logoutAction());
      queryClient.clear();
    },
  });

  // Get current user query
  const { data: currentUser, refetch: refetchUser, isError: isUserError } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated && !user,
    retry: false,
  });

  // Sync current user to Redux
  useEffect(() => {
    if (currentUser) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, dispatch]);

  // Handle user fetch error
  useEffect(() => {
    if (isUserError && isAuthenticated) {
      dispatch(logoutAction());
    }
  }, [isUserError, isAuthenticated, dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    error,
    login: (credentials: LoginCredentials, options?: any) => loginMutation.mutate(credentials, options),
    register: (data: RegisterData, options?: any) => registerMutation.mutate(data, options),
    logout: logoutMutation.mutate,
    refetchUser,
  };
}
