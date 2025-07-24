# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Define o nome de usuário ou SamAccountName do usuário a ser desabilitado
$user = "marceloam"

# Desabilita a conta de usuário
try {
    # Busca o usuário pelo SamAccountName e desabilita a conta
    $adUser = Get-ADUser -Identity $user
    Disable-ADAccount -Identity $adUser

    Write-Output "Conta de usuário '$user' foi desabilitada com sucesso."
} catch {
    Write-Error "Erro ao desabilitar a conta de usuário: $_"
}
