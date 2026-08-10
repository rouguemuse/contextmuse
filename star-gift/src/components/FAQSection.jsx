import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const faqs = [
    { 
      question: 'Is this a physical product?', 
      answer: 'No, this is a digital experience delivered as a private viewing link.' 
    },
    { 
      question: 'How do I provide messages?', 
      answer: 'After purchase, you receive a short personalization form.' 
    },
    { 
      question: 'How long does delivery take?', 
      answer: 'Typically within 24–48 hours.' 
    },
    { 
      question: 'Can this be viewed on mobile?', 
      answer: 'Yes, the experience is fully optimized for mobile devices.' 
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq">
      <div className="container">
        <h2 className="section-title text-center">Frequently asked questions</h2>
        <div className="faq-list glass-card fade-in">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button 
                className="faq-question" 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .faq {
          padding: 8rem 0;
          background: var(--navy);
        }

        .faq-list {
          max-width: 700px;
          margin: 4rem auto 0;
          padding: 1rem 0;
        }

        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1.15rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .faq-question:hover {
          color: var(--gold);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0, 1, 0, 1);
          padding: 0 2rem;
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
          padding: 0 2rem 2.5rem;
          transition: all 0.4s cubic-bezier(1, 0, 1, 0);
        }

        .faq-answer p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .faq-question { padding: 1.5rem; font-size: 1.05rem; }
          .faq-answer { padding: 0 1.5rem; }
          .faq-item.open .faq-answer { padding: 0 1.5rem 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default FAQSection;
