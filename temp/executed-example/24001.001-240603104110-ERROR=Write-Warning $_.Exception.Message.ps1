# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Define as informações do novo usuário
$domain = "ad.cmsj.sc.gov.br"      # Ex:"ad.cmsj.sc.gov.br"
$user = "Vicente"       # Ex:"jonhSD"
$userLogin = "Vicente@ad.cmsj.sc.gov.br"      # Ex:"jonhD@ad.cmsj.sc.gov.br"
$password = ConvertTo-SecureString "?Z6p8?Zk"  # Ex: "SenhaSegura123!" -AsPlainText -Force
$firstName = "Fabrício"     # Ex: "John"
$initials = "S."  # Ex: "S"
$surname = "Vieira" # Ex: "Doe"
$fullName = "$firstName $surname"
$exhibitionName = "$fullName"
$description = "description of employee"   # Ex: "Descrição do usuário"
$departmentName = "null"    # Ex: "Tipo de movimento de TI"
$departmentOU = "null"    # Ex: "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"
$email = "Washington.Santos53@yahoo.com" # Ex: "johndoe@mail.com"
$telephone = "null"     # ramal do tipo de movimento Ex: "1234 / 5678"
$company = "Câmara Municipal de São José"    # Ex: "Câmara Municipal de São José"


$ou = "OU=Users,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"  # Ajuste conforme a sua estrutura de OU no AD
#$grupo = "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"

# Cria o novo usuário no Active Directory
New-ADUser -SamAccountName $user -UserPrincipalName $userLogin -Name $fullName -AccountPassword $password -Path $ou -Enabled $true -PasswordNeverExpires $false -ChangePasswordAtLogon $true -GivenName $firstName -Surname $surname -Initials $initials -DisplayName $exhibitionName -Description $description -Department $movimenttypeName -EmailAddress $email -OfficePhone $telephone -Company $company

Write-Output "Usuário '$user' criado com sucesso."