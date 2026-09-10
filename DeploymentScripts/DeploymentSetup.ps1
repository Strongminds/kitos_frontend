# Load helper
.$PSScriptRoot\AwsApi.ps1

Function Load-Environment-Secrets-From-Aws([String] $envName) {
  Write-Host "Loading environment configuration from SSM"

  $parameters = Get-SSM-Parameters -environmentName "$envName"

  $Env:MsDeployUserName = $parameters["MsDeployUserName"]
  $Env:MsDeployPassword = $parameters["MsDeployPassword"]
  $Env:MsDeployUrl = $parameters["MsDeployUrl"]

  # When the DB provider is Postgres, override deployment target with values from
  # the Postgres-specific SSM path (e.g. /kitos/postgres-dev/) so the frontend is
  # deployed to the server that hosts the PostgreSQL-backed environment.
  if ($Env:KitosDbProvider -eq "Postgres") {
    $pgEnvName = "postgres-$envName"
    Write-Host "KitosDbProvider is Postgres - loading deployment config from SSM path: /kitos/$pgEnvName/"
    $pgParameters = Get-SSM-Parameters -environmentName "$pgEnvName"

    if ($pgParameters.Count -eq 0) {
      throw "No parameters found for Postgres environment $pgEnvName"
    }

    $Env:MsDeployUrl = $pgParameters["MsDeployUrl"]
  }

  Write-Host "Finished loading environment configuration from SSM"
}

Function Setup-Environment([String] $environmentName) {
  Write-Host "Configuring Deployment Environment $environmentName"

  if (-Not (Test-Path 'env:AwsAccessKeyId')) {
    throw "Error: Remember to set the AwsAccessKeyId input before starting the build"
  }
  if (-Not (Test-Path 'env:AwsSecretAccessKey')) {
    throw "Error: Remember to set the AwsSecretAccessKey input before starting the build"
  }

  switch ( $environmentName ) {
    "integration" {
      $Env:DeploymentBundleName = "dev"
      break;
    }
    "dev" {
      $Env:DeploymentBundleName = "dev"
      break;
    }
    "staging" {
      $Env:DeploymentBundleName = "dev"
      break;
    }
    "production" {
      $Env:DeploymentBundleName = "production"
      break;
    }
    default { Throw "Error: Unknown environment provided: $environmentName" }
  }

  Configure-Aws -accessKeyId "$Env:AwsAccessKeyId" -secretAccessKey "$Env:AwsSecretAccessKey"
  Load-Environment-Secrets-From-Aws -envName "$environmentName"

  Write-Host "Finished configuring $environmentName"
}
