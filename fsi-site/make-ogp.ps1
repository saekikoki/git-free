Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAlias'
$rect = New-Object System.Drawing.Rectangle 0, 0, 1200, 630
$c1 = [System.Drawing.Color]::FromArgb(11, 41, 66)
$c2 = [System.Drawing.Color]::FromArgb(18, 58, 92)
$br = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 45
$g.FillRectangle($br, $rect)
$white = [System.Drawing.Brushes]::White
$accent = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(43, 176, 214))
$fe = New-Object System.Drawing.Font 'Segoe UI', 26, ([System.Drawing.FontStyle]::Bold)
$fb = New-Object System.Drawing.Font 'Segoe UI', 84, ([System.Drawing.FontStyle]::Bold)
$ft = New-Object System.Drawing.Font 'Yu Gothic UI', 40, ([System.Drawing.FontStyle]::Bold)
$g.DrawString('SECURITY SERVICES', $fe, $accent, 80, 130)
$g.DrawString('FSI-STYLE SECURITY', $fb, $white, 72, 190)
$g.DrawString(([string][char]0x4EBA + [char]0x3068 + [char]0x8857 + [char]0x306E + [char]0x5B89 + [char]0x5168 + [char]0x3092 + [char]0x3001 + '24' + [char]0x6642 + [char]0x9593 + [char]0x5B88 + [char]0x308B + [char]0x8B66 + [char]0x5099), $ft, $white, 80, 350)
$g.Dispose()
$out = Join-Path $PSScriptRoot 'public\ogp.png'
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output 'ogp done' | Out-File (Join-Path $PSScriptRoot 'ogp.log')
