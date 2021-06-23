
$AppName = "IWAExpress"

Write-Host "Removing files..."
Remove-Item -Force -Recurse ".fortify" -ErrorAction SilentlyContinue
Remove-Item "$($AppName).fpr" -ErrorAction SilentlyContinue
Remove-Item "$($AppName).pdf" -ErrorAction SilentlyContinue
Write-Host "Done."