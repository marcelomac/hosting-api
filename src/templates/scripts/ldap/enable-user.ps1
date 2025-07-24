# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Define o nome de usuário ou SamAccountName do usuário a ser desabilitado
$user = "%employee_login%"

# Habilita a conta de usuário
try {
    # Busca o usuário pelo SamAccountName e desabilita a conta
    $adUser = Get-ADUser -Identity $user
    Enable-ADAccount -Identity $adUser

    Write-Output "Conta de usuário '$user' foi habilitada com sucesso."
} catch {
    Write-Error "Erro ao habilitar a conta de usuário: $_"
}
