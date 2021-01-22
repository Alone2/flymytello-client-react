echo -e "This script uses 'jq'. \nInstall it if you haven't already."
homedir=${1}
outdir=${2}
version=$( jq ".version" ${homedir}/package.json | cut -b 2-6 )
description=$( jq ".description" ${homedir}/package.json )

[ -d "${outdir}" ] || mkdir ${outdir}
[ -d "${outdir}/flymytello-archlinux" ] || mkdir ${outdir}/flymytello-archlinux

echo '# Maintainer: Alone2 <admin@bundr.net>
pkgname=flymytello
pkgver='${version}'
pkgrel=1
pkgdesc='${description}'
arch=("x86_64")
url="https://github.com/Alone2/flymytello-client-react"
license=("MIT")
depends=("electron" "bash")
source=("https://github.com/Alone2/flymytello-client-react/archive/v${pkgver}.zip")

prepare() {
    cd "${srcdir}/flymytello-client-react-${pkgver}"
    sed "/\"electron\"/d" package.json > .tmppackage
    mv .tmppackage package.json
    export npm_config_target=$(tail /usr/lib/electron/version) export npm_config_arch=x64
    export npm_config_target_arch=x64
    export npm_config_disturl=https://atom.io/download/electron
    export npm_config_runtime=electron
    export npm_config_build_from_source=true
    HOME="${srcdir}/.electron-gyp" npm install
}

build() {
    export electronVersion=$(cat /usr/lib/electron/version | cut -c2-)
    cd "${srcdir}/flymytello-client-react-${pkgver}"
    ./node_modules/.bin/electron-builder --linux --x64 --dir ${srcdir} -c.electronDist=/usr/lib/electron -c.electronVersion=electronVersion
}

package() {
    cd "${srcdir}/flymytello-client-react-${pkgver}"

    install -Dm644 ./dist/linux-unpacked/resources/app.asar ${pkgdir}/usr/lib/${pkgname}/app.asar
    
    echo -e "#!/bin/bash\nexec electron /usr/lib/$pkgname/app.asar" > ${srcdir}/.tmplaunch
    install -Dm755 ${srcdir}/.tmplaunch ${pkgdir}/usr/bin/${pkgname}
        
    echo -e "[Desktop Entry]\nName=Flymytello\nComment=${pkgdesc}\nExec=${pkgname}\nType=Application\nIcon=${pkgname}\nTerminal=false\nCategories=Network;Games;" > ${srcdir}/.tmpdesktop

    install -Dm644 ${srcdir}/.tmpdesktop ${pkgdir}/usr/share/applications/${pkgname}.desktop
    install -Dm644 ./assets/icons/${pkgname}512x512.png ${pkgdir}/usr/share/icons/hicolor/512x512/apps/${pkgname}.png
} ' > ${outdir}/flymytello-archlinux/PKGBUILD

echo "(md5checksum needs to be added manually)"

echo done
