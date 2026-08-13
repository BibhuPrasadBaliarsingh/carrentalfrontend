import { useEffect } from 'react'
import { useLoader } from '../context/LoaderContext'
import { useSeoHead } from '../hooks/useSeoHead'

export function TermsPage() {
  const { setIsPageLoading } = useLoader()

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])

  return (
    <div style={{ minHeight: '70vh', padding: '40px 24px', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 28 }}>
        <h1 style={{ marginTop: 0 }}>Terms & Conditions</h1>
        
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>1. Booking & Reservation</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>All bookings are subject to verification, vehicle availability, and the agreed rental terms. A valid government-issued ID and driving license are required for all customers. Customers must be at least 21 years old to rent a vehicle.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>2. Advance Booking Payment & Charges</h2>
          <div style={{ background: '#1f2937', border: '1px solid #ef4444', borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <ul style={{ color: '#d1d5db', lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
              <li><strong>Advance Booking Amount:</strong> ₹200 (mandatory to confirm your booking).</li>
              <li>The ₹200 advance payment will be adjusted towards your total rental amount at the time of final payment.</li>
              <li>Doorstep Delivery or Airport Pickup is available at an additional charge of ₹250.</li>
              <li>The ₹250 delivery/pickup charge is not included in the online advance payment and will not be charged during booking.</li>
              <li>If you choose either of these services, the ₹250 charge will be collected at the time of vehicle handover.</li>
            </ul>
            <div style={{ marginTop: 12, color: '#fde047', fontSize: 13, background: 'rgba(234, 179, 8, 0.1)', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(234, 179, 8, 0.25)', lineHeight: 1.5 }}>
              💡 <strong>Note:</strong> The ₹200 advance payment secures your booking and is deducted from your final rental bill. Delivery or airport pickup charges, if applicable, are payable separately during vehicle handover.
            </div>
          </div>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>By booking with Speed Toyz Cars, you agree to:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8, margin: 0 }}>
            <li>Pay the full rental amount as per the agreed rate</li>
            <li>Provide accurate personal and payment information</li>
            <li>Accept full responsibility for the vehicle during the rental period</li>
            <li>Return the vehicle in the same condition as received</li>
            <li>Pay for any additional services (fuel, tolls, parking) incurred during rental</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>3. Kilometer Limits & Driving Range</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>Each rental package includes a specified driving kilometer limit based on duration:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 12, marginBottom: 12 }}>
            <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ color: '#ef4444', fontWeight: 800, fontSize: 15 }}>⏱️ 6 Hours Rental</div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginTop: 4 }}>150 km</div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>Included Distance Range</div>
            </div>
            <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ color: '#ef4444', fontWeight: 800, fontSize: 15 }}>⏱️ 12 Hours Rental</div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginTop: 4 }}>200 km</div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>Included Distance Range</div>
            </div>
            <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ color: '#ef4444', fontWeight: 800, fontSize: 15 }}>⏱️ 24 Hours (1 Day)</div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginTop: 4 }}>300 km</div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>Included Distance Range</div>
            </div>
          </div>
          <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            ℹ️ Any extra kilometers driven beyond the assigned range limit will incur standard per-kilometer excess charges upon vehicle return.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>4. Vehicle Condition & Inspection</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>Before rental:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8, margin: 0 }}>
            <li>All vehicles are inspected and cleaned</li>
            <li>Customers receive a detailed vehicle condition report</li>
            <li>Any existing damage must be documented and acknowledged</li>
            <li>Fuel level and mileage are recorded</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>5. Customer Responsibilities</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>During the rental period, you are responsible for:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8, margin: 0 }}>
            <li>Safe and lawful operation of the vehicle</li>
            <li>Maintaining vehicle safety and cleanliness</li>
            <li>Complying with traffic laws and regulations</li>
            <li>Protecting the vehicle from theft and damage</li>
            <li>Timely return of the vehicle as per booking schedule</li>
            <li>Fueling the vehicle before return (or paying fuel charges)</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>6. Late Return & Extra Charges</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>Late returns will be charged at ₹500 per hour or part thereof. Excessive delays may result in additional charges or legal action. Fuel charges, toll fees, parking charges, and traffic violations are the customer's responsibility.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>7. Damage & Liability</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>Customers are liable for:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8, margin: 0 }}>
            <li>All damages caused by negligence or misuse</li>
            <li>Accidents, collisions, and mechanical failures due to improper use</li>
            <li>Loss or theft of the vehicle or its components</li>
            <li>Repair costs exceeding the security deposit</li>
          </ul>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>We recommend purchasing comprehensive insurance coverage for added protection.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>8. Insurance & Security Deposit</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>A security deposit is required at the time of booking. Comprehensive insurance is included; however, the customer is liable for the deductible amount (typically ₹5,000-₹10,000) in case of accidents or damage. Deposit refunds are processed within 7-10 business days after vehicle return and inspection.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>9. Cancellation & Refund Policy</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>Cancellation terms:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8, margin: 0 }}>
            <li>Cancelled 48+ hours before rental: Full refund</li>
            <li>Cancelled 24-48 hours before rental: 50% refund</li>
            <li>Cancelled less than 24 hours before rental: No refund</li>
            <li>No-show: Entire booking amount is forfeited</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>10. Prohibited Activities</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>Customers must not:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8, margin: 0 }}>
            <li>Drive under the influence of alcohol or drugs</li>
            <li>Allow unauthorized drivers to operate the vehicle</li>
            <li>Smoke or consume food inside the vehicle</li>
            <li>Transport prohibited items or substances</li>
            <li>Use the vehicle for commercial purposes without approval</li>
            <li>Drive off-road or in hazardous conditions</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>11. Traffic Violations & Legal Issues</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>Customers are responsible for all traffic violations, fines, and legal issues incurred during the rental period. Speed Toyz Cars will assist in forwarding violation notices; however, the customer must settle all penalties. Failure to comply may result in legal action.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>12. Accident & Emergency Procedures</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>In case of an accident or emergency:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8, margin: 0 }}>
            <li>Contact our emergency hotline immediately</li>
            <li>Ensure everyone's safety first</li>
            <li>Call the police and obtain an FIR if required</li>
            <li>Document the incident with photos and witness details</li>
            <li>Do not leave the vehicle unattended or tampered with</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>13. Limitation of Liability</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>Speed Toyz Cars shall not be liable for personal injuries, loss of belongings, or indirect damages. The company's liability is limited to the rental amount paid. Customers use the vehicles at their own risk and assume all associated liabilities.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>14. Dispute Resolution</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>Any disputes arising from this agreement shall be resolved through mutual discussion. If unresolved, the matter will be subject to the jurisdiction of courts in Bhubaneswar, Odisha.</p>
        </section>

        <section>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>15. Contact & Support</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 8 }}>For any questions or concerns regarding these terms, please contact us:</p>
          <p style={{ color: '#d1d5db', margin: 0 }}>
            <strong>Email:</strong> <a href="mailto:speedtoyzcarsodisha@gmail.com" style={{ color: '#ef4444', textDecoration: 'none' }}>speedtoyzcarsodisha@gmail.com</a><br/>
            <strong>Phone:</strong> <a href="tel:+919861332857" style={{ color: '#ef4444', textDecoration: 'none' }}>+91 9861332857</a><br/>
            <strong>24/7 Support:</strong> Available for emergencies
          </p>
        </section>
      </div>
    </div>
  )
}

