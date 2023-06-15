// Quản lí các thông tin trong quá trình vận hành, giống như local Storage
// Nhưng được lưu ở database - interaction

import useSWR from 'swr';
import axiosInteraction, { fetchInteract } from '@/api/base/axios-interaction';
import { useAuth } from './use-auth';

let local = {};
let firstload = false;
export function useLocalStorage(id) {
  const { profile } = useAuth();

  const { data, error, mutate } = useSWR(
    profile.user_uuid ? '/user_storage/' + profile.user_uuid : null,
    fetchInteract
  );
  if (data?.value && firstload === false) {
    firstload = true;
    local = data?.value || {};
  }

  const setLocal = async (name, item) => {
    try {
      local[name] = item;
      await axiosInteraction.post('/user_storage/' + profile.user_uuid, { value: local });
    } catch (error) {
      console.log(error);
    }
  };
  const fisrtLoadStorage = data === undefined && error === undefined;
  return { local, setLocal, fisrtLoadStorage };
}
