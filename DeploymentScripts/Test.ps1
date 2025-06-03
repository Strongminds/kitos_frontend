Write-Host "Testing angular app"

$ErrorActionPreference = 'Stop'

Write-Host "Installing packages"
yarn

yarn cypress install
if ( -not $? ) { throw "Failed installing cypress" }

yarn lint
if ( -not $? ) { throw "Failed linting" }

Write-Host "Running E2E tests in CI configuration"
yarn cy:parallel
if ( -not $? ) { throw "Failed running e2e tests" }
