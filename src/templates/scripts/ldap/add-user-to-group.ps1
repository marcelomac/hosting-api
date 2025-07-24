# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Solicita o nome do usuário e o nome do grupo
$user = "%employee_login%"
$group = "%department_ou%" # Ex: "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"

# Adiciona o usuário a um grupo específico
Add-ADGroupMember -Identity $group -Members $user

Write-Output "Usuário '$user' adicionado ao grupo."
