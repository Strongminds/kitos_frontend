param(
  [Parameter(Mandatory = $true)][string]$environment
)

$ErrorActionPreference = "Stop"

#Load tools
.$PSScriptRoot\DeploymentSetup.ps1
Setup-Environment -environment $environment
if ($LASTEXITCODE -ne 0)	{ Throw "FAILED TO LOAD config from AWS for $environment" }

#Fetch vars from config
$deployment_packages_dir = Resolve-Path "$PSScriptRoot\..\deployment_packages\$Env:DeploymentBundleName"
$computerName = $Env:MsDeployUrl
$username = $Env:MsDeployUserName
$password = $Env:MsDeployPassword

& msdeploy `
  -verb:sync `
  -disableLink:AppPoolExtension `
  -disableLink:ContentExtension `
  -disableLink:CertificateExtension `
  -source:dirPath="$deployment_packages_dir" `
  -allowUntrusted `
  -dest:dirPath="`"C:\inetpub\kitos-frontend`",computerName=`"$computerName`",userName=`"$username`",password=`"$password`",authtype=`"Basic`",includeAcls=`"False`""

if ($LASTEXITCODE -ne 0) {
  Write-Error "MSdeploy failed with exit code $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Host "Frontend deployment completed. Ensuring IIS is running..."
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $securePassword)

$remoteSession = $null
try {
  $sessionOption = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck
  $remoteSession = New-PSSession -ComputerName $computerName -Credential $credential -SessionOption $sessionOption -UseSSL
  Invoke-Command -Session $remoteSession -ScriptBlock {
    Write-Host "Starting IIS..."
    iisreset /restart
    if ($LASTEXITCODE -ne 0) { throw "iisreset failed with exit code $LASTEXITCODE" }
    Write-Host "IIS started successfully."
  }
}
finally {
  if ($remoteSession) { Remove-PSSession -Session $remoteSession }
}
