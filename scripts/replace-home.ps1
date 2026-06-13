Set-Location $PSScriptRoot\..
$main = Get-Content -Path 'main.html' -Raw -Encoding UTF8
$newHome = Get-Content -Path 'sections\home-premium.html' -Raw -Encoding UTF8
$pattern = '(?s)  <!-- ========== HOME PAGE ========== -->.*?  <!-- ========== LAND PAGE ========== -->'
$landMarker = "`r`n`r`n  <!-- ========== LAND PAGE ========== -->"
$replacement = $newHome.TrimEnd() + $landMarker
if ($main -notmatch $pattern) {
    Write-Error 'Pattern not found in main.html'
    exit 1
}
$main = $main -replace $pattern, $replacement
$main = $main -replace '<div class="page active" id="page-csa">', '<div class="page" id="page-csa">'
[System.IO.File]::WriteAllText((Join-Path $PWD 'main.html'), $main)
Write-Host 'Home page replaced successfully'
