export default function Footer() {
  return (
    <footer className="glass-footer">
      <div className="footer-content">
        <div className="footer-card support-card">
          <p className="support-text">Want personalized coping tools?</p>
          <a href="#" className="stillzone-btn">Visit StillZone</a>
        </div>
        
        <div className="footer-card emergency-card">
          <p className="emergency-text">Need emergency support?</p>
          <div className="emergency-contact-text">
            <span className="phone-icon">📞</span>
            <span className="helpline-number">1800-599-0019</span>
            <button 
              className="copy-button" 
              onClick={() => navigator.clipboard.writeText('1800-599-0019')}
              title="Copy number"
            >
              📋
            </button>
          </div>
        </div>
        
        <div className="footer-card adsense-card">
          <p>Advertisement Space</p>
        </div>
      </div>
    </footer>
  );
} 