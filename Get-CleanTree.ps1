param (
    [string]$Path = ".",
    [string[]]$ExcludeDirs = @("node_modules", "dist", ".git", "coverage"),
    [int]$Level = 0
)

function Show-CleanTree {
    param (
        [string]$Path,
        [string[]]$ExcludeDirs,
        [int]$Level
    )

    $items = Get-ChildItem -LiteralPath $Path -Force | Where-Object {
        $_.Name -notin $ExcludeDirs
    }

    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $items.Count - 1)
        $prefix = ('│  ' * $Level) + ($isLast ? '└── ' : '├── ')
        Write-Output "$prefix$item"

        if ($item.PSIsContainer) {
            Show-CleanTree -Path $item.FullName -ExcludeDirs $ExcludeDirs -Level ($Level + 1)
        }
    }
}

Show-CleanTree -Path (Resolve-Path $Path) -ExcludeDirs $ExcludeDirs -Level $Level
