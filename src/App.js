import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Register the TextPlugin
gsap.registerPlugin(TextPlugin);

const carouselImages = [
  'light1.png',
  'light2.png',
  'light3.png',
  'light4.png',
  'light5.png',
];

/** HangingLight now supports both incoming and outgoing animations */
function HangingLight({ image, animateKey, prevImage, prevKey, imgStyle, className }) {
  return (
    <>
      {prevImage && (
        <div className="hanging-light-outer leave-animate" key={prevKey}>
          <div className="hanging-cord"></div>
          <img
            src={process.env.PUBLIC_URL + '/' + prevImage}
            alt="Previous Light"
            className={`hanging-light-img ${className}`}
            style={imgStyle}
          />
        </div>
      )}
      <div className="hanging-light-outer drop-animate" key={animateKey}>
        <div className="hanging-cord"></div>
        <img
          src={process.env.PUBLIC_URL + '/' + image}
          alt="Selected Light"
          className={`hanging-light-img ${className}`}
          style={imgStyle}
        />
      </div>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
function Carousel3D({ active, setActive }) {
  const total = carouselImages.length;
  const next = () => setActive((prev) => (prev + 1) % total);
  const prev = () => setActive((prev) => (prev - 1 + total) % total);
  const getDisplayIndices = () => {
    const left = (active - 1 + total) % total;
    const right = (active + 1) % total;
    return [left, active, right];
  };
  const displayIndices = getDisplayIndices();

  return (
    <div className="carousel-3d arc">
      <button className="carousel-arrow left" onClick={prev}>{'<'}</button>
      <div className="carousel-track arc">
        {carouselImages.map((img, idx) => {
          let style = {
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 0,
            transform: 'translateX(-50%)',
            transition: 'transform 0.5s cubic-bezier(.4,2,.6,1), opacity 0.4s',
            willChange: 'transform, opacity'
          };

          if (idx === displayIndices[1]) {
            style = {
              ...style,
              transform: 'translateX(-50%) translateY(40px) scale(1.1)',
              zIndex: 2,
              opacity: 1,
              pointerEvents: 'auto',
              boxShadow: '0 8px 32px #0002',
              cursor: 'pointer'
            };
          } else if (idx === displayIndices[0]) {
            style = {
              ...style,
              transform: 'translateX(calc(-50% - 150px)) translateY(-30px) scale(0.9) rotate(-18deg)',
              zIndex: 1,
              opacity: 1,
              pointerEvents: 'auto',
              cursor: 'pointer'
            };
          } else if (idx === displayIndices[2]) {
            style = {
              ...style,
              transform: 'translateX(calc(-50% + 150px)) translateY(-30px) scale(0.9) rotate(18deg)',
              zIndex: 1,
              opacity: 1,
              pointerEvents: 'auto',
              cursor: 'pointer'
            };
          }

          return (
            <img
              key={img}
              src={process.env.PUBLIC_URL + '/' + img}
              alt="Product"
              className="carousel-img arc"
              style={style}
              onClick={() => setActive(idx)}
            />
          );
        })}
      </div>
      <button className="carousel-arrow right" onClick={next}>{'>'}</button>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
const products = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D29A89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="6"/><line x1="12" y1="6" x2="12" y2="12"/></svg>
    ),
    name: 'Modern Pendant Light',
    desc: 'Elegant design with warm LED lighting',
    price: '$199.99',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D29A89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    ),
    name: 'Smart LED Bulb',
    desc: 'Voice-controlled, energy-efficient lighting',
    price: '$49.99',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D29A89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="7" rx="6" ry="3"/><path d="M6 7v2c0 1.66 2.69 3 6 3s6-1.34 6-3V7"/><path d="M6 11v2c0 1.66 2.69 3 6 3s6-1.34 6-3v-2"/></svg>
    ),
    name: 'Crystal Chandelier',
    desc: 'Luxurious statement piece for your home',
    price: '$599.99',
  },
];

