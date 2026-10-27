import { Bell, Mail, MessageCircle, MessageSquareText, type LucideIcon } from 'lucide-react'
import { channelLabels, channelsIntro, communications, type Channel } from '../content/communications'
import { PageHeader } from '../components/page/PageHeader'
import { RelatedPages } from '../components/page/RelatedPages'
import { Reveal } from '../components/Reveal'
import '../components/communications/communications.css'

const channelIcons: Record<Channel, LucideIcon> = {
  push: Bell,
  whatsapp: MessageCircle,
  sms: MessageSquareText,
  email: Mail,
}

function ChannelBadge({ channel }: { channel: Channel }) {
  const Icon = channelIcons[channel]
  return (
    <span className={`channel-badge channel-badge--${channel}`}>
      <Icon size={14} aria-hidden="true" />
      {channelLabels[channel]}
    </span>
  )
}

export function CommunicationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Communications"
        title="Important Communications"
        intro={channelsIntro.body + '.'}
        trail={[{ label: 'Communications' }]}
      />

      <section className="page-section" aria-labelledby="channels-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="channels-title" className="page-section__title">
              {channelsIntro.title}
            </h2>
          </div>
          <ul className="channel-grid">
            {channelsIntro.channels.map((c, i) => {
              const Icon = channelIcons[c]
              return (
                <Reveal as="li" key={c} delay={0.05 * i} className={`channel-card channel-card--${c}`}>
                  <span className="channel-card__icon">
                    <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="channel-card__label">{channelLabels[c]}</span>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="page-section" aria-labelledby="schedule-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="schedule-title" className="page-section__title">
              What you receive, and when
            </h2>
          </div>
          <ol className="comms-timeline">
            {communications.map((c, i) => (
              <Reveal as="li" key={c.title} delay={0.05 * i} className="comms-item">
                <span className="comms-item__dot" aria-hidden="true" />
                <div className="comms-item__card">
                  <h3 className="comms-item__title">{c.title}</h3>
                  <p className="comms-item__timing">{c.timing}</p>
                  <p className="comms-item__channels">
                    <span className="visually-hidden">Sent by: </span>
                    {c.channels.map((ch) => (
                      <ChannelBadge key={ch} channel={ch} />
                    ))}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <RelatedPages ids={['payments', 'program-workflow', 'documents']} />
    </>
  )
}
