import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {getActiveChapter, TIMELINE} from '../../audio/timeline';
import {BRAND_TOKENS, FONTS, StagePalette} from '../../theme';
import {ApaItuRplProps} from '../../types/story';

interface StoryOverlayProps {
  props: ApaItuRplProps;
  palette: StagePalette;
}

export const StoryOverlay: React.FC<StoryOverlayProps> = ({props, palette}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safe = BRAND_TOKENS.formats.reels.safeZone;

  const activeChapter = getActiveChapter(frame);
  const isHook = activeChapter === 'babak1';
  const isAnalogy = activeChapter === 'babak2';
  const isSteps =
    activeChapter === 'step1' ||
    activeChapter === 'step2' ||
    activeChapter === 'step3' ||
    activeChapter === 'step4';
  const isOutro = activeChapter === 'outro';

  const stepIndex =
    activeChapter === 'step1'
      ? 0
      : activeChapter === 'step2'
        ? 1
        : activeChapter === 'step3'
          ? 2
          : activeChapter === 'step4'
            ? 3
            : 0;
  const currentStep = props.steps[stepIndex];

  const chapterStart = TIMELINE.clips[activeChapter].chapterStartFrame;
  const cardEnter = spring({
    frame: Math.max(0, frame - chapterStart),
    fps,
    config: {damping: 16},
  });

  const outroStart = TIMELINE.clips.outro.chapterStartFrame;
  const outroFade = interpolate(frame, [outroStart, outroStart + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{fontFamily: FONTS.body, pointerEvents: 'none'}}>
      {/* Selama cerita utama: watermark SE Lab lebih besar & terbaca jelas */}
      {!isOutro && (
        <div
          style={{
            position: 'absolute',
            top: safe.top - 110,
            left: safe.left,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 24px',
            borderRadius: 999,
            backgroundColor: palette.cardBg,
            border: `2px solid ${palette.cardBorder}`,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(8, 106, 212, 0.12)',
          }}
        >
          <Img
            src={staticFile(palette.mode === 'light' ? 'assets/se-logo.png' : 'assets/se-logo-vector.svg')}
            style={{width: 40, height: 44, objectFit: 'contain'}}
          />
          <span style={{fontSize: 28, fontWeight: 800, color: palette.headlineColor, letterSpacing: '-0.02em'}}>
            {BRAND_TOKENS.brand.instagram}
          </span>
        </div>
      )}

      {/* BABAK 1: HOOK */}
      {isHook && (
        <div
          style={{
            position: 'absolute',
            top: safe.top,
            left: safe.left,
            right: safe.right,
            transform: `translateY(${(1 - cardEnter) * 28}px)`,
            opacity: cardEnter,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: palette.orangeAccent,
              color: '#03254a',
              fontSize: 25,
              fontWeight: 800,
              marginBottom: 18,
            }}
          >
            RPL 101 · SERI SOFTWARE ENGINEERING
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 78,
              lineHeight: 1.12,
              fontWeight: 800,
              color: palette.headlineColor,
              letterSpacing: '-0.03em',
            }}
          >
            {props.hookPrefix}{' '}
            <span
              style={{
                display: 'inline-block',
                backgroundColor: palette.pillBg,
                color: palette.pillText,
                padding: '4px 22px',
                borderRadius: 18,
              }}
            >
              {props.hookHighlight}
            </span>{' '}
            {props.hookSuffix}
          </h1>
          <p
            style={{
              marginTop: 22,
              fontSize: 33,
              lineHeight: 1.4,
              fontWeight: 600,
              color: palette.subtitleColor,
              backgroundColor: palette.cardBg,
              border: `1.5px solid ${palette.cardBorder}`,
              padding: '20px 26px',
              borderRadius: 22,
              backdropFilter: 'blur(10px)',
            }}
          >
            {props.hookSubtitle}
          </p>
        </div>
      )}

      {/* BABAK 2: ANALOGI KODING VS REKAYASA */}
      {isAnalogy && (
        <>
          <div
            style={{
              position: 'absolute',
              top: safe.top,
              left: safe.left,
              right: safe.right,
              transform: `translateY(${(1 - cardEnter) * 24}px)`,
              opacity: cardEnter,
            }}
          >
            <div style={{display: 'flex', gap: 12, marginBottom: 16}}>
              <span
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  backgroundColor: palette.cardBg,
                  border: `1.5px solid ${palette.cardBorder}`,
                  color: palette.headlineColor,
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                Kiri: Asal Ngoding
              </span>
              <span
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  backgroundColor: palette.pillBg,
                  color: palette.pillText,
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                Kanan: Software Engineering
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 64,
                fontWeight: 800,
                color: palette.headlineColor,
                letterSpacing: '-0.03em',
              }}
            >
              {props.analogyTitle}
            </h2>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: safe.bottom,
              left: safe.left,
              right: safe.right,
              backgroundColor: palette.cardBg,
              border: `1.5px solid ${palette.cardBorder}`,
              borderRadius: 24,
              padding: '26px 30px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p style={{margin: 0, fontSize: 33, lineHeight: 1.42, fontWeight: 600, color: palette.subtitleColor}}>
              {props.analogySubtitle}
            </p>
          </div>
        </>
      )}

      {/* BABAK 3: 4 STASIUN SIKLUS RPL */}
      {isSteps && (
        <>
          <div
            style={{
              position: 'absolute',
              top: safe.top,
              left: safe.left,
              right: safe.right,
              transform: `translateY(${(1 - cardEnter) * 20}px)`,
              opacity: cardEnter,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                backgroundColor: palette.pillBg,
                color: palette.pillText,
                fontSize: 26,
                fontWeight: 800,
                padding: '10px 22px',
                borderRadius: 14,
                marginBottom: 16,
              }}
            >
              {currentStep.badge}
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 60,
                lineHeight: 1.14,
                fontWeight: 800,
                color: palette.headlineColor,
                letterSpacing: '-0.03em',
              }}
            >
              {currentStep.title}
            </h2>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: safe.bottom,
              left: safe.left,
              right: safe.right,
              backgroundColor: palette.cardBg,
              border: `1.5px solid ${palette.cardBorder}`,
              borderRadius: 24,
              padding: '26px 30px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p style={{margin: 0, fontSize: 33, lineHeight: 1.42, fontWeight: 600, color: palette.subtitleColor}}>
              {currentStep.subtitle}
            </p>
            <div style={{display: 'flex', gap: 10, marginTop: 20}}>
              {props.steps.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: 9,
                    borderRadius: 999,
                    backgroundColor:
                      idx <= stepIndex
                        ? idx === stepIndex
                          ? palette.orangeAccent
                          : palette.bluePrimary
                        : 'rgba(148, 163, 184, 0.35)',
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* BABAK 4: OUTRO LENGKAP 3 LOGO (UB + FILKOM + SE LAB) — Logo & Font Diperbesar */}
      {isOutro && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: outroFade,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: `${safe.top - 50}px ${safe.left}px ${safe.bottom - 70}px`,
          }}
        >
          {/* Top Institutional Pill: 3 Logo Lengkap Lebih Besar & Jelas */}
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                padding: '18px 36px',
                borderRadius: 999,
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: '2.5px solid rgba(186, 186, 186, 0.6)',
                boxShadow: '0 14px 36px rgba(8, 106, 212, 0.16)',
              }}
            >
              <Img src={staticFile('assets/ub-logo.png')} style={{width: 68, height: 68, objectFit: 'contain'}} />
              <Img src={staticFile('assets/filkom-logo.png')} style={{height: 60, objectFit: 'contain'}} />
              <Img src={staticFile('assets/se-logo.png')} style={{height: 66, objectFit: 'contain'}} />
            </div>
          </div>

          {/* Bottom Branding & CTA Card */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center'}}>
            <div
              style={{
                width: '100%',
                backgroundColor: palette.cardBg,
                border: `2px solid ${palette.cardBorder}`,
                borderRadius: 30,
                padding: '32px 34px',
                textAlign: 'center',
                backdropFilter: 'blur(14px)',
              }}
            >
              <p
                style={{
                  margin: '0 0 8px',
                  fontFamily: FONTS.display,
                  fontSize: 40,
                  lineHeight: 1.15,
                  color: BRAND_TOKENS.colors.brandExtras.headerWordmarkBlue,
                  letterSpacing: '0.02em',
                }}
              >
                SOFTWARE ENGINEERING
              </p>
              <p
                style={{
                  margin: '0 0 18px',
                  fontFamily: FONTS.display,
                  fontSize: 40,
                  lineHeight: 1.15,
                  color: palette.orangeAccent,
                  letterSpacing: '0.02em',
                }}
              >
                LABORATORY
              </p>
              <p style={{margin: '0 0 18px', fontSize: 34, fontWeight: 800, color: palette.headlineColor}}>
                {props.outroTagline}
              </p>
              {/* CTA Interaktif Ajak Komentar */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  backgroundColor: palette.orangeAccent,
                  color: '#03254a',
                  padding: '14px 24px',
                  borderRadius: 18,
                  fontSize: 27,
                  fontWeight: 800,
                  boxShadow: '0 8px 22px rgba(242, 159, 71, 0.35)',
                  transform: `scale(${1 + Math.sin((frame - outroStart) * 0.14) * 0.025})`,
                }}
              >
                <span>{props.outroCta}</span>
              </div>
            </div>

            {/* Footer Strip Navy #00024f dengan Logo SE & Font Lebih Besar */}
            <div
              style={{
                width: '100%',
                backgroundColor: palette.navyBar,
                borderRadius: 18,
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <Img src={staticFile('assets/se-logo-vector.svg')} style={{width: 36, height: 38}} />
                <span style={{color: '#f3f3f4', fontSize: 30, fontWeight: 700}}>se.lab.filkom</span>
              </div>
              <span style={{color: palette.orangeAccent, fontSize: 26, fontWeight: 800}}>FILKOM UB</span>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
