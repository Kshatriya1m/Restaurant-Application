import React, { useState, useEffect } from "react";

const FullWidthCarousel = ({ dishes = [], category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Filter dishes by category AND only those with isOffer === true
  const filteredSlides = dishes.filter(
    (dish) => dish.category === category && dish.isOffer
  );

  useEffect(() => {
    if (filteredSlides.length === 0) return;

    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredSlides.length);
        setAnimating(false);
      }, 700);
    }, 4000);

    return () => clearInterval(interval);
  }, [filteredSlides.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [category]);

  if (filteredSlides.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.carouselContainer}>
        {filteredSlides.map((slide, index) => {
          let translateX = "100%";
          let zIndex = 0;
          let opacity = 0;
          let transition = "none";

          if (index === currentIndex) {
            translateX = animating ? "-100%" : "0";
            zIndex = 2;
            opacity = 1;
            transition = "transform .7s ease";
          } else if (index === (currentIndex + 1) % filteredSlides.length) {
            translateX = animating ? "0" : "100%";
            zIndex = 1;
            opacity = 1;
            transition = "transform .7s ease";
          }

          const name = slide.title || slide.name || "Dish";
          const price = slide.price ?? 0;
          const offerPrice = slide.offerPrice ?? price;

          return (
            <div
              key={slide._id || slide.id}
              style={{
                ...styles.slide,
                transform: `translateX(${translateX})`,
                zIndex,
                opacity,
                transition,
              }}
            >
              <img
                src={slide.imageUrl || slide.image}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={styles.caption}>
                <h2 style={{ fontWeight: "bold", fontSize: "1.25rem" }}>{name}</h2>
                {slide.isOffer ? (
                  <p>
                    <span
                      style={{
                        textDecoration: "line-through",
                        marginRight: "0.5rem",
                        color: "#af8a8aff",
                      }}
                    >
                      ₹{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span style={{ fontWeight: "bold" }}>
                      ₹{offerPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </p>
                ) : (
                  <p>₹{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100%",
    margin: "0 auto",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "82vw",
    height: "200px",
    overflow: "hidden",
    margin: "0 auto",
    borderRadius: "20px",
  },
  slide: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    color: "white",
    padding: "1rem 2rem",
    boxSizing: "border-box",
    backgroundColor: "#00000066",
    borderRadius: "20px",
  },
  caption: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    maxWidth: "400px",
  },
};

export default FullWidthCarousel;
