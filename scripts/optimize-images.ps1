# Script para optimizar imágenes (requiere ImageMagick instalado)
# Instalar: choco install imagemagick

$imagesDir = "..\client\public\images"
$assetsDir = "..\client\src\assets"

# Comprimir banners a calidad 75
Write-Host "Comprimiendo banners..."
Get-ChildItem "$imagesDir\banner-*.webp" | ForEach-Object {
    $output = $_.FullName -replace '\.webp$', '-opt.webp'
    magick $_.FullName -quality 75 -define webp:target-size=80kb $output
    Write-Host "Optimizado: $($_.Name)"
}

# Crear logo pequeño 164x164
Write-Host "Creando logo optimizado..."
$logo = Get-ChildItem "$assetsDir\LogoEntreNubes.webp" | Select-Object -First 1
if ($logo) {
    magick $logo.FullName -resize 164x164 -quality 85 "$assetsDir\LogoEntreNubes-sm.webp"
    Write-Host "Logo optimizado creado"
}

Write-Host "Optimización completada!"