// eslint-disable-next-line no-unused-vars
function Toggle({ checked, onChange, label }) {
  return (
    <label className={`toggle-switch${checked ? ' checked' : ''}`}> 
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider" />
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
}

// eslint-disable-next-line no-unused-vars
function ProductCarousel({ products }) {
  const ref = React.useRef();
  const cardRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 4;
  const cardWidth = 200;
  const cardGap = 40;

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, products.length);
    
    cardRefs.current.forEach((card, index) => {
      if (card) {
        const title = card.querySelector('h3');
        const desc = card.querySelector('p');
        const price = card.querySelector('.price');
        
        gsap.fromTo([title, desc, price], 
          { 
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            delay: index * 0.2
          }
        );
      }
    });
  }, [products]);

  const scrollToIndex = (index) => {
    if (ref.current) {
      const maxIndex = Math.max(0, products.length - cardsPerView);
      const newIndex = Math.min(Math.max(0, index), maxIndex);
      setCurrentIndex(newIndex);
      
      const scrollPosition = newIndex * (cardWidth + cardGap);
      ref.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  return (
    <div className="product-carousel-outer">
      <button 
        className="carousel-arrow left" 
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        {'<'}
      </button>
      <div className="product-grid horizontal" ref={ref}>
        {products.map((prod, idx) => (
          <div 
            className="product-card" 
            key={idx}
            ref={el => cardRefs.current[idx] = el}
            style={{ width: 200, height: 200 }}
          >
            <div className="product-image">{prod.icon}</div>
            <div className="product-info">
              <h3>{prod.name}</h3>
              <p>{prod.desc}</p>
              <span className="price">{prod.price}</span>
            </div>
          </div>
        ))}
      </div>
      <button 
        className="carousel-arrow right" 
        onClick={handleNext}
        disabled={currentIndex >= products.length - cardsPerView}
      >
        {'>'}
      </button>
    </div>
  );
}

/**
 * Animated thumbnail carousel: only the entering and leaving items animate, not the whole row.
 */
function ThumbnailCarousel({ images, active, setActive }) {
  const visibleCount = 5;
  const buffer = 1;
  const renderCount = visibleCount + 2 * buffer; // 7
  const total = images.length;
  const [offset, setOffset] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  // Get 7 indices: 1 buffer left, 5 visible, 1 buffer right
  const getIndices = () => {
    const indices = [];
    const start = active - Math.floor(visibleCount / 2) - buffer;
    for (let i = 0; i < renderCount; i++) {
      indices.push((start + i + total) % total);
    }
    return indices;
  };
  const indices = getIndices();

  // Animate left/right
  const slide = (dir) => {
    if (animating) return;
    setOffset(dir);
    setAnimating(true);
    setTimeout(() => {
      setActive((prev) => (prev + dir + total) % total);
      setOffset(0);
      setAnimating(false);
    }, 400);
  };

  // Calculate translateX so the 1st fully visible image (index 1) is at the left edge
  const getTranslateX = () => {
    const thumbWidth = 260;
    const gap = 56;
    const itemSize = thumbWidth + gap;
    // Shift so the 1st fully visible image (index 1 of 7) is at the left edge
    return `translateX(${-itemSize * (buffer - offset)}px)`;
  };

  return (
    <div className="thumb-carousel-outer">
      <button className="carousel-arrow left" onClick={() => slide(-1)} disabled={animating}>{'<'}</button>
      <div className="carousel-track" style={{ transform: getTranslateX() }}>
        {indices.map((idx, i) => (
          <div className="thumbnail-wrapper" key={images[idx] + '-' + i}>
            <div className="thumbnail-card">
              <img
                src={process.env.PUBLIC_URL + '/' + images[idx]}
                alt={`Light thumbnail ${idx + 1}`}
                className={`light-thumb big-thumb${active === idx ? ' selected' : ''}`}
                onClick={() => setActive(idx)}
              />
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-arrow right" onClick={() => slide(1)} disabled={animating}>{'>'}</button>
    </div>
  );
}

function App() {
  const [active, setActive] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);
  const [prevImage, setPrevImage] = useState(null);
  const [prevKey, setPrevKey] = useState(0);
  const titleRef = useRef(null);

  useEffect(() => {
    setAnimateKey((k) => k + 1);
  }, [active]);

  useEffect(() => {
    if (animateKey > 0) {
      const prevIndex = active === 0 ? carouselImages.length - 1 : active - 1;
      setPrevImage(carouselImages[prevIndex]);
      setPrevKey(animateKey + 1000);
      const timeout = setTimeout(() => setPrevImage(null), 900);
      return () => clearTimeout(timeout);
    }
  }, [animateKey, active]);

  useEffect(() => {
    if (titleRef.current) {
      const lines = titleRef.current.querySelectorAll('.title-line');
      
      // Initial animation
      gsap.fromTo(lines,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out"
        }
      );

      // Scramble text animation on hover
      lines.forEach((line, index) => {
        const originalText = line.textContent;
        
        line.addEventListener('mouseenter', () => {
          gsap.to(line, {
            duration: 0.5,
            scrambleText: {
              text: originalText,
              chars: "!@#$%^&*()",
              speed: 0.3,
              revealDelay: 0.1,
              tweenLength: false
            },
            scale: 1.05,
            color: '#D29A89',
            ease: "power2.out"
          });
        });

        line.addEventListener('mouseleave', () => {
          gsap.to(line, {
            duration: 0.5,
            scrambleText: {
              text: originalText,
              chars: "!@#$%^&*()",
              speed: 0.3,
              revealDelay: 0.1,
              tweenLength: false
            },
            scale: 1,
            color: '#fff',
            ease: "power2.out"
          });
        });
      });

      // Cleanup event listeners
      return () => {
        lines.forEach(line => {
          line.removeEventListener('mouseenter', () => {});
          line.removeEventListener('mouseleave', () => {});
        });
      };
    }
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-logo">
          Luminous Lights
        </div>
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-icons">
            <svg className="icon cart" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D29A89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/></svg>
          </div>
        </div>
      </nav>
      <section className="hero" id="home" style={{ minHeight: '100vh', width: '100vw' }}>
        <div className="main-content" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: '2.5rem', marginBottom: '2.5rem', justifyContent: 'center' }}>
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minWidth: 576 }}>
              <HangingLight
                image={carouselImages[active]}
                animateKey={animateKey}
                prevImage={prevImage}
                prevKey={prevKey}
                className={([0, 1, 4].includes(active)) ? 'large' : ''}
              />
            </div>
            <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 340, paddingLeft: '5rem' }}>
              <div ref={titleRef} className="main-card-title" style={{ textAlign: 'center', whiteSpace: 'pre-line', textTransform: 'uppercase', fontFamily: 'Italiana, sans-serif', fontSize: '5.4rem', fontWeight: 200, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', marginTop: '-3rem' }}>
                <div className="title-line" style={{ cursor: 'pointer', color: '#fff' }}>Warm lights</div>
                <div className="title-line" style={{ cursor: 'pointer', color: '#fff' }}>warmer memories.</div>
                <div style={{ width: '80%', height: '3px', background: '#fff', margin: '1.2rem auto 0 auto', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '30px', width: '100%' }}>
            <ThumbnailCarousel images={carouselImages} active={active} setActive={setActive} />
          </div>
        </div>
      </section>
      <footer className="footer"></footer>
    </div>
  );
}

export default App;