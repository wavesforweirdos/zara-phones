import { useRef, useEffect, useCallback } from 'react';
import type { KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import PhoneCard from '../PhoneCard/PhoneCard';
import type { PhoneSummary } from '../../types/phone';
import './SimilarPhones.scss';

interface SimilarPhonesProps {
  products?: PhoneSummary[];
}

function SimilarPhones({ products }: SimilarPhonesProps) {
  const hasProducts = Boolean(products?.length);
  const visible = products?.slice(0, 5) ?? [];
  const gridRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const updateThumb = useCallback(() => {
    const grid = gridRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!grid || !thumb || !track) return;

    const scrollable = grid.scrollWidth - grid.clientWidth;
    if (scrollable <= 0) {
      track.style.visibility = 'hidden';
      return;
    }
    track.style.visibility = '';

    const trackWidth = track.clientWidth;
    const factor = window.innerWidth >= 768 ? 0.25 : 1;
    const thumbWidth = Math.max((grid.clientWidth / grid.scrollWidth) * factor * trackWidth, 40);
    const maxLeft = trackWidth - thumbWidth;
    const thumbLeft = (grid.scrollLeft / scrollable) * maxLeft;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${thumbLeft}px)`;
    thumb.setAttribute('aria-valuenow', String(Math.round((grid.scrollLeft / scrollable) * 100)));
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    updateThumb();
    grid.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);
    return () => {
      grid.removeEventListener('scroll', updateThumb);
      window.removeEventListener('resize', updateThumb);
    };
    // hasProducts: the grid only exists (and needs listeners) once there is something to show
  }, [updateThumb, hasProducts]);

  const handleThumbKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    if (!grid) return;
    const card = grid.firstElementChild;
    const step = card ? card.getBoundingClientRect().width : grid.clientWidth * 0.3;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      grid.scrollBy({ left: step, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      grid.scrollBy({ left: -step, behavior: 'smooth' });
    } else if (e.key === 'Home') {
      e.preventDefault();
      grid.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
      e.preventDefault();
      grid.scrollTo({ left: maxScroll, behavior: 'smooth' });
    }
  }, []);

  const handleThumbMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = gridRef.current?.scrollLeft ?? 0;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const grid = gridRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!grid || !track || !thumb) return;

      const dx = e.clientX - dragStartX.current;
      const maxLeft = track.clientWidth - thumb.clientWidth;
      const maxScroll = grid.scrollWidth - grid.clientWidth;
      if (maxLeft <= 0) return;
      grid.scrollLeft = Math.max(
        0,
        Math.min(maxScroll, dragStartScroll.current + (dx / maxLeft) * maxScroll)
      );
    };
    const onUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Early return only after every hook, so the hook order is the same on every render
  if (!hasProducts) return null;

  return (
    <section className="similar-phones">
      <h2 className="similar-phones__title">Similar items</h2>
      <div className="similar-phones__scrollbar-track" ref={trackRef}>
        <div
          className="similar-phones__scrollbar-thumb"
          ref={thumbRef}
          role="scrollbar"
          tabIndex={0}
          aria-controls="similar-phones-list"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-label="Desplazar productos similares"
          onMouseDown={handleThumbMouseDown}
          onKeyDown={handleThumbKeyDown}
        />
      </div>
      <ul
        id="similar-phones-list"
        className="similar-phones__grid"
        ref={gridRef}
        aria-label="Productos similares"
      >
        {visible.map((phone) => (
          <li key={phone.id}>
            <PhoneCard
              id={phone.id}
              name={phone.name}
              brand={phone.brand}
              price={phone.basePrice}
              imageUrl={phone.imageUrl}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SimilarPhones;