export function PrivacyPage() {
  const { setIsPageLoading } = useLoader()

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])

  return (
    <div style={{ minHeight: '70vh', padding: '40px 24px', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 28 }}>
        <h1 style={{ marginTop: 0 }}>Privacy Policy</h1>
        
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>1. Information We Collect</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>We collect only the information required to process bookings, communicate with you, and improve your experience. This includes:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8 }}>
            <li>Personal Information: Name, email, phone number, address</li>
            <li>Payment Information: Credit/debit card details (processed securely)</li>
            <li>Booking Details: Vehicle preferences, rental dates, and trip information</li>
            <li>Usage Data: Browser type, IP address, pages visited, and timestamps</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>2. How We Use Your Information</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>Your information is used to:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8 }}>
            <li>Process and manage your car rental bookings</li>
            <li>Send booking confirmations and updates</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Send promotional offers and newsletters (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>3. Data Security</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>Your data is stored securely using industry-standard encryption and security protocols. We never share your personal information with third parties without your explicit consent, except when required by law or to process payments through authorized payment gateways.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>4. Cookies & Tracking</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can disable cookies in your browser settings, though this may affect certain features.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>5. Your Rights</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>You have the right to:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>
            <li>Access your personal information</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt-out of promotional communications</li>
            <li>Request a copy of your data in a portable format</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>6. Third-Party Links</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before providing any information.</p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>7. Policy Changes</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>We may update this privacy policy from time to time. Changes will be posted on this page with an updated date. Your continued use of our website constitutes your acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>8. Contact Us</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>For privacy-related inquiries or to exercise your rights, please contact us at:</p>
          <p style={{ color: '#d1d5db', marginTop: 8 }}>
            <strong>Email:</strong> <a href="mailto:speedtoyzcarsodisha@gmail.com" style={{ color: '#ef4444', textDecoration: 'none' }}>speedtoyzcarsodisha@gmail.com</a><br/>
            <strong>Phone:</strong> <a href="tel:+919861332857" style={{ color: '#ef4444', textDecoration: 'none' }}>+91 9861332857</a>
          </p>
        </section>
      </div>
    </div>
  )
}

