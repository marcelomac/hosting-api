# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

$username = "marcelodm"

# Verifica se o usuário já existe
$user = Get-ADUser -Filter {SamAccountName -eq $username}

if ($user) {
    # Usuário existe, habilita o usuário
    Enable-ADAccount -Identity $user

    Write-Host "Usuário $username já existe e foi habilitado."
} else {
    # Usuário não existe, cria o usuário
    $domain = "ad.cmsj.sc.gov.br"
    $userLogin = "$user@$domain"
    $password = ConvertTo-SecureString "N28.cmsj"
    $firstName = "Marcelo"
    $initials = "D."
    $surname = "Melo"
    $fullName = "$firstName $surname"
    $exhibitionName = "$fullName"
    $description = "Comissionado Gabinete"
    $departmentName = "Ver. Jandir da Rosa"
    $departmentOU = "undefined"    # Ex: "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"
    $email = "melo03marcelo@gmail.com"
    $telephone = "1328 / 1334"
    $company = "Câmara Municipal de São José"

    $ou = "OU=Users,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"  # Ajuste conforme a sua estrutura de OU no AD
   
    # Cria o novo usuário no Active Directory
    New-ADUser -SamAccountName $username -UserPrincipalName $userLogin -Name $fullName -AccountPassword $password -Path $ou -Enabled $true -PasswordNeverExpires $false -ChangePasswordAtLogon $true -GivenName $firstName -Surname $surname -Initials $initials -DisplayName $exhibitionName -Description $description -Department $movimenttypeName -EmailAddress $email -OfficePhone $telephone -Company $company

    # Adiciona o usuário a um grupo específico
    Add-ADGroupMember -Identity $departmentOU -Members $user

    Write-Output "Usuário '$user' criado com sucesso."
}