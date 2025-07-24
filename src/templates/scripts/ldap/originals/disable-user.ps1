# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Define o nome de usuário ou SamAccountName do usuário a ser desabilitado
$usuario = "aaaTeste"

# Desabilita a conta de usuário
try {
    # Busca o usuário pelo SamAccountName e desabilita a conta
    $user = Get-ADUser -Identity $usuario
    Disable-ADAccount -Identity $user

    Write-Output "Conta de usuário '$usuario' foi desabilitada com sucesso."
} catch {
    Write-Error "Erro ao desabilitar a conta de usuário: $_"
}
