<#
  Builds the favicon set from the monster mark.

    scripts/make-icons.ps1 [-Src <path>]

  Two findings from rendering the mark at actual tab-strip size drive what
  this emits (see README "Favicon"):

  1. The mark is OUTLINE art on a transparent ground. At 16px the strokes
     alias into noise and the belly reads as a hole, so the icon looks thin
     and undersized. The tab-strip sizes therefore ship a solid silhouette -
     the enclosed void flood-filled - which stays bold all the way down.
     96px keeps the full drawing, where there is room for the face.

  2. No opaque tile on the tab-strip sizes. A dark tile fills the slot, but
     against a dark tab strip it reads as a black box around the mark, which
     looks worse than the problem it solved. A solid silhouette gets the same
     visual weight without boxing anything in. The Apple size is the
     exception: iOS composites transparency onto black no matter what, and a
     tile is what a home-screen icon is supposed to look like.

  Windows-only: it uses System.Drawing rather than adding an image dependency
  for something that runs by hand every few years.
#>
param(
  [string]$Src = "$PSScriptRoot\..\public\Logo\monsterOrange.png"
)

. "$PSScriptRoot\_iconlib.ps1"

$outDir = (Resolve-Path "$PSScriptRoot\..\public").Path
Init-Master $Src

Write-Host "flood-filling silhouette..."
$silhouette = Get-Silhouette 384
$detailed = Get-Square 720

<# Renders and writes one file. #>
function Emit($art, [int]$size, [double]$fill, $tile, [string]$name) {
  $img = Render-Icon $art $size $fill $tile
  $path = Join-Path $outDir $name
  $img.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $img.Dispose()
  Write-Host "wrote $name"
}

# Tab strip - solid, transparent ground, near edge-to-edge.
# Both sizes use the same drawing so 1x and 2x displays agree.
Emit $silhouette 16 0.96 $null "favicon-16.png"
Emit $silhouette 32 0.96 $null "favicon-32.png"
# Larger slots (bookmarks, history) have room for the real drawing.
Emit $detailed   96 0.96 $null "favicon-96.png"
# iOS home screen: opaque by necessity, tiled by convention.
Emit $detailed  180 0.78 $script:BASE "apple-touch-icon.png"

$silhouette.Dispose(); $detailed.Dispose(); $script:Master.Dispose()
