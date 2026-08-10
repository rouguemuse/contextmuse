import React from 'react';

const ExperienceSection = () => {
  return (
    <section className="experience">
      <div className="container">
        <div className="experience-grid">
          <div className="experience-content fade-in">
            <h2 className="section-title">A quiet constellation of meaning</h2>
            <p className="experience-copy">
              Some things are easier to feel than to say all at once.
              This experience lets your words unfold gradually.
              Each light reveals one message, creating a thoughtful and lasting way to show someone why they matter.
            </p>
          </div>
          <div className="experience-visual fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="constellation-showcase">
              {/* Star with message card 1 */}
              <div className="star-msg-pair p1">
                <div className="glow-star pulse-gold"></div>
                <div className="msg-card glass-card">
                  <p>“You make even the simplest moments feel extraordinary.”</p>
                </div>
              </div>
              
              {/* Star with message card 2 */}
              <div className="star-msg-pair p2">
                <div className="glow-star pulse-gold" style={{ animationDelay: '1s' }}></div>
                <div className="msg-card glass-card">
                  <p>“Thank you for being my constant light.”</p>
                </div>
              </div>

              {/* Decorative stars */}
              <div className="tiny-star t1"></div>
              <div className="tiny-star t2"></div>
              <div className="tiny-star t3"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .experience {
          padding: 10rem 0;
          background: rgba(10, 14, 26, 0.5);
        }
        
        .experience-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.8fr;
          align-items: center;
          gap: 6rem;
        }

        .section-title {
          font-size: 2.8rem;
          margin-bottom: 2rem;
        }

        .experience-copy {
          font-size: 1.2rem;
          color: var(--text-secondary);
          max-width: 440px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .constellation-showcase {
          position: relative;
          height: 400px;
        }

        .star-msg-pair {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .p1 { top: 0; left: 10%; }
        .p2 { bottom: 0; right: 10%; }

        .glow-star {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 15px 4px var(--gold-soft);
        }

        .pulse-gold {
          animation: pulse 4s infinite ease-in-out;
        }

        .msg-card {
          width: 240px;
          padding: 1.5rem;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.1rem;
          transform: translateY(10px);
          opacity: 0.9;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .msg-card p {
          margin: 0;
          color: var(--text-primary);
        }

        .tiny-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
        }

        .t1 { top: 20%; right: 40%; }
        .t2 { bottom: 30%; left: 30%; }
        .t3 { top: 50%; right: 20%; }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        @media (max-width: 1024px) {
          .experience-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 4rem;
          }
          .experience-copy { margin: 0 auto; }
          .star-msg-pair { position: static; margin: 2rem auto; }
          .constellation-showcase { height: auto; display: flex; flex-direction: column; }
        }
      `}</style>
    </section>
  );
};

export default ExperienceSection;
