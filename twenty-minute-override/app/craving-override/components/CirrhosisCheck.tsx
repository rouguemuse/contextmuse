'use client';

export default function CirrhosisCheck() {
  return (
    <div className="card-danger">
      <h3 style={{ color: 'var(--danger)', marginBottom: 10, fontSize: '1rem' }}>
        Cirrhosis Reality Check
      </h3>
      <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--off-white)' }}>
        Cirrhosis changes the stakes. Alcohol is not a low-consequence choice anymore. A liver with cirrhosis cannot recover what it has already lost — but it can lose more. This is not about being perfect. It is about protecting whatever function remains and getting medical help when you need it.
      </p>
      <p style={{ marginTop: 12, fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>
        If you are in active withdrawal — shaking, sweating, confused, racing heart — do not wait. Go to urgent care or call 911. Alcohol withdrawal with liver disease can be fatal.
      </p>
      <a
        href="tel:18006624357"
        style={{
          display: 'inline-block',
          marginTop: 12,
          color: 'var(--danger)',
          fontWeight: 700,
          fontSize: '1rem',
          textDecoration: 'none',
        }}
      >
        SAMHSA: 1-800-662-4357
      </a>
    </div>
  );
}
