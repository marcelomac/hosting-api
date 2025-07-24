# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Solicita o nome do usuário e o nome do grupo
$suario = "aaaTeste"
$grupo = "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"

# Adiciona o usuário a um grupo específico
Add-ADGroupMember -Identity $grupo -Members $usuario

Write-Output "Usuário $usuario adicionado ao grupo."
