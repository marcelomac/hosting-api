# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Define o nome de usuário ou SamAccountName do usuário a ser desabilitado
$usuario = "aaaTeste"

# Habilita a conta de usuário
try {
    # Busca o usuário pelo SamAccountName e desabilita a conta
    $user = Get-ADUser -Identity $usuario
    Enable-ADAccount -Identity $user

    Write-Output "Conta de usuário '$usuario' foi habilitada com sucesso."
} catch {
    Write-Error "Erro ao habilitar a conta de usuário: $_"
}
