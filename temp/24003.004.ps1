# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Solicita o nome do usuário e o nome do grupo
$user = "marceloam"
$group = "undefined" # Ex: "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"

# Verifica se o usuário existe no grupo
if (Get-ADGroupMember -Identity $group | Where-Object { $_.SamAccountName -eq $user }) {
    # Remove o usuário do grupo
    Remove-ADGroupMember -Identity $group -Members $user -Confirm:$false
    Write-Output "Usuário '$user' removido do grupo '$group' com sucesso."
} else {
    Write-Output "Usuário '$user' não encontrado no grupo '$group'."
}