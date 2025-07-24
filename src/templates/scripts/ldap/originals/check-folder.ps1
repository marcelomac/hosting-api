$scriptFolder = "F:\users-scripts"

# Define o caminho da subpasta onde os scripts executados ser�o armazenados
$executedFolder = Join-Path -Path $scriptFolder -ChildPath "executed"

# Cria a subpasta se ela n�o existir
if (-not (Test-Path -Path $executedFolder)) {
    New-Item -ItemType Directory -Path $executedFolder
}

# Obt�m a lista de scripts .ps1 na pasta
$scripts = Get-ChildItem -Path $scriptFolder -Filter *.ps1

foreach ($script in $scripts) {
    # Constr�i o caminho completo do script
    $scriptPath = Join-Path -Path $scriptFolder -ChildPath $script.Name

    # Executa o script
    try {
        Write-Output "Executando script: $scriptPath"
        & $scriptPath

        # Gera uma string com a data e hora atual para renomear o script
        $dateTime = Get-Date -Format "yyyyMMdd-HHmmss"
        $newFileName = "$dateTime-$($script.Name)"
        $executedPath = Join-Path -Path $executedFolder -ChildPath $newFileName

        # Move e renomeia o script para a subpasta 'executed' ap�s a execu��o
        Move-Item -Path $scriptPath -Destination $executedPath
        Write-Output "Script movido e renomeado para: $executedPath"
    } catch {
        Write-Error "Erro ao executar ou mover script: $_"
    }
}
