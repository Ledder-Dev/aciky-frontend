# start.ps1 — Lanzador de mundo (token-aware)
# Auto-arranca el stack COMPARTIDO si no está vivo, abre el dashboard general
# la primera vez, y lanza Claude Code apuntando al proxy de Headroom.

$ErrorActionPreference = "Stop"
$worldDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Localizar la raíz del universo (busca _shared/token-stack hacia arriba)
$dir = $worldDir; $stackDir = $null
while ($dir -and -not $stackDir) {
    $candidate = Join-Path $dir "_shared\token-stack"
    if (Test-Path (Join-Path $candidate "headroom-start.ps1")) { $stackDir = $candidate; break }
    $parent = Split-Path -Parent $dir
    if ($parent -eq $dir) { break }
    $dir = $parent
}

if (-not $stackDir) {
    Write-Warning "No encontré _shared/token-stack. Lanzo Claude sin telemetría."
} else {
    function Test-Port($port) {
        return [bool](Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue)
    }
    if (-not (Test-Port 8787) -or -not (Test-Port 8788)) {
        Write-Host "⚙️  Arrancando stack de tokens compartido..."
        & (Join-Path $stackDir "headroom-start.ps1")
        Start-Sleep -Seconds 4
        # Abre el dashboard general (Headroom + Tareas + Agentes + Skills)
        $dash = Join-Path $stackDir "dashboard.html"
        if (Test-Path $dash) { Start-Process $dash }
    } else {
        Write-Host "✅ Stack de tokens ya activo (8787/8788)."
    }
}

Set-Location $worldDir
$env:ANTHROPIC_BASE_URL = "http://127.0.0.1:8787"
Write-Host "✅ ANTHROPIC_BASE_URL → proxy Headroom"
Write-Host "🤖 Claude Code en mundo: $(Split-Path -Leaf $worldDir)"
claude --append-system-prompt "Talk like caveman from message one. Drop filler. Keep technical accuracy. Use fragments."
