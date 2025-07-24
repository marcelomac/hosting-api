# Importa o módulo ActiveDirectory
Import-Module ActiveDirectory

# Define as informações do novo usuário
$domain = "@ad.cmsj.sc.gov.br"
$usuario = "aaaTeste2"
$usuarioLogon = "testeps2$domain"
$senha = ConvertTo-SecureString "SenhaSegura123!" -AsPlainText -Force
$nomeCompleto = "Nome Completo do Usuário"
$primeiroNome = "aaaPrimeiro2"
$iniciais = "M"
$sobrenome = "Nome"
$nomeCompleto = "$primeiroNome $sobrenome"
$nomeExibicao = "$nomecompleto"
$descricao = "Descrição do usuário"
$tipo de movimento = "Tipo de movimento de TI"
$email = "novoUsuario@dominio.com"
$telefone = "1234 / 5678"
$empresa = "Nome da Empresa"


$ou = "CN=Users,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"  # Ajuste conforme a sua estrutura de OU no AD
#$grupo = "CN=TI Suporte,OU=Administrativo,OU=Colaboradores,OU=CMSJ,DC=ad,DC=cmsj,DC=sc,DC=gov,DC=br"  # Ajuste conforme o grupo de pertencimento

# Cria o novo usuário no Active Directory
New-ADUser -SamAccountName $usuario -UserPrincipalName $usuarioLogon -Name $nomeCompleto -AccountPassword $senha -Path $ou -Enabled $true -PasswordNeverExpires $false -ChangePasswordAtLogon $true -GivenName $primeiroNome -Surname $sobrenome -Initials $iniciais -DisplayName $nomeExibicao -Description $descricao -Department $tipo de movimento -EmailAddress $email -OfficePhone $telefone -Company $empresa

# Adiciona o usuário a um grupo específico
#Add-ADGroupMember -Identity $grupo -Members $usuario

Write-Output "Usuário $usuario criado com sucesso e adicionado ao grupo."