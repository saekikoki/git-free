$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$out = Join-Path (Get-Location).Path "browser.log"
"" | Out-File -Encoding utf8 $out
$urls = @(
  "http://localhost:4173/",
  "http://localhost:4173/en/",
  "http://localhost:4173/404.html",
  "http://localhost:4173/news/2025-05-12-fy2024-results/"
)
foreach ($u in $urls) {
  $tmp = Join-Path $env:TEMP ("edge-prof-" + [guid]::NewGuid())
  $dom = Join-Path $env:TEMP "dom.html"
  $err = Join-Path $env:TEMP "edge-err.txt"
  $p = Start-Process -FilePath $edge -ArgumentList @("--headless=new","--disable-gpu","--no-first-run","--user-data-dir=$tmp","--enable-logging=stderr","--v=0","--virtual-time-budget=6000","--dump-dom",$u) -RedirectStandardOutput $dom -RedirectStandardError $err -PassThru -WindowStyle Hidden
  $p.WaitForExit(40000) | Out-Null
  $html = Get-Content $dom -Raw -Encoding UTF8
  $console = Get-Content $err -Encoding UTF8 | Where-Object { $_ -match "CONSOLE" }
  "===== $u" | Out-File -Append -Encoding utf8 $out
  "dom length: $($html.Length)" | Out-File -Append -Encoding utf8 $out
  if ($html -match '<html[^>]*>') { "html tag: $($Matches[0])" | Out-File -Append -Encoding utf8 $out }
  if ($html -match '<title>([^<]*)</title>') { "title: $($Matches[1])" | Out-File -Append -Encoding utf8 $out }
  "data-pre left in head: $(([regex]::Matches($html, 'data-pre')).Count)" | Out-File -Append -Encoding utf8 $out
  "title tags: $(([regex]::Matches($html, '<title')).Count)" | Out-File -Append -Encoding utf8 $out
  "motion-ready: $($html -match 'motion-ready')" | Out-File -Append -Encoding utf8 $out
  "search results: $(([regex]::Matches($html, 'class=""search-result""')).Count)" | Out-File -Append -Encoding utf8 $out
  "news cards: $(([regex]::Matches($html, 'class=""newsx-card""')).Count)" | Out-File -Append -Encoding utf8 $out
  "lang notice: $($html -match 'available in Japanese only')" | Out-File -Append -Encoding utf8 $out
  "console lines:" | Out-File -Append -Encoding utf8 $out
  $console | Out-File -Append -Encoding utf8 $out
  Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}
"DONE" | Out-File -Append -Encoding utf8 $out
