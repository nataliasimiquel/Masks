
export const celularMask = (value: string) => {
  return value
  .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
  .replace(/^(\d{2})(\d)/g,"($1) $2")
  .replace(/(\d{3})(\d)/, '$1-$2')
  .replace(/(\d)(\d{4})$/,"$1-$2")// captura os dois últimos 2 números, com um - antes dos dois números
}



