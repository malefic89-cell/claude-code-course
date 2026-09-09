# Обрезает скриншоты терминала по содержимому: находит границы непустых пикселей,
# добавляет поля и перезаписывает файл. Кадры можно снимать во весь экран.
#
#   powershell -File scripts/crop-screenshots.ps1            # все PNG в public/screenshots
#   powershell -File scripts/crop-screenshots.ps1 00-00-*.png # по маске
#
# Фон определяется по левому верхнему пикселю. Файлы, уже обрезанные (поля
# меньше порога), пропускаются, так что скрипт можно запускать повторно.

param(
  [string]$Pattern = "*.png",
  [int]$Padding = 28,
  [int]$MinWidth = 900
)

Add-Type -AssemblyName System.Drawing

$dir = Join-Path $PSScriptRoot "..\public\screenshots"
$files = Get-ChildItem -Path $dir -Filter $Pattern -File

foreach ($file in $files) {
  $bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
  try {
    $bg = $bmp.GetPixel(0, 0)
    $w = $bmp.Width; $h = $bmp.Height
    $left = $w; $top = $h; $right = -1; $bottom = -1

    for ($y = 0; $y -lt $h; $y++) {
      for ($x = 0; $x -lt $w; $x++) {
        $p = $bmp.GetPixel($x, $y)
        $d = [Math]::Abs($p.R - $bg.R) + [Math]::Abs($p.G - $bg.G) + [Math]::Abs($p.B - $bg.B)
        if ($d -gt 40) {
          if ($x -lt $left) { $left = $x }
          if ($x -gt $right) { $right = $x }
          if ($y -lt $top) { $top = $y }
          if ($y -gt $bottom) { $bottom = $y }
        }
      }
    }

    if ($right -lt 0) { Write-Host "$($file.Name): пустой кадр, пропущен"; continue }

    $x0 = [Math]::Max(0, $left - $Padding)
    $y0 = [Math]::Max(0, $top - $Padding)
    $x1 = [Math]::Min($w - 1, $right + $Padding)
    $y1 = [Math]::Min($h - 1, $bottom + $Padding)
    # Не уже минимальной ширины: иначе узкие кадры растянутся на сайте сильнее широких.
    if (($x1 - $x0 + 1) -lt $MinWidth) { $x1 = [Math]::Min($w - 1, $x0 + $MinWidth - 1) }

    $newW = $x1 - $x0 + 1; $newH = $y1 - $y0 + 1
    if ($newW -ge $w - 4 -and $newH -ge $h - 4) { Write-Host "$($file.Name): уже обрезан"; continue }

    $rect = New-Object System.Drawing.Rectangle $x0, $y0, $newW, $newH
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    $bmp.Dispose(); $bmp = $null
    $cropped.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Host "$($file.Name): ${w}x${h} -> ${newW}x${newH}"
  } finally {
    if ($bmp) { $bmp.Dispose() }
  }
}