export function CookiePage() {
  const { setIsPageLoading } = useLoader()

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])

  return (
    <div style={{ minHeight: '70vh', padding: '40px 24px', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 28 }}>
        <h1 style={{ marginTop: 0 }}>Cookie Policy</h1>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>1. What Are Cookies</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>
            Cookies are small text files stored on your computer or mobile device when you visit Speed Toyz Cars website. They help us make your browsing experience smoother, remember your preferences, and enable core platform functionality.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>2. How We Use Cookies</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>We use cookies for the following purposes:</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.7, marginTop: 8 }}>
            <li><strong>Essential Cookies:</strong> Required to authenticate users, prevent fraud, and handle car rental bookings securely.</li>
            <li><strong>Preference Cookies:</strong> Remember your vehicle search preferences, location filters, and currency settings.</li>
            <li><strong>Analytics Cookies:</strong> Help us measure website performance and visitor traffic to improve our services.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>3. Managing Cookies</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>
            You can choose to accept or decline cookies through your web browser settings. Most browsers automatically accept cookies, but you can modify your settings to decline cookies if you prefer. Note that disabling essential cookies may prevent certain features of our booking platform from functioning properly.
          </p>
        </section>

        <section>
          <h2 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12 }}>4. Contact Us</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>If you have any questions regarding our Cookie Policy, please contact us:</p>
          <p style={{ color: '#d1d5db', marginTop: 8 }}>
            <strong>Email:</strong> <a href="mailto:speedtoyzcarsodisha@gmail.com" style={{ color: '#ef4444', textDecoration: 'none' }}>speedtoyzcarsodisha@gmail.com</a><br/>
            <strong>Phone:</strong> <a href="tel:+919861332857" style={{ color: '#ef4444', textDecoration: 'none' }}>+91 9861332857</a>
          </p>
        </section>
      </div>
    </div>
  )
}

export function AboutPage() {
  const { setIsPageLoading } = useLoader()

  useSeoHead({
    title: 'About SpeedToyzCars | Premier Self Drive Car Rental Bhubaneswar',
    description: 'Learn about SpeedToyzCars, the premier self drive and luxury car rental provider in Bhubaneswar, Odisha. Insured fleet, 24/7 airport delivery, and transparent daily rates.',
    path: '/about'
  })

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])

  const features = [
    { title: '80+ Premium Vehicles', desc: 'From fuel-efficient hatchbacks to luxury SUVs, automatic sedans, and 4x4 Thar convertibles.', icon: '🚗' },
    { title: 'Airport & Doorstep Delivery', desc: 'Instant key handovers at Biju Patnaik International Airport (BPIA) and across Bhubaneswar.', icon: '✈️' },
    { title: '100% Insured & Verified Fleet', desc: 'Regularly serviced, sanitized, and commercial-insured vehicles for complete driving confidence.', icon: '🛡️' },
    { title: 'Transparent Low Rates', desc: 'Fixed rates, zero hidden fees, flexible duration plans (6h, 12h, 24h), and instant security deposit refunds.', icon: '💰' },
  ]

  return (
    <div style={{ minHeight: '70vh', padding: '40px 24px 60px', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            About SpeedToyzCars
          </div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 900, letterSpacing: '-1px', margin: '0 0 16px' }}>
            Bhubaneswar's Premier Self-Drive & Luxury Car Rental
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 16, maxWidth: 720, margin: '0 auto', lineHeight: 1.7 }}>
            Empowering travelers, business delegates, and local residents with freedom of movement across Odisha with premium, well-maintained vehicles.
          </p>
        </div>

        {/* Story Section */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 32, marginBottom: 40 }}>
          <h2 style={{ color: '#ef4444', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Who We Are</h2>
          <p style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
            Founded in Bhubaneswar, <strong>SpeedToyzCars</strong> has quickly grown into Odisha's most trusted name in self-drive vehicle rentals, luxury chauffeur services, and airport travel. We believe that renting a car should be simple, transparent, and exhilarating — whether you're embarking on a road trip to Puri, attending a business meeting in Cuttack, or taking a weekend trip to Konark.
          </p>
          <p style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: 15, margin: 0 }}>
            Our mission is to provide clean, high-performance vehicles backed by 24/7 customer care, zero hidden costs, and flexible rental packages tailored to every budget.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 24, transition: 'transform 0.2s' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(17,24,39,0.95) 100%)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 }}>Visit Us or Reach Out 24/7</h2>
          <p style={{ color: '#d1d5db', lineHeight: 1.7, margin: 0 }}>
            <strong>Location:</strong> Lane-4, Satya Sai Enclave Road, Near Manipal Hospital, Kolathia, Khandagiri, Bhubaneswar, Odisha 751030<br/>
            <strong>Email:</strong> <a href="mailto:speedtoyzcarsodisha@gmail.com" style={{ color: '#ef4444', textDecoration: 'none' }}>speedtoyzcarsodisha@gmail.com</a><br/>
            <strong>Phone:</strong> <a href="tel:+919861332857" style={{ color: '#ef4444', textDecoration: 'none' }}>+91 98613 32857</a> / <a href="tel:+917608068450" style={{ color: '#ef4444', textDecoration: 'none' }}>+91 76080 68450</a>
          </p>
        </div>
      </div>
    </div>
  )
}
