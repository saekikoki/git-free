Add-Type -AssemblyName System.Drawing
$w = 1200; $h = 630
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
$c1 = [System.Drawing.ColorTranslator]::FromHtml("#0b2942")
$c2 = [System.Drawing.ColorTranslator]::FromHtml("#0b3c5d")
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 35
$g.FillRectangle($bg, $rect)

# decorative circles
$orb1 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(60, 43, 176, 214))
$g.FillEllipse($orb1, 760, -160, 620, 620)
$orb2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 127, 210, 234))
$g.FillEllipse($orb2, 920, 330, 420, 420)

# grid lines
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(18, 255, 255, 255)), 1
for ($x = 0; $x -lt $w; $x += 48) { $g.DrawLine($pen, $x, 0, $x, $h) }
for ($y = 0; $y -lt $h; $y += 48) { $g.DrawLine($pen, 0, $y, $w, $y) }

$white = [System.Drawing.Brushes]::White
$accent = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#7fd2ea"))
$muted = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(210, 255, 255, 255))

$jp = "Yu Gothic UI"
if (-not ([System.Drawing.FontFamily]::Families | Where-Object { $_.Name -eq $jp })) { $jp = "Meiryo" }

$fEyebrow = New-Object System.Drawing.Font "Segoe UI", 22, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$fLogo = New-Object System.Drawing.Font "Segoe UI", 92, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$fTag = New-Object System.Drawing.Font $jp, 40, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$fSub = New-Object System.Drawing.Font $jp, 26, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)

$g.DrawString("IT  x  OT  x  AI   SOLUTIONS", $fEyebrow, $accent, 80, 150)
$g.DrawString("FSI-STYLE", $fLogo, $white, 72, 190)
$size = $g.MeasureString("FSI-STYLE ", $fLogo)
$g.DrawString("CORP", $fLogo, $accent, 72 + $size.Width - 20, 190)

$bar = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#2bb0d6"))
$g.FillRectangle($bar, 82, 330, 72, 6)

$g.DrawString("高信頼・高性能なITソリューション", $fTag, $white, 78, 368)
$g.DrawString("企業の未来を支えるシステムを、確かな技術力で。", $fSub, $muted, 80, 436)

$out = Join-Path (Get-Location).Path "public\ogp.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
"saved $out"
