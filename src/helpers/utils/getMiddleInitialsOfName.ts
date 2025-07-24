export function getMiddleInitialsOfName(name: string): string {
  const nameParts = name.trim().split(' ');

  // Remove o primeiro e o último nome
  const middleNames = nameParts.slice(1, -1);

  // Filtra e transforma os nomes do meio para obter as iniciais
  const initials = middleNames
    .filter((part) => part[0] === part[0].toUpperCase()) // Filtra para incluir apenas as maiúsculas
    .map((part) => part[0] + '.') // Adiciona '.' após a inicial
    .join('');

  return initials;
}
