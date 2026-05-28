import { useRef, useState, useEffect, useCallback } from 'react';

const lettersAndSymbols = 'ABCDEFGHIJKLMNOPRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

interface AlumniItem {
  name: string;
  role: string;
  company: string;
}

interface ShuffleFX {
  el: HTMLDivElement;
  role: string;
  company: string;
  word: string;
  originalWord: string;
  totalItems: number;
  scrollTimeout: ReturnType<typeof setTimeout> | undefined;
  scrollTimer: ReturnType<typeof setInterval> | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
  timer2: ReturnType<typeof setInterval> | undefined;
  timer3: ReturnType<typeof setInterval> | undefined;
  timer4: ReturnType<typeof setTimeout> | undefined;
  enterHandler: (() => void) | null;
  leaveHandler: (() => void) | null;
}

class ShuffleFXClass implements ShuffleFX {
  el: HTMLDivElement;
  role: string;
  company: string;
  totalItems: number;
  scrollTimeout: ReturnType<typeof setTimeout> | undefined;
  scrollTimer: ReturnType<typeof setInterval> | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
  timer2: ReturnType<typeof setInterval> | undefined;
  timer3: ReturnType<typeof setInterval> | undefined;
  timer4: ReturnType<typeof setTimeout> | undefined;
  enterHandler: (() => void) | null = null;
  leaveHandler: (() => void) | null = null;
  word: string = '';
  originalWord: string = '';

  constructor(el: HTMLDivElement, role: string, company: string) {
    this.el = el;
    this.role = role;
    this.company = company;
    this.totalItems = 1;
  }

  init(results: { currentWord: string[] }, _rows: number, totalItems: number, delay = 0) {
    this.word = results.currentWord.join('');
    this.originalWord = this.word;
    this.totalItems = totalItems;
    this.startAuto(delay);
  }

  initEventListeners() {
    this.enterHandler = () => this.startShuffle();
    this.leaveHandler = () => this.stopShuffle();
    this.el.addEventListener('mouseenter', this.enterHandler);
    this.el.addEventListener('mouseleave', this.leaveHandler);
  }

  startAuto(delay: number) {
    this.clearTimers();
    this.timer = setTimeout(() => {
      this.startShuffle();
      this.timer2 = setInterval(() => this.startShuffle(), 2000);
    }, delay * 1000 + 1000);
  }

  stopAuto() {
    this.clearTimers();
  }

  clearTimers() {
    if (this.timer) clearTimeout(this.timer);
    if (this.timer2) clearInterval(this.timer2);
    if (this.timer3) clearInterval(this.timer3);
    if (this.timer4) clearTimeout(this.timer4);
  }

  generateInitialWord(rows = 4): Promise<{ currentWord: string[] }> {
    return new Promise((resolve) => {
      let generatedWord = '';

      if (this.word) {
        resolve({ currentWord: Array.from(this.word) });
        return;
      }

      const generateRow = (rowIndex: number) => {
        let delay: number, iterations: number, finalChar: string;

        if (rowIndex === 0) {
          delay = 100;
          iterations = 15;
          finalChar = this.role.charAt(0) || 'E';
        } else if (rowIndex === rows - 1) {
          delay = 80;
          iterations = 10;
          finalChar = this.company.charAt(0) || 'T';
        } else {
          delay = 60;
          iterations = 8;
          finalChar = lettersAndSymbols.charAt(Math.floor(Math.random() * 26));
        }

        let iterationCount = 0;
        const timer = setInterval(() => {
          if (iterationCount < iterations) {
            generatedWord += lettersAndSymbols.charAt(Math.floor(Math.random() * lettersAndSymbols.length));
            iterationCount++;
          } else {
            clearInterval(timer);
            generatedWord += finalChar;
            if (rowIndex < rows - 1) {
              generateRow(rowIndex + 1);
            } else {
              resolve({ currentWord: Array.from(generatedWord) });
            }
          }
        }, delay);
      };

      generateRow(0);
    });
  }

  startShuffle() {
    this.clearTimers();
    this.shuffle();
  }

