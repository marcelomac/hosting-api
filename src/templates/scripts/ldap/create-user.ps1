# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Define as informações do novo usuário
$domain = "%ldap_domain%"      # Ex:"ad.cmsj.sc.gov.br"
$user = "%employee_login%"       # Ex:"jonhSD"
$userLogin = "$user@$domain"      # Ex:"jonhD@ad.cmsj.sc.gov.br"
$password = ConvertTo-SecureString "%password%"  # Ex: "SenhaSegura123!" -AsPlainText -Force
$firstName = "%employee_firstname%"     # Ex: "John"
$initials = "%employee_initials%"  # Ex: "S"
$surname = "%employee_surname%" # Ex: "Doe"
$fullName = "$firstName $surname"
$exhibitionName = "$fullName"
$description = "%relationship_name%"   # Ex: "Descrição do usuário"
$departmentName = "%department_name%"    # Ex: "Tipo de movimento de TI"
$departmentOU = "%department_ou%"    # Ex: "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"
$email = "%employee_email%" # Ex: "johndoe@mail.com"
$telephone = "%department_phone%"     # ramal do tipo de movimento Ex: "1234 / 5678"
$company = "%company_name%"    # Ex: "Câmara Municipal de São José"


$ou = "%ldap_users_ou%"  # Ajuste conforme a sua estrutura de OU no AD
#$grupo = "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"

# Cria o novo usuário no Active Directory
New-ADUser -SamAccountName $user -UserPrincipalName $userLogin -Name $fullName -AccountPassword $password -Path $ou -Enabled $true -PasswordNeverExpires $false -ChangePasswordAtLogon $true -GivenName $firstName -Surname $surname -Initials $initials -DisplayName $exhibitionName -Description $description -Department $movimenttypeName -EmailAddress $email -OfficePhone $telephone -Company $company

Write-Output "Usuário '$user' criado com sucesso."