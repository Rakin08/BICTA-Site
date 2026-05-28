import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VisionCTAProps {
  onNavigate: (id: string) => void;
}

export default function VisionCTA({ onNavigate }: VisionCTAProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const w1Ref = useRef<HTMLDivElement>(null);
  const w2Ref = useRef<HTMLDivElement>(null);
  const w3Ref = useRef<HTMLDivElement>(null);
  const w4Ref = useRef<HTMLDivElement>(null);
  const w5Ref = useRef<HTMLDivElement>(null);
  const of1Ref = useRef<HTMLDivElement>(null);
  const blurStripRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cursorTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = w4Ref.current;
    if (!el) return;

    // Typewriter effect
    const typeEffect = (element: HTMLElement, text: string, speed = 80) => {
      element.textContent = '';
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);
      return timer;
    };

    const textTimer = typeEffect(el, 'Bangladesh');

    // Cursor blink
    const cursorBlink = (intervalTime = 530) => {
      let visible = true;
      const cursorTimer = setInterval(() => {
        if (el) {
          el.style.borderRightColor = visible ? 'transparent' : '#c9a84c';
        }
        visible = !visible;
      }, intervalTime);
      cursorTimerRef.current = cursorTimer;
      return cursorTimer;
    };
    cursorBlink();

    return () => {
      clearInterval(textTimer);
      if (cursorTimerRef.current) clearInterval(cursorTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current || !containerRef.current || !stageRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: stageRef.current,
      },
    });

    tl.from(w1Ref.current, {
      x: '-100vw',
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    })
    .from(w2Ref.current, {
      x: '100vw',
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.4')
    .from(w3Ref.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }, '-=0.4')
    .from(of1Ref.current, {
      height: '0',
      duration: 0.6,
      ease: 'power2.inOut',
    }, '-=0.4')
    .to(blurStripRef.current, {
      width: '120%',
      opacity: 0.4,
      duration: 0.5,
    }, '-=0.3')
    .from(w4Ref.current, {
      opacity: 0,
      duration: 0.5,
    }, '-=0.2')
    .from(w5Ref.current, {
      y: '30vh',
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.3')
    .from(ctaRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.5,
    }, '-=0.2');

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      tl.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={wrapperRef} id="vision" className="vision-wrapper">
      <div
        ref={containerRef}
        className="vision-container"
        style={{
          height: '400vh',
          background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          ref={stageRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {/* Typography */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Playfair Display', serif",
              fontSize: '6vw',
              color: '#faf8f3',
              textShadow: '0 0 20px rgba(201,168,76,0.1)',
              fontWeight: 400,
              lineHeight: 0.9,
            }}
          >
            <div
              ref={w1Ref}
              className="word"
              style={{ position: 'absolute', whiteSpace: 'nowrap', marginRight: '18vw', marginBottom: '15vh' }}
            >
              Shaping
            </div>
            <div
              ref={w2Ref}
              className="word"
              style={{ position: 'absolute', whiteSpace: 'nowrap', marginLeft: '15vw', marginTop: '5vh' }}
            >
              the Future
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                marginTop: '10vh',
              }}
            >
              <div
                ref={w3Ref}
                style={{ fontSize: '20vw', opacity: 0.04 }}
              >
                of
              </div>
              <div
                ref={of1Ref}
                style={{
                  backgroundColor: '#c9a84c',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: 0,
                  width: '0.15vw',
                  height: 0,
                  marginRight: '-5vw',
                }}
              />
            </div>
            <div
              ref={w4Ref}
              style={{
                whiteSpace: 'nowrap',
                marginTop: '25vh',
                fontSize: '4.5vw',
                borderRight: '2px solid #c9a84c',
                paddingRight: '0.5vw',
                position: 'relative',
              }}
            />
            <div
              ref={w5Ref}
              className="word"
              style={{
                position: 'absolute',
                whiteSpace: 'nowrap',
                marginLeft: '20vw',
                marginTop: '20vh',
                fontSize: '8vw',
              }}
            >
              Tech.
            </div>
          </div>

          {/* Blur Strip */}
          <div
            ref={blurStripRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: 2,
              background: 'rgba(201,168,76,0.2)',
              filter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          />

          {/* CTA */}
          <div
            ref={ctaRef}
            style={{
              position: 'absolute',
              bottom: '10vh',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            <h3
              className="font-display font-medium text-[#faf8f3] mb-3"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Join the Movement
            </h3>
            <p className="font-body font-light text-[#e0ddd5] mb-6" style={{ fontSize: '1.125rem' }}>
              Applications for our next cohort are now open. Limited seats.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] bg-[#c9a84c] text-[#0a0a0a] px-10 py-4 transition-all duration-250 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(201,168,76,0.3)]"
            >
              Apply Now
            </button>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .vision-container > div > div {
              font-size: 10vw !important;
            }
            .vision-container [style*="font-size: 20vw"] {
              font-size: 30vw !important;
            }
            .vision-container [style*="font-size: 8vw"] {
              font-size: 12vw !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
