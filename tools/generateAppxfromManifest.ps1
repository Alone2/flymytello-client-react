# Create Certificate (No Password): https://docs.microsoft.com/en-us/windows/win32/appxpkg/how-to-create-a-package-signing-certificate
# or: let electron-windows-store do it

$ver = Read-Host 'Windows Kit Path? (example: D:\Windows Kits\10\bin\10.0.18362.0\x64) '
$cert = Read-Host 'Certification File? '
$env:Path += ";$ver"  

$outdir=$Args[0]

cd $outdir\flymytelloAppx
MakePri createconfig /cf .\priconfig.xml /dq de-DE
MakePri new /pr . /cf .\priconfig.xml

MakeAppx pack /v /o /d  . /p .\Flymytello.appx

SignTool sign /fd SHA256 /a /f $cert .\Flymytello.appx