  shuffle() {
    const duration = 0.3;
    const interval = 30;
    const totalIterations = Math.ceil(duration * 1000 / interval);
    const wordArray = Array.from(this.originalWord);
    const charSets: [number, number][] = [[0, 26], [26, 52], [52, 62]];
    let iteration = 0;

    this.timer3 = setInterval(() => {
      let displayWord = '';

      for (let pos = 0; pos < wordArray.length; pos++) {
        if (iteration >= totalIterations && pos >= wordArray.length - 1) {
          displayWord += wordArray[pos];
        } else {
          const setIndex = Math.floor(Math.random() * charSets.length);
          const [start, end] = charSets[setIndex];
          displayWord += lettersAndSymbols.slice(start, end).charAt(Math.floor(Math.random() * (end - start)));
        }
      }

      this.updateText(displayWord, iteration / totalIterations, charSets);
      iteration++;

      if (iteration > totalIterations) {
        if (this.timer3) clearInterval(this.timer3);
        this.originalWord = this.word;
      }
    }, interval);
  }

  updateText(text: string, progress: number, _charSets: [number, number][]) {
    this.el.dataset.text = text;
    const nameEl = this.el.querySelector(':scope > div:first-child > div') as HTMLElement;
    if (!nameEl) return;
    nameEl.textContent = text;
    const hue = 42 + Math.floor(progress * 8);
    const sat = 50 + Math.floor(progress * 10);
    nameEl.style.color = `hsl(${hue}, ${sat}%, ${50 + Math.floor(progress * 40)}%)`;
  }

  stopShuffle() {
    this.clearTimers();
    const text = this.word;
    const nameEl = this.el.querySelector(':scope > div:first-child > div') as HTMLElement;
    if (nameEl) {
      nameEl.textContent = text;
      nameEl.style.color = '#faf8f3';
    }
    this.startAuto(0.7);
  }

  destroy() {
    this.clearTimers();
    if (this.enterHandler) this.el.removeEventListener('mouseenter', this.enterHandler);
    if (this.leaveHandler) this.el.removeEventListener('mouseleave', this.leaveHandler);
  }
}

interface VerticalShuffleCarouselProps {
  items: AlumniItem[];
}

export default function VerticalShuffleCarousel({ items }: VerticalShuffleCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const cacheRef = useRef<Map<string, { currentWord: string[] }>>(new Map());

  const handleInit = useCallback((el: HTMLDivElement, item: AlumniItem, index: number) => {
    if (!el) return;
    const fx = new ShuffleFXClass(el, item.role, item.company);
    (el as any).fx = fx;

    const word = item.name;
    const cached = cacheRef.current.get(word);

    if (cached) {
      fx.init(cached, 4, items.length, index * 0.1);
    } else {
      fx.generateInitialWord(4).then((results) => {
        cacheRef.current.set(word, results);
        fx.init(results, 4, items.length, index * 0.1);
      });
    }

    fx.initEventListeners();
  }, [items.length]);

  useEffect(() => {
    return () => {
      const shufflers = containerRef.current?.querySelectorAll('.shuffler');
      shufflers?.forEach((el) => {
        const fx = (el as any).fx as ShuffleFXClass;
        if (fx) fx.destroy();
      });
    };
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center py-16"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="w-full max-w-2xl border border-[rgba(201,168,76,0.2)] p-4 md:p-6 flex flex-col gap-1 md:gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="group relative flex items-center justify-between border-b border-[rgba(201,168,76,0.1)] pb-1 md:pb-2 last:border-0 cursor-pointer"
            data-word={item.name}
            data-rows="4"
            data-delay={index * 0.1}
            data-is-hovering={isHovering}
            ref={(el) => {
              if (el && !(el as any).fx) {
                handleInit(el, item, index);
              }
            }}
          >
            <div className="relative overflow-hidden h-10 md:h-12 flex items-center">
              <div
                className="text-xl md:text-2xl font-normal text-[#faf8f3]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.name}
              </div>
            </div>
            <div className="flex gap-2 md:gap-4 text-xs md:text-sm text-[#8a8680]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span>{item.role}</span>
              <span>@ {item.company}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
