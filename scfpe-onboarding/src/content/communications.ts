/**
 * "Important Communications" page, transcribed from the original Google Site images.
 */

export type Channel = 'push' | 'whatsapp' | 'sms' | 'email'

export const channelLabels: Record<Channel, string> = {
  push: 'Push Notification',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  email: 'Email',
}

export const channelsIntro = {
  title: 'Smart Tech for Seamless Business Experience',
  body: 'Important communication are published to dealers through multiple channels',
  channels: ['push', 'whatsapp', 'sms', 'email'] as Channel[],
}

export interface Communication {
  title: string
  timing: string
  channels: Channel[]
}

export const communications: Communication[] = [
  {
    title: 'Cash Discount Reminder',
    timing: 'Communication goes out 2 days prior to slab change [5,13,28th day]',
    channels: ['push', 'whatsapp', 'sms'],
  },
  {
    title: 'Invoice upload Notification',
    timing: 'Communication goes out real-time upon successful upload of an invoice',
    channels: ['push', 'whatsapp', 'email'],
  },
  {
    title: 'Weekly Outstanding Reminder',
    timing: 'This communication goes out Every Monday',
    channels: ['push', 'whatsapp', 'sms'],
  },
  {
    title: 'Invoice Overdue Reminder',
    timing: 'The communication continues on alternate days till overdue is cleared (1,3,5…)',
    channels: ['push', 'whatsapp', 'email'],
  },
  {
    title: 'Payment Confirmation',
    timing: 'Retailers receives this on real-time',
    channels: ['push', 'whatsapp', 'sms'],
  },
]
