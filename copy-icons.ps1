# Script para copiar iconos con nombres limpios
$files = Get-ChildItem 'public/images/reduxfotos/ICONO*.png'
foreach ($f in $files) {
    $nuevoNombre = $f.Name -replace 'ICONO ','' `
                   -replace 'ATRACCIÓ','atraccion' `
                   -replace 'DESARROLLO','desarrollo' `
                   -replace 'FORMACIÓ','formacion' `
                   -replace 'SALUD','salud' `
                   -replace 'BIENESTAR','bienestar'
    $destino = Join-Path $f.DirectoryName $nuevoNombre
    Write-Host "Copiando $($f.Name) a $destino"
    Copy-Item $f.FullName $destino -Force
}
Write-Host "Completado"
