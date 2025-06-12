import { AuthResponse, FormState } from '@/app/lib/definitions';
import api from '@/app/lib/api';
import { setSession, deleteAll } from '@/app/lib/session'
import { useRouter } from 'next/navigation';

export async function login(state: FormState, formData: FormData) {
  const username = formData.get('username') ?? null;
  const password = formData.get('password') ?? null;

  const res = await api.post<AuthResponse>('/seguridad/auth', {
    username,
    password
  });
  if (!res.status) {
    return { message : "Credenciales inválidas"};
  }
  
  await setSession("session", res.data)
  console.log("1");
  const acc = await api.get(`accesos/perfil/permisos/id=${res.data.idPerfil}`);
  if (!acc.status) {
    await deleteAll()
    return { message : "Error al obtener accesos"};
  }
  console.log("2");

  const perm = await api.post(`permisos-usuario/search`, {
    usuario:res.data.usuario
  });
  if (!perm.status) {
    await deleteAll()
    return { message : "Error al obtener permisos"};
  }
  console.log("3");

  await setSession("accesses", acc.data)
  await setSession("permissions", perm.data)

  return { message : ""};
}

export async function logout() {
  const router = useRouter();
  await deleteAll();
  router.push("/login");
}
