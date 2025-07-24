$scriptFolder = "F:\users-scripts"
#$scriptFolder = "F:\users-scripts"
#$scriptFolder = "C:\Users\marcelo\Documents\scripts-users"

# Define o caminho da subpasta onde os scripts executados com SUCESSO serao armazenados:
$executedFolder = Join-Path -Path $scriptFolder -ChildPath "executed"

# $successExecutedFolder = Join-Path -Path $scriptFolder -ChildPath "executed"
# # Define o caminho da subpasta onde os scripts executados com ERRO serao armazenados:
# $errorExecutedFolder = Join-Path -Path $scriptFolder -ChildPath "executed\error"
$fileExtension = ".ps1"
$prefixErrorMessage = "-ERROR="

# Cria a subpasta se ela nao existir
if (-not (Test-Path -Path $executedFolder)) {
    New-Item -ItemType Directory -Path $executedFolder
}

# Obtem a lista de scripts .ps1 na pasta
$scriptsFiles = Get-ChildItem -Path $scriptFolder -Filter *.ps1

foreach ($script in $scriptsFiles) {
    # Constroi o caminho completo do script
    $scriptPath = Join-Path -Path $scriptFolder -ChildPath $script.Name

    # Gera uma string com a data e hora atual para renomear o script
    $dateTime = Get-Date -Format "yyMMddHHmmss"

    # Get the filename without extension
    $fileNameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($script.FullName)
    $newFileName = "$fileNameWithoutExtension"+"-"+"$dateTime"

    # Inicializa uma variável para capturar erros
    $errorMessage = $null

    # Executa o script
    & $scriptPath 2>&1 | ForEach-Object {
        if ($_ -is [System.Management.Automation.ErrorRecord]) {
            $errorMessage = $_.ToString()
            $newFileName =  "$newFileName"+"$prefixErrorMessage"+"$errorMessage"+"$fileExtension"
            $executedPath = Join-Path -Path $executedFolder -ChildPath $newFileName

            # Move e renomeia o script para a subpasta 'executed' apos a execucao
            Move-Item -Path $scriptPath -Destination $executedPath

            Write-Output $errorMessage
        } else {
            Write-Output $_
            $newFileName =  "$newFileName"+"$fileExtension"
            $executedPath = Join-Path -Path $executedFolder -ChildPath $newFileName

            # Move e renomeia o script para a subpasta 'executed' apos a execucao
            Move-Item -Path $scriptPath -Destination $executedPath
            Write-Output "Script movido e renomeado para: $executedPath"
        }
    }
}
