<#
  Shared icon-rendering helpers, dot-sourced by make-icons.ps1.

  Kept separate so the generator and any throwaway comparison script render
  through exactly the same code - a preview that disagrees with what ships is
  worse than no preview.
#>

Add-Type -AssemblyName System.Drawing

$script:MARK = [System.Drawing.Color]::FromArgb(255, 255, 94, 0)   # --c-primary
$script:BASE = [System.Drawing.Color]::FromArgb(255, 10, 10, 10)   # --c-base, dark

<# Loads the master and measures the artwork's bounding box. #>
function Init-Master([string]$path) {
  $script:Master = [System.Drawing.Bitmap]::FromFile((Resolve-Path $path).Path)

  $probe = New-Object System.Drawing.Bitmap 256, 256
  $g = [System.Drawing.Graphics]::FromImage($probe)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($script:Master, 0, 0, 256, 256)
  $g.Dispose()

  $minX = 256; $minY = 256; $maxX = -1; $maxY = -1
  for ($y = 0; $y -lt 256; $y++) {
    for ($x = 0; $x -lt 256; $x++) {
      if ($probe.GetPixel($x, $y).A -gt 8) {
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  $probe.Dispose()

  $sc = $script:Master.Width / 256.0
  $bx = [int]($minX * $sc); $by = [int]($minY * $sc)
  $bw = [int](($maxX - $minX + 1) * $sc); $bh = [int](($maxY - $minY + 1) * $sc)

  # Tight square crop around the content; per-output padding comes from $fill.
  $script:Crop = [int]([Math]::Max($bw, $bh) / 0.98)
  $script:CropX = $bx - [int](($script:Crop - $bw) / 2)
  $script:CropY = $by - [int](($script:Crop - $bh) / 2)
  Write-Host "master $($script:Master.Width)x$($script:Master.Height), bbox ${bw}x${bh}"
}

<# Cropped square copy of the master at $N px, artwork untouched. #>
function Get-Square([int]$N) {
  $b = New-Object System.Drawing.Bitmap $N, $N, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gg = [System.Drawing.Graphics]::FromImage($b)
  $gg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gg.Clear([System.Drawing.Color]::Transparent)
  $gg.DrawImage($script:Master, (New-Object System.Drawing.Rectangle 0, 0, $N, $N),
    $script:CropX, $script:CropY, $script:Crop, $script:Crop, [System.Drawing.GraphicsUnit]::Pixel)
  $gg.Dispose()
  return $b
}

<#
  Solid version of the mark. The artwork is outline art with a transparent
  belly, which turns to noise when downscaled to a tab strip. Flooding the
  transparent area inward from the border finds everything the outside can
  reach; whatever it cannot reach is the belly, so painting that solid gives
  a shape that survives 16px.
#>
function Get-Silhouette([int]$N) {
  $bmp = Get-Square $N
  $rect = New-Object System.Drawing.Rectangle 0, 0, $N, $N
  $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bytes = New-Object byte[] ($data.Stride * $N)
  [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)

  $outside = New-Object bool[] ($N * $N)
  $stack = New-Object System.Collections.Generic.Stack[int]
  function Seed([int]$p) {
    if (-not $outside[$p] -and $bytes[($p * 4) + 3] -le 128) {
      $outside[$p] = $true; $stack.Push($p)
    }
  }
  for ($i = 0; $i -lt $N; $i++) {
    Seed $i; Seed (($N - 1) * $N + $i); Seed ($i * $N); Seed ($i * $N + $N - 1)
  }
  while ($stack.Count -gt 0) {
    $p = $stack.Pop()
    $py = [int][Math]::Floor($p / $N); $px = $p - $py * $N
    if ($px -gt 0)      { Seed ($p - 1) }
    if ($px -lt $N - 1) { Seed ($p + 1) }
    if ($py -gt 0)      { Seed ($p - $N) }
    if ($py -lt $N - 1) { Seed ($p + $N) }
  }
  for ($p = 0; $p -lt $N * $N; $p++) {
    if (-not $outside[$p]) {
      $o = $p * 4                                   # BGRA
      $bytes[$o] = $script:MARK.B; $bytes[$o + 1] = $script:MARK.G
      $bytes[$o + 2] = $script:MARK.R; $bytes[$o + 3] = 255
    }
  }
  [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
  $bmp.UnlockBits($data)
  return $bmp
}

<#
  Scales $art down to $size. $fill is the share of the canvas the mark spans.
  $tile, when given, composites onto that opaque colour; pass $null to keep
  the ground transparent.
#>
function Render-Icon($art, [int]$size, [double]$fill, $tile) {
  $span = [int]($art.Width / $fill)
  $off = [int](($span - $art.Width) / 2)
  $out = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gg = [System.Drawing.Graphics]::FromImage($out)
  $gg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $gg.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $gg.Clear([System.Drawing.Color]::Transparent)
  $gg.DrawImage($art, (New-Object System.Drawing.Rectangle 0, 0, $size, $size),
    -$off, -$off, $span, $span, [System.Drawing.GraphicsUnit]::Pixel)
  $gg.Dispose()

  if ($tile) {
    for ($y = 0; $y -lt $size; $y++) {
      for ($x = 0; $x -lt $size; $x++) {
        $c = $out.GetPixel($x, $y)
        $f = $c.A / 255.0
        $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255,
          [int]($tile.R + ($c.R - $tile.R) * $f),
          [int]($tile.G + ($c.G - $tile.G) * $f),
          [int]($tile.B + ($c.B - $tile.B) * $f)))
      }
    }
  }
  return $out
}
