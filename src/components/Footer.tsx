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
          <a href="tel:988" className="emergency-contact">
            <span className="phone-icon">📞</span>
            <span>988</span>
          </a>
        </div>
        
        <div className="footer-card adsense-card">
          <p>Advertisement Space</p>
        </div>
      </div>
    </footer>
  );
} 