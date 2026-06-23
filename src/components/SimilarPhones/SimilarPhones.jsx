import PropTypes from 'prop-types';
import { useRef, useEffect, useCallback } from 'react';
import PhoneCard from '../PhoneCard/PhoneCard';
import './SimilarPhones.scss';

function SimilarPhones({ products }) {
  if (!products?.length) return null;

  const visible = products.slice(0, 5);
  const gridRef = useRef(null);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
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
    thumb.setAttribute('aria-valuenow', Math.round((grid.scrollLeft / scrollable) * 100));
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
  }, [updateThumb]);

  const handleThumbKeyDown = useCallback((e) => {
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

  const handleThumbMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = gridRef.current?.scrollLeft ?? 0;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
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

SimilarPhones.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      brand: PropTypes.string.isRequired,
      basePrice: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SimilarPhones;
