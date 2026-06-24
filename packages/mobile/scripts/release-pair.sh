#!/bin/bash
# ============================================================================
# Release a COPPIA coerente: Production (feature OFF) + Test aperto (feature ON)
# ============================================================================
#
# Production e beta sono lo STESSO commit buildato due volte (con/senza --beta).
# I track Play condividono lo spazio versionCode e un tester del Test aperto
# riceve il versionCode piu alto a cui ha accesso, INCLUSA la Production: se la
# beta non sta sopra la Production, i tester scivolano su Production e perdono le
# feature combo. Questo script garantisce sempre beta > production.
#
# USAGE:
#   bash packages/mobile/scripts/release-pair.sh              # coppia: prod (N+1) + beta (N+2)
#   bash packages/mobile/scripts/release-pair.sh --beta-only  # solo beta (N+1), Production intatta
#
# OUTPUT (in C:/projects/beybladex/packages/mobile/):
#   beybladex-prod-v<N>.aab   (solo in modalita coppia)  -> track Production
#   beybladex-beta-v<N>.aab                               -> track Test aperto
# ============================================================================
set -e

SRC="c:/claude-code/Personale/app segnapunti beybladex"
APP_JSON="$SRC/packages/mobile/app.json"
SCRIPTS="$SRC/packages/mobile/scripts"
OUT_DIR="C:/projects/beybladex/packages/mobile"

# ---- Parse args ----
BETA_ONLY=0
for arg in "$@"; do
    case "$arg" in
        --beta-only) BETA_ONLY=1 ;;
    esac
done

# ---- versionCode corrente (= piu alto gia usato) ----
CUR=$(node -e "const s=require('fs').readFileSync('$APP_JSON','utf8');const m=s.match(/\"versionCode\":\s*([0-9]+)/);process.stdout.write(m[1]);")
if [ -z "$CUR" ]; then
    echo "ERRORE: versionCode non trovato in app.json"
    exit 1
fi
echo "versionCode corrente (piu alto usato): $CUR"

# Imposta versionCode in app.json toccando SOLO il numero (diff puliti)
set_version() {
    node -e "const fs=require('fs');const p='$APP_JSON';let s=fs.readFileSync(p,'utf8');s=s.replace(/(\"versionCode\":\s*)[0-9]+/,(m,p1)=>p1+$1);fs.writeFileSync(p,s);"
    echo "  versionCode -> $1"
}

build_and_save() {
    # $1 = nome file output (senza dir), $2... = flag passati a full-build-aab.sh
    local OUT_NAME="$1"; shift
    bash "$SCRIPTS/full-build-aab.sh" "$@"
    cp "$OUT_DIR/beybladex-mobile.aab" "$OUT_DIR/$OUT_NAME"
    echo "  -> $OUT_DIR/$OUT_NAME"
}

if [ "$BETA_ONLY" = "1" ]; then
    BETA=$((CUR + 1))
    echo ""
    echo "=== MODALITA BETA-ONLY: beta v$BETA (Production non toccata) ==="
    set_version "$BETA"
    build_and_save "beybladex-beta-v$BETA.aab" --beta
    echo ""
    echo "FATTO:"
    echo "  beybladex-beta-v$BETA.aab  -> caricare su track Test aperto"
else
    PROD=$((CUR + 1))
    BETA=$((CUR + 2))
    echo ""
    echo "=== MODALITA COPPIA: Production v$PROD + beta v$BETA (stesso commit) ==="
    # 1) Production (feature OFF)
    set_version "$PROD"
    build_and_save "beybladex-prod-v$PROD.aab"
    # 2) Beta (feature ON) — sempre un gradino sopra
    set_version "$BETA"
    build_and_save "beybladex-beta-v$BETA.aab" --beta
    echo ""
    echo "FATTO:"
    echo "  beybladex-prod-v$PROD.aab  -> track Production"
    echo "  beybladex-beta-v$BETA.aab  -> track Test aperto"
fi

echo ""
echo "app.json versionCode lasciato a $(node -e "const s=require('fs').readFileSync('$APP_JSON','utf8');const m=s.match(/\"versionCode\":\s*([0-9]+)/);process.stdout.write(m[1]);")"
