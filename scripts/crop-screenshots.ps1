# Обрезает скриншоты терминала по содержимому: находит границы непустых пикселей,
# добавляет поля и перезаписывает файл. Кадры можно снимать во весь экран.
#
#   powershell -File scripts/crop-screenshots.ps1            # все PNG в public/screenshots
#   powershell -File scripts/crop-screenshots.ps1 00-00-*.png # по маске
#
# Фон — самый частый цвет по сетке точек в кадре. Файлы, уже обрезанные (высота
# почти не меняется), пропускаются, так что скрипт можно запускать повторно.

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
    $w = $bmp.Width; $h = $bmp.Height
    # Фон терминала — самый частый цвет по сетке точек внутри кадра: один пиксель
    # может попасть на заголовок окна или на цветную строку diff.
    $votes = @{}
    for ($i = 1; $i -le 9; $i++) {
      for ($j = 1; $j -le 9; $j++) {
        $s = $bmp.GetPixel([int]($w * $i / 10), [int]($h * $j / 10))
        $k = "$($s.R),$($s.G),$($s.B)"
        $votes[$k] = 1 + [int]$votes[$k]
      }
    }
    $best = ($votes.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1).Key -split ","
    $bg = [System.Drawing.Color]::FromArgb([int]$best[0], [int]$best[1], [int]$best[2])
    $left = $w; $top = $h; $right = -1; $bottom = -1
    $chrome = New-Object bool[] $h

    # Строки, где больше половины пикселей не фон, — это «хром»: заголовок окна,
    # панель задач, рамки. Текст терминала такие строки не заполняет. Их пропускаем.
    for ($y = 0; $y -lt $h; $y++) {
      $rowLeft = $w; $rowRight = -1; $count = 0; $strong = 0
      for ($x = 0; $x -lt $w; $x++) {
        $p = $bmp.GetPixel($x, $y)
        $d = [Math]::Abs($p.R - $bg.R) + [Math]::Abs($p.G - $bg.G) + [Math]::Abs($p.B - $bg.B)
        if ($d -gt 40) {
          $count++
          if ($d -gt 150) { $strong++ }
          if ($x -lt $rowLeft) { $rowLeft = $x }
          if ($x -gt $rowRight) { $rowRight = $x }
        }
      }
      # «Хром» — только сильно отличающиеся строки (тёмный заголовок, панель задач).
      # Светлая подложка строк diff отличается от фона слабо и хромом не считается.
      if ($strong -gt ($w / 2)) { $chrome[$y] = $true; continue }
      if ($count -eq 0) { continue }
      if ($rowLeft -lt $left) { $left = $rowLeft }
      if ($rowRight -gt $right) { $right = $rowRight }
      if ($y -lt $top) { $top = $y }
      if ($y -gt $bottom) { $bottom = $y }
    }

    if ($right -lt 0) { Write-Host "$($file.Name): пустой кадр, пропущен"; continue }

    # Поля не должны залезать в «хром» (в заголовок окна сверху, в панель задач снизу).
    $y0 = $top; while ($y0 -gt 0 -and ($top - $y0) -lt $Padding -and -not $chrome[$y0 - 1]) { $y0-- }
    $y1 = $bottom; while ($y1 -lt ($h - 1) -and ($y1 - $bottom) -lt $Padding -and -not $chrome[$y1 + 1]) { $y1++ }
    $x0 = [Math]::Max(0, $left - $Padding)
    $x1 = [Math]::Min($w - 1, $right + $Padding)
    # Не уже минимальной ширины: иначе узкие кадры растянутся на сайте сильнее широких.
    if (($x1 - $x0 + 1) -lt $MinWidth) { $x1 = [Math]::Min($w - 1, $x0 + $MinWidth - 1) }

    $newW = $x1 - $x0 + 1; $newH = $y1 - $y0 + 1
    # Полноэкранный кадр всегда сильно теряет в высоте (заголовок, панель задач).
    # Если высота почти не меняется, кадр уже обрезан — ширину не трогаем.
    if ($newH -ge $h - 24) { Write-Host "$($file.Name): уже обрезан"; continue }

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
