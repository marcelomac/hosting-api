# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Solicita o nome do usuário e o nome do grupo
$nomeUsuario = "aaaTeste"
$nomeGrupo = "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"

# Verifica se o usuário existe no grupo
if (Get-ADGroupMember -Identity $nomeGrupo | Where-Object { $_.SamAccountName -eq $nomeUsuario }) {
    # Remove o usuário do grupo
    Remove-ADGroupMember -Identity $nomeGrupo -Members $nomeUsuario -Confirm:$false
    Write-Output "Usuário $nomeUsuario removido do grupo $nomeGrupo com sucesso."
} else {
    Write-Output "Usuário $nomeUsuario não encontrado no grupo $nomeGrupo."
}
