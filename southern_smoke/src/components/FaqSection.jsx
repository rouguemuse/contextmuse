import React, { useState } from 'react';
import './FaqSection.css';

const faqs = [
  {
    question: "Who qualifies for this program?",
    answer: "We work to assist F+B workers in various roles within the industry. Some eligible positions include chefs, line cooks, barbacks, bartenders, servers, food runners, general managers, dishwashers, and shift supervisors. It can also include farmers and ranchers who provide to food service establishments, distillery workers, vineyard workers, beverage distributors, winemakers, sommeliers... the list goes on. Southern Smoke Foundation was created to support everyone who makes this industry possible."
  },
  {
    question: "Are business owners or self-employed workers eligible for help?",
    answer: "YES! We do not provide grants for business-related costs. Instead, we can assist individuals who own or operate F+B businesses with personal expenses if you have experienced an unforeseen crisis unrelated to your business. However, we determine the qualifying criteria based on your business. To ensure that your business meets our qualifications, we require proof of income and documentation that can help us verify your business. We also require all business owners to have been in operation for at least 12 months and must operate out of a commercial space. Once we receive your application and verify the information provided, we will open a case for you."
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-sidebar">
        <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>
      </div>
      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(index)}>
              <span>{faq.question}</span>
              <span className="faq-icon">{openIndex === index ? '×' : '+'}</span>
            </button>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
