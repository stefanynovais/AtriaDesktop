import './LiquidGlass.css';

function LiquidGlass({ children }) {
  return (
    <>
      <div className="liquid-glass">{children}</div>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="displacementFilter">
          <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="2" result="turbulence" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="200"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </>
  );
}

export default LiquidGlass;
