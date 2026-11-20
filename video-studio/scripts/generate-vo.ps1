<#
.SYNOPSIS
  Generate Voiceover (.wav) clips using built-in Windows Male TTS (System.Speech)
  and export auto-computed timeline frames to src/audio/vo-manifest.json.
#>

param(
  [int]$Rate = 2,
  [int]$Volume = 100,
  [int]$GapFrames = 14
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Speech

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$studioDir = Split-Path -Parent $scriptDir
$audioDir = Join-Path $studioDir "public\audio"
$manifestPath = Join-Path $studioDir "src\audio\vo-manifest.json"

New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $manifestPath) | Out-Null

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voices = $synth.GetInstalledVoices() | Where-Object { $_.Enabled }
$maleVoice = $voices | Where-Object { $_.VoiceInfo.Gender -eq [System.Speech.Synthesis.VoiceGender]::Male } | Select-Object -First 1

if (-not $maleVoice) {
  throw "Tidak ditemukan voice Male pada Windows TTS."
}

$synth.SelectVoice($maleVoice.VoiceInfo.Name)
$synth.Rate = $Rate
$synth.Volume = $Volume

Write-Host "Using Windows Male Voice: $($maleVoice.VoiceInfo.Name) ($($maleVoice.VoiceInfo.Culture)), Rate=$Rate"

$clips = @(
  @{
    key = "babak1"
    file = "vo-babak1.wav"
    text = "Wait. Do you think software engineering is just writing code?"
  },
  @{
    key = "babak2"
    file = "vo-babak2.wav"
    text = "Coding without a blueprint is like stacking bricks blindly. Software engineering builds the structure that lasts."
  },
  @{
    key = "step1"
    file = "vo-step1.wav"
    text = "Step one: requirements and blueprint. Understand the problem before opening your code editor."
  },
  @{
    key = "step2"
    file = "vo-step2.wav"
    text = "Step two: modular architecture. Organize components cleanly so your team can scale."
  },
  @{
    key = "step3"
    file = "vo-step3.wav"
    text = "Step three: quality and testing. Scan and verify every feature before release."
  },
  @{
    key = "step4"
    file = "vo-step4.wav"
    text = "Step four: deploy and evolve. Ship to users, monitor, and iterate continuously."
  },
  @{
    key = "outro"
    file = "vo-outro.wav"
    text = "Beyond coding, building the right software. Follow S E Lab FILKOM U B."
  }
)

function Get-WavDurationSeconds([string]$Path) {
  $bytes = [System.IO.File]::ReadAllBytes($Path)
  $byteRate = [BitConverter]::ToUInt32($bytes, 28)
  $pos = 12
  while ($pos -lt ($bytes.Length - 8)) {
    $chunkId = [System.Text.Encoding]::ASCII.GetString($bytes, $pos, 4)
    $chunkSize = [BitConverter]::ToUInt32($bytes, $pos + 4)
    if ($chunkId -eq "data") {
      return [Math]::Round($chunkSize / [double]$byteRate, 3)
    }
    $pos += 8 + $chunkSize
  }
  return 3.0
}

$manifest = @{
  voiceName = $maleVoice.VoiceInfo.Name
  culture = $maleVoice.VoiceInfo.Culture.Name
  gender = $maleVoice.VoiceInfo.Gender.ToString()
  fps = 30
  totalFrames = 0
  clips = @{}
}

$cursorFrame = 0
foreach ($clip in $clips) {
  $outPath = Join-Path $audioDir $clip.file
  $synth.SetOutputToWaveFile($outPath)
  $synth.Speak($clip.text)
  $synth.SetOutputToNull()

  $durationSec = Get-WavDurationSeconds $outPath
  $durationFrames = [Math]::Ceiling($durationSec * 30)
  $chapterStart = $cursorFrame
  $audioStart = $chapterStart + 6
  $chapterEnd = $audioStart + $durationFrames + $GapFrames

  $manifest.clips[$clip.key] = @{
    file = "audio/$($clip.file)"
    chapterStartFrame = $chapterStart
    chapterEndFrame = $chapterEnd
    audioStartFrame = $audioStart
    durationSeconds = $durationSec
    durationFrames = $durationFrames
    text = $clip.text
  }

  Write-Host ("{0}: frames {1}..{2} (audio @{3}, {4}s)" -f $clip.key, $chapterStart, $chapterEnd, $audioStart, $durationSec)
  $cursorFrame = $chapterEnd
}

$manifest.totalFrames = $cursorFrame + 15
$synth.Dispose()

$manifestJson = $manifest | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($manifestPath, $manifestJson, [System.Text.UTF8Encoding]::new($false))
Write-Host "Total video frames: $($manifest.totalFrames) ($([Math]::Round($manifest.totalFrames / 30.0, 2))s)"
