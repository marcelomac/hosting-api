# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

$username = "jiliardir"
$departmentOU = "CN=Comissões,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"    # Ex: "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"

# Verifica se o usuário já existe
$user = Get-ADUser -Filter {SamAccountName -eq $username}

if ($user) {
    # Usuário existe, habilita o usuário
    Enable-ADAccount -Identity $user

    Write-Host "Usuário $username já existe e foi habilitado."
} else {
    # Usuário não existe, cria o usuário
    $domain = "ad.cmsj.sc.gov.br"
    $userLogin = "$username@$domain"
    $password = ConvertTo-SecureString -String "K07.cmsj" -AsPlainText -Force
    $firstName = "Jiliardi"
    $initials = ""
    $surname = "Rosa"
    $fullName = "Jiliardi da Rosa"
    $exhibitionName = "$fullName"
    $description = "Comissionado Gabinete"
    $departmentName = "Comissões"
    $email = "jiliardidarosa98@gmail.com"
    $telephone = "1303 "
    $company = "Câmara Municipal de São José"

    $ou = "OU=Users,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"  # Ajuste conforme a sua estrutura de OU no AD
   
    # Cria o novo usuário no Active Directory
    New-ADUser -SamAccountName $username -UserPrincipalName $userLogin -Name $fullName -AccountPassword $password -Path $ou -Enabled $true -PasswordNeverExpires $false -ChangePasswordAtLogon $true -GivenName $firstName -Surname $surname -Initials $initials -DisplayName $exhibitionName -Description $description -Department $departmentName -EmailAddress $email -OfficePhone $telephone -Company $company

    Write-Output "Usuário '$username' criado com sucesso."
}

# Verifica se o usuário existe no grupo
if (Get-ADGroupMember -Identity $departmentOU | Where-Object { $_.SamAccountName -eq $username }) {
    Write-Output "Usuário '$username' não encontrado no grupo '$departmentOU'."
} else {
    # Adiciona o usuário a um grupo específico
    Add-ADGroupMember -Identity $departmentOU -Members $username
}
