export type FormState =
{
  username?: string[];
  password?: string[];
  message?: string;
}
| undefined;

export type AuthResponse = {
  authorization: string,
  exp: number,
  caducidadPassword: string,
  fechaUltimoPassword: string,
  idPerfil: string,
  nombre: string,
  nombrePerfil: string,
  nomina: number,
  numeroTrabajo: string,
  usuario: string
}

export type Permission = {
  id: string,
  usuario: string,
  grupo: string,
  permiso: string,
  idPermiso: string,
  status: string,
  usuarioRegistra: number,
  fechaRegistro: string
}

export type Access = {
  idPerfil: string,
  idOperacion: string,
  idTransaccion: string,
  status: string,
  sistema: string
}