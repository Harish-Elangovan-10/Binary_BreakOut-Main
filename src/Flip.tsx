import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface EmailLink {
  display: string
  actual: string
}

interface Email {
  id: number
  sender: string
  subject: string
  body: string
  isPhishing: boolean
  links?: EmailLink[]
}

const initialEmails: Email[] = [
  {
    id: 1,
    sender: 'admissions@harvard.edu',
    subject: 'Your Admission Decision',
    body: 'Congratulations! We are pleased to inform you that you have been admitted to Harvard University. Please log in to your portal to confirm your enrollment and review scholarship details. Welcome to the Harvard family!',
    isPhishing: false,
    links: [{ display: 'https://harvard.edu/admissions/portal', actual: 'https://harvard.edu/admissions/portal' }]
  },
  {
    id: 2,
    sender: 'hr@techcorp-internships.com',
    subject: 'Internship Offer - Software Engineer',
    body: 'Dear Candidate,\n\nWe are excited to extend an internship offer for the Software Engineer position. Your start date is scheduled for June 1st. Please review the attached offer letter and respond with your acceptance by May 15th.\n\nBest regards,\nTech Corp HR Team',
    isPhishing: false,
    links: [{ display: 'https://techcorp-internships.com/offers', actual: 'https://techcorp-internships.com/offers' }]
  },
  {
    id: 3,
    sender: 'service@paypal.com',
    subject: 'Your recent transaction was processed',
    body: 'Thank you for using the Pay-PaI app.\n\nYour recent transaction has been successfully processed.\n\nIf you notice any issues, you can review the transaction details below.',
    isPhishing: true,
    links: [{ display: 'https://www.paypaI.com/activity', actual: 'https://www.paypaI.com/atvity' }]
  },
  {
    id: 4,
    sender: 'noreply@aws.amazon.com',
    subject: 'AWS Account Alert - Unusual Activity',
    body: 'We detected unusual activity on your AWS account from an unrecognized location. This is a routine security notice. If this was not you, please log in to your AWS console to review the activity and update your security settings.\n\nThank you,\nAWS Security Team',
    isPhishing: false,
    links: [{ display: 'https://console.aws.amazon.com/', actual: 'https://console.aws.amazon.com/' }]
  },
  {
    id: 5,
    sender: 'support@paytm.com',
    subject: 'Payment Confirmation',
    body: 'Thank you for your recent payment. Your transaction has been successfully processed. You can view your receipt and transaction history in your Paytm dashboard.\n\nBest regards,\nPaytm Support Team',
    isPhishing: false,
    links: [{ display: 'https://paytm.com/account/activity', actual: 'https://paytm.com/account/activity' }]
  },
  {
    id: 6,
    sender: 'newsletter@medium.com',
    subject: 'Your Weekly Reading Digest',
    body: 'Here are the top stories curated for you this week based on your interests. Dive into articles about technology, programming, and career development.\n\nHappy reading!\nThe Medium Team',
    isPhishing: false,
    links: [{ display: 'https://medium.com/digest', actual: 'https://medium.com/digest' }]
  },
  {
    id: 7,
    sender: 'docs-share@dropb0x-files.com',
    subject: 'Document Shared: Invoice_Q4_2025.pdf',
    body: "Hi,\n\nI've shared a document with you via Dropbox. Please review the attached Q4 invoice at your earliest convenience and let me know if you have any questions.\n\nBest regards,\nAccounting Department",
    isPhishing: true,
    links: [{ display: 'https://dropbox.com/shared/Invoice_Q4_2025.pdf', actual: 'http://dropb0x-files.com/malware-download' }]
  },
  {
    id: 8,
    sender: 'careers@google.com',
    subject: 'Application Status Update',
    body: 'Thank you for your interest in joining Google. We wanted to let you know that your application for the Software Engineer position has been received and is currently under review.\n\nWe appreciate your patience and will be in touch soon.\n\nBest regards,\nGoogle Recruiting Team',
    isPhishing: false,
    links: [{ display: 'https://careers.google.com/applications', actual: 'https://careers.google.com/applications' }]
  }
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Round2Phishing() {
  const location = useLocation()
  const navigate = useNavigate()

  const previousTime = location.state?.round1Time || 0

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [timeElapsed, setTimeElapsed] = useState<number>(previousTime)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [phishingFound, setPhishingFound] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [roundCompleted, setRoundCompleted] = useState(false)

  const [foundPhishingIds, setFoundPhishingIds] = useState<number[]>([])
  const [checkedEmailIds, setCheckedEmailIds] = useState<number[]>([])
  const [emails, setEmails] = useState<Email[]>([])
  const [isLocked, setIsLocked] = useState(false)
  const [lockCountdown, setLockCountdown] = useState(0)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  useEffect(() => {
    document.title = 'Round 2 - Phishing Mail Detection'
  }, [])

  useEffect(() => {
    setEmails(shuffleArray(initialEmails))
  }, [])

  useEffect(() => {
    if (roundCompleted) return

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [roundCompleted])

  useEffect(() => {
    if (lockCountdown <= 0) {
      setIsLocked(false)
      return
    }

    const lockTimer = setInterval(() => {
      setLockCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(lockTimer)
  }, [lockCountdown])

  useEffect(() => {
    if (!showHint) return
    const t = setTimeout(() => setShowHint(false), 10000)
    return () => clearTimeout(t)
  }, [showHint])

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const triggerLock = () => {
    setIsLocked(true)
    setLockCountdown(25)
  }

  const handlePhishingSelection = (email: Email) => {
    if (roundCompleted || isLocked) return

    if (checkedEmailIds.includes(email.id)) {
      setMessage({ text: '⚠️ This email has already been checked!', type: 'info' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setTotalAttempts((prev) => prev + 1)

    if (email.isPhishing) {
      setCheckedEmailIds((prev) => [...prev, email.id])
      setFoundPhishingIds((prev) => [...prev, email.id])

      const newFound = phishingFound + 1
      setPhishingFound(newFound)

      if (newFound >= 2) {
        setMessage({ text: '✅ Correct! You found all phishing emails!', type: 'success' })
        setRoundCompleted(true)
      } else {
        setMessage({ text: `✅ Correct! This is phishing! (${newFound} found)`, type: 'success' })
      }
    } else {
      setCheckedEmailIds((prev) => [...prev, email.id])

      const newWrong = wrongAttempts + 1
      setWrongAttempts(newWrong)

      triggerLock()

      const penaltySeconds = newWrong === 1 ? 60 : 90
      setTimeElapsed((prev) => prev + penaltySeconds)

      const penaltyText = newWrong === 1 ? '+1 minute' : '+1 min 30 sec'

      setMessage({
        text: `❌ Incorrect! Legit email. ${penaltyText} penalty. Locked for 25s. (${newWrong} wrong)`,
        type: 'error'
      })

      if (newWrong >= 4) setShowHint(true)
    }

    setTimeout(() => setMessage(null), 3000)
  }

  const handleLegitSelection = (email: Email) => {
    if (roundCompleted || isLocked) return

    if (checkedEmailIds.includes(email.id)) {
      setMessage({ text: '⚠️ This email has already been checked!', type: 'info' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setTotalAttempts((prev) => prev + 1)

    if (!email.isPhishing) {
      setCheckedEmailIds((prev) => [...prev, email.id])
      setMessage({ text: '✓ Correct! This is legitimate.', type: 'info' })
    } else {
      // Don't add phishing emails to checkedEmailIds when marked incorrectly as legitimate
      // This allows the user to try again after the cooldown period

      const newWrong = wrongAttempts + 1
      setWrongAttempts(newWrong)

      triggerLock()

      const penaltySeconds = newWrong === 1 ? 60 : 90
      setTimeElapsed((prev) => prev + penaltySeconds)

      const penaltyText = newWrong === 1 ? '+1 minute' : '+1 min 30 sec'

      setMessage({
        text: `❌ Incorrect! You missed phishing. ${penaltyText} penalty. Locked for 25s. (${newWrong} wrong)`,
        type: 'error'
      })

      if (newWrong >= 4) setShowHint(true)
    }

    setTimeout(() => setMessage(null), 3000)
  }

  const nextRound = () => {
    navigate('/traversal', { state: { round2Time: timeElapsed } })
  }

  const hints = [
    '🔍 Check the sender domain carefully',
    '⚠️ Urgency and threats are phishing red flags',
    '🎯 Look for URL mismatches'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] text-[#00ff88] overflow-hidden">
      <header className="bg-black/50 border-b-2 border-[#00ff88] p-6 flex justify-between items-center">
        <div>
          <h1 className="m-0 text-3xl text-[#00ff88]">Escape Room - Round 2</h1>
          <p className="m-0 text-sm text-[#00aa55] opacity-80">
            Phishing Mail Detection - Find all the phishing emails!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[#00aa55] bg-black/30 px-3 py-2 rounded border border-[#00aa55]">
            <div>Attempts: {totalAttempts}</div>
            <div>Wrong: {wrongAttempts}</div>
          </div>
          <div className="text-2xl font-bold text-[#00ff88] bg-[rgba(0,255,136,0.1)] px-4 py-2 rounded border border-[#00ff88] min-w-[120px] text-center">
            ⏱️ {formatTime(timeElapsed)}
          </div>
        </div>
      </header>

      {isLocked && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border-2 border-[#ff3333] rounded-lg px-8 py-6 z-[300] text-center">
          <div className="text-[#ff6666] text-xl font-bold mb-2">🔒 LOCKED</div>
          <div className="text-[#ff6666] text-4xl font-bold">{lockCountdown}s</div>
          <div className="text-[#ff6666] text-sm mt-2">Wrong answer penalty</div>
        </div>
      )}

      <main className="flex gap-4 p-6 overflow-hidden justify-center">
        <div className={`w-[300px] bg-black/30 border border-[#00ff88] rounded flex flex-col overflow-hidden ${isLocked ? 'pointer-events-none opacity-50' : ''}`}>
          <h2 className="m-0 p-4 bg-[rgba(0,255,136,0.1)] border-b border-[#00ff88] text-base">
            Inbox ({phishingFound} phishing found)
          </h2>

          <div className="flex-1 overflow-y-auto flex flex-col">
            {emails.map((email) => {
              const isChecked = checkedEmailIds.includes(email.id)
              const isPhishingFound = foundPhishingIds.includes(email.id)

              return (
                <div
                  key={email.id}
                  className={`p-4 border-b border-[rgba(0,255,136,0.2)] transition-all duration-200 
                    ${isChecked && !isPhishingFound ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    ${selectedEmail?.id === email.id ? 'bg-[rgba(0,255,136,0.15)]' : ''}
                    ${isPhishingFound ? 'opacity-50 bg-[rgba(0,255,136,0.1)]' : ''}`}
                  onClick={() => !isLocked && setSelectedEmail(email)}
                >
                  <div className="text-sm text-[#00aa55] font-bold">{email.sender}</div>
                  <div className="text-xs text-[#00ff88] opacity-80 break-words">{email.subject}</div>
                  {isPhishingFound && <span className="text-xs text-[#00ff88]">✓ Identified as phishing</span>}
                  {isChecked && !isPhishingFound && <span className="text-xs text-[#666]">✓ Checked - Legitimate</span>}
                </div>
              )
            })}
          </div>
        </div>

        <div className={`flex-1 max-w-[650px] bg-black/30 border border-[#00ff88] rounded p-6 overflow-y-auto ${isLocked ? 'opacity-50' : ''}`}>
          {selectedEmail ? (
            <>
              <div className="mb-6 pb-4 border-b border-[rgba(0,255,136,0.2)]">
                <div className="text-[#00aa55] font-bold text-sm">From:</div>
                <div className="mb-2">{selectedEmail.sender}</div>
                <div className="text-[#00aa55] font-bold text-sm">Subject:</div>
                <div>{selectedEmail.subject}</div>
              </div>

              <div className="leading-relaxed whitespace-pre-wrap break-words">
                {selectedEmail.body}

                {selectedEmail.links?.length ? (
                  <div className="mt-4 pt-4 border-t border-[rgba(0,255,136,0.2)]">
                    <p className="text-[#00aa55] font-bold mb-2 text-sm">Links in email:</p>
                    {selectedEmail.links.map((link, idx) => (
                      <div
                        key={idx}
                        className="relative bg-[rgba(0,255,136,0.05)] p-2 my-2 border-l-2 border-[#00ff88] text-[#00ccff] text-sm break-all cursor-pointer"
                        onMouseEnter={() => setHoveredLink(`${selectedEmail.id}-${idx}`)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <div className="underline">🔗 {link.display}</div>

                        {hoveredLink === `${selectedEmail.id}-${idx}` && (
                          <div className="absolute left-0 bottom-full mb-2 bg-black/95 border border-[#00ccff] rounded px-3 py-2 z-50 min-w-[250px]">
                            <div className="text-[#00ccff] text-xs font-bold mb-1">Actual URL:</div>
                            <div className="text-sm break-all">{link.actual}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="text-[#00aa55] opacity-60 text-center mt-20">
              Select an email to view its contents
            </div>
          )}
        </div>
      </main>

      {showHint && (
        <div className="bg-[rgba(255,200,0,0.1)] border border-[#ffcc00] rounded p-4 mx-6 text-[#ffcc00]">
          <h3 className="m-0 mb-2 text-base">💡 Hints:</h3>
          <ul className="m-0 pl-6 list-none">
            {hints.map((hint, idx) => (
              <li key={idx} className="my-1 text-sm leading-relaxed">
                → {hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && (
        <div className="fixed bottom-[180px] left-1/2 -translate-x-1/2 px-6 py-4 rounded text-base z-[100] bg-black/80 border border-[#00ff88]">
          {message.text}
        </div>
      )}

      {roundCompleted && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]">
          <div className="bg-black/90 border-2 border-[#00ff88] rounded-lg px-8 py-12 text-center">
            <h2 className="m-0 mb-4 text-4xl text-[#00ff88]">✅ Round 2 Complete!</h2>
            <p className="text-lg text-[#00ccff] my-2">
              Time Taken: <strong className="text-xl">{formatTime(timeElapsed)}</strong>
            </p>
            <p className="text-xl text-[#ffcc00] my-4">
              Secret Code: <strong className="text-[#ff3333] text-2xl">6</strong>
            </p>
            <button
              onClick={nextRound}
              className="mt-6 px-8 py-3 bg-[rgba(0,255,136,0.2)] border-2 border-[#00ff88] text-[#00ff88] rounded font-mono text-base font-bold cursor-pointer"
            >
              Next Round →
            </button>
          </div>
        </div>
      )}

      <footer className="bg-black/50 border-t-2 border-[#00ff88] px-6 py-4 flex gap-4 justify-center">
        <button
          className="px-8 py-3 border-2 rounded font-mono text-base font-bold bg-[rgba(255,51,51,0.1)] border-[#ff3333] text-[#ff6666] disabled:opacity-40"
          onClick={() => selectedEmail && handlePhishingSelection(selectedEmail)}
          disabled={!selectedEmail || roundCompleted || isLocked || checkedEmailIds.includes(selectedEmail.id)}
        >
          🚨 Mark as Phishing {isLocked ? `(${lockCountdown}s)` : ''}
        </button>

        <button
          className="px-8 py-3 border-2 rounded font-mono text-base font-bold bg-[rgba(0,255,136,0.1)] border-[#00ff88] text-[#00ff88] disabled:opacity-40"
          onClick={() => selectedEmail && handleLegitSelection(selectedEmail)}
          disabled={!selectedEmail || roundCompleted || isLocked || checkedEmailIds.includes(selectedEmail.id)}
        >
          ✓ Mark as Legitimate {isLocked ? `(${lockCountdown}s)` : ''}
        </button>
      </footer>
    </div>
  )
}
