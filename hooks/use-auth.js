import axiosInteraction, { fetchInteract } from '@/api/base/axios-interaction';
import { updateDataEventLog } from '@/libs/tracking';
import useSWR from 'swr';

let initTracking = false;
export function useAuth(options) {
  const {
    data: profile,
    error,
    mutate
  } = useSWR('/user/profile', fetchInteract, {
    revalidateOnFocus: false,
    ...options
  });
  // const { data: roles, error: error_role } = useSWR('/content-scopes');

  async function login() {
    await mutate();
  }
  async function logout() {
    localStorage.removeItem('access_token');
    mutate(null, false);
  }

  async function updateProfile(params) {
    try {
      const result = await axiosInteraction.post('/user/profile', { ...profile, ...params });
      await mutate(result, false);
      return result;
    } catch (error) {
      return false;
    }
  }
  const getProfile = () => {};
  const firstLoading = profile === undefined && error === undefined;
  if (!firstLoading && profile && !initTracking) {
    initTracking = true;
    updateDataEventLog({userID: profile.user_uuid});
  }
  return {
    profile,
    error,
    login,
    logout,
    getProfile: mutate,
    firstLoading,
    updateProfile
  };
}
