import React from 'react';
import { testimonials } from '../data';
import './TestimonialWall.css';

const TestimonialWall = () => {
  return (
    <section className="testimonial-section">
      <div className="section-header">
        <h2 className="section-title">Voices from the Line</h2>
        <p className="section-subtitle">Hear directly from the food and beverage workers we've been able to assist.</p>
      </div>
      
      <div className="testimonial-grid">
        {testimonials.map((t) => (
          <div key={t.id} className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="quote-text">{t.quote}</p>
            <div className="quote-author">
              <span className="author-name">{t.author}</span>
              <span className="author-role">{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialWall;
