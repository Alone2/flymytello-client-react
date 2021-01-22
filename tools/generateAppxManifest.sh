echo -e "This script uses 'jq'. \nInstall it if you haven't already."
homedir=${1}
outdir=${2}

[ -d "${outdir}/flymytelloAppx" ] && rm -r ${outdir}/flymytelloAppx
mkdir ${outdir}/flymytelloAppx

cp -r ${outdir}/flymytello-win32-x64/ ${outdir}/flymytelloAppx/app
cp -r ${homedir}/assets/winstore/ ${outdir}/flymytelloAppx/assets

echo Application Name?
read name
echo Publisher?
read publisher

version=$( jq ".version" ${homedir}/package.json | cut -b 2-6 )
description=$( jq ".description" ${homedir}/package.json )

echo '<?xml version="1.0" encoding="utf-8"?>

<Package
  xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
  xmlns:mp="http://schemas.microsoft.com/appx/2014/phone/manifest"
  xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
  xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities"
  IgnorableNamespaces="uap mp">

  <Identity
    ProcessorArchitecture="x64"
    Name="'${name}'"
    Publisher="'${publisher}'"
    Version="'${version}'.0" />

  <Properties>
    <DisplayName>Flymytello</DisplayName>
    <PublisherDisplayName>Alone02</PublisherDisplayName>
    <Logo>assets\StoreLogo.png</Logo>
  </Properties>

  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.18362.0" MaxVersionTested="10.0.18362.0"  />
  </Dependencies>

  <Capabilities>
    <rescap:Capability Name="runFullTrust"/>
  </Capabilities>

  <Resources>
    <Resource Language="de-DE"/>
  </Resources>

  <Applications>
    <Application Id="Flymytello" Executable="app/flymytello.exe" EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements
        DisplayName="Flymytello"
        Square150x150Logo="assets\Square150x150Logo.png"
        Square44x44Logo="assets\Square44x44Logo.png"
        Description='${description}'
        BackgroundColor="transparent">
        <uap:DefaultTile Wide310x150Logo="assets\Wide310x150Logo.png" Square71x71Logo="assets\SmallTile.png" Square310x310Logo="assets\LargeTile.png"/>
        <uap:SplashScreen Image="assets\SplashScreen.png" />
      </uap:VisualElements>
    </Application>
  </Applications>
</Package>' >  ${outdir}/flymytelloAppx/AppxManifest.xml

#echo "(.appx needs to be generated manually)"

echo "appx Manifest generated" 

powershell.exe tools/generateAppxfromManifest.ps1 ${outdir}
