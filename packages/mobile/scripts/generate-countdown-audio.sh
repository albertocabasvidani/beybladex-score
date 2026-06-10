#!/bin/bash
# Genera gli asset audio del countdown via API ElevenLabs + ffmpeg.
#
# Output: packages/mobile/assets/sounds/countdown-it.mp3 e countdown-en.mp3
#   IT: "Tre! Due! Uno! Prooonti... lancio!"  (voce Davide - Sports Commentator)
#   EN: "Three! Two! One! Gooooo shoot!"      (voce Charlie)
#
# Prerequisiti: ELEVENLABS_API_KEY nell'ambiente (dal .env del progetto), ffmpeg.
# I segmenti TTS sono cachati in tmp/countdown-tts: cancellare la cartella per
# rigenerarli (es. dopo un cambio voce). Per tarare solo le pause basta
# modificare PAUSE_NUM/PAUSE_FINAL e rilanciare: usa la cache, niente chiamate API.
set -e

SRC="c:/claude-code/Personale/app segnapunti beybladex"
OUT="$SRC/packages/mobile/assets/sounds"
TMP="$SRC/tmp/countdown-tts"
mkdir -p "$OUT" "$TMP"

VOICE_IT="ImsA1Fn5TNc843fFdz99"   # Davide - Sports Commentator
VOICE_EN="IKne3meq5aSn9XLyUdCD"   # Charlie - Deep, Confident, Energetic
MODEL="eleven_multilingual_v2"

PAUSE_NUM=0.45    # pausa dopo "3" e "2" (secondi)
PAUSE_FINAL=0.3   # pausa dopo "1", prima della frase finale

# Frase finale: massima espressivita' (stability bassa + style alto = urlo esplosivo)
EXPLOSIVE='{"stability": 0.3, "similarity_boost": 0.75, "style": 0.9, "use_speaker_boost": true}'

FFMPEG="ffmpeg"
command -v ffmpeg >/dev/null 2>&1 || FFMPEG="/c/Program Files/ffmpeg/bin/ffmpeg.exe"

tts() { # $1=voice_id $2=testo $3=file output (skip se già in cache) $4=voice_settings JSON opzionale
  if [ -f "$3" ]; then
    echo "cache: $3"
    return
  fi
  local body
  if [ -n "$4" ]; then
    body="{\"text\": \"$2\", \"model_id\": \"$MODEL\", \"voice_settings\": $4}"
  else
    body="{\"text\": \"$2\", \"model_id\": \"$MODEL\"}"
  fi
  # Retry a livello bash: curl --retry non copre gli errori DNS (exit 6)
  local code="" attempt
  for attempt in 1 2 3; do
    code=$(curl -s "https://api.elevenlabs.io/v1/text-to-speech/$1?output_format=mp3_44100_128" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" -H "Content-Type: application/json" \
      -d "$body" \
      -o "$3" -w "%{http_code}") && break
    echo "tentativo $attempt fallito (curl exit $?), riprovo..."
    sleep 2
  done
  if [ "$code" != "200" ]; then
    echo "ERRORE TTS HTTP $code per: $2"
    cat "$3"
    rm -f "$3"
    exit 1
  fi
  echo "generato: $3"
}

# Trim del silenzio in coda ai primi 3 segmenti + pausa fissa, poi concat.
concat() { # $1..$4=segmenti $5=output
  "$FFMPEG" -y -loglevel error -i "$1" -i "$2" -i "$3" -i "$4" -filter_complex "\
[0:a]areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse,apad=pad_dur=${PAUSE_NUM}[a0];\
[1:a]areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse,apad=pad_dur=${PAUSE_NUM}[a1];\
[2:a]areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse,apad=pad_dur=${PAUSE_FINAL}[a2];\
[a0][a1][a2][3:a]concat=n=4:v=0:a=1[out]" \
    -map "[out]" -ac 1 -b:a 96k "$5"
  echo "creato: $5"
}

# --- Italiano (Davide) ---
tts "$VOICE_IT" "Tre!"               "$TMP/it-3.mp3"
tts "$VOICE_IT" "Due!"               "$TMP/it-2.mp3"
tts "$VOICE_IT" "Uno!"               "$TMP/it-1.mp3"
tts "$VOICE_IT" "Prooonti... lancio!"  "$TMP/it-final.mp3" "$EXPLOSIVE"
concat "$TMP/it-3.mp3" "$TMP/it-2.mp3" "$TMP/it-1.mp3" "$TMP/it-final.mp3" "$OUT/countdown-it.mp3"

# --- English ---
tts "$VOICE_EN" "Three!"                 "$TMP/en-3.mp3"
tts "$VOICE_EN" "Two!"                   "$TMP/en-2.mp3"
tts "$VOICE_EN" "One!"                   "$TMP/en-1.mp3"
tts "$VOICE_EN" "Gooooo shoot!"          "$TMP/en-final.mp3" "$EXPLOSIVE"
concat "$TMP/en-3.mp3" "$TMP/en-2.mp3" "$TMP/en-1.mp3" "$TMP/en-final.mp3" "$OUT/countdown-en.mp3"

echo "DONE"
