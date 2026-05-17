type ClerkWebhookEvent<T = any> = {
  data: T
  type: string
  object: "event"
  timestamp: number
  instance_id: string
  event_attributes: {
      http_request: {
          client_ip: string
          user_agent: string
      }
  }
}

export interface ClerkUser {
  id: string
  object: "user"

  first_name: string | null
  last_name: string | null
  username: string | null

  image_url: string
  profile_image_url: string

  email_addresses: any[]
  phone_numbers: any[]
  web3_wallets: any[]
  external_accounts: any[]

  primary_email_address_id: string | null
  primary_phone_number_id: string | null
  primary_web3_wallet_id: string | null

  password_enabled: boolean
  two_factor_enabled: boolean

  created_at: number
  updated_at: number
  last_sign_in_at: number | null

  private_metadata: Record<string, any>
  public_metadata: Record<string, any>
  unsafe_metadata: Record<string, any>

  external_id: string | null
}

export interface ClerkDeletedUser {
  id: string
  object: "user"
  deleted: true
}


export type UserCreatedEvent = ClerkWebhookEvent<ClerkUser> & {
  type: "user.created"
}

export type UserUpdatedEvent = ClerkWebhookEvent<ClerkUser> & {
  type: "user.updated"
}

export type UserDeletedEvent = ClerkWebhookEvent<ClerkDeletedUser> & {
  type: "user.deleted"
}


export type ClerkEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserDeletedEvent
